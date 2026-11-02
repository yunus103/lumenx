import * as THREE from "three";
import { kColor } from "@/lib/light";

export const luminance = (c: THREE.Color) => 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b;

// The UI's white-balanced light colour, as a linear three.js colour.
export const kLinear = (k: number) => {
  const [r, g, b] = kColor(k).map((v) => v / 255);
  return new THREE.Color().setRGB(r, g, b, THREE.SRGBColorSpace);
};

// Tanner Helland's blackbody fit, good enough for 1800–6500 K (the kit's own light colour).
export function kelvin(k: number) {
  const t = k / 100;
  const r = t <= 66 ? 255 : 329.7 * Math.pow(t - 60, -0.1332);
  const g = t <= 66 ? 99.47 * Math.log(t) - 161.1 : 288.1 * Math.pow(t - 60, -0.0755);
  const b = t >= 66 ? 255 : t <= 19 ? 0 : 138.5 * Math.log(t - 10) - 305;
  const c = (x: number) => Math.min(255, Math.max(0, x)) / 255;
  return new THREE.Color().setRGB(c(r), c(g), c(b), THREE.SRGBColorSpace);
}

// What a camera white-balanced for warm interiors shows: the colour relative to 4500 K. Raw blackbody colours
// read far more orange on screen than lamps look to the eye or in the product photos.
export function lampColor(k: number) {
  const c = kelvin(k);
  const w = kelvin(4500);
  return new THREE.Color(c.r / w.r, c.g / w.g, c.b / w.b);
}
