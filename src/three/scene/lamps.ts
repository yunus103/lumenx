// Table lamp builders: kit lamps from their measured spec, and the first-generation procedural lamps. Each returns
// where its light sits and how tall it is; `dummy` lamps (background tables) only get a glowing shade.
import * as THREE from "three";
import { coarse } from "../env";
import { lathe, pleatedShade, pointLight } from "../geometry";
import { buildLamp, type KitLamp } from "../kit/build";
import { KIT } from "../kit/specs";
import { pleatTex } from "../textures";
import type { Viewer } from "../Viewer";
import type { SceneMaterials } from "./materials";

export interface LampInfo {
  bulbY: number;
  h: number;
  lamp?: KitLamp;
}

// Kit lamps: total output of the light leaving the shade (same 5 W class as Avior's main light)
export const KIT_OUTPUT = 1.1;
// Share of it in the exit lights (the pool on the table and the room), relative to the shade's own glow: at 1 the
// table next to the foot came out hotter than in the product's table photo
const KIT_POOL = 0.78;
// Range of the exit lights' shadows: it covers the room; anything beyond it would read as shadowed. (The body is
// not in these maps, the table takes its shadow from the kit, so the bias only has to keep plates and napkins free
// of acne.)
const KIT_SHADOW_FAR = 4;

// Lamps built by the kit from a photo-measured spec. Light leaving the shade's bottom opening comes off the
// whole lit liner, not a point on the axis (the neck would shadow the body), so shadowed points on a ring just
// inside the opening carry it. The lamp's own parts ignore them: the kit lights its body from the liner and
// computes the fabric's glow in its shader, from the same intensity.
export function kitLamp(v: Viewer, key: string, parent: THREE.Object3D, dummy: boolean): LampInfo & { lamp: KitLamp } {
  const lamp = buildLamp(KIT[key]);
  parent.add(lamp.group);
  const seen = new Set<THREE.Material>();
  lamp.group.traverse((o) => {
    if (!(o instanceof THREE.Mesh) || seen.has(o.material)) return;
    const m = o.material as THREE.MeshStandardMaterial;
    seen.add(m);
    v.mats.push(m);
    for (const t of [m.map, m.normalMap, m.roughnessMap]) if (t) v.texs.push(t);
  });
  const info = { bulbY: lamp.lampPos.y, h: lamp.height, lamp };
  if (dummy) return info;
  v.kit = lamp;
  // Three points on the opening plane. Below it they make the pool; above it they get out through the walls (the
  // fabric casts its shadow from its outer faces only), which is the light the shade transmits into the room, so
  // no separate glow light is needed. All of them shadowed: the body must shade the table under it. Six looked
  // the same and doubled the shader size of every material in the scene (cold compile time).
  const n = 3;
  const res = coarse ? 256 : 512;
  for (let i = 0; i < n; i++) {
    const a = (i * Math.PI * 2) / n + 0.5;
    const l = pointLight(6, Math.sin(a) * lamp.exit.r, lamp.exit.y, Math.cos(a) * lamp.exit.r);
    l.castShadow = true;
    l.shadow.mapSize.set(res, res);
    l.shadow.bias = -0.0002;
    l.shadow.normalBias = 0.0008;
    l.shadow.radius = 8;
    l.shadow.camera.near = 0.004;
    l.shadow.camera.far = KIT_SHADOW_FAR;
    v.addLight(l, (KIT_OUTPUT * KIT_POOL) / n, "main");
  }
  return info;
}

export function proceduralLamp(v: Viewer, key: string, parent: THREE.Object3D, M: SceneMaterials, dummy: boolean): LampInfo {
  const body = (v.bodyMat ||= v.mat({ color: "#ffffff", metalness: 1, roughness: 0.3 }, true));
  // the neck sits centimetres under the LED; a slightly satin finish keeps its highlight from blowing out
  const neck = (v.neckMat ||= v.mat({ color: "#ffffff", metalness: 1, roughness: 0.4 }, true));
  const add = (geo: THREE.BufferGeometry, m: THREE.Material, o: { cast?: boolean; recv?: boolean } = {}) => v.mesh(geo, m, { parent, ...o });
  if (key === "avior") {
    add(new THREE.CylinderGeometry(0.064, 0.064, 0.005, 48), M.rubber).position.y = 0.0025;
    // the LED module is wider than the neck, so only the bell casts a (real) shadow
    add(lathe([[0, 0.005], [0.061, 0.005], [0.0655, 0.008], [0.0667, 0.016], [0.0667, 0.064], [0.065, 0.069], [0.06, 0.074], [0.05, 0.08], [0.039, 0.089], [0.033, 0.098], [0, 0.098]]), body);
    add(lathe([[0.033, 0.098], [0.028, 0.108], [0.0205, 0.13], [0.0168, 0.15], [0.016, 0.172], [0.0175, 0.175], [0.0175, 0.19], [0, 0.19]]), neck, { cast: false });
    const info = pleatShade(v, parent, { y0: 0.172, h: 0.124, rb: 0.122, rt: 0.056, n: 30, depth: 0.085, bulbY: 0.212 }, dummy);
    return { ...info, h: 0.3 };
  }
  if (key === "alderamin") {
    add(new THREE.CylinderGeometry(0.062, 0.062, 0.005, 48), M.rubber).position.y = 0.0025;
    add(lathe([[0, 0.005], [0.059, 0.005], [0.0635, 0.009], [0.064, 0.018], [0.064, 0.06], [0.061, 0.066], [0.053, 0.071], [0.037, 0.077], [0.0236, 0.083], [0.018, 0.089], [0, 0.089]]), body);
    add(lathe([[0.018, 0.089], [0.0148, 0.095], [0.0118, 0.101], [0.0099, 0.107], [0.0075, 0.115], [0.0062, 0.125], [0.0062, 0.238], [0.009, 0.24], [0.009, 0.262], [0, 0.262]]), neck, { cast: false });
    add(new THREE.SphereGeometry(0.011, 24, 12), body, { cast: false }).position.y = 0.125;
    const info = pleatShade(v, parent, { y0: 0.248, h: 0.127, rb: 0.119, rt: 0.055, n: 30, depth: 0.085, bulbY: 0.285 }, dummy);
    return { ...info, h: 0.38 };
  }
  // capella: cylindrical base, thin stem, conical metal hat with a downward LED ring
  add(lathe([[0, 0], [0.056, 0], [0.0587, 0.003], [0.0587, 0.072], [0.057, 0.0765], [0.05, 0.079], [0.012, 0.08], [0, 0.08]], 72), body);
  add(new THREE.CylinderGeometry(0.0097, 0.0097, 0.176, 24), body, { cast: false }).position.y = 0.168;
  const hat = add(lathe([[0.064, 0.257], [0.0645, 0.259], [0.0447, 0.343], [0.033, 0.347], [0.012, 0.3505], [0, 0.351]], 72), body);
  hat.material = body;
  hat.geometry.computeVertexNormals();
  const inner = v.mat({ color: "#efe9df", roughness: 0.5, emissive: "#ffffff", emissiveIntensity: 0, side: THREE.BackSide });
  add(lathe([[0.0625, 0.258], [0.0435, 0.341], [0, 0.343]], 72), inner, { cast: false });
  add(new THREE.CylinderGeometry(0.0105, 0.0105, 0.016, 24), body).position.y = 0.358;
  add(new THREE.SphereGeometry(0.0105, 24, 8, 0, Math.PI * 2, 0, Math.PI / 2), body).position.y = 0.366;
  const led = v.mat({ color: "#f4efe6", roughness: 0.6, emissive: "#ffffff", emissiveIntensity: 0 });
  add(new THREE.RingGeometry(0.012, 0.036, 48).rotateX(Math.PI / 2), led, { cast: false }).position.y = 0.3395;
  v.emitters.push({ m: led, gain: 9 }, { m: inner, gain: 1.1 });
  if (!dummy) {
    const spot = new THREE.SpotLight(0xffffff, 0, 4, 0.7, 0.6, 2);
    spot.position.set(0, 0.337, 0);
    spot.target.position.set(0, -1, 0);
    spot.castShadow = true;
    spot.shadow.mapSize.set(1024, 1024);
    spot.shadow.bias = -0.0003;
    spot.shadow.normalBias = 0.004;
    spot.shadow.radius = 4;
    spot.shadow.camera.near = 0.01;
    spot.shadow.camera.far = 4;
    v.addLight(spot, 2.6, "main");
    v.addLight(pointLight(0.16, 0, 0.3, 0), 0.08, "fill");
  }
  return { bulbY: 0.339, h: 0.36 };
}

interface PleatOptions {
  y0: number;
  h: number;
  rb: number;
  rt: number;
  n: number;
  depth: number;
  bulbY: number;
}

// Pleated shade with its frame. The main point light casts shadows so light only escapes top and bottom;
// a second unshadowed light tinted by the fabric stands in for light transmitted through the shade.
function pleatShade(v: Viewer, parent: THREE.Object3D, { y0, h, rb, rt, n, depth, bulbY }: PleatOptions, dummy: boolean) {
  const sm = v.mat({
    color: "#ffffff",
    roughness: 0.9,
    side: THREE.DoubleSide,
    flatShading: true,
    emissive: "#ffffff",
    emissiveMap: pleatTex(),
    emissiveIntensity: 0,
    shadowSide: THREE.DoubleSide,
  });
  v.shadeMats.push(sm);
  const m = v.mesh(pleatedShade(rt, rb, h, n, depth), sm, { parent, recv: false });
  m.position.y = y0;
  const wire = v.bodyMat!;
  const ring = v.mesh(new THREE.TorusGeometry(rt * 0.93, 0.0015, 6, 48).rotateX(Math.PI / 2), wire, { parent, cast: false });
  ring.position.y = y0 + h - 0.003;
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2;
    const len = rt * 0.93;
    const arm = v.mesh(new THREE.CylinderGeometry(0.0012, 0.0012, len, 6).rotateZ(Math.PI / 2), wire, { parent, cast: false });
    arm.position.set((Math.cos(a) * len) / 2, y0 + h - 0.003, (Math.sin(a) * len) / 2);
    arm.rotation.y = -a;
  }
  const ledM = v.mat({ color: "#ffffff", emissive: "#ffffff", emissiveIntensity: 0 });
  v.mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.008, 24), ledM, { parent, cast: false }).position.y = bulbY;
  v.emitters.push({ m: ledM, gain: 12 });
  if (!dummy) {
    const main = new THREE.PointLight(0xffffff, 0, 6, 2);
    main.position.set(0, bulbY, 0);
    main.castShadow = true;
    main.shadow.mapSize.set(coarse ? 512 : 1024, coarse ? 512 : 1024);
    main.shadow.bias = -0.002;
    main.shadow.normalBias = 0.002;
    main.shadow.radius = 5;
    main.shadow.camera.near = 0.005;
    main.shadow.camera.far = 6;
    v.addLight(main, 1.1, "main");
    v.addLight(pointLight(6, 0, y0 + h * 0.45, 0), 0.18, "glow");
  }
  return { bulbY };
}
