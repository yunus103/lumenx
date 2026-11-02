// 3D material parameters for body finishes and shades, keyed by their Sanity slug. Pure data (no three.js), so the
// configurator can resolve them during SSR. Colours, metalness and roughness are the demo's (js/data.js, kit.js).

export interface WoodFinish {
  early: string;
  late: string;
  rough: number;
  clearcoat: number;
}

export interface Finish3D {
  hex: string;
  metal: number;
  rough: number;
  // turned wood bodies (kit lamps) draw their own grain from these
  wood?: WoodFinish;
}

export interface Shade3D {
  hex: string;
  // how strongly the fabric's own colour tints the light it lets through (a red shade glows red)
  glow: number;
}

const FINISHES: Record<string, Finish3D> = {
  gold: { hex: "#D8BE7E", metal: 1, rough: 0.12 },
  bronz: { hex: "#9A5A35", metal: 1, rough: 0.14 },
  rose: { hex: "#DCA690", metal: 1, rough: 0.13 },
  krom: { hex: "#E2E4E8", metal: 1, rough: 0.05 },
  "satine-nikel": { hex: "#B9B5AC", metal: 1, rough: 0.34 },
  eskitme: { hex: "#6B4E31", metal: 0.95, rough: 0.46 },
  siyah: { hex: "#141415", metal: 0, rough: 0.46 },
  beyaz: { hex: "#EDECE6", metal: 0, rough: 0.5 },
  // oiled, satin: a thin clearcoat, never 0 (that would switch the program on a finish change)
  kayin: { hex: "#C98A45", metal: 0, rough: 0.42, wood: { early: "#c97f3b", late: "#94501f", rough: 0.55, clearcoat: 0.12 } },
  ceviz: { hex: "#6A3820", metal: 0, rough: 0.4, wood: { early: "#6b4128", late: "#33190c", rough: 0.52, clearcoat: 0.15 } },
};

const SHADES: Record<string, Shade3D> = {
  krem: { hex: "#D8D3B3", glow: 1.1 },
  kirmizi: { hex: "#B0111F", glow: 1.6 },
  keten: { hex: "#E6DCC6", glow: 1.1 },
};

const shadeHex = (hex: string, t: number) =>
  "#" +
  [1, 3, 5]
    .map((i) => Math.round(parseInt(hex.slice(i, i + 2), 16) * t))
    .map((v) => Math.min(255, v).toString(16).padStart(2, "0"))
    .join("");

export const woodFromHex = (hex: string): WoodFinish => ({ early: hex, late: shadeHex(hex, 0.55), rough: 0.55, clearcoat: 0.12 });

// Finishes added in the Studio later still render: their swatch colour with a material picked by their type.
export function finish3D(f: { slug?: { current: string }; hex?: string; finishType?: string }): Finish3D {
  const known = f.slug && FINISHES[f.slug.current];
  if (known) return known;
  const hex = f.hex ?? "#888888";
  const type = (f.finishType ?? "").toLocaleLowerCase("tr-TR");
  if (type.includes("ahşap")) return { hex, metal: 0, rough: 0.42, wood: woodFromHex(hex) };
  if (type.includes("kaplama")) return { hex, metal: 1, rough: 0.2 };
  return { hex, metal: 0, rough: 0.46 };
}

export function shade3D(s: { slug?: { current: string }; hex?: string }): Shade3D {
  return (s.slug && SHADES[s.slug.current]) || { hex: s.hex ?? "#D8D3B3", glow: 1.1 };
}
