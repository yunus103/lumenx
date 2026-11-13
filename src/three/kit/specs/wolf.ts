import type { KitSpec } from ".";

// Height 170 mm from the datasheet, proportions from the one photo (the datasheet drawing is traced from it and agrees).
const wolf: KitSpec = {
  body: {
    profile: [
      [0, 0.4], [4.78, 0.4, 1], [4.84, 0.45], [4.85, 0.55, 1],
      // drum wall, a seam groove under the shoulder cap
      [4.85, 0.9], [4.85, 1.25], [4.85, 1.6], [4.85, 1.95], [4.85, 2.2, 1], [4.82, 2.23, 1], [4.82, 2.28, 1],
      [4.88, 2.31, 1],
      // the cap: a short wall rolling into a convex shoulder, then the concave trumpet of the stem
      [4.88, 2.45], [4.88, 2.6], [4.88, 2.75], [4.86, 2.9], [4.81, 3.05], [4.72, 3.2], [4.59, 3.34], [4.39, 3.47],
      [4.1, 3.6], [3.82, 3.72], [3.56, 3.82], [3.36, 3.9], [3.18, 3.97], [3.05, 4.07], [2.96, 4.2], [2.87, 4.38], [2.77, 4.6],
      [2.62, 4.85], [2.49, 5.08], [2.32, 5.4], [2.15, 5.73], [2.01, 6.05], [1.87, 6.38], [1.76, 6.7], [1.66, 7.02],
      [1.56, 7.35], [1.49, 7.7], [1.44, 8.05], [1.41, 8.4], [1.38, 8.85], [1.36, 9.47, 1], [0, 9.47],
    ],
    foot: { r: 4.85, h: 0.4, rBottom: 4.84 },
  },
  hat: {
    profile: [
      // LED plate recessed inside the dome, the inside wall down to a thin rolled rim
      [1.36, 9.45], [5.6, 9.45, 1], [5.85, 9.36], [6.05, 9.22], [6.2, 9.05, 1], [6.28, 9.0], [6.35, 9.02],
      [6.4, 9.07],
      // the dome, past its equator, then the call button
      [6.47, 9.17], [6.56, 9.32], [6.63, 9.48], [6.68, 9.65], [6.71, 9.85], [6.7, 10.1], [6.63, 10.45], [6.55, 10.8],
      [6.46, 11.15], [6.35, 11.5], [6.22, 11.85], [6.07, 12.2], [5.91, 12.55], [5.73, 12.9], [5.53, 13.25],
      [5.29, 13.6], [5.0, 13.95], [4.66, 14.3], [4.27, 14.65], [3.83, 15.0], [3.33, 15.33], [2.82, 15.6],
      [2.36, 15.82], [1.98, 15.96], [1.62, 16.05, 1],
      // the call button: a thin flange and the brass post inside the frosted cap (glass)
      [1.38, 16.07], [1.38, 16.13, 1], [1.12, 16.15, 1], [0.32, 16.15, 1], [0.32, 16.45], [0.32, 16.72, 1],
      [0.25, 16.78, 1], [0, 16.78],
    ],
    led: { y: 9.44, rIn: 1.42, rOut: 5.55 },
  },
  // the call button's cap: frosted milky plastic, tapered, with a flat top
  glass: {
    profile: [
      [1.12, 16.15], [1.08, 16.25], [1.04, 16.4], [0.98, 16.6], [0.88, 16.8], [0.81, 16.93], [0.73, 16.99], [0.6, 17, 1],
      [0, 17],
    ],
    thickness: 0.1,
    frost: 0.3,
  },
  light: { kelvin: 2700, lumen: 550, y: 9.44, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default wolf;
