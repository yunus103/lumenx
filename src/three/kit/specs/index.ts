// 3D specs for kit-built lamps (centimetres), one file per lamp in this folder, loaded when its product opens.
// Proportions are measured on the product photos' silhouettes, absolute size comes from the datasheet's height; see
// build.ts for how each part is turned.
// Modelling a new turned lamp = add its file here, register it in ../../models.ts, fill the product's modelKey.
import type { Grain, ShadeSpec } from "../materials";

// r, y; a third value marks a hard edge, where the smooth curve stops and a new one starts
export type ProfilePoint = [r: number, y: number, corner?: 1];

export interface Detail {
  type: "button" | "usbc" | "hole";
  y: number;
  x: number;
  side: "front" | "back";
  r: number;
}

// A metal hat over a downward LED disc, instead of a fabric shade.
export interface HatSpec {
  profile: ProfilePoint[];
  led: {
    y: number;
    rIn: number;
    rOut: number;
    // Opt-in, where the photos show it: the body takes the disc's light as an area source, so a stem right under it
    // glows and fades down. `metal` is the share a metal finish scatters diffusely (0 polished, more for a sandy
    // metallic powder coat); paint scatters it by its own colour.
    wash?: { metal: number };
  };
}

export interface KitSpec {
  body: {
    // turned wood draws its own grain; without one the body takes the selected finish as metal or paint
    grain?: Grain;
    profile: ProfilePoint[];
    foot: { r: number; h: number };
    // Opt-in: a diamond-knurled grip, drawn as a normal map on the profile's runs between two of its corners (`from`,
    // `to`: heights in cm, each a corner point). `pitch` is the distance between neighbouring grooves of one helix,
    // across them (cm); `angle` the helices' angle to the axis (degrees, ±). `cross`: how deep the second helix's
    // grooves are, relative to the first's (default 1, a full diamond). Same finish as the body.
    knurl?: { from: number; to: number; pitch: number; angle: number; cross?: number };
  };
  shade?: ShadeSpec;
  hat?: HatSpec;
  topButton?: { r: number; h: number };
  details?: Detail[];
  light: { kelvin: number; lumen: number; y: number; dimmer: number[]; body: number; bounce: number };
}

const loaded: Record<string, KitSpec> = {};

export const kitSpec = (key: string) => loaded[key];

export async function loadKitSpec(key: string) {
  loaded[key] ||= (await import(`./${key}`)).default as KitSpec;
}
