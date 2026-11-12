import type { KitSpec } from ".";

// Height 250 mm from the datasheet (top of the finial), proportions from the photos: Ø100 base as the datasheet says,
// a Ø127 hat where the datasheet says 130. The bronze, rose and chrome photos show the hat's underside: a thin rim,
// a short inner wall and an LED disc ~3 mm up, with a collar where the stem meets it. Charge port and touch key are
// underneath, unseen.
const evora: KitSpec = {
  body: {
    profile: [
      [0, 0.5], [4.82, 0.5, 1], [4.9, 0.53], [4.93, 0.6],
      // a drum with a slight draft, flaring into a rolled lip
      [4.94, 0.85], [4.96, 1.2], [4.98, 1.4], [5.005, 1.6], [5.05, 1.8], [5.11, 1.96], [5.18, 2.08], [5.24, 2.16],
      [5.28, 2.21], [5.29, 2.25], [5.26, 2.29], [5.18, 2.31, 1],
      // the shallow top face rising into the trumpet stem
      [4.4, 2.32], [3.7, 2.34], [3.15, 2.4], [2.72, 2.5], [2.38, 2.64], [2.14, 2.82], [1.94, 3.02], [1.76, 3.25],
      [1.59, 3.5], [1.43, 3.77], [1.33, 4.05], [1.21, 4.35], [1.09, 4.85], [0.98, 5.4],
      // an hourglass stem, slimmest at 10 cm
      [0.89, 6.0], [0.81, 6.6], [0.745, 7.2], [0.69, 7.8], [0.655, 8.4], [0.632, 9.0], [0.625, 9.6], [0.615, 10.2],
      [0.618, 10.8], [0.628, 11.4], [0.645, 12.0], [0.668, 12.6], [0.695, 13.2], [0.727, 13.8], [0.765, 14.4],
      [0.808, 15.0], [0.852, 15.6], [0.895, 16.2], [0.92, 16.6, 1],
      // the collar under the LED disc
      [1.02, 16.62, 1], [1.02, 16.99, 1], [0, 16.99],
    ],
    foot: { r: 4.8, h: 0.5 },
  },
  hat: {
    profile: [
      // LED disc, a short inner wall down to the thin rim, a short skirt
      [1.0, 17.0], [6.12, 17.0, 1], [6.2, 16.72, 1], [6.28, 16.7], [6.32, 16.74], [6.34, 16.82, 1],
      [6.33, 17.0], [6.33, 17.25],
      // a half ellipsoid dome (Ø127, 6.8 cm high)
      [6.31, 17.71], [6.26, 18.17], [6.195, 18.62], [6.095, 19.08], [5.97, 19.51], [5.82, 19.95], [5.65, 20.37],
      [5.44, 20.78], [5.2, 21.17], [4.93, 21.54], [4.64, 21.9], [4.32, 22.24], [3.98, 22.55], [3.62, 22.84],
      [3.25, 23.1], [2.85, 23.33], [2.43, 23.53], [2.01, 23.7], [1.57, 23.84], [1.12, 23.94], [0.66, 24.01, 1],
      // the finial, chrome on the beyaz, bronz, krom, saten and turuncu photos (the gold photo's looks gold)
      [0.69, 24.12], [0.7, 24.3], [0.69, 24.5], [0.65, 24.68], [0.56, 24.84], [0.4, 24.95], [0.2, 24.99], [0, 25],
    ],
    led: { y: 16.99, rIn: 1.05, rOut: 6.1 },
    fixed: [{ from: 24.01, to: 25, finish: "krom" }],
  },
  light: { kelvin: 2700, lumen: 550, y: 16.99, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default evora;
