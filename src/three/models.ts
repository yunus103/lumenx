// Which 3D model a product's `modelKey` opens. Pure data, safe to import anywhere.
//  kit:       turned lamps built from a measured spec (kit/specs.ts), shown in the baked restaurant
//  lamp:      first-generation procedural table lamps (scene/lamps.ts)
//  luminaire: LED armatures over a dining table (scene/luminaire.ts)

export type ModelFamily = "kit" | "lamp" | "luminaire";

export const MODELS: Record<string, ModelFamily> = {
  defne: "kit",
  avior: "lamp",
  alderamin: "lamp",
  capella: "lamp",
  kare: "luminaire",
  altigen: "luminaire",
};

export const hasModel = (key?: string): key is string => !!key && key in MODELS;

export type Mode = "gunduz" | "aksam" | "gece";
export const MODE_LABELS: Record<Mode, string> = { gunduz: "Gündüz", aksam: "Akşam", gece: "Gece" };
