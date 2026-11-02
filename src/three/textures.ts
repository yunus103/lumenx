import * as THREE from "three";
import { ASSETS, coarse } from "./env";
import { loadKitTextures } from "./kit/materials";

// Shared between viewers; loaded once.
export const texCache: {
  wood?: { albedo: THREE.Texture; bump: THREE.Texture };
  plaster?: THREE.Texture;
  pleat?: THREE.Texture;
} = {};

function hash(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function canvasTex(w: number, h: number, fn: (x: number, y: number) => number[], srgb?: boolean) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d")!;
  const img = g.createImageData(w, h);
  const d = img.data;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const [r, gg, b] = fn(x, y);
      const i = (y * w + x) * 4;
      d[i] = r;
      d[i + 1] = gg;
      d[i + 2] = b;
      d[i + 3] = 255;
    }
  g.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 8;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// Walnut planks (albedo + a height map reused for bump and roughness) and wall plaster are baked offline
// (frekans-demo tools/bake-textures.py): computing them here blocked the page for ~1.5 s when a product opened.
// Must resolve before the first build().
let texLoad: Promise<void> | null = null;
export function loadTextures() {
  const W = coarse ? 512 : 1024;
  const loader = new THREE.TextureLoader();
  const get = (name: string, srgb?: boolean) =>
    loader.loadAsync(`${ASSETS}/tex/${name}`).then((t) => {
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.anisotropy = 8;
      if (srgb) t.colorSpace = THREE.SRGBColorSpace;
      return t;
    });
  return (texLoad ||= Promise.all([get(`wood-${W}.webp`, true), get(`wood-bump-${W}.webp`), get("plaster.webp"), loadKitTextures()])
    .then(([albedo, bump, plaster]) => {
      texCache.wood = { albedo, bump };
      texCache.plaster = plaster;
    })
    .catch((err) => {
      texLoad = null;
      throw err;
    }));
}

// Pleat texture for the backlit shade: alternate facets transmit differently, fabric fibres add grain.
export function pleatTex() {
  return (texCache.pleat ||= canvasTex(128, 256, (x, y) => {
    const facet = x < 64 ? 1 : 0.62;
    const edge = 1 - 0.35 * Math.pow(Math.abs((x % 64) - 32) / 32, 6);
    const vert = 0.7 + 0.3 * Math.sin(Math.min(1, (1 - y / 255) * 1.1) * Math.PI * 0.92);
    const fibre = 0.9 + 0.1 * hash(x * 0.3, y);
    const v = 255 * facet * edge * vert * fibre;
    return [v, v, v];
  }));
}
