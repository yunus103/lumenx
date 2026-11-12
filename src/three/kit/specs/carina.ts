import type { KitSpec } from ".";

// Height 260 mm from the datasheet, proportions from the gold photo: base Ø97, bell Ø107. The krom/rose/saten photos
// draw the bell ~5% narrower against the base, and the datasheet (an older drawing and photo: a conical bell, no cup)
// labels both 100 mm. The alabaster bell is the opal shade (plain, no veining). Charge port, battery light and touch
// key are underneath (datasheet), unseen.
const carina: KitSpec = {
  body: {
    profile: [
      [0, 0.48], [4.78, 0.48, 1], [4.82, 0.52], [4.83, 0.6, 1],
      [4.83, 1.3], [4.83, 2.0], [4.83, 2.7, 1],
      // a rounded edge into the top face, which rises as one concave curve into the flare (r = 0.4 + e^((4.79 - y) / 1.26))
      [4.815, 2.82], [4.77, 2.91], [4.69, 2.965], [4.55, 3.005], [4.35, 3.065], [4.11, 3.14], [3.82, 3.24], [3.54, 3.35],
      [3.26, 3.47], [2.98, 3.6], [2.7, 3.74], [2.44, 3.9], [2.18, 4.07], [1.94, 4.25], [1.71, 4.45], [1.5, 4.68], [1.31, 4.92],
      [1.16, 5.17], [1.03, 5.45], [0.92, 5.73], [0.82, 6.02], [0.72, 6.32], [0.63, 6.62, 1],
      // collar: a thin washer under a round bead
      [0.71, 6.62, 1], [0.71, 6.68, 1], [0.67, 6.68, 1], [0.7, 6.71], [0.737, 6.77], [0.755, 6.845], [0.755, 6.915], [0.737, 6.99], [0.7, 7.04], [0.62, 7.07, 1],
      [0.46, 7.08, 1],
      [0.46, 9.5], [0.46, 11.8], [0.46, 14.1], [0.46, 16.42, 1],
      // bead and a short cone up into the cup
      [0.66, 16.44], [0.73, 16.5], [0.75, 16.58], [0.73, 16.66], [0.66, 16.71, 1], [0.63, 16.75], [0.56, 16.81], [0.48, 16.87], [0.42, 16.93, 1],
      // a shallow bowl, its rim tucked right under the bell's lip
      [1.2, 16.95], [1.9, 17.03], [2.5, 17.14], [2.85, 17.3], [3.08, 17.47], [3.2, 17.63], [3.24, 17.76, 1], [3.18, 17.8, 1], [0, 17.82],
    ],
    foot: { r: 4.78, h: 0.48 },
  },
  shade: {
    opal: true,
    profile: [
      [4.97, 18.3], [4.98, 18.13], [5.05, 18.03], [5.16, 18.0], [5.26, 18.05], [5.31, 18.16], [5.32, 18.29],
      [5.291, 18.45], [5.076, 18.78], [4.853, 19.11], [4.64, 19.45], [4.452, 19.79], [4.295, 20.16], [4.173, 20.53],
      [4.078, 20.92], [4.0, 21.31], [3.923, 21.7], [3.835, 22.08], [3.726, 22.46], [3.591, 22.84], [3.428, 23.2],
      [3.239, 23.55], [3.022, 23.88], [2.78, 24.19], [2.512, 24.48], [2.219, 24.75], [1.97, 24.89], [1.66, 24.98],
      [1.34, 25.02, 1], [0, 25.02],
    ],
    y: 18.0, h: 6.6, rBottom: 5.0, rTop: 1.9, thickness: 0.3, tape: 0, transmission: 0.011, liner: 0.03,
  },
  // the finial: the body's metal in every photo, a bullet-shaped dome on a short upright edge (gold photo silhouette)
  topButton: {
    r: 1.38, h: 0.98, finish: "body",
    shape: [
      [0, 0], [1, 0, 1], [1, 0.1], [0.968, 0.2], [0.93, 0.3], [0.874, 0.4], [0.81, 0.5], [0.733, 0.6], [0.645, 0.7],
      [0.559, 0.8], [0.41, 0.9], [0.26, 0.96], [0.12, 0.99], [0, 1],
    ],
  },
  light: { kelvin: 2700, lumen: 350, y: 20.5, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default carina;
