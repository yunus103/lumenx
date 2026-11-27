import type { KitSpec } from ".";

// Height 195 mm from the 2027 catalogue and the gallery's dimension photo (10.5 + 6 + 3 cm), proportions from the
// studio photo: a Ø75.5 egg (catalogue and label Ø80) and a Ø85 hat (catalogue and label Ø90); the photo is ~5% under
// both, so the labels are rounded up or the lamp is ~205 mm tall. The copper metal (plate, bead collar, stem, the cap
// under the hat) stays copper on the walnut, so it is a fixed rose; the flush key on top of the hat is yellower, a
// fixed gold. The hat's underside is in no photo: a flat wooden plate with a wide LED disc, as the night photos' lit
// rim and stem suggest.
const puren: KitSpec = {
  body: {
    // beech, one block for body and hat: a vertical pith just in front of the egg, leaning back, gives the photo's
    // tall arches on the front of the egg and straight streaks on the hat
    grain: { pith: [0.2, 6, 4.4], dir: [0, 1, -0.12], ring: 0.24, contrast: 0.3 },
    profile: [
      // the egg rounds well under onto a thin black rubber foot
      [0, 0.15], [1.5, 0.15, 1], [1.62, 0.17], [1.76, 0.22], [1.9, 0.28], [2.03, 0.34], [2.15, 0.41], [2.26, 0.48],
      [2.36, 0.56], [2.45, 0.65], [2.55, 0.79], [2.66, 0.95], [2.79, 1.13],
      [2.92, 1.33], [3.04, 1.54], [3.15, 1.76], [3.25, 1.98], [3.34, 2.21], [3.42, 2.45], [3.49, 2.7], [3.55, 2.96],
      [3.6, 3.23], [3.65, 3.52], [3.7, 3.82], [3.735, 4.12], [3.758, 4.45], [3.772, 4.8],
      [3.775, 5.2], [3.765, 5.6], [3.74, 6.0], [3.7, 6.4], [3.635, 6.8], [3.555, 7.2], [3.46, 7.6],
      [3.335, 8.0], [3.18, 8.4], [3.0, 8.8], [2.79, 9.18], [2.55, 9.54], [2.29, 9.86], [2.04, 10.12, 1],
      [1.9, 10.15, 1],
      // copper: the thin plate with a rounded top edge, the round bead collar, the stem, the cap under the hat
      [1.95, 10.15, 1], [1.95, 10.38], [1.93, 10.45], [1.87, 10.5, 1],
      [0.62, 10.5, 1], [0.68, 10.53], [0.715, 10.6], [0.72, 10.7], [0.7, 10.8], [0.65, 10.88], [0.56, 10.94],
      [0.475, 10.97, 1], [0.475, 16.05, 1], [0.53, 16.08], [0.63, 16.13], [0.69, 16.19], [0.7, 16.27, 1], [0, 16.27],
    ],
    foot: { r: 1.5, h: 0.15, rBottom: 1.4, round: 0.05 },
    fixed: [{ from: 10.15, to: 16.27, finish: "rose" }],
  },
  hat: {
    // a side-grain blank of its own: near-level streaks round the side, diagonal ones across the top
    grain: { pith: [0, -10.2, -28], dir: [1, 0.03, 0.08], ring: 0.16, contrast: 0.25, pores: 0.5 },
    profile: [
      // flat LED plate, a full pillow roll to the widest point, the shallow dome of the top
      [0.7, 16.27], [3.05, 16.27, 1], [3.2, 16.3], [3.32, 16.35], [3.43, 16.42], [3.54, 16.5], [3.66, 16.6],
      [3.78, 16.71], [3.9, 16.83], [4.0, 16.96], [4.09, 17.1], [4.16, 17.25], [4.21, 17.41], [4.24, 17.57],
      [4.25, 17.74], [4.245, 17.9], [4.23, 18.06], [4.2, 18.22], [4.15, 18.38], [4.08, 18.52], [3.99, 18.65],
      [3.86, 18.77], [3.73, 18.89], [3.58, 19.0], [3.42, 19.1], [3.24, 19.19], [3.04, 19.27], [2.82, 19.34],
      [2.57, 19.4], [2.3, 19.44], [2.0, 19.47], [1.65, 19.49], [1.3, 19.5], [1.08, 19.5, 1],
      // the flush brass key
      [1.03, 19.5, 1], [1.03, 19.47, 1], [0, 19.47],
    ],
    led: { y: 16.26, rIn: 0.72, rOut: 2.95, wash: { metal: 0.15 } },
    fixed: [{ from: 19.47, to: 19.5, finish: "gold" }],
  },
  details: [
    { type: "usbc", y: 1.94, x: 1.54, side: "front", r: 0.65 },
    { type: "hole", y: 2.0, x: -0.14, side: "front", r: 0.09 },
  ],
  // the photos' stain (pale honey beech), not the kayin calibrated on Defne
  woodTone: { kayin: { early: "#f0ab58", late: "#b06e30", rough: 0.55, clearcoat: 0.12 } },
  light: { kelvin: 2700, lumen: 550, y: 16.26, dimmer: [0.4, 0.7, 1], body: 0.012, bounce: 200 },
};

export default puren;
