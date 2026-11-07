import type { KitSpec } from ".";

// Height 340 mm from the datasheet; its Ø200 is the hat's rim and fits the photo. Proportions from the one photo. The
// stem's lit edges fade into the grey background, so its radius is read from the outer edge, not half contrast. The
// hat's underside isn't shown: rim band, recess and LED disc follow Agena's. Charge port and touch key are
// underneath, unseen (the Premium base takes a wireless cassette).
const olena: KitSpec = {
  body: {
    profile: [
      [0, 0.48], [4.56, 0.48, 1], [4.62, 0.51], [4.64, 0.6, 1],
      // drum, a seam groove, a tight roll into the straight cone, then a concave fillet into the neck
      [4.64, 2.24, 1], [4.61, 2.27], [4.61, 2.31], [4.63, 2.34, 1], [4.6, 2.42], [4.54, 2.52], [4.46, 2.65], [3.84, 4], [2.92, 6], [2.01, 8], [1.55, 9],
      [1.3, 9.55], [1.09, 10], [0.93, 10.5], [0.82, 11], [0.76, 11.45], [0.72, 11.85], [0.69, 11.94, 1],
      // stem from a small ledge, a seam groove, then the collar flaring into the hat
      [0.55, 11.96, 1], [0.55, 28.8, 1], [0.525, 28.83], [0.525, 28.87], [0.59, 28.9, 1],
      [0.63, 29.3], [0.68, 29.7], [0.8, 30.33], [0.9, 30.8], [0.98, 31], [1.02, 31.14, 1], [0, 31.14],
    ],
    foot: { r: 4.58, h: 0.48 },
  },
  hat: {
    profile: [
      [1.02, 31.12], [8.85, 31.12, 1], [8.88, 30.95, 1], [10.12, 30.95], [10.17, 30.98, 1],
      // straight cone, a small roll into the flat top
      [9.47, 32.15], [8.76, 33.3], [8.45, 33.7], [8.3, 33.86], [8.05, 33.95], [7.7, 33.98], [0, 33.98],
    ],
    led: { y: 31.11, rIn: 1.05, rOut: 8.82 },
  },
  light: { kelvin: 2700, lumen: 550, y: 31.11, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default olena;
