import type { KitSpec } from ".";

// Height 290 mm and the Ø120 hat from the datasheet; the drum (Ø96) and the rest from the eight photos, which all
// show the same shape. The datasheet's Ø100 "Alt" is its template value. Charge port and touch key are underneath,
// unseen. No photo sees the hat's underside: a flat LED plate with a small boss round the stem, as on Mirach.
const rigel: KitSpec = {
  body: {
    profile: [
      [0, 0.3], [4.77, 0.3, 1], [4.8, 0.33], [4.81, 0.41, 1],
      // straight drum, a small rounded edge into the flat top
      [4.81, 4.0, 1], [4.8, 4.12], [4.76, 4.22], [4.69, 4.29], [4.59, 4.33, 1],
      // a short neck and a rounded ring where the stem starts
      [0.84, 4.35, 1], [0.84, 4.5, 1], [0.9, 4.52], [0.95, 4.58], [0.97, 4.67], [0.95, 4.76], [0.9, 4.82], [0.87, 4.84, 1],
      [0.87, 24.25, 1], [0, 24.25],
    ],
    foot: { r: 4.93, h: 0.3 },
  },
  hat: {
    profile: [
      // the boss round the stem, the flat LED plate, a thin rim
      [0.87, 24.0], [0.95, 24.03], [1.0, 24.1], [1.02, 24.19], [1.02, 24.25, 1], [5.86, 24.25, 1],
      [5.92, 24.28], [5.94, 24.35, 1],
      // a cone, a little full low down, a rounded shoulder into the flat top, then the round-topped finial
      [5.92, 24.42, 1], [5.47, 25.13], [4.97, 25.84], [4.45, 26.55], [3.93, 27.26], [3.42, 27.97],
      [3.35, 28.04], [3.23, 28.09], [3.08, 28.12], [2.9, 28.14, 1],
      [0.93, 28.18, 1], [0.93, 28.42], [0.9, 28.52], [0.83, 28.6], [0.72, 28.68], [0.6, 28.76], [0.45, 28.85], [0.3, 28.93],
      [0.15, 28.98], [0, 29.0],
    ],
    led: { y: 24.24, rIn: 1.08, rOut: 5.7 },
  },
  light: { kelvin: 2700, lumen: 550, y: 24.24, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default rigel;
