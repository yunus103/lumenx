import type { KitSpec } from ".";

// Height 220 mm from the gallery's dimension photo (no datasheet), proportions from the studio photos: a Ø68.4 body
// (labelled 6.5 cm), a Ø103 bell (labelled 10 cm) 6.9 cm high (labelled 7), a Ø37 finial (labelled 3). The bell is
// white on white in the shop photos: its outline is traced from the faint grey rim the photos draw round it. It is
// frosted opal glass, satin by day and glowing at night (night photo), so it is the top-level `opal` with `rough`
// rather than the glossy `shade.opal`; that also means no `topButton`, so the brass finial is the top of the body's
// profile, its stem running up through the bell. Plate, collar, stem and finial stay brass on both woods (fixed gold).
const beliz: KitSpec = {
  body: {
    // oak: a vertical pith far behind the lamp gives straight streaks on the drum and the photo's arches of rings
    // across the front of the rounded shoulder
    grain: { pith: [0.3, 12, -10], dir: [0.02, 1, 0], ring: 0.12, contrast: 0.5, pores: 1 },
    profile: [
      [0, 0.15], [3.2, 0.15, 1], [3.31, 0.18], [3.375, 0.25], [3.405, 0.35], [3.42, 0.5],
      [3.42, 0.9], [3.42, 1.4], [3.42, 1.9], [3.42, 2.4], [3.42, 2.9], [3.42, 3.4], [3.42, 3.9], [3.42, 4.4],
      [3.42, 4.9], [3.42, 5.4], [3.42, 5.9], [3.42, 6.4], [3.42, 6.9], [3.42, 7.3],
      // the shoulder, a quarter ellipse cut off flat under the plate
      [3.407, 7.606], [3.369, 7.91], [3.305, 8.209], [3.217, 8.502], [3.104, 8.787], [2.967, 9.061], [2.807, 9.322],
      [2.625, 9.569], [2.423, 9.798], [2.201, 10.009], [1.961, 10.2, 1],
      // the thin brass plate, a round collar on it, the stem up through the bell
      [2.08, 10.2, 1], [2.1, 10.22], [2.1, 10.34], [2.08, 10.36, 1],
      [0.72, 10.36, 1], [0.745, 10.4], [0.77, 10.48], [0.78, 10.58], [0.77, 10.68], [0.73, 10.76], [0.62, 10.8, 1],
      [0.47, 10.8, 1], [0.47, 21.03, 1],
      // the finial: a flattened dome (superellipse, exponent 1.85) on the bell's top
      [1.82, 21.03, 1], [1.81, 21.13], [1.774, 21.23], [1.71, 21.33], [1.618, 21.43], [1.495, 21.53], [1.336, 21.63],
      [1.128, 21.73], [0.848, 21.83], [0.6, 21.89], [0.32, 21.94], [0, 21.97],
    ],
    // the thin black rubber foot under the wood's rounded edge
    foot: { r: 3.25, h: 0.15 },
    fixed: [{ from: 10.2, to: 21.97, finish: "gold", brush: 0.4 }],
  },
  // the frosted opal bell: a rounded lip, the flare, a long gently tapering waist and a round shoulder under the finial
  opal: {
    profile: [
      [4.72, 14.32], [4.76, 14.2], [4.86, 14.15], [4.98, 14.17], [5.07, 14.25], [5.12, 14.37], [5.135, 14.5],
      [5.12, 14.63], [5.09, 14.74], [4.959, 15.0], [4.78, 15.25], [4.609, 15.52], [4.462, 15.79], [4.338, 16.08],
      [4.235, 16.37], [4.141, 16.67], [4.062, 16.97], [3.988, 17.27], [3.922, 17.58], [3.859, 17.88], [3.8, 18.19],
      [3.729, 18.49], [3.652, 18.79], [3.567, 19.09], [3.457, 19.39], [3.334, 19.67], [3.194, 19.95], [3.013, 20.21],
      [2.803, 20.44], [2.562, 20.63], [2.3, 20.8], [2.038, 20.94], [1.75, 21.0], [1.2, 21.02], [0.6, 21.025], [0, 21.025],
    ],
    transmission: 0.012,
    rough: 0.45,
    // frosted glass, not stone: a faint fine mottling in the glow (night photo), invisible by day as in the shop photos
    alabaster: { scale: 0.25, strength: 0.15 },
  },
  details: [
    { type: "button", y: 4.31, x: 0.61, side: "front", r: 0.32 },
    { type: "usbc", y: 2.18, x: 0.73, side: "front", r: 0.68 },
    { type: "hole", y: 2.47, x: -1.19, side: "front", r: 0.09 },
  ],
  // the photos' stain (satin mid-brown oak), not the ceviz calibrated on Defne
  woodTone: { ceviz: { early: "#9e5b2e", late: "#633013", rough: 0.5, clearcoat: 0.25, coatRough: 0.25, contrast: 1.4 } },
  light: { kelvin: 2700, lumen: 350, y: 17.5, dimmer: [0.4, 0.7, 1], body: 0.012, bounce: 200 },
};

export default beliz;
