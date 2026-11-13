// 3D specs for kit-built lamps (centimetres), one file per lamp in this folder, loaded when its product opens.
// Proportions are measured on the product photos' silhouettes, absolute size comes from the datasheet's height; see
// build.ts for how each part is turned.
// Modelling a new turned lamp = add its file here, register it in ../../models.ts, fill the product's modelKey.
import type { Grain, ShadeSpec } from "../materials";

// r, y; a third value marks a hard edge, where the smooth curve stops and a new one starts
export type ProfilePoint = [r: number, y: number, corner?: 1];

// Opt-in: N flat sides instead of round, over the profile's runs between `from` and `to` (heights in cm; the whole
// part when left out). Each side is flat across and follows the profile up, rolls included, with a sharp edge between
// sides. The profile's r is the half-width across the corners or across the flats. A flat step next to the range (a
// top face, the bottom) morphs from the polygon to a circle across its width, so round parts meet it without a gap:
// end the range on such a step, or on the axis. `angle` turns the polygon (degrees; 0 puts a flat facing the front).
// The foot and the LED disc stay round: keep them inside the flats. Details on the faceted part sit on the circle.
export interface Facets {
  n: number;
  across: "corners" | "flats";
  from?: number;
  to?: number;
  angle?: number;
}

// Opt-in: a smooth white opal band (milky acrylic) under the hat, from `y` up `h` at radius `r`, closed underneath
// up to the LED disc. Glossy white by day; at night it glows from the LED like a shade (`transmission` as there).
export interface OpalBand {
  y: number;
  h: number;
  r: number;
  transmission: number;
}

// Opt-in: an opal part turned from its own profile (r, y in cm, corners as anywhere) instead of the band: a stepped
// bowl hanging under the hat (Nade). It glows from the light (`light.y`) like a shade, outside and, through any
// opening, inside; it casts no shadow, so the light still reaches the table through it. The same at the spec's top
// level (`opal`) is a lamp's only light-giving part, with no hat or shade: a candle in a glass tube (Furud).
export interface OpalShell {
  profile: ProfilePoint[];
  transmission: number;
}

// Opt-in: the profile's runs between two of its corners (`from`, `to`: heights in cm, like `knurl`) keep one finish
// whatever the buyer picks (`finish`: a slug from finishes.ts, lit as metal or paint by its own metalness), e.g. a
// chrome ball finial on a painted or brass lamp. `rough` overrides the finish's roughness on that zone (a glossy
// white dome: `beyaz` is satin, 0.5). Far copies draw it in the body's finish.
export interface FixedFinish {
  from: number;
  to: number;
  finish: string;
  rough?: number;
}

// Opt-in: clear glass turned from its own profile: the outer surface (r, y in cm, corners as anywhere, bottom-up),
// the wall `thickness` cm thick inward from it. An open end (r above 0) is a rounded rim; an end on the axis closes
// it. Thin glass, no refraction: what is inside or behind it shows through, its faces reflect the room and darken
// towards the silhouette, and at night it catches the lamp's light along its walls and rims. Casts no shadow.
export interface GlassPart {
  profile: ProfilePoint[];
  thickness: number;
}

// Opt-in, per spec: the body and hat drawn as antique brass whenever the buyer picks `finish` (a slug from finishes.ts,
// e.g. "eskitme", calibrated as paint for the lamps whose photos show paint). Then `hex` is the brass under the
// patina, `rough` its roughness, `metal` its metalness for the reflections, and `patina` (0-1) how much of it the dark
// streaks cover; the parts' `brush` lines apply too. At night it stays lit as the finish is (as paint when the
// finish's metalness is 0.5 or below), so the LED doesn't make it shine gold.
export interface Antique {
  finish: string;
  hex: string;
  rough: number;
  metal: number;
  patina: number;
}

// Opt-in, per spec: the body and hat (and a body-finish top button) drawn as a marble print, thin wandering strands
// crossing every way (hydro-dipped: Konra, Oxford), whenever the buyer picks `finish` (a slug from finishes.ts; the
// print's ground is that finish, so other finishes stay plain). `vein` is the strands' colour, `scale` the pattern's
// size in cm (6: neighbouring strands a few mm apart, bending every few cm), `width` the strands' width (mm; from about
// half to twice that), `rough` the print's roughness (the finish's when left out). Solid in object space, so it wraps
// round the turning without a seam or stretching; strands finer than a pixel fade to their mean tone.
export interface Marble {
  finish: string;
  vein: string;
  scale: number;
  width: number;
  rough?: number;
}

export interface Detail {
  type: "button" | "usbc" | "hole";
  y: number;
  x: number;
  side: "front" | "back";
  r: number;
  // Opt-in, buttons: the button's finish (a slug from finishes.ts; brass when left out), and a flat centre inset in
  // another finish, `r` in cm (a chrome ring round a white key: `ring: "krom", centre: { finish: "beyaz", r: 0.6 }`)
  ring?: string;
  centre?: { finish: string; r: number };
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
  facets?: Facets;
  opal?: OpalBand | OpalShell;
  fixed?: FixedFinish[];
  // Opt-in: the hat's painted inside, lit by an LED hidden in a housing under it (Bella): a FixedFinish zone (its
  // runs between `from` and `to`) that takes the LED's light at night as lit paint, never brighter than about white,
  // and replaces the LED disc, which is then not drawn. Far copies keep the disc.
  inside?: FixedFinish;
  brush?: number;
}

export interface KitSpec {
  body: {
    // turned wood draws its own grain; without one the body takes the selected finish as metal or paint
    grain?: Grain;
    profile: ProfilePoint[];
    // Opt-in `rBottom`: the wall's radius at the floor (a taper; r * 0.97 when left out); `round`: the bottom edge
    // rounded over with this radius (cm), tangent to the floor and the wall
    foot: { r: number; h: number; rBottom?: number; round?: number };
    // Opt-in: a diamond-knurled grip, drawn as a normal map on the profile's runs between two of its corners (`from`,
    // `to`: heights in cm, each a corner point). `pitch` is the distance between neighbouring grooves of one helix,
    // across them (cm); `angle` the helices' angle to the axis (degrees, ±). `cross`: how deep the second helix's
    // grooves are, relative to the first's (default 1, a full diamond). Same finish as the body.
    knurl?: { from: number; to: number; pitch: number; angle: number; cross?: number };
    facets?: Facets;
    fixed?: FixedFinish[];
    // Opt-in: fine brushing lines round the axis (0-1, how strongly they break up the reflections; 0.5 is Torino's
    // satin brushed brass), on brushed metal finishes only (metalness above 0.5 and roughness 0.2 or more: not krom,
    // not paint) and with `antique`. A side view shows fine horizontal streaks, a flat top concentric ones. Not on
    // `fixed` zones or the knurl. The same on the hat (`hat.brush`).
    brush?: number;
  };
  shade?: ShadeSpec;
  hat?: HatSpec;
  antique?: Antique;
  marble?: Marble;
  // `shape` (opt-in): the button's outline in units of r and h, [0, 0] to [0, 1] (the default dome when left out:
  // [[0, 0], [1, 0], [1, 0.2], [0.9, 0.6], [0.55, 0.92], [0, 1]]). `finish` (opt-in): "body" for the selected finish,
  // or a slug from finishes.ts; brass when left out.
  topButton?: { r: number; h: number; shape?: ProfilePoint[]; finish?: string };
  // Opt-in, see OpalShell and GlassPart. A lamp without a shade or a hat needs `opal`.
  opal?: OpalShell;
  glass?: GlassPart;
  details?: Detail[];
  light: { kelvin: number; lumen: number; y: number; dimmer: number[]; body: number; bounce: number };
}

const loaded: Record<string, KitSpec> = {};

export const kitSpec = (key: string) => loaded[key];

export async function loadKitSpec(key: string) {
  loaded[key] ||= (await import(`./${key}`)).default as KitSpec;
}
