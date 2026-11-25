import type { KitSpec } from ".";

// Height 225 mm from the 2027 catalogue and the gallery's dimension photo, proportions from the studio photos: they
// give the catalogue's Ø70 body, the photo's Ø35 collar plate and 9 mm stem, and a Ø85 hat (the dimension photo
// labels it 80, the catalogue 60). The metal (collar plate, bushing, stem, cap, hat) is black whatever the wood, so it
// is a fixed `siyah`. No photo shows a button or a charge port: only the felt pad underneath.
const mina: KitSpec = {
  body: {
    grain: { pith: [-2.7, 4.4, 1.9], dir: [0, 1, 0.02], ring: 0.2, contrast: 0.46 },
    profile: [
      [0, 0.1], [1.95, 0.1], [2.04, 0.13], [2.12, 0.2], [2.21, 0.33], [2.32, 0.51], [2.45, 0.72], [2.6, 0.93],
      [2.71, 1.12], [2.9, 1.47], [3.07, 1.84], [3.21, 2.23], [3.31, 2.64], [3.39, 3.06], [3.44, 3.47], [3.46, 3.89],
      [3.45, 4.31], [3.42, 4.73], [3.36, 5.15], [3.28, 5.56], [3.18, 5.97], [3.05, 6.37], [2.91, 6.77], [2.76, 7.16],
      [2.61, 7.55], [2.47, 7.95], [2.33, 8.34], [2.2, 8.74], [2.09, 9.15], [1.99, 9.56], [1.9, 9.97], [1.83, 10.38],
      [1.78, 10.8], [1.74, 11.22], [1.71, 11.64], [1.7, 12.06], [1.69, 12.48], [1.68, 12.9], [1.66, 12.97, 1],
      // black: the rounded collar plate over the wood, the round bushing, the stem, the cap under the hat
      [1.72, 12.99], [1.76, 13.05], [1.77, 13.13], [1.75, 13.24], [1.69, 13.31], [1.58, 13.36], [1.45, 13.38, 1],
      [0.66, 13.38, 1], [0.72, 13.41], [0.75, 13.5], [0.75, 13.66], [0.72, 13.76], [0.64, 13.82], [0.55, 13.84, 1],
      [0.45, 13.84, 1], [0.45, 19.88, 1], [0.6, 19.89], [0.7, 19.93], [0.76, 20.0], [0.77, 20.08], [0.77, 20.27, 1], [0, 20.27],
    ],
    foot: { r: 1.95, h: 0.1, rBottom: 1.8 },
    fixed: [{ from: 12.97, to: 20.27, finish: "siyah" }],
  },
  hat: {
    profile: [
      // a ring closing the sleeve, hidden inside the cap
      [0.4, 20.1], [0.79, 20.1, 1],
      // the LED plate recessed inside a thin rim, the straight cone narrowing up to a softened top edge
      [0.79, 20.36, 1], [3.98, 20.36, 1], [3.98, 20.27, 1], [4.3, 20.27, 1],
      [3.65, 22.38, 1], [3.6, 22.46], [3.52, 22.5, 1], [0, 22.5],
    ],
    // the lit studio photo shows the stem lit under the hat
    led: { y: 20.35, rIn: 0.8, rOut: 3.96, wash: { metal: 0 } },
    fixed: [{ from: 20.1, to: 22.5, finish: "siyah" }],
  },
  light: { kelvin: 2700, lumen: 550, y: 20.35, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default mina;
