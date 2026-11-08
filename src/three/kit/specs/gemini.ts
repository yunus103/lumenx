import type { KitSpec } from ".";

// Height 280 mm from the datasheet, proportions from the only photo (taken from between the base and the hat: the
// hat's lit underside and the base's top both show, so review.py's camera, fitted above the hat, misreads the hat and
// base-top rows). The photo gives a Ø122 hat against the datasheet's Ø120. The knob's lower half hides behind the
// hat's near edge; its height is read from the hat's rim ellipse. Touch key and charge port are unseen.
const gemini: KitSpec = {
  body: {
    profile: [
      [0, 0.6], [4.69, 0.6, 1], [4.75, 0.63], [4.77, 0.72, 1],
      // drum wall, a roll of about 3 mm into the flat top (the photo's edge highlight is that narrow)
      [4.77, 3.84, 1], [4.76, 3.95], [4.73, 4.04], [4.67, 4.1], [4.58, 4.135], [4.47, 4.14, 1],
      // collar at the stem's foot, with a fine groove near its bottom
      [0.93, 4.14, 1], [0.93, 4.19, 1], [0.9, 4.22, 1], [0.93, 4.25, 1],
      [0.93, 4.42], [0.9, 4.52], [0.84, 4.58, 1], [0.735, 4.6, 1],
      // straight stem, then the collar under the hat
      [0.76, 23.73, 1], [0.95, 23.73], [0.99, 23.76], [1, 23.81, 1], [1, 24.45, 1], [0, 24.45],
    ],
    foot: { r: 4.5, h: 0.6 },
  },
  hat: {
    profile: [
      [0.98, 24.45], [5.94, 24.45, 1], [5.94, 24.35, 1], [6.1, 24.35, 1],
      [6.1, 26.36, 1], [6.08, 26.52], [6.02, 26.62], [5.92, 26.67], [5.79, 26.68, 1],
      // knob: a short cylinder under a flattened dome
      [0.89, 26.68, 1], [0.89, 27.5, 1], [0.86, 27.64], [0.78, 27.76], [0.64, 27.86], [0.4, 27.95], [0, 28],
    ],
    led: { y: 24.44, rIn: 1, rOut: 5.94 },
  },
  light: { kelvin: 2700, lumen: 550, y: 24.44, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default gemini;
