// Table lamp scene: a laid restaurant table under the lamp. Kit lamps stand in the baked restaurant (a closed
// placeholder room until it has loaded); the other lamps stand in front of a plaster wall.
import * as THREE from "three";
import { linenSet, tableWood } from "../kit/materials";
import type { Variant, ViewerModel } from "../types";
import type { Viewer } from "../Viewer";
import { forkGeometry, knifeGeometry } from "./cutlery";
import { kitLamp, proceduralLamp, type LampInfo } from "./lamps";
import { sceneMaterials, type SceneMaterials } from "./materials";
import { pointLight } from "../geometry";
import { roomData } from "./room";
import { tableware } from "./tableware";

// A diner's place (seated at +z): dinner and bread plates, folded napkin under the fork, knife, a wine glass with
// wine and a water tumbler. Plates and glasses are closed solids with real wall thickness, rim and foot.
export function placeSetting(v: Viewer, M: SceneMaterials, x: number, z: number, rot = 0, parent: THREE.Object3D = v.root) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  g.rotation.y = rot;
  parent.add(g);
  // built once (tens of ms each); a disposed geometry is simply uploaded again on the next build
  const cut = (v.cutlery ||= { fork: forkGeometry(), knife: knifeGeometry() });
  const w = (v.ware ||= tableware());
  v.mesh(w.plate, M.ceramic, { parent: g });
  v.mesh(w.bread, M.ceramic, { parent: g }).position.set(-0.215, 0, -0.2);
  v.mesh(w.napkin, M.linen, { parent: g }).position.set(-0.2, 0, 0.01);
  v.mesh(cut.fork, M.steel, { parent: g }).position.set(-0.2, 0.0105, 0);
  v.mesh(cut.knife, M.steel, { parent: g }).position.set(0.165, 0, 0);
  const wine = new THREE.Group();
  wine.position.set(0.12, 0, -0.19);
  g.add(wine);
  v.mesh(w.wineGlass, M.glass, { parent: wine, cast: false });
  v.mesh(w.wine, M.wine, { parent: wine, cast: false });
  v.mesh(w.tumbler, M.glass, { parent: g, cast: false }).position.set(0.215, 0, -0.13);
}

// Lamp geometry + its own lights.
export function tableLamp(v: Viewer, model: ViewerModel, parent: THREE.Object3D, M: SceneMaterials, dummy: boolean): LampInfo {
  return model.family === "kit" ? kitLamp(v, model.key, parent, dummy) : proceduralLamp(v, model.key, parent, M, dummy);
}

// Kit lamps can be turned all the way round: a closed room instead of a wall floating in the void (until the
// baked restaurant has loaded). The orbit range keeps the camera inside it. Returns its meshes.
function placeholderRoom(v: Viewer, M: SceneMaterials, z0: number) {
  const x = 2.2;
  const z1 = 2.2;
  const y0 = -0.75;
  const y1 = 1.85;
  const h = y1 - y0;
  const d = z1 - z0;
  const wall = (w: number, rot: number, px: number, pz: number) => {
    const m = v.mesh(new THREE.PlaneGeometry(w, h).rotateY(rot), M.wall, { cast: false });
    m.position.set(px, y0 + h / 2, pz);
    return m;
  };
  const ceil = v.mesh(new THREE.PlaneGeometry(2 * x, d).rotateX(Math.PI / 2), v.mat({ color: "#8a827a", roughness: 0.95 }), { cast: false });
  ceil.position.set(0, y1, (z0 + z1) / 2);
  return [wall(2 * x, Math.PI, 0, z1), wall(d, Math.PI / 2, -x, (z0 + z1) / 2), wall(d, -Math.PI / 2, x, (z0 + z1) / 2), ceil];
}

export function buildTableScene(v: Viewer, model: ViewerModel, variant: Variant) {
  const M = sceneMaterials(v);
  const kit = model.family === "kit";
  // cutlery is polished steel: it shows the lit table and shade, not the (near black) night environment
  v.steelMat = M.steel;
  const hero = variant === "hero";
  // kit lamps light the table from a few centimetres up and are seen close: a solid walnut veneer (no repeating
  // planks) under a satin lacquer, which keeps their reflection soft instead of a blown-out dot
  const kitTop = kit && !hero;
  const topMat = kitTop ? tableWood() : M.woodMat([1.6, 1.2]);
  if (kitTop) {
    v.mats.push(topMat);
    Object.assign(topMat, { clearcoatRoughness: 0.75, specularIntensity: 0.25 });
  }
  const top = v.mesh(new THREE.BoxGeometry(hero ? 1.5 : 1.3, 0.04, hero ? 0.9 : 1.05), topMat);
  top.position.set(0, -0.02, hero ? 0 : -0.1);
  const legGeo = new THREE.BoxGeometry(0.05, 0.71, 0.05);
  for (const [a, b] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    const l = v.mesh(legGeo, M.floor);
    l.position.set(a * 0.55, -0.395, b * 0.33 - (hero ? 0 : 0.1));
  }
  const floor = v.mesh(new THREE.PlaneGeometry(30, 30).rotateX(-Math.PI / 2), M.woodMat([12, 12]), { cast: false });
  floor.position.y = -0.75;

  if (hero) {
    // restaurant depth: far wall and other lit tables, out of focus in the final render
    const wall = v.mesh(new THREE.PlaneGeometry(16, 5), M.wall, { cast: false });
    wall.position.set(0, 1.5, -4.2);
    for (const [x, z] of [[-1.9, -1.4], [1.7, -2.6], [-0.6, -3.3]]) {
      const t = v.mesh(new THREE.BoxGeometry(1.2, 0.04, 0.8), M.woodMat([1.4, 1]));
      t.position.set(x, -0.02, z);
      const g = new THREE.Group();
      g.position.set(x + 0.1, 0, z);
      v.root.add(g);
      const n0 = v.shadeMats.length;
      const info = tableLamp(v, model, g, M, true);
      v.bgShades.push(...v.shadeMats.splice(n0));
      v.addLight(pointLight(5, x + 0.1, info.bulbY, z), 1.4, "bg");
    }
    placeSetting(v, M, -0.36, 0.14, 0.15);
    placeSetting(v, M, 0.38, 0.16, -0.15);
    v.scene.fog = new THREE.Fog(0x000000, 3, 9);
  } else {
    // kit lamps stand in a room with the table away from the wall: the lit shade reads against a dim background,
    // as in the product's table photo
    const inRoom = kitTop && variant !== "card";
    const back = variant === "card" ? -1.3 : inRoom ? -1.5 : -0.625;
    const wall = v.mesh(new THREE.PlaneGeometry(8, 4), M.wall, { cast: false });
    wall.position.set(0, 1.2, back);
    if (inRoom) {
      // the baked restaurant if it's loaded, else a plain closed room until it is
      v.placeholder = [floor, wall, ...placeholderRoom(v, M, back)];
      if (roomData) v.attachRoom(roomData);
      // charcoal linen napkins, as in the product's own table photo, instead of the wine-red ones
      M.linen.color.set("#2f2c29");
      M.linen.sheenColor.set("#6b655d");
      // the shade's weave, so they read as cloth rather than a painted slab
      const weave = linenSet([1.3, 2.2]);
      v.texs.push(weave.normalMap, weave.roughnessMap);
      Object.assign(M.linen, { normalMap: weave.normalMap, roughnessMap: weave.roughnessMap, normalScale: new THREE.Vector2(0.8, 0.8) });
    }
    if (variant !== "card") {
      placeSetting(v, M, -0.38, 0.12, 0.12);
      placeSetting(v, M, 0.4, 0.15, -0.1);
    }
  }
  const info = tableLamp(v, model, v.root, M, false);
  if (kitTop) v.kit!.receive(topMat);
  v.probe.set(0, 0.07, 0.09);
  v.probeHide = [];
  v.root.traverse((o) => {
    if (!(o instanceof THREE.Mesh)) return;
    if (o.material === v.bodyMat || o.material === v.neckMat || v.emitters.some((e) => e.m === o.material)) v.probeHide.push(o);
  });
  if (v.kit) v.probeHide.push(v.kit.body);

  // before setCamera: fit() uses it, and a NaN camera there sticks in OrbitControls' change detection
  v.fitAspect = 1.25;
  if (variant === "card") v.setCamera([0.0, info.h * 0.62, 1.05], [0, info.h * 0.5, 0], 26);
  else if (hero) v.setCamera([0.62, 0.42, 1.0], [-0.06, 0.17, 0], 34);
  // a longer lens than the other lamps: seen from close, a wide one makes the shade look oversized
  else if (kit) v.setCamera([0.46, 0.25, 0.78], [0, info.h * 0.47, 0], 25);
  else v.setCamera([0.48, 0.34, 0.82], [0, info.h * 0.52, 0], 32);
  // kit lamps are modelled down to the stitching, so they can be inspected from close up
  if (v.ctl)
    Object.assign(v.ctl, {
      minDistance: kit ? 0.14 : 0.4,
      maxDistance: v.room_ ? 2 : kit ? 1.25 : 2.4,
      maxPolarAngle: 1.52,
      minPolarAngle: 0.2,
    });
  // in the restaurant the sun comes in through the window front right of the table, as in the room's bake
  // (tools/room/bake.py); from higher up the wall above the windows would shade the table
  if (v.placeholder.length || v.room_) v.sun.position.set(2.7, 1.75, 1.3);
  else v.sun.position.set(2.2, 2.8, 1.6);
  v.sun.target.position.set(0, 0, 0);
}
