import type { KitSpec } from ".";

// Height 300 mm from the datasheet, proportions from the one photo (rose): a Ø83 hat over a Ø85 drum. The datasheet's
// "100mm" hat and "100mm Alt" are template values; its own drawing draws the hat 80 mm across at 300 mm high, as the
// photo shows. Charge port and touch key are underneath, unseen; the hat's underside isn't shown, so its rim lip,
// recessed LED plate and disc follow Agena. The hat is an octagon; the drum's vertical bands are reflections (its
// bottom edge is an ellipse, unbroken, and the cap's roll shows no corners), so it stays round.
const melma: KitSpec = {
  body: {
    profile: [
      [0, 0.6], [3.9, 0.6, 1], [4.1, 0.65], [4.18, 0.75], [4.2, 0.9], [4.21, 1.1],
      // the drum, under a cap whose rounded rim overhangs it a little; the cap's top swells into the trumpet
      [4.21, 1.6], [4.21, 2.1], [4.21, 2.55, 1], [4.26, 2.55, 1], [4.31, 2.64], [4.33, 2.8], [4.41, 2.97],
      [4.46, 3.15], [4.43, 3.35], [4.34, 3.5], [4.16, 3.62], [3.88, 3.75], [3.52, 3.84], [3.12, 3.93], [2.72, 4.03],
      [2.36, 4.15], [2.06, 4.29], [1.84, 4.45], [1.62, 4.62], [1.42, 4.84], [1.26, 5.06], [1.12, 5.28], [0.99, 5.5],
      [0.89, 5.72], [0.8, 5.94], [0.74, 6.16], [0.69, 6.36], [0.65, 6.5, 1],
      // a ring collar with a groove at its foot, then the slender stem up into the hat
      [0.56, 6.54, 1], [0.56, 6.6, 1], [0.62, 6.62, 1], [0.62, 6.9], [0.6, 6.95], [0.4, 6.98, 1],
      [0.4, 8.5], [0.4, 10], [0.4, 11.5], [0.4, 13], [0.4, 14.5], [0.4, 16], [0.4, 17.5], [0.4, 19], [0.4, 20.5],
      [0.4, 22], [0.4, 23.5], [0.4, 24.98, 1],
      // a thin plate under the hat, running up into its recess
      [0.6, 24.98, 1], [0.6, 25.42, 1], [0, 25.42],
    ],
    foot: { r: 3.85, h: 0.6 },
  },
  hat: {
    // a straight cone with a softly rounded top edge
    profile: [
      [0.6, 25.4], [3.76, 25.4, 1], [3.79, 25.17, 1], [4.06, 25.12, 1], [4.13, 25.13], [4.16, 25.18, 1],
      [4.05, 25.65], [3.94, 26.12], [3.83, 26.6], [3.72, 27.08], [3.61, 27.56], [3.5, 28.04], [3.4, 28.52],
      [3.29, 29.0], [3.18, 29.45], [3.1, 29.78], [3.07, 29.89], [3.01, 29.96], [2.9, 30, 1], [0, 30],
    ],
    led: { y: 25.39, rIn: 0.65, rOut: 3.74 },
    // eight flat panels, one facing the photo camera (face widths 0.75 : 1 : 0.7 across the photo); the photo width
    // is across the flats
    facets: { n: 8, across: "flats", angle: 8 },
  },
  light: { kelvin: 2700, lumen: 550, y: 25.39, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default melma;
