import type { KitSpec } from ".";

// Height 185 mm from the gallery's dimension photo and the 2027 catalogue, proportions from the studio photos. Both
// studio photos make the lamp 2.0 hats tall, not the 2.18 of the labels (Ø85 × 20 mm hat, Ø60 base, Ø20 cone top;
// the catalogue swaps base and head), while the labels' diameters agree with each other: at 185 mm the photos give a
// Ø93 × 22 mm hat, a Ø66 base and a Ø22 cone top. The hat's underside follows the dimension photo's bottom view: a
// wooden rim round a recessed plate with a ring of LEDs, the cone running into it. USB-C port and indicator hole on
// the back, low on the cone.
const alya: KitSpec = {
  body: {
    grain: { pith: [0.3, 0, 5.2], dir: [0, 1, -0.24], ring: 0.2, contrast: 0.55, pores: 1.6 },
    profile: [
      // felt pad underneath, a softly rounded bottom edge, then the straight cone up into the hat
      [0, 0.1], [2.9, 0.1], [3.07, 0.13], [3.18, 0.2], [3.24, 0.3], [3.25, 0.4],
      [3.218, 0.6], [3.164, 1], [3.096, 1.5], [3.028, 2], [2.96, 2.5], [2.891, 3], [2.823, 3.5], [2.755, 4],
      [2.687, 4.5], [2.619, 5], [2.551, 5.5], [2.483, 6], [2.415, 6.5], [2.347, 7], [2.279, 7.5], [2.21, 8],
      [2.142, 8.5], [2.074, 9], [2.006, 9.5], [1.938, 10], [1.87, 10.5], [1.802, 11], [1.734, 11.5], [1.666, 12],
      [1.598, 12.5], [1.529, 13], [1.461, 13.5], [1.393, 14], [1.325, 14.5], [1.257, 15], [1.189, 15.5],
      [1.121, 16], [1.08, 16.3], [1.039, 16.6, 1], [0, 16.6],
    ],
    foot: { r: 2.95, h: 0.1, rBottom: 2.85 },
  },
  hat: {
    // a side-grain blank of its own: level streaks round the side, straight parallel lines across the top
    grain: { pith: [0, -10.6, -28], dir: [1, 0, 0.05], ring: 0.15, contrast: 0.55, pores: 1.6 },
    profile: [
      // LED plate recessed inside the rim, the rim's rounded outer edge, the straight wall
      [1.03, 16.6], [4.25, 16.6, 1], [4.25, 16.3, 1], [4.52, 16.3], [4.6, 16.33], [4.64, 16.38], [4.65, 16.46],
      [4.65, 16.75], [4.65, 17.05], [4.65, 17.35], [4.65, 17.65], [4.65, 17.95], [4.65, 18.25],
      // a soft roll into the flat top
      [4.64, 18.37], [4.61, 18.42], [4.56, 18.445], [4.48, 18.45, 1],
      // the flush brass disc, a hair proud of the wood
      [1.1, 18.45, 1], [1.1, 18.46, 1], [1.1, 18.49], [1.07, 18.5, 1], [0, 18.5],
    ],
    // the night photo shows the cone lit under the hat
    led: { y: 16.59, rIn: 1.07, rOut: 4.22, wash: { metal: 0, wood: 3 } },
    fixed: [{ from: 18.46, to: 18.5, finish: "gold", brush: 0.3 }],
  },
  details: [
    { type: "usbc", y: 2.8, x: 0.65, side: "back", r: 0.62 },
    { type: "hole", y: 4.5, x: 0.85, side: "back", r: 0.09 },
  ],
  // the photos' stain (lacquered dark red-brown wood), not the ceviz calibrated on Defne
  woodTone: { ceviz: { early: "#9b5225", late: "#612a0e", rough: 0.45, clearcoat: 0.35, coatRough: 0.2, contrast: 1.4 } },
  light: { kelvin: 2700, lumen: 550, y: 16.59, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default alya;
