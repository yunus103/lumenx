import type { KitSpec } from ".";

// Height 220 mm from the datasheet, proportions from the one photo: a Ø120 hat (the datasheet's Ø120) over a Ø97
// base. The cone runs straight from a short drum up into the hat. Charge port and touch key are underneath, unseen;
// the hat's underside isn't shown, so its LED disc follows Fuga: a flat plate filling the underside to the rim.
const esna: KitSpec = {
  body: {
    profile: [
      [0, 0.15], [4.2, 0.15, 1], [4.38, 0.2], [4.52, 0.3], [4.64, 0.45], [4.74, 0.62], [4.8, 0.82], [4.835, 1.05],
      // short drafted drum bending into the straight cone
      [4.83, 1.5], [4.815, 2.0], [4.79, 2.4], [4.75, 2.7], [4.69, 2.98], [4.62, 3.3], [4.5, 3.95],
      [4.29, 4.95], [4.08, 5.95], [3.87, 6.95], [3.66, 7.95], [3.45, 8.95], [3.24, 9.95], [3.03, 10.95],
      [2.82, 11.95], [2.61, 12.95], [2.4, 13.95], [2.19, 14.95], [1.98, 15.95], [1.77, 16.95], [1.71, 17.25, 1],
      [0, 17.25],
    ],
    foot: { r: 4.2, h: 0.15 },
  },
  hat: {
    profile: [
      [1.7, 17.23], [5.84, 17.23, 1], [5.95, 17.26], [6.0, 17.32], [6.01, 17.42],
      // the dome: steep sides curving into a low rounded crown
      [5.93, 17.75], [5.8, 18.1], [5.63, 18.5], [5.39, 18.92], [5.155, 19.3], [4.875, 19.7], [4.56, 20.08],
      [4.21, 20.44], [3.84, 20.78], [3.43, 21.09], [2.95, 21.37], [2.42, 21.6], [1.88, 21.77], [1.33, 21.89],
      [0.8, 21.96], [0.27, 21.995], [0, 22],
    ],
    led: { y: 17.22, rIn: 1.8, rOut: 5.7 },
  },
  light: { kelvin: 2700, lumen: 550, y: 17.22, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default esna;
