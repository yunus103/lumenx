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
  gold: { hex: "#DFD898", metal: 1, rough: 0.24 },
  // gold, bronz and eskitme: calibrated against the product photos in the day render (2026-11-08). eskitme stays at
  // metal 0.5 or below so the kit lights it as paint: the photos show a satin painted finish, not shiny metal at night.
  bronz: { hex: "#966B55", metal: 1, rough: 0.26 },
  // rose and gri: against the product photos in the day render (2026-11-13). rose: the warm room shifts the swatch
  // redder and more saturated (copper); this paler, pinker hex renders at the photos' mid hue ~17 and saturation ~0.41.
  // gri: the warm dark grey satin powder coat of the Toledo photo (labelled toledo-siyah), a little metal for its
  // fleck; at most 0.5, so the kit lights it as paint at night.
  rose: { hex: "#EDC2C0", metal: 1, rough: 0.26 },
  krom: { hex: "#E2E4E8", metal: 1, rough: 0.13 },
  gri: { hex: "#726E66", metal: 0.25, rough: 0.36 },
  "satine-nikel": { hex: "#B9B5AC", metal: 1, rough: 0.34 },
  eskitme: { hex: "#8C8973", metal: 0.45, rough: 0.62 },
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
