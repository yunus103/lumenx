import type { KitSpec } from ".";

// Height 330 mm and hat Ø220 from the datasheet, everything else from the one photo (its hat-to-base ratio puts the
// base at Ø101; the sheet's "100mm Alt" is its charging-template text). The hat's underside is lit nearly to the rim
// in the photo, so the LED disc runs out to the rim band. Charge port and touch key are underneath, unseen.
const nigora: KitSpec = {
  body: {
    profile: [
      [0, 0.35], [5.01, 0.35, 1], [5.08, 0.39], [5.1, 0.47, 1],
      // drum wall up to the crisp seam, then a shallow shoulder that rolls into the concave bell
      [5.1, 3.39, 1], [4.92, 3.5], [4.5, 3.72], [4.05, 3.95], [3.6, 4.2], [3.0, 5.06], [2.35, 6.1], [1.97, 6.94],
      [1.63, 8.0], [1.33, 9.25], [1.15, 10.4], [1.1, 11.15, 1],
      // two turned rings where the stem enters the bell
      [0.99, 11.2, 1], [1.02, 11.3], [1.02, 11.55], [0.96, 11.63, 1], [0.8, 11.67, 1], [0.8, 12.05], [0.75, 12.14],
      [0.64, 12.2, 1], [0.48, 12.24, 1],
      // stem, then the boss and cap it is fixed to the hat with
      [0.48, 28.15, 1], [0.84, 28.25, 1], [0.86, 28.6, 1], [0.99, 28.65, 1], [0.99, 29.1, 1], [0, 29.1],
    ],
    foot: { r: 4.94, h: 0.35 },
  },
  hat: {
    profile: [
      [1.0, 29.1], [10.65, 29.1, 1], [10.68, 29.0, 1], [10.97, 29.0], [11.0, 29.03, 1],
      // straight bevelled side, a soft roll into the flat top
      [9.9, 30.8], [9.0, 32.2], [8.75, 32.62], [8.4, 32.88], [7.9, 32.98], [7.3, 33.0, 1], [0, 33.0],
    ],
    led: { y: 29.09, rIn: 1.0, rOut: 10.64 },
  },
  light: { kelvin: 2700, lumen: 550, y: 29.09, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default nigora;
