import type { KitSpec } from ".";

// Height 255 mm, Ø100 base and Ø120 hat from the datasheet, which the one photo's proportions match. Charge port and
// touch key are underneath, unseen. The hat's underside shows only as a thin LED sliver, so it follows Agena.
const polaris: KitSpec = {
  body: {
    profile: [
      // a bottom plate under a seam groove, then the drum
      [0, 0.12], [4.98, 0.12, 1], [5.02, 0.15], [5.03, 0.3, 1], [4.97, 0.33, 1], [4.97, 0.38, 1], [5.03, 0.41, 1],
      [5.03, 1.4], [5.01, 2.35, 1],
      // a round shoulder into the gently sloping top, then the concave flare up to the stem, evenly spaced
      [5.0, 2.6], [4.96, 2.78], [4.84, 2.95], [4.36, 3.14], [3.86, 3.26], [3.33, 3.38], [2.85, 3.5], [2.55, 3.64],
      [2.4, 3.8], [2.3, 3.98], [2.18, 4.18], [2.0, 4.42], [1.71, 4.72], [1.47, 5.0], [1.3, 5.28], [1.15, 5.56], [1.02, 5.84],
      [0.92, 6.1], [0.83, 6.35], [0.77, 6.58], [0.71, 6.8, 1],
      // a short ring with a groove on top where the stem starts
      [0.63, 6.81, 1], [0.63, 7.02, 1], [0.6, 7.06, 1], [0.47, 7.09, 1], [0.445, 7.13, 1],
      // the stem, and a small flared collar under the hat
      [0.445, 19.7, 1], [0.5, 19.73, 1], [0.6, 19.85, 1], [0.6, 19.94, 1], [0, 19.94],
    ],
    foot: { r: 4.85, h: 0.12 },
  },
  // the battery indicator, low on the front
  details: [{ type: "hole", y: 0.5, x: 1.15, side: "front", r: 0.07 }],
  hat: {
    profile: [
      // recessed LED plate, a flat rim ring with a small roll at its edge
      [0.6, 19.94], [5.2, 19.94, 1], [5.22, 19.97, 1], [5.9, 19.97, 1], [5.97, 19.99], [6.02, 20.05], [6.07, 20.3, 1],
      // a straight cone, evenly spaced, rounding over into the flat top
      [5.92, 20.77], [5.76, 21.24], [5.61, 21.71], [5.45, 22.18], [5.3, 22.65], [5.15, 23.12], [4.99, 23.59], [4.84, 24.06],
      [4.69, 24.53], [4.58, 24.87], [4.5, 25.1], [4.39, 25.3], [4.23, 25.44], [4.02, 25.5, 1],
      [0, 25.5],
    ],
    led: { y: 19.93, rIn: 0.65, rOut: 5.18 },
  },
  light: { kelvin: 2700, lumen: 550, y: 19.93, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default polaris;
