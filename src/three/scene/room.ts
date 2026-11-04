// The baked restaurant shared by every kit table lamp. Built and baked once in Blender (frekans-demo tools/room):
// geometry in room.glb, albedo textures, and one lightmap per mode. Drawn unlit (albedo x lightmap), so it costs a
// texture fetch per pixel and no lights. Viewer.open() waits for it and it stays cached across products.
import * as THREE from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { ASSETS, coarse } from "../env";
import type { Mode } from "../models";

const ROOM_URL = `${ASSETS}/room/`;
const ROOM_RES = coarse ? "lo" : "hi";
const MODES: Mode[] = ["gunduz", "aksam", "gece"];

// material: [albedo texture, linear colour]. The same values the bake used for its bounce light.
const ROOM_ALBEDO: Record<string, [string | null, [number, number, number]?]> = {
  plaster: ["plaster"],
  ceiling: ["plaster"],
  walnut: ["walnut"],
  panel: ["walnut", [0.62, 0.55, 0.5]],
  parquet: ["parquet"],
  fabric: ["fabric"],
  art1: ["art1"],
  art2: ["art2"],
  paint: [null, [0.66, 0.62, 0.55]],
  brass: [null, [0.8, 0.6, 0.32]],
  ceramic: [null, [0.86, 0.85, 0.82]],
  napkin: [null, [0.035, 0.033, 0.031]],
  soil: [null, [0.05, 0.035, 0.025]],
  potted_plant_01_leaves: ["potted_plant_01_leaves"],
  potted_plant_01_pot: ["potted_plant_01_pot"],
  potted_plant_02_leaves: ["potted_plant_02_leaves"],
  potted_plant_02_pot: ["potted_plant_02_pot"],
};

// what isn't lightmapped, per mode (before exposure): the street outside, the sheer curtains it backlights, the
// sconces' frosted glass (and the black 'void' behind the wainscot, which stays black)
// `lamps`: the background lamps' power relative to the evening. The day gain is 12, so they bake a twelfth as strong.
export const ROOM_FX: Record<Mode, { view: number; curtain: number; glass: number; lamps: number }> = {
  gunduz: { view: 1, curtain: 0.6, glass: 1.2, lamps: 0.0875 },
  aksam: { view: 0.45, curtain: 0.04, glass: 2.5, lamps: 1 },
  gece: { view: 0.32, curtain: 0.035, glass: 2.5, lamps: 1 },
};

// How much of each lamp layer a fabric-shaded lamp gives, fitted against the earlier bake that had the lamps inside
export const ROOM_LAMP_MIX = { down: 0.93, up: 0.06 };

export interface RoomMeta {
  lightmap: Record<Mode | "lamp-down" | "lamp-up", number>;
  gain?: Partial<Record<Mode, number>>;
  tables: [number, number][];
}

export interface RoomData {
  group: THREE.Group;
  meta: RoomMeta;
  mats: THREE.MeshBasicMaterial[];
  fx: Record<string, THREE.MeshBasicMaterial>;
  lm: Partial<Record<Mode, THREE.Texture>>;
  view: Partial<Record<Mode, THREE.Texture>>;
  perMode: (m: Mode) => Promise<void>;
  lampLight: { down: THREE.Color; up: THREE.Color };
}

let roomLoad: Promise<RoomData> | null = null;
export let roomData: RoomData | null = null;

// The background lamps follow the product's switch, level and colour, so their light is added to the mode's map at
// draw time: two more fetches per pixel, no lights.
const lampUniforms = {
  lampDown: { value: null as THREE.Texture | null },
  lampUp: { value: null as THREE.Texture | null },
  lampDownLight: { value: new THREE.Color(0, 0, 0) },
  lampUpLight: { value: new THREE.Color(0, 0, 0) },
};

function addLampLayers(shader: Parameters<THREE.Material["onBeforeCompile"]>[0]) {
  Object.assign(shader.uniforms, lampUniforms);
  shader.fragmentShader = shader.fragmentShader
    .replace("#include <common>", "#include <common>\nuniform sampler2D lampDown, lampUp;\nuniform vec3 lampDownLight, lampUpLight;")
    .replace(
      "reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;",
      // the layers are stored as square roots (encode.py): their faint bounce would not survive 8 bits otherwise
      `reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
      vec3 lampD = texture2D(lampDown, vLightMapUv).rgb;
      vec3 lampU = texture2D(lampUp, vLightMapUv).rgb;
      reflectedLight.indirectDiffuse += lampD * lampD * lampDownLight + lampU * lampU * lampUpLight;`,
    );
}

function roomTex(name: string, srgb = true) {
  return new THREE.TextureLoader().loadAsync(`${ROOM_URL}${name}-${ROOM_RES}.webp`).then((t) => {
    // glTF UVs: no flip
    t.flipY = false;
    t.anisotropy = 8;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    if (srgb) t.colorSpace = THREE.SRGBColorSpace;
    return t;
  });
}

export function loadRoom(mode: Mode): Promise<RoomData> {
  return (roomLoad ||= (async () => {
    const draco = new DRACOLoader().setDecoderPath(`${ASSETS}/draco/`);
    const names = [...new Set(Object.values(ROOM_ALBEDO).map((a) => a[0]).filter((n): n is string => !!n))];
    const lm: RoomData["lm"] = {};
    const view: RoomData["view"] = {};
    const pending: Partial<Record<Mode, Promise<void>>> = {};
    // per-mode maps: the current mode's first, the others right after (a switch then finds them loaded)
    // the atlas's islands sit a few texels apart: smaller mips would blend neighbours (light is smooth anyway)
    const atlasTex = (name: string) =>
      roomTex(name).then((l) => {
        l.channel = 1;
        l.wrapS = l.wrapT = THREE.ClampToEdgeWrapping;
        l.generateMipmaps = false;
        l.minFilter = THREE.LinearFilter;
        return l;
      });
    const perMode = (m: Mode) =>
      (pending[m] ||= Promise.all([atlasTex(`lm-${m}`), roomTex(`view-${m}`)]).then(([l, v]) => {
        v.wrapS = v.wrapT = THREE.ClampToEdgeWrapping;
        lm[m] = l;
        view[m] = v;
      }));
    const [gltf, meta, texs, lampDown, lampUp] = await Promise.all([
      new GLTFLoader().setDRACOLoader(draco).loadAsync(`${ROOM_URL}room.glb`),
      fetch(`${ROOM_URL}room.json`).then((r) => r.json() as Promise<RoomMeta>),
      Promise.all(names.map((n) => roomTex(n))),
      atlasTex("lm-lamp-down"),
      atlasTex("lm-lamp-up"),
      perMode(mode),
    ]);
    draco.dispose();
    lampUniforms.lampDown.value = lampDown;
    lampUniforms.lampUp.value = lampUp;
    const tex = Object.fromEntries(names.map((n, i) => [n, texs[i]]));
    const mats: Record<string, THREE.MeshBasicMaterial> = {};
    const fx: Record<string, THREE.MeshBasicMaterial> = {};
    gltf.scene.traverse((o) => {
      if (!(o instanceof THREE.Mesh)) return;
      const key = (o.material as THREE.Material).name.replace(/\.\d+$/, "");
      o.geometry.deleteAttribute("normal");
      if (key in ROOM_ALBEDO) {
        const [t, c] = ROOM_ALBEDO[key];
        // created with a lightmap: swapping it per mode then never changes the shader
        o.material = mats[key] ||= new THREE.MeshBasicMaterial({
          name: key,
          map: t ? tex[t] : null,
          lightMap: lm[mode],
          color: c ? new THREE.Color().setRGB(...c, THREE.LinearSRGBColorSpace) : 0xffffff,
        });
        mats[key].onBeforeCompile = addLampLayers;
      } else {
        // 'void': the black board behind the wainscot (build.py)
        o.material = fx[key] ||= new THREE.MeshBasicMaterial({
          name: key,
          color: key === "void" ? 0 : 0xffffff,
          map: key === "view" ? view[mode] : null,
          side: THREE.DoubleSide,
          transparent: key === "curtain",
          opacity: 0.88,
          depthWrite: key !== "curtain",
        });
      }
    });
    for (const m of MODES)
      perMode(m).catch(() => {
        delete pending[m];
      });
    return (roomData = {
      group: gltf.scene,
      meta,
      mats: Object.values(mats),
      fx,
      lm,
      view,
      perMode,
      lampLight: { down: lampUniforms.lampDownLight.value, up: lampUniforms.lampUpLight.value },
    });
  })().catch((err) => {
    roomLoad = null;
    throw err;
  }));
}

// Starts the room's download (or joins it). Never rejects: without the room a kit lamp opens in the placeholder.
export function preloadRoom(mode: Mode = "gece") {
  return loadRoom(mode).catch((err) => {
    console.warn("room", err);
  });
}
