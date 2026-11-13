import type { KitSpec } from ".";

// Height 300 mm and the Ø100 base from the datasheet, proportions from the one photo (its 45 mm hat fits the photo's
// Ø43-44). A drum whose low domed top rounds into a trumpet flaring into a very thin stem with a bead at each end, and a
// small straight cone hat over an LED ring around a short hub. Black foot ring under the drum.
const geminga: KitSpec = {
  body: {
    profile: [
      [0, 0.3], [4.86, 0.3, 1], [4.9, 0.35], [4.92, 0.46, 1],
      // the wall, a small round over its top edge, then one smooth curve: a low convex dome turning into the
      // trumpet without a crease; spaced evenly (closer round the edge) so the spline can't fold
      [4.92, 0.658], [4.92, 0.857], [4.92, 1.055], [4.92, 1.253], [4.92, 1.452], [4.92, 1.65], [4.92, 1.849],
      [4.92, 2.047], [4.92, 2.245], [4.92, 2.441], [4.92, 2.586], [4.92, 2.697], [4.919, 2.8], [4.901, 2.901],
      [4.853, 2.992], [4.782, 3.066], [4.701, 3.131], [4.607, 3.198], [4.471, 3.284], [4.295, 3.376], [4.114, 3.457],
      [3.928, 3.526], [3.739, 3.586], [3.548, 3.639], [3.355, 3.687], [3.162, 3.73], [2.968, 3.771], [2.773, 3.811],
      [2.58, 3.854], [2.389, 3.909], [2.205, 3.982], [2.031, 4.076], [1.87, 4.192], [1.725, 4.328], [1.597, 4.479],
      [1.483, 4.641], [1.379, 4.81], [1.282, 4.983], [1.193, 5.16], [1.112, 5.341], [1.037, 5.525], [0.969, 5.711],
      [0.907, 5.9], [0.851, 6.09], [0.799, 6.281], [0.751, 6.474], [0.705, 6.667], [0.66, 6.86, 1],
      [0.69, 6.9], [0.72, 7.02], [0.7, 7.15], [0.6, 7.22, 1], [0.43, 7.26, 1],
      // the stem thickens slightly upwards, into a bead under the hat's hub
      [0.465, 27.12, 1], [0.62, 27.15], [0.72, 27.23], [0.76, 27.35], [0.72, 27.48], [0.62, 27.55, 1], [0, 27.55],
    ],
    foot: { r: 4.7, h: 0.3 },
  },
  hat: {
    // a hub disc under the LED ring (the white band the photo shows under the rim), a thin rim, then a straight cone
    // to a rounded tip
    profile: [
      [0.58, 27.55], [0.83, 27.55, 1], [0.86, 27.58], [0.86, 27.7, 1], [2.1, 27.7, 1], [2.12, 27.67, 1], [2.16, 27.66],
      [2.19, 27.7, 1], [2.19, 27.82, 1], [0.24, 29.85, 1], [0.12, 29.96], [0, 30],
    ],
    led: { y: 27.69, rIn: 0.9, rOut: 2.08 },
  },
  light: { kelvin: 2700, lumen: 550, y: 27.69, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default geminga;
