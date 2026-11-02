// Lamp kit: builds a lamp from a product spec (plain data, centimetres). Geometry is turned (lathe) from the
// silhouette measured on the product photos; materials are shared between all products.
import * as THREE from "three";
import { lampColor } from "../color";
import type { WoodFinish } from "../finishes";
import {
  CM,
  LINEN_TILE,
  fabricMaterial,
  linenSet,
  linerLit,
  radiusAt,
  ringShadowed,
  woodMaterial,
  type LinerUniforms,
  type RingUniforms,
} from "./materials";
import type { KitSpec } from "./specs";

const v2 = (r: number, y: number) => new THREE.Vector2(r * CM, y * CM);

// Starting wood until the viewer applies the selected finish (before the first frame).
const INITIAL_WOOD: WoodFinish = { early: "#c97f3b", late: "#94501f", rough: 0.55, clearcoat: 0.12 };

// Smooth Catmull-Rom through the measured points; corners at the ends stay where they are.
function smoothProfile(pts: [number, number][], n = 220) {
  const curve = new THREE.SplineCurve(pts.map(([r, y]) => v2(r, y)));
  return curve.getSpacedPoints(n);
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
  body: THREE.Mesh;
  footprint: number;
  exit: { y: number; r: number };
  height: number;
  receive(m: THREE.Material): void;
  setFinish(f: WoodFinish): void;
  setLight(intensity: number, worldPos: THREE.Vector3, c?: THREE.Color): void;
}

export function buildLamp(spec: KitSpec): KitLamp {
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
  const prof = smoothProfile(b.profile);
  const top = Math.max(...prof.map((p) => p.y));
  const lit: LinerUniforms[] = [];
  const byLiner = <M extends THREE.Material>(m: M) => {
    lit.push(linerLit(m, spec.shade, prof, top));
    return m;
  };
  const wood = byLiner(woodMaterial(INITIAL_WOOD, b.grain));
  // the body stays out of the exit lights' shadow maps (point lights render distance materials); the table takes
  // its shadow from ringShadowed. Daylight shadows are unaffected.
  const noRing = new THREE.MeshDistanceMaterial({ colorWrite: false, depthWrite: false });
  // a satin lacquer: the lit table shows in it towards the silhouette, as in the photos, but only faintly
  wood.userData.envI = 0.2;
  const bodyMesh = add(lathe(prof, 200), wood);
  bodyMesh.customDistanceMaterial = noRing;
  const rubber = new THREE.MeshStandardMaterial({ color: "#141312", roughness: 0.85 });
  const foot = add(new THREE.CylinderGeometry(b.foot.r * CM, b.foot.r * CM * 0.97, b.foot.h * CM, 64), rubber);
  foot.position.y = (b.foot.h * CM) / 2;
  foot.customDistanceMaterial = noRing;

  /* details on the body surface */
  const brass = new THREE.MeshPhysicalMaterial({ color: "#d9b26a", metalness: 1, roughness: 0.28 });
  const black = byLiner(new THREE.MeshStandardMaterial({ color: "#0c0c0d", roughness: 0.55 }));
  const steel = byLiner(new THREE.MeshStandardMaterial({ color: "#8d9096", metalness: 1, roughness: 0.35 }));
  const bodyBrass = byLiner(brass.clone());
  for (const d of spec.details || []) {
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
    if (d.type === "button") {
      const geo = lathe([v2(0, -0.3), v2(d.r, -0.3), v2(d.r, 0.02), v2(d.r * 0.92, 0.06), v2(0, 0.06)], 48);
      holder.add(new THREE.Mesh(geo, bodyBrass));
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
  const s = spec.shade;
  const y0 = s.y;
  const y1 = s.y + s.h;
  const circ = Math.PI * (s.rBottom + s.rTop);
  const outer = fabricMaterial({ color: "#eee4cc", transmission: s.transmission, ...linenSet([Math.round(circ / LINEN_TILE), s.h / LINEN_TILE]) });
  const inner = fabricMaterial({ color: "#efe6d2", transmission: s.liner, inward: true });
  // the tape is folded over the rim: three layers of fabric, so lit from inside it reads as a band a little darker
  // and warmer than the wall (~0.7x in the photos), not grey. Same weave scale as the wall, across the U.
  const tapeLen = 2 * s.tape + Math.PI * (s.thickness / 2 + 0.08);
  const tape = fabricMaterial({ color: "#e6d6b6", transmission: s.transmission * 0.6, ...linenSet([Math.round(circ / LINEN_TILE), tapeLen / LINEN_TILE]) });
  const fabrics = [outer, inner, tape];
  // The fabric casts shadows from its outer faces only: daylight from outside is blocked, but the glow light inside
  // still gets out through the walls, as the light the fabric transmits does
  // (tape and cap, a few millimetres of fabric, cast none: lit from inside they glow too)
  outer.shadowSide = THREE.FrontSide;
  const t2 = s.thickness / 2;
  const rAt = (y: number) => s.rBottom + ((s.rTop - s.rBottom) * (y - y0)) / s.h;
  add(lathe(wallPoints(s.rBottom, s.rTop, y0, y1, t2, false)), outer);
  add(lathe(wallPoints(s.rBottom, s.rTop, y0, y1, -t2, true)), inner, false);
  add(lathe(tapePoints(rAt, y0, s.tape, s.thickness, false)), tape, false);
  add(lathe(tapePoints(rAt, y1, s.tape, s.thickness, true)), tape, false);
  if (s.cap) {
    const capT = s.thickness;
    const capGeo = lathe([v2(0, y1 - capT / 2), v2(s.rTop - 0.05, y1 - capT / 2), v2(s.rTop - 0.05, y1 + capT / 2), v2(0, y1 + capT / 2)], 120);
    const cap = fabricMaterial({ color: "#eee4cc", transmission: s.transmission * 1.6, ...linenSet([(2 * s.rTop) / LINEN_TILE, (2 * s.rTop) / LINEN_TILE]) });
    fabrics.push(cap);
    add(capGeo, cap, false);
    // Planar UVs for the disc so the weave doesn't pinch towards the centre
    const pos = capGeo.attributes.position;
    const uv = capGeo.attributes.uv;
    for (let i = 0; i < pos.count; i++) uv.setXY(i, (pos.getX(i) / (s.rTop * CM)) * 0.5 + 0.5, (pos.getZ(i) / (s.rTop * CM)) * 0.5 + 0.5);
    const tb = spec.topButton;
    const btn = add(lathe([v2(0, 0), v2(tb.r, 0), v2(tb.r, tb.h * 0.2), v2(tb.r * 0.9, tb.h * 0.6), v2(tb.r * 0.55, tb.h * 0.92), v2(0, tb.h)], 64), brass);
    btn.position.y = (y1 + capT / 2) * CM;
  }

  /* light */
  const L = spec.light;
  const lampPos = new THREE.Vector3(0, L.y * CM, 0);
  const color = lampColor(L.kelvin);
  const cd = L.lumen / (4 * Math.PI);
  const exit = { y: (s.y - 0.05) * CM, r: s.rBottom * 0.86 * CM };
  const rings: RingUniforms[] = [];

  return {
    group: g,
    lampPos,
    color,
    cd,
    dimmer: L.dimmer,
    reflect: [brass, bodyBrass, steel, wood],
    body: bodyMesh,
    footprint: Math.max(...prof.map((p) => p.x)),
    // where the viewer puts the light leaving the opening: just inside it and near the wall. Low enough that the
    // rim doesn't cut the pool into petals (the liner spreads the light, there is no sharp cut-off), far enough
    // from the neck that it isn't lit from millimetres.
    exit,
    height: (y1 + s.thickness + (spec.topButton?.h || 0)) * CM,
    // a surface under the lamp (the table) takes the body's shadow from the whole exit ring
    receive(m) {
      rings.push(ringShadowed(m, prof, top, exit));
    },
    setFinish(f) {
      wood.userData.uniforms.uEarly.value.set(f.early);
      wood.userData.uniforms.uLate.value.set(f.late);
      wood.roughness = f.rough;
      wood.clearcoat = f.clearcoat;
    },
    // intensity in the viewer's light units (0 = off), position in world space; colour defaults to the spec's
    setLight(intensity, worldPos, c = color) {
      for (const m of fabrics) {
        const u = m.userData.uniforms;
        u.uLampI.value = intensity;
        u.uLamp.value.copy(worldPos);
        u.uLampColor.value.copy(c);
      }
      for (const u of lit) {
        u.uLampI.value = intensity * L.body;
        u.uBounce.value = L.bounce;
        u.uLampColor.value.copy(c);
        u.uBase.value.copy(worldPos).sub(lampPos);
      }
      for (const u of rings) u.uBase.value.copy(worldPos).sub(lampPos);
    },
  };
}
