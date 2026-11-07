import type { KitSpec } from ".";

// Height 220 mm from the datasheet, proportions from the photos: the datasheet's own Ø120 hat and Ø100 base don't fit
// its drawing, where the height is 2.35 hats as in the photos. Charge port and touch key are underneath, unseen.
const agena: KitSpec = {
  body: {
    profile: [
      [0, 0.38], [4.62, 0.38, 1], [4.69, 0.42], [4.7, 0.52, 1],
      // wall, a soft roll into the shallow cone of the top, then the stepped collar
      [4.7, 2.42, 1], [4.67, 2.56], [4.58, 2.64], [4.45, 2.68, 1],
      [2.42, 2.93, 1], [2.3, 2.97], [2.2, 3.06], [2.12, 3.2, 1],
      [2.03, 3.52, 1], [1.95, 3.62], [1.8, 3.72], [1.55, 3.78, 1],
      [1.3, 3.8, 1],
      // tapered stem, running up into the hat
      [1.26, 3.86, 1], [0.92, 18.32, 1], [0, 18.32],
    ],
    foot: { r: 4.6, h: 0.38 },
  },
  hat: {
    profile: [
      [0.9, 18.3], [4.3, 18.3, 1], [4.33, 18.1, 1], [4.78, 18.05, 1], [4.9, 18.08], [4.93, 18.18, 1],
      [4.93, 21.85, 1], [4.89, 21.97], [4.78, 22, 1], [0, 22],
    ],
    led: { y: 18.29, rIn: 0.95, rOut: 4.28 },
  },
  light: { kelvin: 2700, lumen: 550, y: 18.29, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default agena;
