import type { KitSpec } from ".";

// Height 250 mm from the datasheet; its Ø150 hat and Ø100 base fit the one photo (Ø152 and Ø97 at that height).
// A short drum on a black rubber foot bends into a straight cone that runs up into a flat-bottomed drum hat with a
// broad rounded shoulder and a slightly domed top. The hat's underside is unseen: the recessed LED disc inside a rim
// is copied from Agena. Charge port and touch key are underneath, unseen.
const orben: KitSpec = {
  body: {
    profile: [
      [0, 0.45], [4.8, 0.45, 1], [4.84, 0.48], [4.85, 0.56],
      // drum, bending over ~1.7 cm into the straight cone (evenly spaced points so it can't fold)
      [4.85, 0.9], [4.85, 1.3], [4.83, 1.7], [4.79, 2.1], [4.72, 2.5], [4.645, 2.9],
      [4.559, 3.4], [4.476, 3.8], [4.392, 4.2], [4.309, 4.6], [4.225, 5.0], [4.141, 5.4], [4.058, 5.8], [3.974, 6.2],
      [3.891, 6.6], [3.807, 7.0], [3.723, 7.4], [3.64, 7.8], [3.556, 8.2], [3.473, 8.6], [3.389, 9.0], [3.305, 9.4],
      [3.222, 9.8], [3.138, 10.2], [3.055, 10.6], [2.971, 11.0], [2.887, 11.4], [2.804, 11.8], [2.72, 12.2],
      [2.637, 12.6], [2.553, 13.0], [2.469, 13.4], [2.386, 13.8], [2.302, 14.2], [2.219, 14.6], [2.135, 15.0],
      [2.051, 15.4], [1.968, 15.8], [1.884, 16.2], [1.801, 16.6], [1.76, 16.8], [1.73, 17.02, 1], [0, 17.02],
    ],
    foot: { r: 4.8, h: 0.45 },
  },
  hat: {
    profile: [
      [1.75, 17.0], [6.9, 17.0, 1], [6.93, 16.83, 1], [7.45, 16.8, 1], [7.55, 16.82], [7.58, 16.9, 1],
      [7.58, 17.3], [7.58, 17.68], [7.58, 18.05], [7.58, 18.43], [7.58, 18.8], [7.58, 19.18], [7.58, 19.55],
      [7.58, 19.93], [7.58, 20.3], [7.58, 20.68], [7.58, 21.05], [7.58, 21.43], [7.58, 21.8],
      // broad shoulder, flatter than a quarter circle, into the slightly domed top
      [7.58, 22.1], [7.56, 22.45], [7.49, 22.75], [7.37, 23.05], [7.2, 23.35], [6.97, 23.65], [6.66, 23.95],
      [6.24, 24.22], [5.75, 24.45], [5.2, 24.65], [4.6, 24.78], [3.9, 24.87], [3.1, 24.93], [2.3, 24.97],
      [1.5, 24.99], [0.7, 25], [0, 25],
    ],
    led: { y: 16.99, rIn: 1.8, rOut: 6.85 },
  },
  light: { kelvin: 2700, lumen: 550, y: 16.99, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default orben;
