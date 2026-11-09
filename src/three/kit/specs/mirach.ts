import type { KitSpec } from ".";

// Height 300 mm from the datasheet, proportions from the one photo (gold): a Ø95 drum and a Ø75 dome hat, so the
// datasheet's Ø100 "Alt" is its template value. Charge port and touch key are underneath, unseen. The photo sees just
// the hat's rim from below; the LED plate recessed inside the dome follows Mimosa.
const mirach: KitSpec = {
  body: {
    profile: [
      [0, 0.6], [4.55, 0.6, 1], [4.65, 0.65], [4.7, 0.75], [4.72, 0.9, 1],
      // seam groove on the drum
      [4.72, 2.26, 1], [4.69, 2.28, 1], [4.69, 2.32, 1], [4.72, 2.34, 1],
      // a round shoulder, then the concave flare up to the stem; evenly spaced so the spline can't fold
      [4.72, 3.05, 1], [4.71, 3.25], [4.66, 3.45], [4.58, 3.63], [4.46, 3.8], [4.3, 3.94], [4.08, 4.05], [3.82, 4.14],
      [3.52, 4.22], [3.2, 4.3], [2.88, 4.38], [2.57, 4.47], [2.27, 4.57], [2.0, 4.68], [1.79, 4.81], [1.64, 4.95], [1.52, 5.09],
      [1.37, 5.3], [1.24, 5.51], [1.12, 5.73], [1.02, 5.95], [0.93, 6.17], [0.85, 6.39], [0.78, 6.6], [0.73, 6.8, 1],
      // a groove and a short rounded ring where the stem starts
      [0.66, 6.82, 1], [0.66, 6.9, 1], [0.68, 6.93], [0.69, 7.05], [0.68, 7.25], [0.65, 7.36], [0.58, 7.43], [0.43, 7.48, 1],
      [0.43, 25.5, 1], [0, 25.5],
    ],
    foot: { r: 4.55, h: 0.6 },
  },
  hat: {
    profile: [
      // a small boss where the stem enters, the recessed LED plate, a thin rolled lip at the rim
      [0.43, 25.12], [0.56, 25.15], [0.64, 25.2], [0.67, 25.28], [0.67, 25.5, 1], [3.52, 25.5, 1],
      [3.6, 25.22, 1], [3.76, 25.22], [3.79, 25.27],
      // the dome, flattish on top, then the ball finial
      [3.75, 25.36], [3.73, 25.59], [3.7, 25.83], [3.66, 26.06], [3.6, 26.28], [3.52, 26.51], [3.44, 26.73], [3.35, 26.94],
      [3.24, 27.15], [3.12, 27.35], [3.0, 27.55], [2.86, 27.75], [2.72, 27.93], [2.57, 28.11], [2.41, 28.28], [2.24, 28.44],
      [2.06, 28.6], [1.88, 28.74], [1.68, 28.88], [1.42, 28.94], [1.13, 28.98], [0.85, 29.01], [0.64, 29.03, 1],
      [0.6, 29.08], [0.63, 29.18], [0.63, 29.35], [0.645, 29.5], [0.63, 29.65], [0.58, 29.78], [0.5, 29.88], [0.38, 29.96],
      [0.2, 30.0], [0, 30.01],
    ],
    led: { y: 25.49, rIn: 0.7, rOut: 3.5 },
  },
  light: { kelvin: 2700, lumen: 550, y: 25.49, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default mirach;
