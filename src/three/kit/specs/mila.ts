import type { KitSpec } from ".";

// Height 280 mm from the datasheet, proportions from the photos (fitted on the rozze-bronze one): a Ø101 base and a
// Ø48 hat, close to the datasheet's Ø100 and Ø45. A drum base with a flat, radially brushed top, a thin rod stem
// standing in a small washer, and a cylindrical cup for a hat. The hat's underside isn't in any photo (all are shot
// from above), so the LED disc is recessed inside a thin rim as on Agena. Charge port and touch key are underneath.
const mila: KitSpec = {
  body: {
    profile: [
      [0, 0.15], [4.89, 0.15, 1], [4.99, 0.19], [5.05, 0.27], [5.07, 0.4, 1],
      // drum wall, a small roll into the flat top
      [5.07, 1.3], [5.07, 2.2], [5.07, 3.1], [5.07, 3.8, 1], [5.05, 3.92], [5.0, 3.98], [4.91, 4.0, 1],
      // washer where the rod stands
      [0.66, 4.0, 1], [0.66, 4.08], [0.63, 4.13], [0.58, 4.14, 1],
      // rod, running up into the hat
      [0.47, 4.14, 1], [0.47, 10], [0.47, 16], [0.47, 22], [0.47, 25.61, 1], [0, 25.61],
    ],
    foot: { r: 4.6, h: 0.15 },
  },
  hat: {
    profile: [
      [0.46, 25.6], [2.28, 25.6, 1], [2.28, 25.3, 1], [2.36, 25.3], [2.38, 25.34, 1],
      [2.38, 26.0], [2.38, 26.7], [2.38, 27.4], [2.38, 27.8, 1], [2.36, 27.92], [2.31, 27.98], [2.23, 28.0, 1], [0, 28.0],
    ],
    led: { y: 25.59, rIn: 0.5, rOut: 2.25 },
  },
  light: { kelvin: 2700, lumen: 550, y: 25.59, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default mila;
