// Kit materials: turned wood, backlit fabric, and the two shader patches that light the lamp's parts from its
// lit liner and shade the table from its whole exit ring. Shader text is the demo's, unchanged.
import * as THREE from "three";
import { ASSETS, coarse } from "../env";

export const CM = 0.01;

/* ---------- textures ---------- */

// Loaded once before any lamp is built (a lamp built before its maps arrive renders without them); each use
// is a clone with its own repeat, sharing the uploaded image.
const LINEN = ["linen-diff", "linen-nor-gl", "linen-rough"] as const;
const base: Partial<Record<(typeof LINEN)[number], THREE.Texture>> = {};
let kitLoad: Promise<void[]> | null = null;
export function loadKitTextures() {
  const loader = new THREE.TextureLoader();
  return (kitLoad ||= Promise.all(
    LINEN.map((f, i) =>
      loader.loadAsync(`${ASSETS}/tex/${f}.webp`).then((t) => {
        t.wrapS = t.wrapT = THREE.RepeatWrapping;
        t.anisotropy = 8;
        if (i === 0) t.colorSpace = THREE.SRGBColorSpace;
        base[f] = t;
      })
    )
  ).catch((err) => {
    kitLoad = null;
    throw err;
  }));
}

// one linen tile covers this many centimetres (threads ~0.6 mm apart); mean light blocking of the tile, as
// printed by the demo's tools/make-linen.py
export const LINEN_TILE = 8.7;
const LINEN_DENSITY = 0.528;

export interface LinenSet {
  map: THREE.Texture;
  normalMap: THREE.Texture;
  roughnessMap: THREE.Texture;
}

export function linenSet(repeat: [number, number]): LinenSet {
  const [map, normalMap, roughnessMap] = LINEN.map((f) => {
    const t = base[f]!.clone();
    t.repeat.set(...repeat);
    return t;
  });
  return { map, normalMap, roughnessMap };
}

/* ---------- uniform holders ---------- */

type U<T> = { value: T };

export interface WoodUniforms {
  uEarly: U<THREE.Color>;
  uLate: U<THREE.Color>;
  [k: string]: U<unknown>;
}

export interface FabricUniforms {
  uLamp: U<THREE.Vector3>;
  uLampI: U<number>;
  uLampColor: U<THREE.Color>;
  [k: string]: U<unknown>;
}

export interface LinerUniforms {
  uBase: U<THREE.Vector3>;
  uLampColor: U<THREE.Color>;
  uLampI: U<number>;
  uBounce: U<number>;
  [k: string]: U<unknown>;
}

export interface RingUniforms {
  uBase: U<THREE.Vector3>;
  [k: string]: U<unknown>;
}

/* ---------- shader snippets ---------- */

const NOISE = /* glsl */ `
  float h3(vec3 p) { p = fract(p * .3183099 + .1); p *= 17.; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
  float n3(vec3 x) {
    vec3 i = floor(x), f = fract(x); f = f * f * (3. - 2. * f);
    return mix(mix(mix(h3(i), h3(i + vec3(1,0,0)), f.x), mix(h3(i + vec3(0,1,0)), h3(i + vec3(1,1,0)), f.x), f.y),
               mix(mix(h3(i + vec3(0,0,1)), h3(i + vec3(1,0,1)), f.x), mix(h3(i + vec3(0,1,1)), h3(i + 1.), f.x), f.y), f.z);
  }
  float fbm(vec3 p) { float a = .5, s = 0.; for (int i = 0; i < 4; i++) { s += a * n3(p); p *= 2.03; a *= .5; } return s; }
`;

// The lamp's own parts take no light from the viewer's point and spot lights: those sit centimetres away inside
// the shade, where inverse square blows up and cuts hard terminators. Bodies are lit by the liner instead
// (linerLit), the fabric by its own transmitted glow. Daylight (directional, environment) still applies.
const NO_LOCAL = THREE.ShaderChunk.lights_fragment_begin
  .replace("#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )", "#if 0")
  .replace("#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )", "#if 0");
const skipLocal = (s: THREE.WebGLProgramParametersWithUniforms) => {
  s.fragmentShader = s.fragmentShader.replace("#include <lights_fragment_begin>", NO_LOCAL);
};

// The real source under the shade is the whole lit liner. It is sampled as patches on its lower part; each one is
// seen through the bottom opening and around the body (the neck hides the far side, tested against the turned
// profile), so the light wraps softly over the shoulders. Light bounced off the lit table fills the lower half.
const ROWS = coarse ? 2 : 3;
const COLS = coarse ? 6 : 8;
const LINER = /* glsl */ `
  uniform vec3 uBase, uLampColor;
  uniform float uLampI, uBounce, uProf[17];
  uniform vec4 uShade; // bottom radius, top radius, bottom y, height (m, lamp-local)
  uniform float uTop;
  uniform ivec2 uGrid; // patch rows, columns
  varying vec3 vLinerW;
  // radius of the turned body at height y (0 above it)
  float bodyR(float y) { float f = clamp(y / uTop, 0., 1.) * 16.; int i = int(min(f, 15.)); return y > uTop ? 0. : mix(uProf[i], uProf[i + 1], f - float(i)); }
#ifdef KIT_WASH
  uniform vec4 uWash; // LED disc height, inner and outer radius, stem radius (m, lamp-local)
  uniform float uWashMetal;
  uniform int uWashN;
  // integral over the angle of max(u cos a + v, 0) / (A - B cos a)^2, from 0 to acos(c)
  float washF(float c, float u, float v, float A, float B, float AmB, float ApB) {
    float AB2 = AmB * ApB;
    float I0 = 2. * inversesqrt(AB2) * atan(sqrt(ApB * max(1. - c, 0.)), sqrt(AmB * max(1. + c, 0.)));
    float J = (B * sqrt(max(1. - c * c, 0.)) / (A - B * c) + A * I0) / AB2;
    return u * (A * J - I0) / max(B, 1e-9) + v * J;
  }
  // Irradiance from the LED disc, a Lambertian ring facing down, in the patches' units. Close under the disc the
  // patches can't resolve it (and their distance floor caps it), so it is integrated exactly around the axis: on a
  // turned surface the normal lies in the plane through the axis. The surface's own tangent plane and the stem (a
  // cylinder through the whole height) hide the rest. Rings are smoothstep-spaced to resolve both edges of the disc.
  float ledWash(vec3 P, vec3 n) {
    float p = max(length(P.xz), 1e-5), H = uWash.x - P.y;
    if (H <= 0.) return 0.;
    float nr = dot(n.xz, P.xz) / p, rs = uWash.w, E = 0.;
    for (int k = 0; k < uWashN; k++) {
      float t = (float(k) + .5) / float(uWashN);
      float rho = uWash.y + (uWash.z - uWash.y) * t * t * (3. - 2. * t);
      float dRho = 6. * t * (1. - t) * (uWash.z - uWash.y) / float(uWashN);
      float u = nr * rho, v = n.y * H - nr * p;
      u = abs(u) < 1e-7 ? 1e-7 : u;
      float A = rho * rho + p * p + H * H, B = 2. * rho * p;
      float AmB = (rho - p) * (rho - p) + H * H, ApB = (rho + p) * (rho + p) + H * H;
      // cosines bounding the lit angles: the tangent plane, and the tangents from the point to the stem
      float ct = clamp(-v / u, -1., 1.);
      float cb = clamp((rs * rs - sqrt(max((p * p - rs * rs) * (rho * rho - rs * rs), 0.))) / (p * rho), -1., 1.);
      float cLo = u > 0. ? 1. : ct, cHi = u > 0. ? max(ct, cb) : cb;
      E += float(cHi < cLo) * 2. * (washF(cHi, u, v, A, B, AmB, ApB) - washF(cLo, u, v, A, B, AmB, ApB)) * rho * dRho;
    }
    return E * H * float(uGrid.x * uGrid.y) / (3.14159265 * (uWash.z * uWash.z - uWash.y * uWash.y));
  }
#endif
`;
// Diffuse is summed exactly over the patches; the specular highlight uses one light from their weighted mean
// direction (an area source gives one broad highlight anyway), which keeps the shader small: one BRDF evaluation
// instead of one per patch.
const LINER_LIGHT = /* glsl */ `
  {
    vec3 P = vLinerW - uBase;
    vec3 nW = inverseTransformDirection(geometryNormal, viewMatrix);
    float rB = uShade.x, y0 = uShade.z, slope = (uShade.x - uShade.y) / uShade.w, span = uShade.w * .6;
    float irr = 0.; vec3 dir = vec3(0.);
    // uniform loop bounds: the compiler keeps the loop instead of unrolling it 24 times (seconds of compile on
    // Windows, where ANGLE translates to D3D)
    for (int j = 0; j < uGrid.x; j++) {
      float y = y0 + span * (float(j) + .5) / float(uGrid.x);
      float r = rB - slope * (y - y0) - .002;
      for (int i = 0; i < uGrid.y; i++) {
        float a = (float(i) + .5 * float(j)) * 6.2831853 / float(uGrid.y);
        vec3 S = vec3(cos(a) * r, y, sin(a) * r);
        vec3 nS = normalize(vec3(-cos(a), -slope, -sin(a)));
        vec3 d = S - P; float d2 = dot(d, d); vec3 L = d * inversesqrt(d2);
        float w = max(dot(-L, nS), 0.) * max(dot(nW, L), 0.);
        // branch-free on purpose: loops with branches take seconds to compile on Windows (ANGLE/D3D)
        vec2 q = P.xz + d.xz * max(y0 - P.y, 0.) / max(d.y, 1e-4);
        w *= 1. - smoothstep(rB - .004, rB + .001, length(q));
        vec3 X1 = P + d * .2, X2 = P + d * .4, X3 = P + d * .6;
        float gap = min(min(length(X1.xz) - bodyR(X1.y), length(X2.xz) - bodyR(X2.y)), length(X3.xz) - bodyR(X3.y));
        w *= smoothstep(-.001, .004, gap) / max(d2, 6e-3);
        irr += w; dir += L * w;
      }
    }
    if (irr > 0.) {
      directLight.direction = normalize((viewMatrix * vec4(dir, 0.)).xyz);
      float nl = max(dot(geometryNormal, directLight.direction), .05);
      directLight.color = uLampColor * (uLampI * irr / nl);
      vec3 keep = reflectedLight.directDiffuse;
      RE_Direct(directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight);
#ifdef KIT_WASH
      reflectedLight.directDiffuse = keep;
#else
      reflectedLight.directDiffuse = keep + uLampColor * uLampI * irr * BRDF_Lambert(material.diffuseColor);
#endif
    }
#ifdef KIT_WASH
    reflectedLight.directDiffuse += uLampColor * uLampI * ledWash(P, nW) * BRDF_Lambert(material.diffuseColor + diffuseColor.rgb * metalnessFactor * uWashMetal);
#endif
    // close to the table a downward face only sees the table in the body's own shadow
    float under = max(-nW.y, 0.), seen = mix(1., smoothstep(0., .06, P.y), under);
    // the table is wood: what it bounces back is the lamp's colour filtered by its orange-brown
    reflectedLight.indirectDiffuse += uLampColor * vec3(1., .58, .32) * uLampI * uBounce * (.2 + .8 * under + .25 * (1. - abs(nW.y))) * seen * BRDF_Lambert(material.diffuseColor);
  }
`;

/* ---------- profile helpers ---------- */

export function radiusAt(pts: THREE.Vector2[], y: number) {
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    if ((a.y - y) * (b.y - y) <= 0 && a.y !== b.y) return a.x + ((b.x - a.x) * (y - a.y)) / (b.y - a.y);
  }
  return 0;
}

const profUniform = (prof: THREE.Vector2[], top: number) => Array.from({ length: 17 }, (_, i) => radiusAt(prof, (top * i) / 16) + 0.0004);

export interface ShadeSpec {
  y: number;
  h: number;
  rBottom: number;
  rTop: number;
  thickness: number;
  tape: number;
  cap?: boolean;
  transmission: number;
  liner: number;
}

// The LED disc under a hat, for ledWash (m, lamp-local); `metal` as in HatSpec.led.wash.
export interface WashSpec {
  y: number;
  rIn: number;
  rOut: number;
  stem: number;
  metal: number;
}

export function linerLit<M extends THREE.Material>(m: M, shade: ShadeSpec, prof: THREE.Vector2[], top: number, wash?: WashSpec): LinerUniforms {
  const u: LinerUniforms = {
    uBase: { value: new THREE.Vector3() },
    uLampColor: { value: new THREE.Color() },
    uLampI: { value: 0 },
    uBounce: { value: 0 },
    uShade: { value: new THREE.Vector4(shade.rBottom * CM, shade.rTop * CM, shade.y * CM, shade.h * CM) },
    uProf: { value: profUniform(prof, top) },
    uTop: { value: top },
    uGrid: { value: new THREE.Vector2(ROWS, COLS) },
  };
  if (wash) {
    u.uWash = { value: new THREE.Vector4(wash.y, wash.rIn, wash.rOut, wash.stem) };
    u.uWashMetal = { value: wash.metal };
    u.uWashN = { value: 16 };
  }
  const prev = m.onBeforeCompile;
  m.onBeforeCompile = (s, r) => {
    prev.call(m, s, r);
    Object.assign(s.uniforms, u);
    s.vertexShader =
      "varying vec3 vLinerW;\n" +
      s.vertexShader.replace("#include <project_vertex>", "#include <project_vertex>\nvLinerW = (modelMatrix * vec4(transformed, 1.)).xyz;");
    s.fragmentShader = (wash ? "#define KIT_WASH\n" : "") + LINER + s.fragmentShader.replace("#include <lights_fragment_begin>", NO_LOCAL + LINER_LIGHT);
  };
  const key = m.customProgramCacheKey.call(m);
  m.customProgramCacheKey = () => key + (wash ? "-liner-wash" : "-liner");
  return u;
}

// The body's shadow on the table, from the whole exit ring at once. The viewer's exit lights are a few points on
// that ring; shadow-mapped, each one cast its own hard copy of the body (three dark spokes). The body is left out
// of their shadow maps and the table takes the ring's visibility instead: each ring sample is tested against the
// turned profile at a few heights, like the liner. What the ring can't reach is still lit a little by the bounce
// off the lit table and body around it.
const RING_N = coarse ? 10 : 16;
const RING = /* glsl */ `
  uniform vec3 uBase;
  uniform vec2 uExit; // ring radius, height (m, lamp-local)
  uniform float uProf[17], uTop, uFill;
  uniform int uRingN;
  varying vec3 vRingW;
  float bodyR(float y) { float f = clamp(y / uTop, 0., 1.) * 16.; int i = int(min(f, 15.)); return y > uTop ? 0. : mix(uProf[i], uProf[i + 1], f - float(i)); }
  float ringVis(vec3 P) {
    float v = 0.;
    for (int i = 0; i < uRingN; i++) {
      float a = float(i) * 6.2831853 / float(uRingN);
      vec3 d = vec3(cos(a) * uExit.x, uExit.y, sin(a) * uExit.x) - P;
      float gap = 1.;
      for (int k = 0; k < 6; k++) {
        float y = uTop * (.08 + .14 * float(k)), t = clamp((y - P.y) / d.y, 0., 1.);
        vec3 X = P + d * t;
        gap = min(gap, length(X.xz) - bodyR(y));
      }
      v += smoothstep(-.002, .005, gap);
    }
    return mix(uFill, 1., v / float(uRingN));
  }
`;
export function ringShadowed(m: THREE.Material, prof: THREE.Vector2[], top: number, exit: { r: number; y: number }): RingUniforms {
  const u: RingUniforms = {
    uBase: { value: new THREE.Vector3() },
    uExit: { value: new THREE.Vector2(exit.r, exit.y) },
    uFill: { value: 0.14 },
    uProf: { value: profUniform(prof, top) },
    uTop: { value: top },
    uRingN: { value: RING_N },
  };
  const prev = m.onBeforeCompile;
  m.onBeforeCompile = (s, r) => {
    prev.call(m, s, r);
    Object.assign(s.uniforms, u);
    s.vertexShader =
      "varying vec3 vRingW;\n" +
      s.vertexShader.replace("#include <project_vertex>", "#include <project_vertex>\nvRingW = (modelMatrix * vec4(transformed, 1.)).xyz;");
    s.fragmentShader =
      RING +
      s.fragmentShader
        .replace("#include <lights_fragment_begin>", "float kitVis = ringVis(vRingW - uBase);\n#include <lights_fragment_begin>")
        .replace(
          "#include <lights_fragment_begin>",
          THREE.ShaderChunk.lights_fragment_begin.replace(
            "getPointLightInfo( pointLight, geometryPosition, directLight );",
            "getPointLightInfo( pointLight, geometryPosition, directLight );\n\t\tdirectLight.color *= kitVis;"
          )
        );
  };
  const key = m.customProgramCacheKey.call(m);
  m.customProgramCacheKey = () => key + "-ring";
  return u;
}

// MSAA resolves before exposure and the knee, so where a surface many times brighter than white meets a dark room, a
// pixel it barely touches still comes out white, and a nearly upright edge shows in steps at any sample count. Limited
// to about white before the resolve, the edge can grade. Hue is kept; the knee would flatten this light anyway.
export function brightnessLimited<M extends THREE.Material>(m: M) {
  const limit = { value: 1 };
  const prev = m.onBeforeCompile;
  m.onBeforeCompile = (s, r) => {
    prev.call(m, s, r);
    s.uniforms.uLimit = limit;
    s.fragmentShader =
      "uniform float uLimit;\n" +
      s.fragmentShader.replace(
        "#include <opaque_fragment>",
        "outgoingLight *= min(1., uLimit / max(max(outgoingLight.r, max(outgoingLight.g, outgoingLight.b)), 1e-4));\n#include <opaque_fragment>"
      );
  };
  const key = m.customProgramCacheKey.call(m);
  m.customProgramCacheKey = () => key + "-limited";
  return limit;
}

/* ---------- knurl ---------- */

// A diamond knurl: two helices of V grooves with rounded crests, as a normal map (with an occlusion map for the
// grooves) rather than geometry. One tile is one groove spacing around by the axial distance between crossings, in
// cm, so the pattern is to scale. Mipmaps keep it from shimmering; where they average the grooves away, the shorter
// mean normal becomes roughness (Toksvig), so far away it reads as a duller band instead of turning back into a
// mirror-smooth tube.
const KNURL_TILE = 128;
const KNURL_SS = 4;
// tooth height over pitch: flanks up to ~45 degrees
const KNURL_DEPTH = 0.25;
const TOKSVIG = /* glsl */ `
  {
    float nl = length(texture2D(normalMap, vNormalMapUv).xyz * 2. - 1.);
    float a = roughnessFactor * roughnessFactor;
    roughnessFactor = sqrt(sqrt(a * a + .6 * (1. - nl) / max(nl, .5)));
  }
`;

function knurlMaps(around: number, along: number, pitch: number, cross: number) {
  const nor = new Uint8Array(KNURL_TILE * KNURL_TILE * 4);
  const ao = new Uint8Array(KNURL_TILE * KNURL_TILE * 4);
  const depth = KNURL_DEPTH * pitch;
  const frac = (x: number) => x - Math.floor(x);
  for (let py = 0; py < KNURL_TILE; py++)
    for (let px = 0; px < KNURL_TILE; px++) {
      let nx = 0;
      let ny = 0;
      let nz = 0;
      let occ = 0;
      for (let k = 0; k < KNURL_SS * KNURL_SS; k++) {
        const s = (px + ((k % KNURL_SS) + 0.5) / KNURL_SS) / KNURL_TILE;
        const t = (py + (Math.floor(k / KNURL_SS) + 0.5) / KNURL_SS) / KNURL_TILE;
        // the lower of the two helices' teeth (tooth 4q(1-q): groove at q = 0, crest at 0.5); the second one's
        // grooves only `cross` as deep
        const q1 = frac(s + t);
        const q2 = frac(s - t);
        const first = 4 * q1 * (1 - q1) < 1 - cross * (1 - 4 * q2 * (1 - q2));
        const [q, dir, c] = first ? [q1, 1, 1] : [q2, -1, cross];
        const slope = c * depth * (4 - 8 * q);
        const gx = -slope / around;
        const gy = (-slope * dir) / along;
        const len = Math.hypot(gx, gy, 1);
        nx += gx / len;
        ny += gy / len;
        nz += 1 / len;
        occ += 0.3 + 0.7 * Math.sqrt(1 - c * (1 - 4 * q * (1 - q)));
      }
      const n = KNURL_SS * KNURL_SS;
      const i = (py * KNURL_TILE + px) * 4;
      nor[i] = Math.round((nx / n) * 127.5 + 127.5);
      nor[i + 1] = Math.round((ny / n) * 127.5 + 127.5);
      nor[i + 2] = Math.round((nz / n) * 127.5 + 127.5);
      nor[i + 3] = 255;
      ao[i] = ao[i + 1] = ao[i + 2] = Math.round((occ / n) * 255);
      ao[i + 3] = 255;
    }
  return [nor, ao].map((data) => {
    const t = new THREE.DataTexture(data, KNURL_TILE, KNURL_TILE);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.magFilter = THREE.LinearFilter;
    t.minFilter = THREE.LinearMipmapLinearFilter;
    t.generateMipmaps = true;
    t.anisotropy = 8;
    t.needsUpdate = true;
    return t;
  });
}

// `around`, `along`: the tile's size on the surface (cm); `pitch`: the grooves' spacing across them (cm); `cross` as in
// the spec
export function knurlMaterial(around: number, along: number, pitch: number, cross: number) {
  const [normalMap, aoMap] = knurlMaps(around, along, pitch, cross);
  const m = new THREE.MeshPhysicalMaterial({ metalness: 1, roughness: 0.3, normalMap, aoMap });
  m.onBeforeCompile = (s) => {
    s.fragmentShader = s.fragmentShader.replace("#include <normal_fragment_maps>", "#include <normal_fragment_maps>\n" + TOKSVIG);
  };
  m.customProgramCacheKey = () => "knurl";
  return m;
}

/* ---------- wood ---------- */

export interface WoodParams {
  early: string;
  late: string;
  rough: number;
  clearcoat: number;
}

export interface Grain {
  pith: [number, number, number];
  dir: [number, number, number];
  ring: number;
  contrast?: number;
  pores?: number;
  relief?: number;
}

export interface WoodMaterial extends THREE.MeshPhysicalMaterial {
  userData: { uniforms: WoodUniforms; envI?: number };
}

// Turned wood: the growth rings are solid (distance from a pith line, computed in object space), so the turning
// shows what the real piece does: near-vertical lines on the neck and elongated bullseyes where the bulb passes
// closest to the pith. Fine fibre streaks and pores run along the grain, oak rays cross it.
export function woodMaterial(f: WoodParams, grain: Grain): WoodMaterial {
  const m = new THREE.MeshPhysicalMaterial({ roughness: f.rough, clearcoat: f.clearcoat, clearcoatRoughness: 0.38 }) as WoodMaterial;
  const u: WoodUniforms = {
    uEarly: { value: new THREE.Color(f.early) },
    uLate: { value: new THREE.Color(f.late) },
    uPith: { value: new THREE.Vector3(...grain.pith) },
    uGrain: { value: new THREE.Vector3(...grain.dir).normalize() },
    uRing: { value: grain.ring },
    uRings: { value: grain.contrast ?? 0.38 },
    uPores: { value: grain.pores ?? 1 },
    uRelief: { value: grain.relief ?? 1 },
  };
  m.userData.uniforms = u;
  m.onBeforeCompile = (s) => {
    Object.assign(s.uniforms, u);
    s.vertexShader = "varying vec3 vLocal;\n" + s.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\nvLocal = position * 100.;");
    s.fragmentShader =
      "varying vec3 vLocal;\nuniform vec3 uEarly, uLate, uPith, uGrain;\nuniform float uRing, uRings, uPores, uRelief;\n" +
      NOISE +
      s.fragmentShader
        .replace(
          "#include <color_fragment>",
          /* glsl */ `
          vec3 p = vLocal, r = p - uPith;
          float along = dot(r, uGrain);
          vec3 radial = r - along * uGrain;
          float rho = length(radial);
          // rings wander: a broad sway plus a finer wobble, so neighbouring rings are never quite parallel
          float d = rho + (fbm(p * .16) - .5) * .5 + (fbm(p * .7 + 9.) - .5) * .12 + .08 * sin(along * .45);
          // growth differs from year to year: rings of uneven width
          d += uRing * .6 * n3(vec3(d / uRing * .5, 0., 0.));
          float ring = fract(d / uRing), year = floor(d / uRing);
          // latewood darkens gradually through the year; the boundary is the sharp step to next spring's wood
          // pores (dashes ~.8 x .15 mm), rays and fibres are finer than a pixel from most viewpoints, where they only
          // alias (shimmer, visible pixels on phones): each fades to its average as the pixel footprint (cm) grows.
          // The rings themselves get close to that from afar, so the latewood edge widens and then fades out too.
          float fw = length(fwidth(p));
          float late = smoothstep(.3, .97, ring) * (1. - smoothstep(1. - max(.03, fw / uRing), 1., ring)) * (.45 + .55 * n3(vec3(year * 3.1)));
          late = mix(late, .25, smoothstep(.6, 1.2, fw / uRing));
          // the spring wood opens with a band of pores: the ring reads as rows of short dashes, not a drawn line
          float zone = 1. - smoothstep(.04, .3, ring);
          float dens = zone * (.45 + .55 * n3(along * 1.5 * uGrain + radial * 6.)) + .15;
          float fibre = mix(fbm(along * .35 * uGrain + radial * 9.), .47, smoothstep(.03, .09, fw));
          float pore = mix(smoothstep(.62, .78, n3(along * 12. * uGrain + radial * 60.)) * dens * 1.6, dens * .25, smoothstep(.008, .03, fw));
          // oak rays: thin sheets fanning out from the pith, a few mm tall along the grain; where the turning cuts
          // them they show as short ticks across the grain
          vec3 e1 = normalize(cross(uGrain, abs(uGrain.z) < .9 ? vec3(0., 0., 1.) : vec3(1., 0., 0.))), e2 = cross(uGrain, e1);
          float arc = atan(dot(radial, e2), dot(radial, e1)) * rho;
          float ray = mix(smoothstep(.66, .82, n3(vec3(arc * 28., along * 1.6, rho * 2.5))), .1, smoothstep(.012, .04, fw));
          // broad streaks along the grain, patches the oil soaked into unevenly, and a drift between golden and
          // redder wood across the piece
          float figure = n3(along * .12 * uGrain + radial * 1.2 + 11.), oil = fbm(p * .5 + 5.);
          float tone = (.9 + .2 * fbm(p * .18 + 3.)) * (.94 + .12 * figure);
          vec3 c = mix(uEarly, uLate, late * uRings) * (.9 + .2 * fibre) * mix(vec3(1.03, 1., .92), vec3(.97, 1., 1.08), fbm(p * .25 + 17.));
          diffuseColor.rgb = mix(c, uLate * .6, (pore * .32 + ray * .4) * uPores) * tone;
          // rays are dense and polish glossier than the open spring wood
          float woodRough = late * .04 + (pore * .2 - ray * .1) * uPores + (oil - .5) * .16;
          // the wood's own relief (cm, then m): open pores sink, fibres stand up a little, sanding takes the soft
          // spring wood a little lower than the dense latewood (a ripple along each ring that shows in the highlight;
          // smooth, since a step at the ring boundary reads as a pale stitched line in the liner's grazing light),
          // and a hand-sanded turning is never quite true, so the highlight breaks up instead of sliding like plastic
          // (deeper pores catch the liner's grazing light on their upper rims: pale nicks at night)
          float woodH = (-pore * .0012 + (fibre - .47) * .004 + ray * .001) * uPores
            + ((.5 - .5 * cos(6.2832 * ring)) * .002 + (fbm(p * .9 + 2.) - .5) * .016) * uRelief;
          woodH *= .01;
        `
        )
        .replace("#include <roughnessmap_fragment>", "#include <roughnessmap_fragment>\nroughnessFactor = clamp(roughnessFactor + woodRough, 0., 1.);")
        // bump from the screen-space derivatives of the height (as three's bump map does); the clearcoat keeps the
        // unperturbed normal
        .replace(
          "#include <normal_fragment_maps>",
          /* glsl */ `
          #include <normal_fragment_maps>
          {
            vec3 sx = dFdx(-vViewPosition), sy = dFdy(-vViewPosition);
            vec3 R1 = cross(sy, normal), R2 = cross(normal, sx);
            float det = dot(sx, R1);
            normal = normalize(abs(det) * normal - sign(det) * (dFdx(woodH) * R1 + dFdy(woodH) * R2));
          }
        `
        );
  };
  m.customProgramCacheKey = () => "wood";
  return m;
}

/* ---------- fabric ---------- */

export interface FabricOptions extends Partial<LinenSet> {
  color: string;
  transmission: number;
  sheen?: string;
  side?: THREE.Side;
  inward?: boolean;
}

export interface FabricMaterial extends THREE.MeshPhysicalMaterial {
  userData: { uniforms: FabricUniforms };
}

// Backlit fabric: besides the usual reflection, the shade glows with the light it transmits. The glow is
// computed per pixel from the lamp position (inverse square, cosine), so it falls off naturally towards the
// rims, and thin spots of the weave let more light through than the threads.
export function fabricMaterial(o: FabricOptions): FabricMaterial {
  const m = new THREE.MeshPhysicalMaterial({
    color: o.color,
    roughness: 0.92,
    sheen: 1,
    sheenColor: new THREE.Color(o.sheen || "#fff8ec"),
    sheenRoughness: 0.75,
    map: o.map,
    normalMap: o.normalMap,
    roughnessMap: o.roughnessMap,
    normalScale: new THREE.Vector2(0.35, 0.35),
    side: o.side || THREE.FrontSide,
  }) as FabricMaterial;
  const u: FabricUniforms = {
    uLamp: { value: new THREE.Vector3() },
    uLampI: { value: 0 },
    uLampColor: { value: new THREE.Color() },
    uT: { value: o.transmission },
    uFlip: { value: o.inward ? 1 : -1 },
  };
  m.userData.uniforms = u;
  m.onBeforeCompile = (s) => {
    Object.assign(s.uniforms, u);
    skipLocal(s);
    s.vertexShader =
      "varying vec3 vWPos, vWNrm;\n" +
      s.vertexShader.replace(
        "#include <project_vertex>",
        "#include <project_vertex>\nvWPos = (modelMatrix * vec4(transformed, 1.)).xyz;\nvWNrm = normalize(mat3(modelMatrix) * objectNormal);"
      );
    s.fragmentShader =
      "varying vec3 vWPos, vWNrm;\nuniform vec3 uLamp, uLampColor;\nuniform float uLampI, uT, uFlip;\n" +
      s.fragmentShader.replace(
        "#include <emissivemap_fragment>",
        /* glsl */ `
        #include <emissivemap_fragment>
        {
          vec3 toL = uLamp - vWPos;
          // light bounces around inside the shade many times before it gets through, which evens out the
          // inverse square of the direct path
          float d2 = mix(max(dot(toL, toL), 1e-5), .0025, .7);
          float c = max(dot(normalize(toL), uFlip * vWNrm), 0.);
          float weave = 1.;
          #ifdef USE_ROUGHNESSMAP
            // how much of the light the threads block (R of the roughness map, see tools/make-linen.py),
            // normalised to the tile's mean so the overall glow doesn't depend on the weave
            weave = (1. - .45 * texture2D(roughnessMap, vRoughnessMapUv).r) / (1. - .45 * ${LINEN_DENSITY});
          #endif
          // the fabric filters what it lets through, more strongly than what it reflects (light scatters through
          // several fibres), so the glow is a warmer version of its colour; seen edge-on it reads darker
          float facing = .7 + .3 * saturate(dot(normal, normalize(vViewPosition)));
          totalEmissiveRadiance += uLampColor * pow(diffuse, vec3(1.5)) * uLampI * (.35 + .65 * c) / d2 * uT * weave * facing * RECIPROCAL_PI;
        }
      `
      );
  };
  m.customProgramCacheKey = () => "fabric" + (o.map ? 1 : 0);
  return m;
}

// Table top for kit scenes, in the same solid wood: a flat-sawn walnut veneer, the pith far under the top and
// tilted a little, so the rings cut the surface into long cathedral arches running front to back. Centimetres,
// box centred on its origin. The pores are filled under the lacquer: at table distance open ones read as sand.
export function tableWood() {
  return woodMaterial(
    { early: "#7a4a2b", late: "#3d2112", rough: 0.5, clearcoat: 0.15 },
    { pith: [25, -60, 0], dir: [0.05, 0.025, 1], ring: 1.5, contrast: 0.2, pores: 0.2, relief: 0.3 }
  );
}
