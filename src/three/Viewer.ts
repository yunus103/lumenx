// 3D product viewer. Everything is modelled procedurally in metres from the product photos' silhouettes.
// Light is physical (inverse-square, candela): the light inside a shade casts shadows through the shade, so
// it only leaves through the openings; linear LED profiles are made of RectAreaLights following the diffuser.
// Render on demand: a frame is drawn only when the camera moved or something visible changed.
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { kLinear, luminance } from "./color";
import { coarse } from "./env";
import { loadKitSpec } from "./kit/specs";
import type { KitLamp } from "./kit/build";
import type { Mode } from "./models";
import { CLAMP, FINISH, FocusedRoomPass, KNEE, StillFrame } from "./passes";
import { KIT_OUTPUT, kitLamp } from "./scene/lamps";
import { buildLuminaireScene } from "./scene/luminaire";
import { ROOM_FX, ROOM_LAMP_MIX, loadRoom, preloadRoom, type RoomData } from "./scene/room";
import { buildTableScene } from "./scene/table";
import { tableware, type Tableware } from "./scene/tableware";
import type { Variant, ViewerModel, ViewerState } from "./types";

export { loadTextures } from "./textures";
export { preloadRoom } from "./scene/room";

RectAreaLightUniformsLib.init();

interface ModeLook {
  env: number;
  bg: string;
  sun: number;
  sunColor: string;
  exp: number;
}

const MODES: Record<Mode, ModeLook> = {
  gunduz: { env: 0.55, bg: "#b9b1a6", sun: 1.3, sunColor: "#fff6ec", exp: 0.8 },
  aksam: { env: 0.14, bg: "#1b1e26", sun: 0.45, sunColor: "#93a7d8", exp: 2.3 },
  gece: { env: 0.004, bg: "#030303", sun: 0, sunColor: "#000000", exp: 3.1 },
};
// Kit lamps at dusk: the lamp carries the scene (as in the product's own photos), so half the blue daylight and a
// little more exposure
const KIT_AKSAM: ModeLook = { ...MODES.aksam, env: 0.07, sun: 0.22, exp: 2.7 };
// At night the sconces still light the room: with the lamp off the table must not be blacker than the ones around it
const KIT_GECE: ModeLook = { ...MODES.gece, env: 0.025 };
// Strip lights in metal's reflections: direction round the lamp (degrees, 0 towards the viewer's side), width (m at 1 m)
const REFLECTION_CARDS: [number, number][] = [[38, 0.3], [-62, 0.42], [128, 0.5], [-142, 0.26]];
// Frames averaged once the view is still, one per animation frame
const STILL_SAMPLES = coarse ? 8 : 16;
// Below this speed (pixels per second) the camera's glide is over to the eye, and only delays the sharp picture
const GLIDE_END = 40;
const halton = (i: number, base: number) => {
  let f = 1;
  let r = 0;
  for (let n = i; n > 0; n = Math.floor(n / base)) {
    f /= base;
    r += f * (n % base);
  }
  return r;
};
// Lamp output relative to daylight. Night/evening exposures compensate, so daylight can drown the lamp.
const LAMP = 0.4;
const REF_LUM = luminance(kLinear(3000));

type LightRole = "main" | "glow" | "fill" | "bg";
type SceneLight = THREE.PointLight | THREE.SpotLight | THREE.RectAreaLight;
interface Emitter {
  m: THREE.MeshStandardMaterial;
  gain: number;
}
type Reflector = THREE.MeshStandardMaterial;

export interface ViewerOptions {
  interactive?: boolean;
  preserve?: boolean;
  maxDpr?: number;
  tone?: "aces" | "neutral";
  // the visitor started turning the model (the hint fades)
  onInteract?: () => void;
}

export class Viewer {
  readonly host: HTMLElement;
  readonly opts: ViewerOptions;
  readonly r: THREE.WebGLRenderer;
  readonly scene = new THREE.Scene();
  readonly cam = new THREE.PerspectiveCamera(30, 1, 0.02, 60);
  readonly root = new THREE.Group();
  readonly sun = new THREE.DirectionalLight(0xffffff, 0);
  readonly probe = new THREE.Vector3();
  ctl?: OrbitControls;

  // per build (disposed by clear())
  mats: THREE.Material[] = [];
  texs: THREE.Texture[] = [];
  lamps: SceneLight[] = [];
  emitters: Emitter[] = [];
  kit: KitLamp | null = null;
  bodyMat: THREE.MeshPhysicalMaterial | THREE.MeshLambertMaterial | null = null;
  neckMat: THREE.MeshPhysicalMaterial | null = null;
  steelMat: THREE.MeshStandardMaterial | null = null;
  glassMat: THREE.MeshStandardMaterial | null = null;
  wineMat: THREE.MeshStandardMaterial | null = null;
  shadeMats: THREE.MeshStandardMaterial[] = [];
  bgShades: THREE.MeshStandardMaterial[] = [];
  probeHide: THREE.Object3D[] = [];
  placeholder: THREE.Mesh[] = [];
  bgKits: { lamp: KitLamp; pos: THREE.Vector3 }[] = [];
  private cards: THREE.Group | null = null;
  room_: RoomData | null = null;
  fitAspect = 1.25;

  // shared geometry, built once per viewer
  cutlery?: { fork: THREE.BufferGeometry; knife: THREE.BufferGeometry };
  ware?: Tableware;

  private readonly dpr: number;
  private readonly tone: THREE.ToneMapping;
  private readonly pm: THREE.PMREMGenerator;
  private readonly roomEnv: THREE.Texture;
  private readonly cubeRT: THREE.WebGLCubeRenderTarget;
  private readonly cubeCam: THREE.CubeCamera;
  private readonly shadeProbe = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });
  private readonly bounce = new THREE.HemisphereLight(0xffffff, 0xffffff, 0);
  private readonly composer: EffectComposer;
  private readonly bloom: UnrealBloomPass;
  private readonly knee: ShaderPass;
  private readonly finish: ShaderPass;
  private readonly drawPass: RenderPass;
  private readonly focus: FocusedRoomPass | null = null;
  private readonly still = new StillFrame();
  private stillCount = 0;
  private dragging = false;
  private readonly lastCam = new THREE.Vector3();
  private roomParts = new Set<THREE.Object3D>();
  private readonly ro: ResizeObserver;
  private readonly io: IntersectionObserver;
  private capEnv: THREE.WebGLRenderTarget | null = null;
  private model: ViewerModel | null = null;
  private target = new THREE.Vector3();
  private base: THREE.Vector3 | null = null;
  private moved = false;
  private intro = 1;
  private camMoved = false;
  private keepCam = false;
  private dirty = true;
  private ready = false;
  private alive = true;
  private vis = true;
  private slow = 0;
  private raf = 0;
  private buildId = 0;
  private shadowsStale = true;
  private lastState: ViewerState | null = null;

  constructor(host: HTMLElement, opts: ViewerOptions = {}) {
    this.host = host;
    this.opts = { interactive: true, preserve: false, ...opts };
    const r = (this.r = new THREE.WebGLRenderer({ antialias: false, preserveDrawingBuffer: this.opts.preserve, powerPreference: "high-performance" }));
    r.setPixelRatio((this.dpr = Math.min(devicePixelRatio || 1, this.opts.maxDpr || (coarse ? 1.5 : 2))));
    r.toneMapping = this.tone = this.opts.tone === "aces" ? THREE.ACESFilmicToneMapping : THREE.NeutralToneMapping;
    r.shadowMap.enabled = true;
    r.shadowMap.type = THREE.PCFShadowMap;
    r.shadowMap.autoUpdate = false;
    host.prepend(r.domElement);
    // iOS drops the GL context of background tabs; shadows and the probe must be rebuilt afterwards
    r.domElement.addEventListener("webglcontextlost", (e) => e.preventDefault());
    r.domElement.addEventListener("webglcontextrestored", () => {
      this.shadowsStale = true;
      if (this.lastState) this.apply(this.lastState);
    });

    this.pm = new THREE.PMREMGenerator(r);
    const room = new RoomEnvironment();
    this.roomEnv = this.pm.fromScene(room, 0.04).texture;
    room.dispose();
    this.scene.environment = this.roomEnv;
    // Probe: the lit scene is captured into a cube map and used as the environment, so metal reflects the
    // glowing shade and the warm table, and walls/ceiling receive one bounce of the lamp's light.
    this.cubeRT = new THREE.WebGLCubeRenderTarget(coarse ? 64 : 128, { type: THREE.HalfFloatType });
    this.cubeCam = new THREE.CubeCamera(0.01, 30, this.cubeRT);

    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(2048, 2048);
    this.sun.shadow.bias = -0.0004;
    this.sun.shadow.normalBias = 0.02;
    Object.assign(this.sun.shadow.camera, { left: -2.5, right: 2.5, top: 2.5, bottom: -2.5, near: 0.5, far: 14 });
    this.scene.add(this.sun, this.sun.target);
    this.scene.add(this.bounce);

    const rt = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4 });
    this.composer = new EffectComposer(r, rt);
    this.drawPass = new RenderPass(this.scene, this.cam);
    this.composer.addPass(this.drawPass);
    // phones go without the depth of field
    if (!coarse) {
      this.focus = new FocusedRoomPass(this.scene, this.cam, () => this.ctl?.target ?? this.target, (room) => this.showPart(room));
      this.composer.addPass(this.focus);
    }
    this.composer.addPass(new ShaderPass(CLAMP));
    this.bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.32, 0.4, 1.0);
    this.composer.addPass(this.bloom);
    this.knee = new ShaderPass(KNEE);
    this.knee.enabled = false;
    this.composer.addPass(this.knee);
    this.composer.addPass(new OutputPass());
    this.finish = new ShaderPass(FINISH);
    this.finish.enabled = false;
    this.composer.addPass(this.finish);

    if (this.opts.interactive) {
      const c = (this.ctl = new OrbitControls(this.cam, r.domElement));
      c.enableDamping = true;
      c.dampingFactor = 0.12;
      c.enablePan = false;
      c.rotateSpeed = 0.65;
      c.zoomSpeed = 0.8;
      c.addEventListener("start", () => {
        this.moved = true;
        this.dragging = true;
        this.opts.onInteract?.();
      });
      c.addEventListener("end", () => {
        this.dragging = false;
      });
      // Pointer and wheel handlers move the camera themselves, so update() in the loop only sees the damping
      // remainder and often reports "unchanged". The change event catches every real move.
      c.addEventListener("change", () => {
        this.camMoved = true;
      });
    }

    this.scene.add(this.root);

    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(host);
    this.resize();
    // entries are queued oldest first; the last one is the current state
    this.io = new IntersectionObserver((es) => {
      this.vis = es[es.length - 1].isIntersecting;
      if (this.vis) this.dirty = true;
    });
    this.io.observe(host);
    let last = 0;
    let prevMoved = false;
    const loop = (now: number) => {
      if (!this.alive) return;
      this.raf = requestAnimationFrame(loop);
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 1 / 60;
      last = now;
      // until the scene is built and its shaders compiled, a render would compile them synchronously
      if (!this.ready || !this.vis || document.hidden) return;
      // damping per second instead of per frame (same feel at 60 fps); on slow frames a drag would crawl
      if (this.intro < 1) {
        // capped per frame: a slow first frame must not skip the move
        this.intro = this.moved ? 1 : Math.min(1, this.intro + Math.min(dt, 0.04) / 1.8);
        this.fit();
      }
      if (this.ctl) {
        this.ctl.dampingFactor = 1 - Math.pow(1 - 0.12, dt * 60);
        this.ctl.update();
        this.endGlide(dt);
      }
      const moved = this.camMoved;
      this.camMoved = false;
      if (moved || this.dirty) {
        this.dirty = false;
        this.stillCount = 0;
        this.composer.render();
      } else if (this.stillCount < STILL_SAMPLES) this.refine();
      // dt only measures render cost when the previous frame rendered too
      if (moved && prevMoved) this.adapt(dt);
      // a still view can afford full resolution again
      else if (!moved && prevMoved && this.r.getPixelRatio() < this.dpr) {
        this.r.setPixelRatio(this.dpr);
        this.resize();
        this.dirty = true;
      }
      prevMoved = moved;
    };
    if (this.opts.interactive) this.raf = requestAnimationFrame(loop);
  }

  // Turning damping off for one update drops what is left of the glide.
  private endGlide(dt: number) {
    const c = this.ctl!;
    const px = (this.cam.position.distanceTo(this.lastCam) / this.cam.position.distanceTo(c.target) / THREE.MathUtils.degToRad(this.cam.fov)) * this.host.clientHeight;
    this.lastCam.copy(this.cam.position);
    if (this.dragging || !this.moved || !px || px / dt > GLIDE_END) return;
    c.enableDamping = false;
    c.update();
    c.enableDamping = true;
  }

  // One more sample of a still view. The first is centred, so the picture doesn't shift when the averaging starts.
  private refine() {
    const n = this.stillCount++;
    const w = this.host.clientWidth;
    const h = this.host.clientHeight;
    const px = 1 / this.r.getPixelRatio();
    if (n) this.cam.setViewOffset(w, h, (halton(n, 2) - 0.5) * px, (halton(n, 3) - 0.5) * px, w, h);
    this.composer.renderToScreen = false;
    this.composer.render();
    this.composer.renderToScreen = true;
    if (n) this.cam.clearViewOffset();
    this.still.add(this.r, this.composer.readBuffer.texture, n);
  }

  // Which part of the room scene is on show (FocusedRoomPass). The lights stay: the same lights mean the same shaders.
  private showPart(room: boolean | null) {
    if (this.room_) this.room_.group.visible = room !== false;
    for (const o of this.root.children) {
      if (o instanceof THREE.Light) continue;
      o.visible = room === null || this.roomParts.has(o) === room;
    }
  }

  // Weak GPUs: after half a second of dragging below ~35 fps, render fewer pixels. It never steps back up during
  // a drag, so the resolution can't oscillate; the loop restores it once the camera stops.
  private adapt(dt: number) {
    this.slow = dt > 0.028 ? this.slow + dt : 0;
    const pr = this.r.getPixelRatio();
    if (this.slow < 0.5 || pr <= 0.75) return;
    this.slow = 0;
    this.r.setPixelRatio(Math.max(0.75, pr - 0.25));
    this.resize();
  }

  resize() {
    const w = this.host.clientWidth;
    const h = this.host.clientHeight;
    if (!w || !h) return;
    this.r.setSize(w, h, false);
    this.composer.setPixelRatio(this.r.getPixelRatio());
    this.composer.setSize(w, h);
    const size = this.r.getDrawingBufferSize(new THREE.Vector2());
    this.still.setSize(size.x, size.y);
    this.cam.aspect = w / h;
    this.cam.updateProjectionMatrix();
    this.fit();
    this.dirty = true;
  }

  // Narrow viewports pull the camera back so the product stays in frame, until the user takes over.
  private fit() {
    if (!this.base || this.moved) return;
    const k = Math.max(1, Math.pow(this.fitAspect / Math.max(this.cam.aspect, 0.3), 0.8));
    const rest = this.base.clone().multiplyScalar(k);
    if (this.intro < 1) {
      const left = Math.pow(1 - this.intro, 3);
      rest.applyAxisAngle(THREE.Object3D.DEFAULT_UP, -0.2 * left).multiplyScalar(1 + 0.1 * left);
    }
    this.cam.position.copy(this.target).add(rest);
    this.cam.lookAt(this.target);
    if (this.ctl) {
      this.ctl.target.copy(this.target);
      this.ctl.update();
    }
  }

  setCamera(pos: [number, number, number], target: [number, number, number], fov?: number) {
    if (this.keepCam) return;
    this.cam.fov = fov || this.cam.fov;
    this.cam.updateProjectionMatrix();
    this.target = new THREE.Vector3(...target);
    this.base = new THREE.Vector3(...pos).sub(this.target);
    this.moved = false;
    this.fit();
    this.dirty = true;
  }

  dispose() {
    this.alive = false;
    cancelAnimationFrame(this.raf);
    this.ro.disconnect();
    this.io.disconnect();
    this.clear();
    this.ctl?.dispose();
    for (const p of this.composer.passes) p.dispose?.();
    this.composer.dispose();
    this.still.dispose();
    this.roomEnv.dispose();
    this.cubeRT.dispose();
    this.pm.dispose();
    this.shadeProbe.dispose();
    this.capEnv?.dispose();
    this.r.dispose();
    this.r.forceContextLoss();
    this.r.domElement.remove();
  }

  private clear() {
    this.root.traverse((o) => {
      if (o instanceof THREE.Mesh) o.geometry.dispose();
      if (o instanceof THREE.InstancedMesh) o.dispose();
      if (o instanceof THREE.Light && o.shadow?.map) o.shadow.map.dispose();
    });
    this.mats.forEach((m) => m.dispose());
    this.texs.forEach((x) => x.dispose());
    this.texs = [];
    this.root.clear();
    this.mats = [];
    this.lamps = [];
    this.emitters = [];
    this.kit = null;
    this.bodyMat = null;
    this.neckMat = null;
    this.steelMat = null;
    this.glassMat = null;
    this.wineMat = null;
    this.roomParts.clear();
    this.setFocus(false);
    this.shadeMats = [];
    this.bgShades = [];
    this.probeHide = [];
    this.scene.fog = null;
    // the baked room is shared: detached, never disposed
    if (this.room_) {
      this.scene.remove(this.room_.group);
      this.room_ = null;
    }
    this.placeholder = [];
    this.bgKits = [];
  }

  mat(o: THREE.MeshPhysicalMaterialParameters, phys: true): THREE.MeshPhysicalMaterial;
  mat(o: THREE.MeshStandardMaterialParameters, phys?: false): THREE.MeshStandardMaterial;
  mat(o: THREE.MeshPhysicalMaterialParameters, phys?: boolean) {
    const m = phys ? new THREE.MeshPhysicalMaterial(o) : new THREE.MeshStandardMaterial(o);
    this.mats.push(m);
    return m;
  }

  mesh(geo: THREE.BufferGeometry, mat: THREE.Material, { cast = true, recv = true, parent = this.root as THREE.Object3D } = {}) {
    const m = new THREE.Mesh(geo, mat);
    m.castShadow = cast;
    m.receiveShadow = recv;
    parent.add(m);
    return m;
  }

  // role: 'main' follows the lamp level directly, 'glow' is tinted by the shade, 'fill' is a small local fill.
  addLight(light: SceneLight, base: number, role: LightRole = "main") {
    light.userData = { base, role };
    this.root.add(light);
    if (light instanceof THREE.SpotLight) this.root.add(light.target);
    this.lamps.push(light);
    return light;
  }

  /* ----- build ----- */

  build(model: ViewerModel, s: ViewerState, variant: Variant = "detail") {
    this.setup(model, s, variant);
    this.apply(s);
    this.ready = true;
  }

  // Product page entry. Shaders compile in parallel (KHR_parallel_shader_compile) instead of freezing the
  // page on the first frames, and the first frame is drawn before the caller reveals the canvas.
  async open(model: ViewerModel, s: ViewerState) {
    // kit table lamps open in the baked room in one step: the room is part of the first compile and frame
    if (model.family === "kit") await Promise.all([preloadRoom(s.mode), loadKitSpec(model.key)]);
    if (!this.alive) return;
    this.setup(model, s, "detail");
    // the reflecting materials get the probe's (not yet captured) map now, so this first round compiles their
    // final variants too, not a second round after the capture
    if (model.family !== "luminaire") {
      this.capEnv ||= this.pm.fromCubemap(this.cubeRT.texture);
      this.reflectors().forEach((m) => {
        m.envMap = this.capEnv!.texture;
      });
    }
    await this.compile(); // variants the probe capture renders with
    if (!this.alive) return;
    this.apply(s);
    await this.compile(); // anything the capture changed
    if (!this.alive) return;
    // the first view settles onto the product, in the room only
    if (this.room_ && this.ctl && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      this.intro = 0;
      this.fit();
    }
    // its shaders and buffer now, not as a hitch when the first drag ends
    this.still.add(this.r, this.composer.readBuffer.texture, 0);
    this.composer.render();
    this.dirty = false;
    this.ready = true;
    if (this.placeholder.length) this.withRoom(s.mode).catch((err) => console.warn("room", err));
  }

  // The baked restaurant replaces the placeholder room once it has loaded: only when it wasn't ready at open() (a
  // failed download is retried here), or in a harness whose build() doesn't wait for it.
  private async withRoom(mode: Mode) {
    const id = this.buildId;
    const R = await loadRoom(mode);
    if (!this.alive || id !== this.buildId || !this.placeholder.length) return;
    this.attachRoom(R);
    // its materials are new, the lamp copies reuse the hero lamp's programs; no frame until they're compiled
    this.ready = false;
    await this.compile();
    if (!this.alive || id !== this.buildId) return;
    this.ready = true;
    if (this.lastState) this.apply(this.lastState);
  }

  // Every background table gets a copy of the lamp, following the main lamp's switch, level and colour temperature.
  // The copies only glow: their light on the tables and the banquette comes from the room's lamp layers (applyRoom).
  attachRoom(R: RoomData) {
    for (const o of this.placeholder) {
      o.removeFromParent();
      o.geometry.dispose();
    }
    this.placeholder = [];
    this.scene.add(R.group);
    this.room_ = R;
    const model = this.model!;
    this.bgKits = R.meta.tables.map(([x, z], i) => {
      const g = new THREE.Group();
      g.position.set(x, 0, z);
      g.rotation.y = i * 2.4;
      this.root.add(g);
      this.roomParts.add(g);
      const { lamp } = kitLamp(this, model.key, g, true);
      // receiveShadow stays: switching it would be another shader variant to compile
      lamp.group.traverse((o) => {
        o.castShadow = false;
      });
      return { lamp, pos: new THREE.Vector3(x, lamp.lampPos.y, z) };
    });
    if (this.ctl) this.ctl.maxDistance = 2;
    this.setFocus(true);
    this.addFarGlasses(R.meta.glasses);
  }

  private setFocus(on: boolean) {
    if (!this.focus) return;
    this.focus.enabled = on;
    this.drawPass.enabled = !on;
  }

  // A wine glass at every place of the background tables: two draw calls, whatever their number
  private addFarGlasses(spots: [number, number][]) {
    const w = (this.ware ||= tableware());
    if (!this.glassMat || !this.wineMat) return;
    const at = new THREE.Matrix4();
    const add = (geo: THREE.BufferGeometry, mat: THREE.Material, order: number) => {
      const m = new THREE.InstancedMesh(geo, mat, spots.length);
      spots.forEach(([x, z], i) => m.setMatrixAt(i, at.makeTranslation(x, 0, z)));
      m.frustumCulled = false;
      m.renderOrder = order;
      this.root.add(m);
      this.roomParts.add(m);
    };
    add(w.farWine, this.wineMat, -1);
    add(w.farGlass, this.glassMat, 0);
  }

  private applyRoom(key: Mode, s: ViewerState, f: number, lc: THREE.Color) {
    const R = this.room_!;
    // a mode whose maps are still loading keeps the previous mode's until they arrive
    const lm = R.lm[key];
    if (lm) {
      const k = R.meta.lightmap[key] * Math.PI * (R.meta.gain?.[key] ?? 1);
      R.mats.forEach((m) => {
        m.lightMap = lm;
        m.lightMapIntensity = k;
      });
      R.fx.view.map = R.view[key] ?? null;
    } else
      R.perMode(key).then(() => {
        if (this.room_ === R && this.lastState?.mode === key) this.apply(this.lastState);
      });
    const fx = ROOM_FX[key];
    const warm = kLinear(2700); // wall sconces are not the product: fixed warm
    R.fx.view.color.setScalar(fx.view);
    R.fx.curtain.color.setRGB(...fx.curtainTint, THREE.LinearSRGBColorSpace).multiplyScalar(fx.curtain);
    R.fx.sconce_glass.color.copy(warm).multiplyScalar(fx.glass);
    this.bgKits.forEach(({ lamp, pos }) => {
      lamp.setFinish(s.finish);
      lamp.setLight(KIT_OUTPUT * f, pos, lc);
    });
    // the same lamps' light in the room: the baked 2700 K colour at 2700 K, shifted as the UI's colour shifts
    const power = (R.meta.gain?.[key] ?? 1) * fx.lamps * (f / LAMP);
    const tint = new THREE.Color().setRGB(lc.r / warm.r, (0.64 * lc.g) / warm.g, (0.34 * lc.b) / warm.b, THREE.LinearSRGBColorSpace);
    R.lampLight.down.copy(tint).multiplyScalar(R.meta.lightmap["lamp-down"] * ROOM_LAMP_MIX.down * power);
    // the baked up layer is the fabric shades' glow; metal hats send nothing upward
    R.lampLight.up.copy(tint).multiplyScalar(R.meta.lightmap["lamp-up"] * ROOM_LAMP_MIX.up * power * (this.kit?.glows === false ? 0 : 1));
  }

  // Programs depend on the target they draw into: the scene is only ever drawn into linear render targets
  // (composer, probe), never straight to the canvas, so compile for one. Compiled for the canvas (sRGB output),
  // every material would be compiled a second time, synchronously, on the first frame.
  private compile() {
    this.r.setRenderTarget(this.composer.readBuffer);
    const pending = this.r.compile(this.scene, this.cam);
    this.r.setRenderTarget(null);
    // renderer.compileAsync's own polling throws once a material it waits for is disposed (leaving the page or
    // rebuilding mid-compile), so it is done here: a disposed material has no program left to wait for.
    return new Promise<void>((resolve) => {
      const check = () => {
        pending.forEach((m) => {
          const { currentProgram: program } = this.r.properties.get(m) as { currentProgram?: { isReady(): boolean } };
          if (!program || program.isReady()) pending.delete(m);
        });
        if (!this.alive || !pending.size) resolve();
        else setTimeout(check, 10);
      };
      check();
    });
  }

  private setup(model: ViewerModel, s: ViewerState, variant: Variant) {
    this.buildId++;
    // rebuilding the same product (profile height) keeps the angle the visitor turned to
    this.keepCam = this.moved && this.model?.key === model.key;
    this.clear();
    this.model = model;
    this.shadowsStale = true;
    // kit lamps use the camera-like knee instead of the renderer's tone mapping (render targets aren't tone
    // mapped, so switching it only rebuilds the output pass, never the scene's materials)
    const kit = model.family === "kit";
    this.knee.enabled = kit;
    this.finish.enabled = kit;
    // kit lamps light plates from a hand away: more glow would melt their edges
    this.bloom.strength = kit ? 0.16 : 0.32;
    this.r.toneMapping = kit ? THREE.NoToneMapping : this.tone;
    if (model.family === "luminaire") buildLuminaireScene(this, model, s);
    else buildTableScene(this, model, variant);
  }

  /* ----- state ----- */

  apply(s: ViewerState) {
    const model = this.model!;
    const kit = model.family === "kit";
    const isT = model.family !== "luminaire";
    const mode = kit && s.mode === "aksam" ? KIT_AKSAM : kit && s.mode === "gece" ? KIT_GECE : MODES[s.mode];
    // same lumen output at every colour temperature: normalise luminance to the 3000 K colour
    const lc = kLinear(s.k);
    lc.multiplyScalar(REF_LUM / luminance(lc));
    const f = LAMP * (s.on ? (isT ? [0.32, 0.62, 1][s.lvl] * (s.power === "premium" ? 1 : 0.72) : 1) : 0);

    this.scene.background = new THREE.Color(mode.bg);
    if (this.scene.fog) this.scene.fog.color.set(mode.bg);
    this.scene.environmentIntensity = mode.env;
    this.r.toneMappingExposure = mode.exp;
    this.knee.uniforms.exposure.value = mode.exp;
    this.lastState = s;
    this.sun.intensity = mode.sun;
    this.sun.color.set(mode.sunColor);
    // window light: soft edged
    this.sun.shadow.radius = kit ? 4 : 1;
    // castShadow stays on at night (intensity 0): toggling it recompiles every material, a multi-second freeze

    if (this.bodyMat) {
      if (isT && this.bodyMat instanceof THREE.MeshPhysicalMaterial) {
        const fi = s.finish;
        this.bodyMat.color.set(fi.hex);
        this.bodyMat.metalness = fi.metal;
        this.bodyMat.roughness = fi.rough;
        this.bodyMat.clearcoat = fi.metal > 0.5 ? 0 : 0.25;
        this.bodyMat.clearcoatRoughness = 0.4;
        if (this.neckMat) {
          this.neckMat.color.set(fi.hex);
          this.neckMat.metalness = fi.metal;
          this.neckMat.roughness = Math.min(0.6, fi.rough + 0.25);
        }
      } else {
        this.bodyMat.color.set(s.ralHex ?? "#0a0a0a");
      }
    }

    const shade = s.shade;
    const tint = shade ? new THREE.Color(shade.hex) : new THREE.Color(1, 1, 1);
    const glowC = lc.clone().multiply(tint).multiplyScalar(shade ? shade.glow : 1.1);
    this.shadeMats.forEach((m) => {
      m.color.copy(tint);
      m.emissive.copy(glowC);
      m.emissiveIntensity = 1.7 * f;
    });
    this.shadeProbe.color.copy(glowC).multiplyScalar(1.1 * f).add(tint.clone().multiplyScalar(mode.env * 0.5));
    // background-table lamps follow the main lamp: same switch, level and colour temperature
    this.bgShades.forEach((m) => {
      m.color.copy(tint);
      m.emissive.copy(glowC);
      m.emissiveIntensity = 1.7 * f;
    });
    this.emitters.forEach((e) => {
      e.m.emissive.copy(lc);
      e.m.emissiveIntensity = e.gain * f;
    });
    if (this.kit) {
      this.kit.setFinish(s.finish);
      this.kit.setExposure(mode.exp);
      this.kit.setLight(KIT_OUTPUT * f, this.kit.lampPos, lc);
    }
    this.lamps.forEach((l) => {
      const { base, role } = l.userData as { base: number; role: LightRole };
      l.color.copy(role === "glow" || role === "bg" ? glowC : lc);
      l.intensity = base * f;
    });
    // crude bounce: light reflected off the lit table/floor reaches the walls and ceiling
    const warmGrey = new THREE.Color("#8a7a6a");
    this.bounce.color.copy(lc).multiply(warmGrey);
    this.bounce.groundColor.copy(lc).multiply(warmGrey);
    // kit lamps sit low: most of their light lands on the table right around them and bounces back up onto the
    // lower body, which no direct ray reaches
    this.bounce.intensity = (isT ? (kit ? 0.25 : 0.06) : 0.3) * f;
    if ((!isT || kit) && mode.env > 0.3) {
      // daylight in a room: neutral sky from the windows, warm bounce from the floor. Kit rooms have no windows
      // modelled, so it is their only daylight besides the sun (without it the body was black off its sunlit side).
      this.bounce.color.set("#e9eef5");
      this.bounce.groundColor.set("#cdbfae");
      this.bounce.intensity = mode.env * (isT ? 3.6 : 2.2);
    }

    if (this.room_) this.applyRoom(s.mode, s, f, lc);
    this.capture(mode);
    this.dirty = true;
  }

  // table scenes: what reflects the probe capture
  private reflectors(): Reflector[] {
    const body = this.bodyMat instanceof THREE.MeshStandardMaterial ? this.bodyMat : null;
    return [body, this.neckMat, this.steelMat, this.glassMat, ...(this.kit?.reflect || [])].filter((m): m is Reflector => !!m);
  }

  // A product photographer's strip lights: tall bright panels around the lamp that exist only in the probe capture.
  // Metal shows what surrounds it, and in a dark panelled room that is nothing; these give it the long bands that make
  // it read as metal, as in the studio photos. They light nothing and never appear in the frame.
  private reflectionCards(mode: ModeLook) {
    if (!this.cards) {
      this.cards = new THREE.Group();
      // Upright walls seen from above reflect downward, flat tops upward. Ending just over the horizon, the panels stay
      // out of the flat tops (a flat face shows one direction, so a panel there turns it all white); drawn over the
      // table, which would otherwise hide them from the probe.
      const m = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, toneMapped: false, depthTest: false, depthWrite: false });
      for (const [deg, w] of REFLECTION_CARDS) {
        const a = (deg * Math.PI) / 180;
        const card = new THREE.Mesh(new THREE.PlaneGeometry(w, 1.02), m);
        card.position.set(Math.sin(a), -0.39, Math.cos(a));
        card.rotation.y = a;
        card.renderOrder = 10;
        this.cards.add(card);
      }
    }
    const level = mode.env > 0.3 ? 2.4 : mode === KIT_AKSAM ? 0.8 : 0.4;
    ((this.cards.children[0] as THREE.Mesh).material as THREE.MeshBasicMaterial).color.setRGB(level, level * 0.93, level * 0.84, THREE.LinearSRGBColorSpace);
    return this.cards;
  }

  private capture(mode: ModeLook) {
    // A single probe is only valid near where it was taken: table lamps use it for the body's reflections
    // only; rooms use it (emitters hidden, their light is already direct) as one-bounce ambient light.
    const sc = this.scene;
    const hide = this.probeHide;
    const table = this.model!.family !== "luminaire";
    sc.environment = this.roomEnv;
    sc.environmentIntensity = mode.env;
    // their previous reflections stay out of the capture; a zero intensity rather than no map, which would be a
    // different shader variant to compile (synchronously, inside the capture)
    if (table)
      this.reflectors().forEach((m) => {
        m.envMapIntensity = 0;
      });
    // Shadows are rendered with everything visible, then reused for the capture. They depend only on geometry and
    // light positions, so a finish, level or colour change reuses them (dozens of shadow renders saved per click).
    if (this.shadowsStale) {
      this.shadowsStale = false;
      this.r.shadowMap.needsUpdate = true;
      this.r.setRenderTarget(this.composer.readBuffer);
      this.r.render(sc, this.cam);
      this.r.setRenderTarget(null);
    }
    // the shade's inside is lit from millimetres away; for reflections only its outer glow matters
    const swaps: [THREE.Mesh, THREE.Material][] = [];
    const glass: THREE.Object3D[] = [];
    this.root.traverse((o) => {
      if (!(o instanceof THREE.Mesh)) return;
      const m = o.material as THREE.MeshPhysicalMaterial;
      if (this.shadeMats.includes(m)) {
        swaps.push([o, m]);
        o.material = this.shadeProbe;
      } else if (m.transmission > 0 || m.transparent) glass.push(o);
    });
    hide.push(...glass);
    hide.forEach((o) => {
      o.visible = false;
    });
    this.cubeCam.position.copy(this.probe);
    const cards = this.kit?.glows === false ? this.reflectionCards(mode) : null;
    if (cards) sc.add(cards);
    this.cubeCam.update(this.r, sc);
    if (cards) sc.remove(cards);
    hide.forEach((o) => {
      o.visible = true;
    });
    hide.length -= glass.length;
    swaps.forEach(([o, m]) => {
      o.material = m;
    });
    this.capEnv = this.pm.fromCubemap(this.cubeRT.texture, this.capEnv ?? undefined);
    if (table)
      this.reflectors().forEach((m) => {
        m.envMap = this.capEnv!.texture;
        m.envMapIntensity = (m.userData.envI as number | undefined) ?? 0.45;
      });
    else {
      sc.environment = this.capEnv.texture;
      sc.environmentIntensity = 1;
    }
  }

  render() {
    this.r.shadowMap.needsUpdate = true;
    this.composer.render();
  }
}
