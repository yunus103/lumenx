import * as THREE from "three";

export type Pt = [r: number, y: number];

export const lathe = (pts: Pt[], seg = 96) => new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r, y)), seg);

// A smooth curve through the points: straight segments showed as kinks in the glass's reflections.
export const spline = (pts: Pt[], n: number): Pt[] =>
  new THREE.SplineCurve(pts.map(([r, y]) => new THREE.Vector2(r, y))).getPoints(n).map((v) => [v.x, v.y]);

// Pleated (accordion) shade as an open frustum: n pleats, each two flat facets.
export function pleatedShade(rt: number, rb: number, h: number, n: number, depth: number) {
  const pos: number[] = [];
  const uv: number[] = [];
  const N = n * 2;
  const pt = (i: number, top: boolean) => {
    const a = (i / N) * Math.PI * 2;
    const inner = i % 2 === 1;
    const r = (top ? rt : rb) * (inner ? 1 - depth * (top ? 0.5 : 1) : 1);
    const y = top ? h : inner ? 0.004 : 0;
    return [Math.cos(a) * r, y, Math.sin(a) * r];
  };
  for (let i = 0; i < N; i++) {
    const u0 = i % 2 ? 0.5 : 0;
    const u1 = u0 + 0.5;
    const a = pt(i, false);
    const b = pt(i + 1, false);
    const c = pt(i + 1, true);
    const d = pt(i, true);
    pos.push(...a, ...b, ...c, ...a, ...c, ...d);
    uv.push(u0, 0, u1, 0, u1, 1, u0, 0, u1, 1, u0, 1);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.computeVertexNormals();
  return g;
}

// Regular polygon frame (hexagon, square) as a flat shape with a hole.
export function frameShape(n: number, R: number, w: number, rot: number) {
  const ri = R - w / Math.cos(Math.PI / n);
  const s = new THREE.Shape();
  const hole = new THREE.Path();
  for (let i = 0; i <= n; i++) {
    const a = rot + (i / n) * Math.PI * 2;
    if (i) {
      s.lineTo(Math.cos(a) * R, Math.sin(a) * R);
      hole.lineTo(Math.cos(a) * ri, Math.sin(a) * ri);
    } else {
      s.moveTo(Math.cos(a) * R, Math.sin(a) * R);
      hole.moveTo(Math.cos(a) * ri, Math.sin(a) * ri);
    }
  }
  s.holes.push(hole);
  return s;
}

export function pointLight(dist: number, x: number, y: number, z: number) {
  const l = new THREE.PointLight(0xffffff, 0, dist, 2);
  l.position.set(x, y, z);
  return l;
}
