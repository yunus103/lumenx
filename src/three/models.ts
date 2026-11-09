// Which 3D model a product's `modelKey` opens. Pure data, safe to import anywhere.
//  kit:       turned lamps built from a measured spec (kit/specs/), shown in the baked restaurant
//  lamp:      first-generation procedural table lamps (scene/lamps.ts)
//  luminaire: LED armatures over a dining table (scene/luminaire.ts)

export type ModelFamily = "kit" | "lamp" | "luminaire";

export const MODELS: Record<string, ModelFamily> = {
  defne: "kit",
  agena: "kit",
  mimosa: "kit",
  olena: "kit",
  sirius: "kit",
  vita: "kit",
  nigora: "kit",
  baro: "kit",
  diya: "kit",
  fuga: "kit",
  gemini: "kit",
  meissa: "kit",
  capella: "kit",
  mensa: "kit",
  mila: "kit",
  pandora: "kit",
  rena: "kit",
  sani: "kit",
  tole: "kit",
  aldebaran: "kit",
  aro: "kit",
  casares: "kit",
  esna: "kit",
  evora: "kit",
  ezop: "kit",
  geminga: "kit",
  heli: "kit",
  hint: "kit",
  karo: "kit",
  konra: "kit",
  melma: "kit",
  merle: "kit",
  mira: "kit",
  mirach: "kit",
  mona: "kit",
  mula: "kit",
  neptun: "kit",
  avior: "lamp",
  alderamin: "lamp",
  kare: "luminaire",
  altigen: "luminaire",
};

export const hasModel = (key?: string): key is string => !!key && key in MODELS;

export type Mode = "gunduz" | "aksam" | "gece";
export const MODE_LABELS: Record<Mode, string> = { gunduz: "Gündüz", aksam: "Akşam", gece: "Gece" };
