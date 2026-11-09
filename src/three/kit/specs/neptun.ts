import type { KitSpec } from ".";

// Height 320 mm from the datasheet, proportions from the one photo (the same in Sanity and on Light Design). Its hat
// comes out Ø110 as the datasheet says; the base Ø91, not the sheet's template "100mm Alt". The hat's underside is
// unseen: a lip around a recessed LED plate as on Agena. Touch key and charge port are unseen.
const neptun: KitSpec = {
  body: {
    profile: [
      [0, 0.35], [4.45, 0.35, 1], [4.5, 0.39], [4.53, 0.48, 1],
      // drum with a fine seam, rolling over into the straight cone
      [4.53, 0.62, 1], [4.5, 0.65, 1], [4.5, 0.69, 1], [4.53, 0.72, 1],
      [4.53, 1.0], [4.53, 1.3], [4.515, 1.55], [4.47, 1.75], [4.38, 1.97], [4.25, 2.25],
      [4.04, 2.7], [3.81, 3.15], [3.59, 3.6], [3.37, 4.05], [3.15, 4.5], [2.93, 4.95], [2.71, 5.4], [2.49, 5.85],
      [2.27, 6.3], [2.05, 6.75], [1.83, 7.2], [1.61, 7.65], [1.39, 8.1], [1.17, 8.55], [0.97, 8.96, 1],
      // groove and ring where the stem meets the cone
      [0.83, 8.96, 1], [0.83, 9.02, 1], [0.89, 9.04, 1], [0.89, 9.3, 1], [0.86, 9.34, 1], [0.76, 9.36, 1],
      // the stem, with a thin flange under the hat
      [0.76, 27.82, 1], [0.88, 27.82, 1], [0.88, 27.96, 1], [0, 27.96],
    ],
    foot: { r: 4.45, h: 0.35 },
  },
  hat: {
    // a flat drum with a small dome on top
    profile: [
      // crisp bottom edge, a wall widening slightly upward, a rounded top edge
      [0.9, 27.95], [5.1, 27.95, 1], [5.13, 27.77, 1], [5.4, 27.75, 1], [5.46, 27.78], [5.47, 27.85, 1],
      [5.47, 28.5], [5.48, 29.2], [5.49, 29.9], [5.5, 30.6], [5.51, 30.95], [5.49, 31.17], [5.42, 31.3],
      [5.3, 31.36, 1], [0.86, 31.36, 1],
      [0.86, 31.5], [0.84, 31.64], [0.77, 31.8], [0.62, 31.92], [0.38, 31.98], [0, 32],
    ],
    led: { y: 27.94, rIn: 0.95, rOut: 5.08 },
  },
  light: { kelvin: 2700, lumen: 550, y: 27.94, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default neptun;
