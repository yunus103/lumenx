// Architectural luminaires: dining table under a pendant / ceiling fixture in a room.
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { coarse } from "../env";
import { frameShape, lathe } from "../geometry";
import type { ViewerModel, ViewerState } from "../types";
import type { Viewer } from "../Viewer";
import { sceneMaterials } from "./materials";
import { placeSetting } from "./table";

const PROFILE: Record<string, number> = { H5: 0.05, "H7,5": 0.075, H10: 0.1 };

export function buildLuminaireScene(v: Viewer, model: ViewerModel, s: ViewerState) {
  const M = sceneMaterials(v);
  const kare = model.key === "kare";
  const prof = PROFILE[s.prof ?? ""] || 0.075;
  const ceilY = 2.75;
  v.mesh(new THREE.PlaneGeometry(14, 14).rotateX(-Math.PI / 2), M.woodMat([7, 7]), { cast: false });
  const back = v.mesh(new THREE.PlaneGeometry(14, ceilY), M.wall, { cast: false });
  back.position.set(0, ceilY / 2, -2.2);
  // Lambert ignores RectAreaLights, which in three.js emit from both faces and would flood the ceiling
  const ceilM = new THREE.MeshLambertMaterial({ color: "#d8d3ca" });
  v.mats.push(ceilM);
  const ceil = v.mesh(new THREE.PlaneGeometry(14, 14).rotateX(Math.PI / 2), ceilM, { cast: false });
  ceil.position.y = ceilY;

  // table, chairs, settings
  const tW = kare ? 2.1 : 1.8;
  const tD = kare ? 1.0 : 0.92;
  const top = v.mesh(new THREE.BoxGeometry(tW, 0.045, tD), M.woodMat([2, 1]));
  top.position.y = 0.7525;
  const legM = v.mat({ color: "#1b1917", roughness: 0.5, metalness: 0.4 });
  for (const [a, b] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    const l = v.mesh(new THREE.BoxGeometry(0.05, 0.73, 0.05), legM);
    l.position.set(a * (tW / 2 - 0.1), 0.365, b * (tD / 2 - 0.1));
  }
  const chairM = v.mat({ color: "#4a3a30", roughness: 0.78, sheen: 0.8, sheenRoughness: 0.5, sheenColor: "#8a6a58" }, true);
  const seatGeo = new RoundedBoxGeometry(0.46, 0.07, 0.45, 3, 0.025);
  const backGeo = new RoundedBoxGeometry(0.46, 0.3, 0.06, 3, 0.025);
  const chair = (x: number, z: number, ry: number) => {
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    g.rotation.y = ry;
    v.root.add(g);
    v.mesh(seatGeo, chairM, { parent: g }).position.y = 0.47;
    const cb = v.mesh(backGeo, chairM, { parent: g });
    cb.position.set(0, 0.76, -0.21);
    cb.rotation.x = -0.1;
    for (const [a, b] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      const l = v.mesh(new THREE.CylinderGeometry(0.011, 0.009, 0.45, 10), legM, { parent: g });
      l.position.set(a * 0.19, 0.225, b * 0.19);
    }
  };
  // back wall: low sideboard and a framed print give the room scale
  const sideM = v.mat({ color: "#2a211c", roughness: 0.5, clearcoat: 0.4, clearcoatRoughness: 0.3 }, true);
  const sb = v.mesh(new RoundedBoxGeometry(1.8, 0.78, 0.42, 3, 0.01), sideM);
  sb.position.set(-0.2, 0.39, -1.98);
  const art = v.mesh(new THREE.BoxGeometry(1.0, 0.7, 0.03), v.mat({ color: "#15120f", roughness: 0.4, metalness: 0.3 }));
  art.position.set(-0.9, 1.65, -2.18);
  const print = v.mesh(new THREE.PlaneGeometry(0.88, 0.58), v.mat({ color: "#8f7e66", roughness: 0.9 }), { cast: false });
  print.position.set(-0.9, 1.65, -2.163);
  const n = kare ? 3 : 2;
  for (let i = 0; i < n; i++) {
    const x = (i - (n - 1) / 2) * (tW / n);
    chair(x, -tD / 2 - 0.18, 0);
    const g = new THREE.Group();
    g.position.y = 0.775;
    v.root.add(g);
    placeSetting(v, M, x, -tD / 2 + 0.2, 0, g);
    placeSetting(v, M, x, tD / 2 - 0.2, Math.PI, g);
  }
  const vaseM = v.mat({ color: "#7d7166", roughness: 0.75 });
  v.mesh(lathe([[0, 0], [0.06, 0], [0.075, 0.05], [0.07, 0.14], [0.04, 0.2], [0.032, 0.26], [0.036, 0.28], [0, 0.28]], 96), vaseM).position.set(0.12, 0.775, 0.02);
  const runner = v.mesh(new THREE.BoxGeometry(tW * 0.8, 0.003, 0.3), M.linen);
  runner.position.set(0, 0.7765, 0);

  // luminaire
  // Lambert: three.js RectAreaLights emit from both faces and would light the profiles from inside
  const body = (v.bodyMat = new THREE.MeshLambertMaterial({ color: "#111111" }));
  v.mats.push(body);
  const diff = v.mat({ color: "#f5f3ee", roughness: 0.8, emissive: "#ffffff", emissiveIntensity: 0, side: THREE.DoubleSide });
  v.emitters.push({ m: diff, gain: 5 });
  const w = 0.05;
  const frame = (nSides: number, R: number, rot: number, y: number, cx = 0, cz = 0) => {
    const g = new THREE.ExtrudeGeometry(frameShape(nSides, R, w, rot), { depth: prof, bevelEnabled: false, curveSegments: 1 });
    g.rotateX(-Math.PI / 2);
    const b = v.mesh(g, body);
    b.position.set(cx, y, cz);
    const d = v.mesh(new THREE.ShapeGeometry(frameShape(nSides, R - 0.004, w - 0.008, rot)).rotateX(Math.PI / 2), diff, { cast: false, recv: false });
    d.position.set(cx, y - 0.0008, cz);
    // one area light per straight run of diffuser, facing down. Phones get one square light per square
    // frame (same total output) because every area light is evaluated for every pixel.
    const rm = R - w / 2 / Math.cos(Math.PI / nSides);
    if (coarse && nSides === 4) {
      const side = 2 * rm * Math.cos(Math.PI / 4);
      const ra = new THREE.RectAreaLight(0xffffff, 0, side, side);
      ra.rotation.set(-Math.PI / 2, 0, 0);
      ra.position.set(cx, y - 0.002, cz);
      v.addLight(ra, (150 * 4 * (w - 0.01) * 0.96) / side, "main");
      return;
    }
    for (let i = 0; i < nSides; i++) {
      const a0 = rot + (i / nSides) * Math.PI * 2;
      const a1 = rot + ((i + 1) / nSides) * Math.PI * 2;
      const x0 = Math.cos(a0) * rm;
      const z0 = -Math.sin(a0) * rm;
      const x1 = Math.cos(a1) * rm;
      const z1 = -Math.sin(a1) * rm;
      const len = Math.hypot(x1 - x0, z1 - z0);
      const ra = new THREE.RectAreaLight(0xffffff, 0, len * 0.96, w - 0.01);
      ra.rotation.order = "YXZ";
      ra.rotation.set(-Math.PI / 2, -Math.atan2(z1 - z0, x1 - x0), 0);
      ra.position.set(cx + (x0 + x1) / 2, y - 0.002, cz + (z0 + z1) / 2);
      v.addLight(ra, 150, "main");
    }
  };
  const wireM = v.mat({ color: "#8d8b86", metalness: 0.9, roughness: 0.3 });
  const wire = (x: number, y0: number, z: number) => {
    const len = ceilY - y0;
    const c = v.mesh(new THREE.CylinderGeometry(0.0008, 0.0008, len, 5), wireM, { cast: false });
    c.position.set(x, y0 + len / 2, z);
    v.mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.012, 24), body, { cast: false }).position.set(x, ceilY - 0.006, z);
  };
  let center: [number, number, number];
  v.fitAspect = 1.3; // before setCamera, see buildTableScene
  if (model.key === "altigen") {
    const R = 0.46;
    const y = 1.52;
    frame(6, R, 0, y);
    for (const i of [0, 2, 3, 5]) {
      const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
      wire(Math.cos(a) * (R - 0.06), y + prof, -Math.sin(a) * (R - 0.06));
    }
    center = [0, y, 0];
    v.setCamera([1.5, 1.12, 2.55], [0, 1.16, 0], 40);
  } else {
    const S = 0.62;
    const R = S / Math.SQRT2;
    const d = 0.2;
    const gap = prof + 0.012;
    const topY = ceilY - 0.09;
    for (const [x, z, lvl] of [[-d, -d, 0], [d, -d, 1], [d, d, 2], [-d, d, 3]]) {
      const y = topY - lvl * gap;
      frame(4, R, Math.PI / 4, y, x, z);
      const rod = v.mesh(new THREE.CylinderGeometry(0.004, 0.004, ceilY - y - prof, 8), wireM, { cast: false });
      rod.position.set(x - S / 2 + 0.04, (ceilY + y + prof) / 2, z - S / 2 + 0.04);
    }
    center = [0, topY - 2 * gap, 0];
    v.setCamera([2.1, 1.22, 3.1], [0, 1.6, 0], 42);
  }
  // a soft shadow-casting downlight so objects on the table ground themselves
  const spot = new THREE.SpotLight(0xffffff, 0, 6, 1.25, 1, 2);
  spot.position.set(center[0], center[1] - 0.02, center[2]);
  spot.target.position.set(center[0], 0, center[2]);
  spot.castShadow = true;
  spot.shadow.mapSize.set(1024, 1024);
  spot.shadow.bias = -0.0004;
  spot.shadow.radius = 6;
  spot.shadow.camera.near = 0.05;
  spot.shadow.camera.far = 6;
  v.addLight(spot, 12, "main");
  v.probe.set(0.4, 1.7, 1.2);
  v.root.traverse((o) => {
    if (o instanceof THREE.Mesh && o.material === diff) v.probeHide.push(o);
  });
  if (v.ctl) Object.assign(v.ctl, { minDistance: 1.2, maxDistance: 5.5, maxPolarAngle: 1.75, minPolarAngle: 0.45 });
  v.sun.position.set(2.5, 4, 3);
  v.sun.target.position.set(0, 0.7, 0);
}
