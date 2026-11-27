import type { KitSpec } from ".";

// Height 235 mm from the 2027 catalogue and the gallery's dimension photo, proportions from the studio photos: they
// give a Ø77 body and a Ø111 hat, not the Ø65 / Ø95 of the catalogue and the dimension photo's labels (that photo
// itself measures about Ø71 / Ø105 at 235 mm). The copper (plate, bushing, stem, the ring under the hat) stays copper
// whatever the wood, so it is a fixed `rose`; the touch key on the hat is brass. The night photo lights the stem
// from a small LED ring round its top.
const yosun: KitSpec = {
  body: {
    // beech, one block for body and hat: a vertical pith just in front of the body gives straight streaks on it
    grain: { pith: [0.3, 9, 4.6], dir: [0.02, 1, 0], ring: 0.2, contrast: 0.32 },
    profile: [
      [0, 0.15], [3.72, 0.15, 1], [3.79, 0.18], [3.83, 0.26], [3.83, 0.5], [3.83, 1.1], [3.83, 1.7], [3.83, 2.3],
      [3.83, 2.9], [3.83, 3.5], [3.83, 4.1], [3.83, 4.7], [3.83, 5.3], [3.83, 5.9], [3.83, 6.5], [3.83, 7.1],
      [3.83, 7.6], [3.81, 7.95], [3.77, 8.28], [3.7, 8.58], [3.6, 8.86], [3.48, 9.12], [3.34, 9.37], [3.18, 9.6],
      [3.0, 9.82], [2.82, 10.02], [2.66, 10.22], [2.55, 10.45, 1],
      // the flat top of the dome under the thin copper plate, the round-topped bushing on it, the stem into the hat
      [2.36, 10.45, 1],
      [2.36, 10.56], [2.34, 10.6, 1],
      [0.86, 10.6, 1], [0.88, 10.66], [0.88, 10.8], [0.85, 10.89], [0.76, 10.95], [0.63, 10.97, 1],
      [0.53, 10.97, 1], [0.53, 20.0, 1], [0, 20.0],
    ],
    foot: { r: 3.72, h: 0.15 },
    fixed: [{ from: 10.45, to: 20.0, finish: "rose" }],
  },
  hat: {
    // a side-grain blank of its own: near-level streaks round the side, diagonal ones across the top
    grain: { pith: [0, -6.2, -28], dir: [1, 0.03, 0.08], ring: 0.15, contrast: 0.3, pores: 0.5 },
    profile: [
      // the copper ring round the stem (its underside is the LED), the flat underside, the pillow-round rim, the top
      [0.53, 20.0], [0.84, 20.0, 1], [0.84, 20.3, 1],
      [1.2, 20.3], [1.6, 20.3], [2.0, 20.3], [2.4, 20.3], [2.8, 20.3], [3.2, 20.3], [3.55, 20.3],
      [3.85, 20.3], [4.142, 20.324], [4.425, 20.396], [4.69, 20.514], [4.93, 20.674], [5.137, 20.872], [5.305, 21.1],
      [5.429, 21.353], [5.504, 21.622], [5.53, 21.9], [5.506, 22.193], [5.436, 22.474], [5.323, 22.733], [5.17, 22.961],
      [4.983, 23.147], [4.771, 23.286], [4.54, 23.371], [4.3, 23.4],
      [3.9, 23.4], [3.5, 23.4], [3.1, 23.4], [2.7, 23.4], [2.3, 23.4], [1.9, 23.4], [1.5, 23.4], [1.15, 23.4], [0, 23.4],
    ],
    led: { y: 19.99, rIn: 0.54, rOut: 0.83, wash: { metal: 0.15 } },
    fixed: [{ from: 20.0, to: 20.3, finish: "rose" }],
  },
  // the brass touch key, a flat disc a little proud of the top
  topButton: { r: 1.1, h: 0.1, shape: [[0, 0], [1, 0], [1, 0.5], [0.92, 1], [0, 1]] },
  details: [
    { type: "usbc", y: 1.48, x: -0.17, side: "front", r: 0.8 },
    { type: "hole", y: 1.76, x: -2.56, side: "front", r: 0.1 },
  ],
  // the photos' stain (pale honey beech), not the kayin calibrated on Defne
  woodTone: { kayin: { early: "#f0ab58", late: "#b06e30", rough: 0.55, clearcoat: 0.12 } },
  light: { kelvin: 2700, lumen: 550, y: 19.99, dimmer: [0.4, 0.7, 1], body: 0.012, bounce: 200 },
};

export default yosun;
