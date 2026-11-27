import type { KitSpec } from ".";

// Height 205 mm from the 2027 catalogue and the gallery's dimension photo, proportions from the studio photo: a Ø70
// base (catalogue and label Ø60), a Ø134 hat rim (label 115) and a Ø72 hat top (catalogue and label 65); the
// dimension photo itself measures the larger diameters too. The hat's underside is in no photo: a recessed LED plate
// inside a thin rim, as Mina's, lighting the whole rim at night as the night photo's bright line shows.
const aran: KitSpec = {
  body: {
    // beech: a vertical pith behind the cone gives the body's straight streaks and flames
    grain: { pith: [0.4, 8, -5.5], dir: [0.02, 1, 0], ring: 0.22, contrast: 0.42 },
    profile: [
      [0, 0.2], [3.4, 0.2, 1], [3.47, 0.23], [3.5, 0.3], [3.5, 0.4],
      // one straight cone up into the hat
      [3.42, 0.8], [3.34, 1.4], [3.27, 2], [3.19, 2.6], [3.11, 3.2], [3.03, 3.8], [2.95, 4.4], [2.87, 5], [2.8, 5.6],
      [2.72, 6.2], [2.64, 6.8], [2.56, 7.4], [2.48, 8], [2.4, 8.6], [2.33, 9.2], [2.25, 9.8], [2.17, 10.4], [2.09, 11],
      [2.01, 11.6], [1.93, 12.2], [1.86, 12.8], [1.78, 13.4], [1.7, 14], [1.62, 14.6], [1.54, 15.2], [1.5, 15.7, 1],
      [0, 15.7],
    ],
    foot: { r: 3.3, h: 0.2 },
  },
  hat: {
    // a side-grain blank of its own: near-horizontal streaks across the cone, parallel figure on the top
    grain: { pith: [0, 18, -40], dir: [1, 0.04, 0.12], ring: 0.13, contrast: 0.25, pores: 0.5 },
    profile: [
      // LED plate recessed inside a thin rim, the rim's rounded outer edge, the straight cone, a softened top edge
      [1.45, 15.6], [6.2, 15.6, 1], [6.2, 15.5, 1], [6.56, 15.5], [6.64, 15.52], [6.69, 15.57], [6.7, 15.64],
      [6.46, 16], [6.2, 16.4], [5.93, 16.8], [5.67, 17.2], [5.4, 17.6], [5.14, 18], [4.88, 18.4], [4.61, 18.8],
      [4.35, 19.2], [4.08, 19.6], [3.82, 20], [3.62, 20.3], [3.57, 20.41], [3.51, 20.47], [3.42, 20.5, 1],
      // brass disc on the top, nearly flush
      [1.08, 20.5, 1], [1.08, 20.505, 1], [1.08, 20.54], [1.06, 20.56], [0.9, 20.56], [0, 20.56],
    ],
    led: { y: 15.59, rIn: 1.55, rOut: 6.15, wash: { metal: 0.15, wood: 3 } },
    fixed: [{ from: 20.505, to: 20.6, finish: "gold", brush: 0.3 }],
  },
  details: [
    { type: "usbc", y: 2.1, x: 1.9, side: "front", r: 0.6 },
    { type: "hole", y: 2.2, x: 0.4, side: "front", r: 0.09 },
  ],
  // the photos' stain (pale honey beech), not the kayin calibrated on Defne
  woodTone: { kayin: { early: "#f0ab58", late: "#b06e30", rough: 0.55, clearcoat: 0.12 } },
  light: { kelvin: 2700, lumen: 550, y: 15.59, dimmer: [0.4, 0.7, 1], body: 0.012, bounce: 200 },
};

export default aran;
