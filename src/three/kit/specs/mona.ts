import type { KitSpec } from ".";

// Height 210 mm from the datasheet, proportions from the one photo (the sheet's "100mm Alt" is the template value;
// the photo gives a Ø96 base and hat). A straight cone that stands up into a short, near-vertical drum over a
// rounded bottom edge on a black rubber foot ring, under a plain drum hat with a soft top edge. The hat's underside
// is unseen: recess and LED disc copied from Agena. Charge port and touch key are unseen.
const mona: KitSpec = {
  body: {
    profile: [
      [0, 0.4], [4.5, 0.4, 1], [4.62, 0.43], [4.72, 0.5], [4.78, 0.62], [4.8, 0.8],
      // the drum bends over ~2 cm into the straight cone; points every cm keep the spline from folding
      [4.8, 1.0], [4.775, 1.5], [4.705, 2.0], [4.63, 2.5], [4.54, 3.0], [4.443, 3.5],
      [4.229, 4.5], [4.014, 5.5], [3.8, 6.5], [3.586, 7.5], [3.371, 8.5], [3.157, 9.5], [2.943, 10.5],
      [2.729, 11.5], [2.514, 12.5], [2.3, 13.5], [2.086, 14.5], [1.871, 15.5], [1.657, 16.5],
      [1.49, 17.28, 1], [0, 17.28],
    ],
    foot: { r: 4.55, h: 0.4 },
  },
  hat: {
    profile: [
      [1.45, 17.25], [4.4, 17.25, 1], [4.43, 17.05, 1], [4.72, 17.05, 1], [4.76, 17.07], [4.77, 17.11, 1],
      [4.77, 20.7, 1], [4.75, 20.87], [4.68, 20.97], [4.56, 21, 1], [0, 21],
    ],
    led: { y: 17.24, rIn: 1.5, rOut: 4.38 },
  },
  light: { kelvin: 2700, lumen: 550, y: 17.24, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default mona;
