// Light colour and swatch helpers ported from the demo (js/data.js, js/app.js).

export const KINFO: Record<number, [name: string, use: string]> = {
  2700: ["Sıcak beyaz", "Restoran masası, otel odası, akşam yemeği"],
  3000: ["Yumuşak beyaz", "Kafe, lobi, salon ve bekleme alanları"],
  4000: ["Doğal beyaz", "Ofis, mağaza, çalışma ve toplantı alanı"],
  6500: ["Gün ışığı", "Atölye, depo ve teknik alanlar"],
};

export const nearestKelvin = (k: number) => (k < 2850 ? 2700 : k < 3500 ? 3000 : k < 5200 ? 4000 : 6500);

function k2rgb(k: number): number[] {
  const t = k / 100;
  let r: number, g: number, b: number;
  if (t <= 66) {
    r = 255;
    g = 99.4708025861 * Math.log(t) - 161.1195681661;
    b = t <= 19 ? 0 : 138.5177312231 * Math.log(t - 10) - 305.0447927307;
  } else {
    r = 329.698727446 * Math.pow(t - 60, -0.1332047592);
    g = 288.1221695283 * Math.pow(t - 60, -0.0755148492);
    b = 255;
  }
  return [r, g, b].map((v) => Math.round(Math.max(0, Math.min(255, v))));
}

// Light colour as a camera white-balanced to about 4800 K shows it (and as the eye adapts to it):
// 2700 K stays clearly warm, 4000 K reads close to neutral, 6500 K reads cool.
const WB = k2rgb(4800);
export function kColor(k: number): number[] {
  const c = k2rgb(k).map((v, i) => v / WB[i]);
  const m = Math.max(...c);
  return c.map((v) => Math.round((255 * v) / m));
}
export const rgbStr = (k: number) => kColor(k).join(",");

const hexRgb = (h: string) => [0, 2, 4].map((i) => parseInt(h.replace("#", "").slice(i, i + 2), 16));
const rgbHex = (a: number[]) => "#" + a.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
const mix = (a: string, b: string, t: number) => {
  const A = hexRgb(a);
  const B = hexRgb(b);
  return rgbHex(A.map((v, i) => v + (B[i] - v) * t));
};

export const swatchBg = (hex: string, metal: boolean) =>
  metal
    ? `radial-gradient(circle at 32% 28%, ${mix(hex, "#ffffff", 0.55)}, ${hex} 45%, ${mix(hex, "#000000", 0.45)} 100%)`
    : `radial-gradient(circle at 35% 30%, ${mix(hex, "#ffffff", 0.12)}, ${hex} 60%, ${mix(hex, "#000000", 0.2)})`;
