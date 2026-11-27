import type { KitSpec } from ".";

// Height 260 mm from the gallery's dimension photo and the 2027 catalogue, proportions from the studio photo: a Ø72
// body (label and catalogue Ø65) and a Ø111.5 hat, 27 mm thick (label and catalogue Ø95, label 20 mm); the dimension
// photo itself draws the hat even wider (~Ø118). The brass (plate, bushing, stem, the cup under the hat, the touch
// disc on top) is the same on both woods, so it is a fixed gold. The hat's underside is in no photo: a flat wooden
// plate with an LED disc reaching nearly to the rim, as the lit line under the rim in the studio photo shows.
const feza: KitSpec = {
  body: {
    // beech, quarter-sawn: a vertical pith far off to the side and behind gives the photos' straight, even streaks
    grain: { pith: [-18, 12, -12], dir: [0, 1, 0], ring: 0.2, contrast: 0.32 },
    profile: [
      // straight drum on a thin black rubber foot
      [0, 0.2], [3.48, 0.2, 1], [3.56, 0.23], [3.59, 0.3], [3.6, 0.4],
      [3.6, 1.09], [3.6, 1.69], [3.6, 2.28], [3.6, 2.88], [3.6, 3.47], [3.6, 4.06], [3.6, 4.66], [3.6, 5.25],
      [3.6, 5.85], [3.6, 6.44], [3.6, 7.03], [3.6, 7.63], [3.6, 8.22], [3.6, 8.82], [3.6, 9.41], [3.6, 10.0],
      [3.6, 10.6], [3.6, 11.19], [3.6, 11.79], [3.6, 12.38],
      // the domed top, half an ellipse (3.6 x 3.37 cm), runs under the brass plate's edge
      [3.586, 12.675], [3.546, 12.96], [3.479, 13.248], [3.387, 13.522], [3.271, 13.788], [3.13, 14.044],
      [2.967, 14.288], [2.788, 14.512], [2.583, 14.727], [2.366, 14.92, 1],
      // brass: the thin plate with an eased top edge, the round-topped bushing, the stem, the cup under the hat
      [2.4, 14.92, 1], [2.4, 15.11], [2.38, 15.15], [2.34, 15.17, 1],
      [0.85, 15.17, 1], [0.85, 15.5], [0.83, 15.62], [0.77, 15.71], [0.67, 15.77], [0.57, 15.79, 1],
      [0.57, 22.75, 1], [0.66, 22.79], [0.78, 22.84], [0.84, 22.9], [0.85, 22.98], [0.85, 23.32, 1], [0, 23.32],
    ],
    foot: { r: 3.48, h: 0.2 },
    fixed: [{ from: 14.92, to: 23.32, finish: "gold", brush: 0.35 }],
  },
  hat: {
    // a side-grain blank of its own: level streaks round the side with the rings' arcs at its ends, parallel lines on top
    grain: { pith: [0, -3, -28], dir: [1, 0.03, 0.08], ring: 0.15, contrast: 0.5, pores: 0.5 },
    profile: [
      // flat underside round the LED, a small round into the straight side, a softer round over into the flat top
      [0.85, 23.32], [5.45, 23.32, 1], [5.53, 23.34], [5.565, 23.39], [5.575, 23.46],
      [5.575, 23.75], [5.575, 24.05], [5.575, 24.34], [5.575, 24.63], [5.575, 24.93], [5.575, 25.22], [5.575, 25.5],
      [5.57, 25.72], [5.55, 25.86], [5.5, 25.95], [5.42, 25.99], [5.3, 26, 1],
      // the brass touch disc set a hair below the top in a fine groove
      [1.17, 26, 1], [1.15, 25.96, 1], [1.12, 25.96, 1], [1.1, 25.99, 1], [0, 25.99],
    ],
    // the night photo shows the stem lit under the hat
    led: { y: 23.31, rIn: 0.9, rOut: 5.0, wash: { metal: 0.15 } },
    fixed: [{ from: 25.96, to: 25.99, finish: "gold", brush: 0.35 }],
  },
  details: [
    { type: "usbc", y: 2.43, x: 1.79, side: "front", r: 0.63 },
    { type: "hole", y: 2.4, x: 0.06, side: "front", r: 0.08 },
  ],
  // the photos' stain (pale honey beech), not the kayin calibrated on Defne
  woodTone: { kayin: { early: "#f0ab58", late: "#b06e30", rough: 0.55, clearcoat: 0.12 } },
  light: { kelvin: 2700, lumen: 550, y: 23.31, dimmer: [0.4, 0.7, 1], body: 0.012, bounce: 200 },
};

export default feza;
