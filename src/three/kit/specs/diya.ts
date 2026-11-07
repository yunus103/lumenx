import type { KitSpec } from ".";

// Height 135 mm to the knob's top from the datasheet, proportions from the gold and black photos, which agree within
// 0.3 mm. The datasheet's Ø115 hat doesn't fit its own drawing, where the height is 1.33 hats as in the photos (Ø102).
// The base's flat top ring and the flare's foot are seen from above in the photos, so they are placed by the fit, not
// read off the outline. The hat's underside is unseen: a recessed LED disc inside a thin rim, as on Agena. The small
// pin at the base's lower edge shows on the gold photo only, so it is left out (a kit detail is brass on every
// finish); charge contacts and touch key are underneath.
const diya: KitSpec = {
  body: {
    profile: [
      [0, 0.5], [4.3, 0.5, 1], [4.4, 0.52], [4.435, 0.57], [4.445, 0.7],
      // drum wall, a soft roll onto a narrow flat ring, then the concave flare up to the stem
      [4.43, 1.5], [4.42, 2.3], [4.41, 3.02, 1], [4.395, 3.11], [4.36, 3.17], [4.28, 3.2, 1], [4.12, 3.23], [3.96, 3.27],
      [3.8, 3.33], [3.6, 3.45], [3.34, 3.68], [3.13, 3.9], [2.85, 4.2], [2.66, 4.4], [2.5, 4.6],
      [2.26, 5], [1.99, 5.5], [1.73, 6], [1.55, 6.5], [1.385, 7], [1.265, 7.5], [1.17, 8],
      [1.1, 8.5], [1.01, 9], [0.96, 9.5], [0.95, 9.82, 1], [0, 9.82],
    ],
    foot: { r: 4.23, h: 0.5 },
  },
  hat: {
    profile: [
      [0.95, 9.8], [4.58, 9.8, 1], [4.61, 9.6, 1], [4.96, 9.55, 1], [5.06, 9.57], [5.09, 9.66, 1],
      [5.09, 10.55], [5.09, 11.45], [5.09, 12.3, 1], [5.075, 12.4], [5.04, 12.47], [4.97, 12.5, 1],
      // the knob: a slightly flattened ball on the hat's flat top
      [0.42, 12.5, 1], [0.52, 12.55], [0.6, 12.63], [0.65, 12.73], [0.67, 12.85], [0.67, 12.97], [0.655, 13.1],
      [0.6, 13.23], [0.5, 13.36], [0.33, 13.46], [0, 13.51],
    ],
    led: { y: 9.79, rIn: 0.98, rOut: 4.56 },
  },
  light: { kelvin: 2700, lumen: 550, y: 9.79, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default diya;
