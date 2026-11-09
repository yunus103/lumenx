import type { KitSpec } from ".";

// Height 255 mm from the datasheet (top of the finial), proportions from the one photo (glossy red paint): a Ø114 hat
// where the datasheet says 120, a Ø97 base as its "100mm Alt". The base is a drum with a seam where the domed top
// starts, which runs into a trumpet neck and a short collar under the thin stem. The hat is a spun dome with a ball
// finial; its underside isn't in the photo, so the LED plate is recessed 3 mm as Heli's. Charge port and touch key
// are underneath, unseen.
const mira: KitSpec = {
  body: {
    profile: [
      [0, 0.3], [4.6, 0.3, 1], [4.71, 0.35], [4.765, 0.45],
      // drum wall with a slight draft, up to the seam
      [4.775, 0.8], [4.77, 1.3], [4.763, 1.8], [4.755, 2.3], [4.745, 2.88, 1], [4.71, 2.93, 1], [4.725, 2.97, 1],
      // the domed top rolling into the trumpet neck
      [4.675, 3.08], [4.59, 3.2], [4.47, 3.34], [4.31, 3.48], [4.12, 3.62], [3.91, 3.75], [3.67, 3.87], [3.42, 3.98],
      [3.16, 4.08], [2.9, 4.17], [2.63, 4.25], [2.37, 4.33], [2.12, 4.41], [1.9, 4.5], [1.73, 4.6], [1.61, 4.73],
      [1.52, 4.88], [1.41, 5.05], [1.29, 5.23], [1.18, 5.42], [1.07, 5.62], [0.97, 5.83], [0.88, 6.04], [0.81, 6.24],
      [0.755, 6.44], [0.72, 6.6], [0.705, 6.68, 1],
      // the collar, its top rounding into the stem
      [0.63, 6.69, 1], [0.635, 6.74], [0.635, 6.95], [0.6, 7.04], [0.54, 7.09], [0.47, 7.115], [0.42, 7.12, 1],
      // straight stem, running up into the hat
      [0.42, 9.0], [0.42, 11.0], [0.42, 13.0], [0.42, 15.0], [0.42, 17.0], [0.42, 19.0], [0.42, 20.6, 1], [0, 20.6],
    ],
    foot: { r: 4.56, h: 0.3 },
  },
  hat: {
    profile: [
      // LED plate 3 mm up, a short inner wall down to the thin rim
      [0.42, 20.6], [5.5, 20.6, 1], [5.54, 20.3, 1], [5.6, 20.3], [5.65, 20.33], [5.675, 20.42],
      // dome (a superellipse fitted to the photo), points evenly along the arc
      [5.63, 20.602], [5.55, 20.899], [5.455, 21.188], [5.35, 21.47], [5.237, 21.743], [5.085, 22.007],
      [4.918, 22.261], [4.736, 22.505], [4.54, 22.738], [4.332, 22.959], [4.111, 23.169], [3.879, 23.366],
      [3.637, 23.549], [3.384, 23.719], [3.123, 23.875], [2.853, 24.016], [2.576, 24.143], [2.293, 24.254],
      [2.004, 24.35], [1.711, 24.43], [1.414, 24.496], [1.114, 24.547], [0.812, 24.584], [0.509, 24.607, 1],
      // ball finial
      [0.57, 24.68], [0.62, 24.76], [0.65, 24.85], [0.667, 24.95], [0.665, 25.05], [0.64, 25.15], [0.59, 25.25],
      [0.51, 25.34], [0.4, 25.42], [0.22, 25.48], [0, 25.5],
    ],
    led: { y: 20.59, rIn: 0.45, rOut: 5.48 },
  },
  light: { kelvin: 2700, lumen: 550, y: 20.59, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default mira;
