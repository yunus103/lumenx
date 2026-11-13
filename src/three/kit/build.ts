// Lamp kit: builds a lamp from a product spec (plain data, centimetres). Geometry is turned (lathe) from the
// silhouette measured on the product photos; materials are shared between all products.
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { lampColor } from "../color";
import { finish3D, woodFromHex, type Finish3D, type WoodFinish } from "../finishes";
import {
  alabastered,
  brightnessLimited,
  CM,
  LINEN_TILE,
  fabricMaterial,
  glassMaterial,
  knurlMaterial,
  linenSet,
  linerLit,
  marbled,
  opalMaterial,
  radiusAt,
  ringShadowed,
  surfaceTreated,
  woodMaterial,
  type LinerUniforms,
  type RingUniforms,
  type ShadeSpec,
  type WashSpec,
} from "./materials";
import type { Facets, FixedFinish, GlassPart, KitSpec, OpalShell, ProfilePoint } from "./specs";

const v2 = (r: number, y: number) => new THREE.Vector2(r * CM, y * CM);

// Starting wood until the viewer applies the selected finish (before the first frame).
const INITIAL_WOOD: WoodFinish = { early: "#c97f3b", late: "#94501f", rough: 0.55, clearcoat: 0.12 };
const PAINT_BODY = 0.1;
// the brightest a metal or painted body gets, relative to display white
const BODY_LIMIT = 1.2;
// a painted hat inside (HatSpec inside) lit by its hidden LED: the light it gives off (the viewer's emitter gain) and
// how bright it may get. Lit paint near the LED is far brighter than white, so the knee turns it pale cream there and
// leaves it warm further out, as in Bella's night photo; the limit still keeps its edges from stepping.
const INSIDE_GAIN = 3;
const INSIDE_LIMIT = 4;
// The inside's light along each of its runs (the emissive map's v: the profile runs from the stem out): full at the
// inner end, by the LED in the housing's edge, falling to a third at the rim.
let insideFade: THREE.DataTexture | undefined;
function fadeOut() {
  if (insideFade) return insideFade;
  const n = 32;
  const px = new Uint8Array(n * 4);
  for (let i = 0; i < n; i++) {
    const v = Math.round(255 * (0.33 + 0.67 * (1 - i / (n - 1)) ** 1.5));
    px.set([v, v, v, 255], i * 4);
  }
  insideFade = new THREE.DataTexture(px, 1, n);
  insideFade.magFilter = insideFade.minFilter = THREE.LinearFilter;
  insideFade.needsUpdate = true;
  return insideFade;
}
// how strongly clear glass shows the lamp's light caught in its walls (glassMaterial)
const GLASS_GLOW = 0.003;

// Smooth Catmull-Rom through the measured points; corners at the ends stay where they are.
function smoothProfile(pts: [number, number][], n = 220) {
  const curve = new THREE.SplineCurve(pts.map(([r, y]) => v2(r, y)));
  return curve.getSpacedPoints(n);
}

// The profile cut at its hard edges, each stretch smooth on its own: polished metal shows any rounding of an edge.
function profileRuns(pts: ProfilePoint[], n: number) {
  const runs: [number, number][][] = [[]];
  pts.forEach(([r, y, corner], i) => {
    runs[runs.length - 1].push([r, y]);
    if (corner && i < pts.length - 1) runs.push([[r, y]]);
  });
  const length = (run: [number, number][]) => run.slice(1).reduce((s, [r, y], i) => s + Math.hypot(r - run[i][0], y - run[i][1]), 0);
  const total = runs.reduce((s, run) => s + length(run), 0);
  return runs.map((run) => smoothProfile(run, Math.max(1, Math.round((n * length(run)) / total))));
}

// One face of the conical wall, offset from the mid-surface. Point order sets the normal: bottom-up faces out.
function wallPoints(rB: number, rT: number, y0: number, y1: number, off: number, inward: boolean) {
  const pts = [v2(rB + off, y0), v2(rT + off, y1)];
  return inward ? pts.reverse() : pts;
}

// Binding tape folded over a rim: a U around the wall edge, slightly proud of both faces.
function tapePoints(rAt: (y: number) => number, yEdge: number, len: number, t: number, top: boolean) {
  const s = top ? -1 : 1;
  const pad = t / 2 + 0.08;
  const pts = [v2(rAt(yEdge + s * len) - pad + 0.01, yEdge + s * len)];
  for (let i = 0; i <= 10; i++) {
    const a = (Math.PI * i) / 10;
    pts.push(v2(rAt(yEdge) - Math.cos(a) * pad, yEdge - s * Math.sin(a) * pad));
  }
  pts.push(v2(rAt(yEdge + s * len) + pad - 0.01, yEdge + s * len));
  return top ? pts.reverse() : pts;
}

const lathe = (pts: THREE.Vector2[], seg = 160) => new THREE.LatheGeometry(pts, seg);
const turned = (runs: THREE.Vector2[][], seg: number) => (runs.length === 1 ? lathe(runs[0], seg) : mergeGeometries(runs.map((run) => lathe(run, seg))));

// One run turned as an N-sided polygon (see Facets): `a`, `b` are how far its start and end are the polygon rather
// than the circle, blended along the run. Normals are flat across each side and smooth along the profile.
function facetedRun(run: THREE.Vector2[], a: number, b: number, seg: number, f: Facets) {
  const half = Math.PI / f.n;
  const toCorner = f.across === "flats" ? 1 / Math.cos(half) : 1;
  // a side is flat whatever its subdivision; a blend towards the circle needs the circle's
  const m = a === 1 && b === 1 ? 1 : Math.ceil(seg / f.n);
  const P = run.length;
  const len = [0];
  for (let i = 1; i < P; i++) len.push(len[i - 1] + run[i].distanceTo(run[i - 1]));
  // the profile normal as LatheGeometry takes it: across the neighbours
  const pn = run.map((_, i) => {
    const d = run[Math.min(i + 1, P - 1)].clone().sub(run[Math.max(i - 1, 0)]);
    return new THREE.Vector2(d.y, -d.x).normalize();
  });
  const pos: number[] = [];
  const nor: number[] = [];
  const uv: number[] = [];
  const cols = f.n * (m + 1);
  const n3 = new THREE.Vector3();
  for (let k = 0; k < f.n; k++) {
    const th = ((f.angle ?? 0) * Math.PI) / 180 + 2 * k * half;
    for (let j = 0; j <= m; j++) {
      const t = j / m;
      const phi = th - half + 2 * half * t;
      // on the side's chord, for a unit circumradius
      const cx = ((1 - t) * Math.sin(th - half) + t * Math.sin(th + half)) * toCorner;
      const cz = ((1 - t) * Math.cos(th - half) + t * Math.cos(th + half)) * toCorner;
      for (let i = 0; i < P; i++) {
        const s = a + (b - a) * (len[i] / len[P - 1]);
        const r = run[i].x;
        pos.push(r * (s * cx + (1 - s) * Math.sin(phi)), run[i].y, r * (s * cz + (1 - s) * Math.cos(phi)));
        const hx = s * Math.sin(th) + (1 - s) * Math.sin(phi);
        const hz = s * Math.cos(th) + (1 - s) * Math.cos(phi);
        const hl = Math.hypot(hx, hz);
        n3.set((pn[i].x * hx) / hl, pn[i].y, (pn[i].x * hz) / hl).normalize();
        nor.push(n3.x, n3.y, n3.z);
        uv.push((k * (m + 1) + j) / (cols - 1), i / (P - 1));
      }
    }
  }
  const idx: number[] = [];
  for (let c = 0; c < cols - 1; c++) {
    // the next side starts on the same corner, with its own normal: no quad between them
    if (c % (m + 1) === m) continue;
    for (let i = 0; i < P - 1; i++) {
      const p = c * P + i;
      const q = p + P;
      idx.push(p, q, p + 1, q + 1, p + 1, q);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(idx);
  return geo;
}

// The runs turned round, or N-sided where `f` says. A flat step takes its sides from its neighbours, so it closes
// the gap between a faceted run and a round one (or the axis).
function shaped(runs: THREE.Vector2[][], seg: number, f?: Facets) {
  if (!f) return turned(runs, seg);
  const lo = ((f.from ?? -Infinity) - 1e-4) * CM;
  const hi = ((f.to ?? Infinity) + 1e-4) * CM;
  const flat = runs.map((run) => run.every((p) => Math.abs(p.y - run[0].y) < 1e-9));
  const inside = runs.map((run, i) => !flat[i] && run.every((p) => p.y >= lo && p.y <= hi));
  return mergeGeometries(
    runs.map((run, i) => {
      const [a, b] = inside[i] ? [1, 1] : flat[i] ? [+!!inside[i - 1], +!!inside[i + 1]] : [0, 0];
      return a || b ? facetedRun(run, a, b, seg, f) : lathe(run, seg);
    })
  );
}

// A tapered or rounded rubber foot (KitSpec body.foot): the wall runs from rBottom at the floor up to r, its bottom
// edge rounded with a fillet tangent to the floor and the wall.
function footGeometry({ r, h, rBottom = r * 0.97, round = 0 }: KitSpec["body"]["foot"]) {
  const wall = new THREE.Vector2(r - rBottom, h).normalize();
  // the fillet touches the floor this far in from the corner, under its centre
  const t = round / Math.tan(Math.acos(-wall.x) / 2);
  const end = Math.atan2(wall.y * t - round, t + wall.x * t);
  const edge = Array.from({ length: round > 0 ? 9 : 1 }, (_, i) => {
    const a = -Math.PI / 2 + ((end + Math.PI / 2) * i) / 8;
    return round > 0 ? v2(rBottom - t + round * Math.cos(a), round + round * Math.sin(a)) : v2(rBottom, 0);
  });
  return turned([[v2(0, 0), edge[0]], [...edge, v2(r, h)], [v2(r, h), v2(0, h)]], 64);
}

// A glass wall (GlassPart): the outer surface's runs, the inner one offset `thickness` inward along the normal (at a
// corner along the mitre, so both runs meet), and a half-round rim over each open end. Every face's normal points out
// of the glass, so the inner surface faces the axis.
function glassGeometry({ profile, thickness }: GlassPart, n: number, seg: number) {
  const runs = profileRuns(profile, n);
  const t = thickness * CM;
  // outward: right of the bottom-up direction of travel
  const out = (a: THREE.Vector2, b: THREE.Vector2) => new THREE.Vector2(b.y - a.y, a.x - b.x).normalize();
  const normals = runs.map((run) => run.map((_, i) => out(run[Math.max(i - 1, 0)], run[Math.min(i + 1, run.length - 1)])));
  const inner = runs.map((run, k) =>
    run.map((p, i) => {
      const nrm = normals[k][i];
      const other = i === 0 && k > 0 ? normals[k - 1].at(-1)! : i === run.length - 1 && k < runs.length - 1 ? normals[k + 1][0] : nrm;
      const mitre = nrm.clone().add(other).normalize();
      return p.clone().addScaledVector(mitre, -t / mitre.dot(nrm));
    })
  );
  // from the outer end round to the inner one, bulging along `along` (away from the profile)
  const rim = (p: THREE.Vector2, nrm: THREE.Vector2, along: THREE.Vector2, toInner: boolean) => {
    const c = p.clone().addScaledVector(nrm, -t / 2);
    const pts = Array.from({ length: 13 }, (_, i) => {
      const a = (Math.PI * i) / 12;
      return c.clone().addScaledVector(nrm, (Math.cos(a) * t) / 2).addScaledVector(along, (Math.sin(a) * t) / 2);
    });
    return toInner ? pts : pts.reverse();
  };
  const first = runs[0];
  const last = runs.at(-1)!;
  const pieces = [...runs, ...inner.map((run) => [...run].reverse())];
  if (last.at(-1)!.x > 1e-6) pieces.push(rim(last.at(-1)!, normals.at(-1)!.at(-1)!, last.at(-1)!.clone().sub(last.at(-2)!).normalize(), true));
  if (first[0].x > 1e-6) pieces.push(rim(first[0], normals[0][0], first[0].clone().sub(first[1]).normalize(), false));
  return turned(pieces, seg);
}

function opalSource({ profile }: OpalShell): ShadeSpec {
  const ys = profile.map((p) => p[1]);
  const r = Math.max(...profile.map((p) => p[0]));
  const y = Math.min(...ys);
  return { y, h: Math.max(...ys) - y, rBottom: r, rTop: r, thickness: 0, tape: 0, transmission: 0, liner: 0 };
}

const within = (run: THREE.Vector2[], from: number, to: number) => run.every((p) => p.y >= (from - 1e-4) * CM && p.y <= (to + 1e-4) * CM);

// The viewer only talks to the lamp through this.
export interface KitLamp {
  group: THREE.Group;
  lampPos: THREE.Vector3;
  color: THREE.Color;
  cd: number;
  dimmer: number[];
  // the metals and the lacquered wood reflect the lit scene, so the viewer hands them its probe capture (taken
  // with the body hidden: the probe sits in front of it)
  reflect: THREE.MeshStandardMaterial[];
  // left out of the probe capture: the probe sits in front of them
  probeHide: THREE.Mesh[];
  // LEDs the viewer drives directly, with their brightness
  emitters: { m: THREE.MeshStandardMaterial; gain: number }[];
  // a fabric shade glows upward too; a metal hat only lights downward
  glows: boolean;
  footprint: number;
  exit: { y: number; r: number };
  height: number;
  receive(m: THREE.Material): void;
  setFinish(f: Finish3D): void;
  setExposure(exposure: number): void;
  setLight(intensity: number, worldPos: THREE.Vector3, c?: THREE.Color): void;
}

// `far`: a copy seen from metres away on a background table, no details and a sixth of the facets. Eleven lamps at
// full detail were most of the scene's triangles, and of the time to build it.
export function buildLamp(spec: KitSpec, far = false): KitLamp {
  const round = far ? 24 : 160;
  const g = new THREE.Group();
  const add = (geo: THREE.BufferGeometry, mat: THREE.Material, cast = true) => {
    const m = new THREE.Mesh(geo, mat);
    m.castShadow = cast;
    m.receiveShadow = true;
    g.add(m);
    return m;
  };

  /* body */
  const b = spec.body;
  const runs = profileRuns(b.profile, far ? 32 : 220);
  const prof = runs.flat();
  const top = Math.max(...prof.map((p) => p.y));
  const lit: LinerUniforms[] = [];
  // under a hat the source is the LED disc: to the liner's lighting, a very flat cone looking down
  const hat = spec.hat;
  // with no hat or shade, the lamp's own opal part (KitSpec opal) is the source: to the liner, a straight shade as tall
  // and wide as it
  const source =
    spec.shade ??
    (hat
      ? { y: hat.led.y - 0.1, h: 0.1, rBottom: hat.led.rOut, rTop: 0, thickness: 0, tape: 0, transmission: 0, liner: 0 }
      : opalSource(spec.opal!));
  const byLiner = <M extends THREE.Material>(m: M, wash?: WashSpec) => {
    lit.push(linerLit(m, source, prof, top, wash));
    return m;
  };
  const wood = b.grain ? woodMaterial(INITIAL_WOOD, b.grain) : null;
  // far copies of a metal lamp skip the liner's highlight: on a few blurred pixels it only sparkles
  const metal = new THREE.MeshPhysicalMaterial({ metalness: 1, roughness: 0.3 });
  // the stem that hides part of the LED disc: the thinnest part of the body's upper half
  const wash: WashSpec | undefined = hat?.led.wash && {
    y: hat.led.y * CM,
    rIn: hat.led.rIn * CM,
    rOut: hat.led.rOut * CM,
    stem: Math.min(...prof.filter((p) => p.x > 0 && p.y > top / 2).map((p) => p.x)),
    metal: hat.led.wash.metal,
  };
  const surface: THREE.MeshPhysicalMaterial = wood ? byLiner(wood) : far ? metal : byLiner(metal, wash);
  const bodyLimit = wood || far ? null : brightnessLimited(surface);
  // the body stays out of the exit lights' shadow maps (point lights render distance materials); the table takes
  // its shadow from ringShadowed. Daylight shadows are unaffected.
  const noRing = new THREE.MeshDistanceMaterial({ colorWrite: false, depthWrite: false });
  // wood is a satin lacquer: the lit table shows in it towards the silhouette, as in the photos, but only faintly.
  // Metal shows everything around it.
  surface.userData.envI = wood ? 0.2 : 1;
  // parts in a fixed finish (FixedFinish, button rings and centres): one material per finish, lit as metal or paint
  // by its own metalness, as the body is by the selected finish's
  const fixed = new Map<string, { m: THREE.MeshPhysicalMaterial; u: LinerUniforms; limit: { value: number }; top: number }>();
  // `lit`: its own material, which the viewer also drives as an emitter (HatSpec inside)
  const fixedMat = (slug: string, rough?: number, lit = false) => {
    const key = (rough === undefined ? slug : `${slug}@${rough}`) + (lit ? "@lit" : "");
    let z = fixed.get(key);
    if (!z) {
      const f = finish3D({ slug: { current: slug } });
      const m = new THREE.MeshPhysicalMaterial({ color: f.hex, metalness: f.metal, roughness: rough ?? f.rough });
      m.userData.envI = 1;
      if (lit) m.emissiveMap = fadeOut();
      z = { m, u: linerLit(m, source, prof, top, wash), limit: brightnessLimited(m), top: lit ? INSIDE_LIMIT : BODY_LIMIT };
      fixed.set(key, z);
    }
    return z.m;
  };
  // the runs of each fixed-finish zone as their own meshes, the rest in the selected finish
  const zoned = (all: THREE.Vector2[][], zones: (FixedFinish & { lit?: boolean })[] = []) => ({
    rest: all.filter((run) => !zones.some((z) => within(run, z.from, z.to))),
    zones: zones.map((z) => ({ runs: all.filter((run) => within(run, z.from, z.to)), mat: fixedMat(z.finish, z.rough, z.lit) })),
  });
  // a knurled grip is its own mesh: the runs between its two corners, in the same finish with the knurl's maps
  const k = wood || far ? undefined : b.knurl;
  const inGrip = (run: THREE.Vector2[]) => !!k && within(run, k.from, k.to);
  const bodyZones = zoned(runs.filter((run) => !inGrip(run)), far ? [] : b.fixed);
  // brushed or antique metal (body.brush, hat.brush, antique): one patch on the body's material, each part's brush
  // strength as a vertex attribute
  const surf = wood || far || !(b.brush || hat?.brush || spec.antique) ? null : surfaceTreated(surface);
  const brushed = (geo: THREE.BufferGeometry, v = 0) => {
    if (surf) geo.setAttribute("kitBrush", new THREE.Float32BufferAttribute(new Float32Array(geo.attributes.position.count).fill(v), 1));
    return geo;
  };
  const antique = surf && spec.antique;
  const antiqueAs = antique && finish3D({ slug: { current: antique.finish } });
  // a marble print (KitSpec marble): one patch on the body's material, which the hat and a body-finish button share
  const marble = wood ? undefined : spec.marble;
  const marb = marble && marbled(surface, marble.vein, marble.scale, marble.width / 10);
  const marbleAs = marble && finish3D({ slug: { current: marble.finish } });
  const bodyMesh = add(brushed(shaped(bodyZones.rest, far ? 24 : 200, b.facets), b.brush), surface);
  bodyMesh.customDistanceMaterial = noRing;
  const probeHide = [bodyMesh];
  for (const z of bodyZones.zones) {
    const zone = add(shaped(z.runs, 200, b.facets), z.mat);
    zone.customDistanceMaterial = noRing;
    probeHide.push(zone);
  }
  let grip: THREE.MeshPhysicalMaterial | null = null;
  let gripLimit: { value: number } | null = null;
  if (k) {
    const gripRuns = runs.filter(inGrip);
    // a whole number of grooves around, so the pattern closes on itself
    const a = (k.angle * Math.PI) / 180;
    const r = Math.max(...gripRuns.flat().map((p) => p.x)) / CM;
    const n = Math.max(1, Math.round((2 * Math.PI * r * Math.cos(a)) / k.pitch));
    const around = (2 * Math.PI * r) / n;
    const along = around / Math.tan(a);
    grip = byLiner(knurlMaterial(around, along, around * Math.cos(a), k.cross ?? 1), wash);
    gripLimit = brightnessLimited(grip);
    grip.userData.envI = 1;
    const geo = turned(gripRuns, 200);
    const pos = geo.attributes.position;
    const uv = geo.attributes.uv;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * n, pos.getY(i) / CM / along);
    const gripMesh = add(geo, grip);
    gripMesh.customDistanceMaterial = noRing;
    probeHide.push(gripMesh);
  }
  if (!far) {
    const rubber = new THREE.MeshStandardMaterial({ color: "#141312", roughness: 0.85 });
    const plain = b.foot.rBottom === undefined && !b.foot.round;
    const foot = add(plain ? new THREE.CylinderGeometry(b.foot.r * CM, b.foot.r * CM * 0.97, b.foot.h * CM, 64) : footGeometry(b.foot), rubber);
    if (plain) foot.position.y = (b.foot.h * CM) / 2;
    foot.customDistanceMaterial = noRing;
  }

  /* details on the body surface */
  const brass = new THREE.MeshPhysicalMaterial({ color: "#d9b26a", metalness: 1, roughness: 0.28 });
  const black = byLiner(new THREE.MeshStandardMaterial({ color: "#0c0c0d", roughness: 0.55 }));
  const steel = byLiner(new THREE.MeshStandardMaterial({ color: "#8d9096", metalness: 1, roughness: 0.35 }));
  const bodyBrass = byLiner(brass.clone());
  for (const d of far ? [] : spec.details || []) {
    const y = d.y * CM;
    const r = radiusAt(prof, y);
    const ang = Math.asin(Math.min(1, (d.x * CM) / r)) + (d.side === "back" ? Math.PI : 0);
    const dy = 0.002;
    const slope = (radiusAt(prof, y + dy) - radiusAt(prof, y - dy)) / (2 * dy);
    const n = new THREE.Vector3(Math.sin(ang), -slope, Math.cos(ang)).normalize();
    const holder = new THREE.Group();
    holder.position.set(Math.sin(ang) * r, y, Math.cos(ang) * r);
    holder.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), n);
    g.add(holder);
    const rr = d.r * CM;
    if (d.type === "button" && d.centre) {
      // a ring with a flat top round a centre sunk a hair below it, a fine groove between them
      const rc = d.centre.r;
      const ring = [[v2(d.r, -0.3), v2(d.r, 0.02)], [v2(d.r, 0.02), v2(d.r * 0.92, 0.06)], [v2(d.r * 0.92, 0.06), v2(rc, 0.06)], [v2(rc, 0.06), v2(rc, 0.03)]];
      holder.add(new THREE.Mesh(turned(ring, 48), d.ring ? fixedMat(d.ring) : bodyBrass));
      const ri = rc - 0.015;
      const centre = [[v2(ri, 0.03), v2(ri, 0.05)], [v2(ri, 0.05), v2(ri * 0.94, 0.055)], [v2(ri * 0.94, 0.055), v2(0, 0.055)]];
      holder.add(new THREE.Mesh(turned(centre, 48), fixedMat(d.centre.finish)));
    } else if (d.type === "button") {
      const geo = lathe([v2(0, -0.3), v2(d.r, -0.3), v2(d.r, 0.02), v2(d.r * 0.92, 0.06), v2(0, 0.06)], 48);
      holder.add(new THREE.Mesh(geo, d.ring ? fixedMat(d.ring) : bodyBrass));
    } else if (d.type === "usbc") {
      const disc = new THREE.Mesh(new THREE.CylinderGeometry(rr, rr, 0.006, 48), black);
      disc.position.y = -0.0028;
      holder.add(disc);
      const slot = new THREE.Mesh(new THREE.CapsuleGeometry(rr * 0.14, rr * 0.62, 4, 12), steel);
      slot.rotation.z = Math.PI / 2;
      slot.scale.x = 0.45;
      slot.position.y = 0.0003;
      holder.add(slot);
    } else if (d.type === "hole") {
      const hole = new THREE.Mesh(new THREE.CylinderGeometry(rr, rr, 0.004, 24), black);
      hole.position.y = -0.0019;
      holder.add(hole);
    }
  }

  /* shade */
  const fabrics: ReturnType<typeof fabricMaterial>[] = [];
  const s = spec.shade;
  if (s) {
    const y0 = s.y;
    const y1 = s.y + s.h;
    const circ = Math.PI * (s.rBottom + s.rTop);
    const outer = s.opal
      ? opalMaterial(s.transmission)
      : fabricMaterial({ color: "#eee4cc", transmission: s.transmission, ...linenSet([Math.round(circ / LINEN_TILE), s.h / LINEN_TILE]) });
    const inner = s.opal ? opalMaterial(s.liner, true) : fabricMaterial({ color: "#efe6d2", transmission: s.liner, inward: true });
    if (s.opal && s.alabaster) for (const m of [outer, inner]) alabastered(m, s.alabaster.scale, s.alabaster.strength);
    // the tape is folded over the rim: three layers of fabric, so lit from inside it reads as a band a little darker
    // and warmer than the wall (~0.7x in the photos), not grey. Same weave scale as the wall, across the U.
    const tapeLen = 2 * s.tape + Math.PI * (s.thickness / 2 + 0.08);
    fabrics.push(outer, inner);
    // The fabric casts shadows from its outer faces only: daylight from outside is blocked, but the glow light inside
    // still gets out through the walls, as the light the fabric transmits does
    // (tape and cap, a few millimetres of fabric, cast none: lit from inside they glow too)
    outer.shadowSide = THREE.FrontSide;
    const t2 = s.thickness / 2;
    const rAt = (y: number) => s.rBottom + ((s.rTop - s.rBottom) * (y - y0)) / s.h;
    if (s.profile) {
      // one turned surface: the outer material on its front faces, the liner on its back faces (their normals point
      // out, so the liner takes its glow as an outer face does)
      const shell = shaped(profileRuns(s.profile, far ? 32 : 160), round);
      add(shell, outer);
      inner.side = THREE.BackSide;
      add(shell, inner, false);
    } else {
      add(lathe(wallPoints(s.rBottom, s.rTop, y0, y1, t2, false), round), outer);
      add(lathe(wallPoints(s.rBottom, s.rTop, y0, y1, -t2, true), round), inner, false);
    }
    // an opal wall is moulded: no tape, just its rims (a profiled one has them in its profile)
    if (s.profile) {
      // nothing to add
    } else if (s.opal) {
      add(lathe([v2(s.rBottom - t2, y0), v2(s.rBottom + t2, y0)], round), outer, false);
      add(lathe([v2(s.rTop + t2, y1), v2(s.rTop - t2, y1)], round), outer, false);
    } else {
      const tape = fabricMaterial({ color: "#e6d6b6", transmission: s.transmission * 0.6, ...linenSet([Math.round(circ / LINEN_TILE), tapeLen / LINEN_TILE]) });
      fabrics.push(tape);
      add(lathe(tapePoints(rAt, y0, s.tape, s.thickness, false).filter((_, i, a) => !far || i % 3 === 0 || i === a.length - 1), round), tape, false);
      add(lathe(tapePoints(rAt, y1, s.tape, s.thickness, true).filter((_, i, a) => !far || i % 3 === 0 || i === a.length - 1), round), tape, false);
    }
    if (s.cap) {
      const capT = s.thickness;
      const capGeo = lathe([v2(0, y1 - capT / 2), v2(s.rTop - 0.05, y1 - capT / 2), v2(s.rTop - 0.05, y1 + capT / 2), v2(0, y1 + capT / 2)], far ? 24 : 120);
      const cap = s.opal
        ? opalMaterial(s.transmission * 1.6)
        : fabricMaterial({ color: "#eee4cc", transmission: s.transmission * 1.6, ...linenSet([(2 * s.rTop) / LINEN_TILE, (2 * s.rTop) / LINEN_TILE]) });
      fabrics.push(cap);
      add(capGeo, cap, false);
      // Planar UVs for the disc so the weave doesn't pinch towards the centre
      const pos = capGeo.attributes.position;
      const uv = capGeo.attributes.uv;
      for (let i = 0; i < pos.count; i++) uv.setXY(i, (pos.getX(i) / (s.rTop * CM)) * 0.5 + 0.5, (pos.getZ(i) / (s.rTop * CM)) * 0.5 + 0.5);
    }
    const tb = spec.topButton;
    if (!far && tb && (s.cap || s.profile)) {
      const geo = tb.shape
        ? turned(profileRuns(tb.shape.map(([r, y, c]): ProfilePoint => [r * tb.r, y * tb.h, c]), 60), 64)
        : lathe([v2(0, 0), v2(tb.r, 0), v2(tb.r, tb.h * 0.2), v2(tb.r * 0.9, tb.h * 0.6), v2(tb.r * 0.55, tb.h * 0.92), v2(0, tb.h)], 64);
      const btn = add(brushed(geo, b.brush), tb.finish === "body" ? surface : tb.finish ? fixedMat(tb.finish) : brass);
      btn.position.y = (s.profile ? Math.max(...s.profile.map((p) => p[1])) : y1 + s.thickness / 2) * CM;
    }
  }

  // an opal part turned from its own profile, as a profiled shade: one surface, its back faces the inside
  const opalShell = (o: OpalShell) => {
    const shell = shaped(profileRuns(o.profile, far ? 16 : 120), round);
    const out = opalMaterial(o.transmission);
    const inside = opalMaterial(o.transmission);
    inside.side = THREE.BackSide;
    fabrics.push(out, inside);
    add(shell, out, false);
    add(shell, inside, false);
  };
  if (spec.opal) opalShell(spec.opal);

  /* clear glass */
  const reflectGlass: THREE.MeshStandardMaterial[] = [];
  if (spec.glass) {
    const glass = glassMaterial(GLASS_GLOW);
    fabrics.push(glass);
    reflectGlass.push(glass);
    add(glassGeometry(spec.glass, far ? 32 : 160, round), glass, false);
  }

  /* metal hat over an LED disc */
  const emitters: KitLamp["emitters"] = [];
  if (hat) {
    const inside = far ? undefined : hat.inside;
    const hatZones = zoned(profileRuns(hat.profile, far ? 16 : 120), far ? [] : [...(hat.fixed ?? []), ...(inside ? [{ ...inside, lit: true }] : [])]);
    probeHide.push(add(brushed(shaped(hatZones.rest, round, hat.facets), hat.brush), surface));
    for (const z of hatZones.zones) probeHide.push(add(shaped(z.runs, round, hat.facets), z.mat));
    if (inside) emitters.push({ m: fixedMat(inside.finish, inside.rough, true), gain: INSIDE_GAIN });
    else {
      const led = new THREE.MeshStandardMaterial({ color: "#f4efe6", roughness: 0.6, emissive: "#ffffff", emissiveIntensity: 0 });
      const disc = add(new THREE.RingGeometry(hat.led.rIn * CM, hat.led.rOut * CM, round).rotateX(Math.PI / 2), led, false);
      disc.position.y = hat.led.y * CM;
      emitters.push({ m: led, gain: 6 });
    }
    const o = hat.opal;
    if (o && "profile" in o) opalShell(o);
    else if (o) {
      const band = opalMaterial(o.transmission);
      fabrics.push(band);
      add(turned([[v2(hat.led.rOut, o.y), v2(o.r, o.y)], [v2(o.r, o.y), v2(o.r, o.y + o.h)]], round), band, false);
    }
  }

  /* light */
  const L = spec.light;
  const lampPos = new THREE.Vector3(0, L.y * CM, 0);
  const color = lampColor(L.kelvin);
  const cd = L.lumen / (4 * Math.PI);
  // below a hat, far enough from it to clear the shadow camera's near plane: the hat stops the light going upward
  // an own opal part (no shade, no hat) lets its light out as a shade does, through the bottom of `source`
  const exit = hat && !s ? { y: (hat.led.y - 0.5) * CM, r: hat.led.rOut * 0.86 * CM } : { y: (source.y - 0.05) * CM, r: source.rBottom * 0.86 * CM };
  const rings: RingUniforms[] = [];
  const heightCm = s
    ? (s.profile ? Math.max(...s.profile.map((p) => p[1])) : s.y + s.h + s.thickness) + (spec.topButton?.h || 0)
    : Math.max(...(hat ?? spec.opal!).profile.map((p) => p[1]), ...(spec.glass?.profile.map((p) => p[1]) ?? []));

  return {
    group: g,
    lampPos,
    color,
    cd,
    dimmer: L.dimmer,
    // far copies of metal and paint lamps take the probe capture too: under the room environment (a bright neutral
    // studio) they read milky white, chrome most of all. Far wood keeps it, as before.
    reflect:
      far && wood
        ? []
        : [...(grip ? [brass, bodyBrass, steel, surface, grip] : [brass, bodyBrass, steel, surface]), ...[...fixed.values()].map((z) => z.m), ...reflectGlass],
    probeHide,
    emitters,
    glows: !!s || !hat,
    footprint: Math.max(...prof.map((p) => p.x)),
    // where the viewer puts the light leaving the opening: just inside it and near the wall. Low enough that the
    // rim doesn't cut the pool into petals (the liner spreads the light, there is no sharp cut-off), far enough
    // from the neck that it isn't lit from millimetres.
    exit,
    height: heightCm * CM,
    // a surface under the lamp (the table) takes the body's shadow from the whole exit ring
    receive(m) {
      rings.push(ringShadowed(m, prof, top, exit));
    },
    setFinish(f) {
      if (!wood) {
        // antique keeps the finish's metalness here, so setLight lights it as the finish (paint: no gold shine at
        // night); the shader raises it for the reflections
        const ant = !!antique && !!antiqueAs && f.hex === antiqueAs.hex && f.metal === antiqueAs.metal;
        const mar = !!marb && !!marbleAs && f.hex === marbleAs.hex && f.metal === marbleAs.metal;
        for (const m of grip ? [surface, grip] : [surface]) {
          m.color.set(ant ? antique.hex : f.hex);
          m.metalness = f.metal;
          m.roughness = far ? Math.max(f.rough, 0.55) : ant ? antique.rough : mar ? (marble.rough ?? f.rough) : f.rough;
        }
        if (marb) marb.uMarble.value = +mar;
        if (surf) {
          surf.uBrushOn.value = +(f.metal > 0.5 && f.rough >= 0.2);
          surf.uAntique.value = +ant;
          surf.uAMetal.value = antique ? antique.metal : 1;
          surf.uPatina.value = antique ? antique.patina : 0;
        }
        return;
      }
      const w = f.wood ?? woodFromHex(f.hex);
      wood.userData.uniforms.uEarly.value.set(w.early);
      wood.userData.uniforms.uLate.value.set(w.late);
      wood.roughness = w.rough;
      wood.clearcoat = w.clearcoat;
    },
    setExposure(exposure) {
      if (bodyLimit) bodyLimit.value = BODY_LIMIT / exposure;
      if (gripLimit) gripLimit.value = BODY_LIMIT / exposure;
      for (const z of fixed.values()) z.limit.value = z.top / exposure;
    },
    // intensity in the viewer's light units (0 = off), position in world space; colour defaults to the spec's
    setLight(intensity, worldPos, c = color) {
      for (const m of fabrics) {
        const u = m.userData.uniforms;
        u.uLampI.value = intensity;
        u.uLamp.value.copy(worldPos);
        u.uLampColor.value.copy(c);
      }
      // metal only takes a highlight from the LED (and its `wash` share as diffuse); paint takes all of it as diffuse
      const body = wood || surface.metalness > 0.5 ? L.body : L.body * PAINT_BODY;
      const liner = (u: LinerUniforms, k: number) => {
        u.uLampI.value = intensity * k;
        u.uBounce.value = L.bounce;
        u.uLampColor.value.copy(c);
        u.uBase.value.copy(worldPos).sub(lampPos);
      };
      for (const u of lit) liner(u, body);
      for (const { m, u } of fixed.values()) liner(u, m.metalness > 0.5 ? L.body : L.body * PAINT_BODY);
      for (const u of rings) u.uBase.value.copy(worldPos).sub(lampPos);
    },
  };
}
