import type { KitSpec } from ".";

// Proportions from the one photo (gold), scaled so the hat is the datasheet's Ø115 mm. That gives a 247 mm height and
// a Ø90 base. The datasheet's 126 mm can't be the height: at 126 mm the base would be 46 mm wide, too small for its
// two 18650 cells. Its Ø100 "Alt" is the sheets' template value. Charge port and touch key are underneath, unseen.
const tole: KitSpec = {
  body: {
    profile: [
      [0, 0.56], [4.5, 0.56, 1],
      // drum, a soft roll into the flat top, a rounded boss and a short sleeve at the stem's foot
      [4.5, 1.3], [4.5, 2.1], [4.5, 2.86, 1], [4.47, 2.98], [4.4, 3.05], [4.28, 3.08, 1],
      [2.2, 3.08, 1], [2.08, 3.12], [2.02, 3.22], [2.0, 3.4], [2.0, 3.72], [1.97, 3.9], [1.9, 4.03], [1.79, 4.11], [1.65, 4.15, 1],
      [1.3, 4.15, 1], [1.3, 4.48], [1.27, 4.52, 1],
      // tapered stem, running up into the hat
      [1.23, 4.52, 1], [0.98, 17.66, 1], [0, 17.66],
    ],
    foot: { r: 4.32, h: 0.56 },
  },
  hat: {
    // a straight drum with a wide rounded top; the bottom is a thin rim round the LED disc
    profile: [
      [0.97, 17.72], [5.5, 17.72, 1], [5.53, 17.6, 1], [5.74, 17.6, 1], [5.77, 17.63], [5.77, 17.72, 1],
      [5.77, 18.5], [5.76, 19.4], [5.75, 20.3], [5.73, 21.2], [5.71, 22.0], [5.68, 22.6], [5.58, 23.05],
      [5.38, 23.45], [5.14, 23.8], [4.8, 24.12], [4.3, 24.42], [3.7, 24.62], [3.0, 24.72], [2.4, 24.75, 1], [0, 24.75],
    ],
    led: { y: 17.71, rIn: 1.05, rOut: 5.45 },
  },
  light: { kelvin: 2700, lumen: 550, y: 17.71, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default tole;
