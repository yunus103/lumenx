import type { KitSpec } from ".";

// Height 230 mm from the 2027 catalogue and the gallery's dimension photo, proportions from the studio photo: a Ø71
// body (catalogue Ø65) and a Ø117.6 hat (catalogue and label Ø110; the dimension photo itself measures Ø118). The
// brass (plate, collar, stem, the cap on the hat) stays brass on the walnut-stained hat of the night photo, so it is
// a fixed gold. The hat's underside is in no photo: a flat wooden plate inside the rim with a small LED round the
// stem, where the night photo's light is brightest.
const pera: KitSpec = {
  body: {
    // beech, one block for body and hat: a vertical pith just in front of the hat's rim gives straight streaks on the
    // body and the photo's arch of rings at the front of the dome
    grain: { pith: [0.3, 10, 6.0], dir: [0.02, 1, 0], ring: 0.24, contrast: 0.2 },
    profile: [
      [0, 0.2], [3.33, 0.2, 1], [3.46, 0.24], [3.53, 0.34], [3.55, 0.5], [3.55, 0.9], [3.55, 1.4], [3.55, 2], [3.55, 2.6],
      [3.55, 3.2], [3.55, 3.8], [3.55, 4.4], [3.55, 5], [3.55, 5.6], [3.55, 6.2], [3.55, 6.8], [3.55, 7.4],
      [3.55, 8], [3.54, 8.5], [3.5, 8.9], [3.4, 9.28], [3.25, 9.62], [3.07, 9.92], [2.88, 10.17], [2.76, 10.3, 1],
      // the rounded shoulder runs under the thin brass plate, the round-topped collar on it, the stem into the hat
      [2.68, 10.3, 1],
      [2.68, 10.56], [2.66, 10.6, 1],
      [0.8, 10.6, 1], [0.8, 10.94], [0.77, 11.02], [0.69, 11.06, 1],
      [0.49, 11.06, 1], [0.49, 18.6, 1], [0, 18.6],
    ],
    foot: { r: 3.3, h: 0.2 },
    fixed: [{ from: 10.3, to: 18.6, finish: "gold", brush: 0.4 }],
  },
  hat: {
    profile: [
      // LED plate, the inside of the rim, the rim rolling under into the dome
      [0.49, 18.6], [4.85, 18.6, 1], [5.15, 18.08, 1], [5.45, 18.08, 1], [5.61, 18.11], [5.75, 18.2], [5.84, 18.33],
      [5.88, 18.5, 1], [5.86, 18.86], [5.8, 19.22], [5.7, 19.57], [5.57, 19.91], [5.4, 20.23], [5.21, 20.53],
      [4.99, 20.82], [4.74, 21.09], [4.48, 21.34], [4.2, 21.57], [3.9, 21.78], [3.59, 21.97], [3.27, 22.14],
      [2.94, 22.29], [2.61, 22.43], [2.26, 22.54], [1.91, 22.64], [1.56, 22.72], [1.2, 22.79, 1],
      // brass cap, a thin disc with a rounded edge
      [1.12, 22.79, 1], [1.12, 22.92], [1.09, 22.97], [1.02, 22.995], [0.8, 23], [0, 23],
    ],
    led: { y: 18.59, rIn: 0.55, rOut: 2.5, wash: { metal: 0.15 } },
    fixed: [{ from: 22.79, to: 23.1, finish: "gold", brush: 0.4 }],
  },
  details: [
    { type: "usbc", y: 2.95, x: -1.29, side: "front", r: 0.6 },
    { type: "hole", y: 3.07, x: -2.75, side: "front", r: 0.09 },
  ],
  light: { kelvin: 2700, lumen: 550, y: 18.59, dimmer: [0.4, 0.7, 1], body: 0.012, bounce: 200 },
};

export default pera;
