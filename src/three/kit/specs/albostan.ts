import type { KitSpec } from ".";

// No datasheet; the only photos are the small price-list cutout (the Sanity photo, 115 px wide) and the same render,
// cropped at the base, in the 2027 catalogue. Height 280 mm and head Ø70 from the catalogue, which the photo's
// proportions match (Ø71 hat at 280 mm); they give a Ø92 base, not the catalogue's Ø100. The hat's underside isn't in
// either photo, so its LED plate recessed inside the rim follows Mimosa. Charge port and touch key are underneath.
const albostan: KitSpec = {
  body: {
    profile: [
      [0, 0.39], [4.58, 0.39, 1], [4.61, 0.41], [4.62, 0.45, 1],
      [4.62, 2.58, 1], [4.61, 2.63], [4.58, 2.67], [4.55, 2.69, 1],
      // a shallow cone into the bell, an exponential flare (fitted to the photo) up to the stem
      [4.27, 2.77], [3.98, 2.85], [3.7, 2.93], [3.41, 3.01], [3.14, 3.12], [2.88, 3.26], [2.63, 3.41], [2.38, 3.58],
      [2.11, 3.76], [1.89, 3.95], [1.71, 4.16], [1.51, 4.38], [1.34, 4.62], [1.18, 4.86], [1.04, 5.12], [0.92, 5.39],
      [0.81, 5.67], [0.73, 5.95], [0.65, 6.24, 1],
      [0.56, 6.24, 1], [0.56, 6.38, 1],
      [0.63, 6.41], [0.68, 6.47], [0.7, 6.55], [0.66, 6.63], [0.61, 6.69], [0.53, 6.74], [0.47, 6.78, 1],
      [0.42, 6.78, 1], [0.47, 25.54, 1], [0, 25.54],
    ],
    foot: { r: 4.59, h: 0.39 },
  },
  hat: {
    profile: [
      [0.47, 25.53], [3.29, 25.53, 1], [3.32, 25.39, 1], [3.42, 25.39], [3.49, 25.41], [3.54, 25.46], [3.56, 25.52], [3.57, 25.57, 1],
      [3.57, 26.08, 1], [3.53, 26.18], [3.45, 26.26], [3.33, 26.35], [3.17, 26.44], [2.96, 26.53], [2.7, 26.62],
      [2.4, 26.71], [2.05, 26.79], [1.65, 26.86], [1.2, 26.92], [0.8, 26.96, 1],
      // knob: a thin collar, a dark neck, a ball
      [0.66, 26.96, 1], [0.66, 27.05, 1], [0.44, 27.05, 1], [0.44, 27.1, 1],
      [0.52, 27.13], [0.62, 27.2], [0.7, 27.3], [0.73, 27.42], [0.73, 27.55], [0.7, 27.68], [0.62, 27.79], [0.48, 27.89],
      [0.27, 27.96], [0, 28],
    ],
    led: { y: 25.52, rIn: 0.51, rOut: 3.27 },
  },
  light: { kelvin: 2700, lumen: 550, y: 25.52, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default albostan;
