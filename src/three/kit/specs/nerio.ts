import type { KitSpec } from ".";

// Height 250 mm from the datasheet, proportions from the bronz photo: a Ø81 hat over a Ø95 base (the datasheet says
// Ø90; at 250 mm the photo's base comes out 5% wider). Casares' smaller sibling: a two-band drum split by a seam,
// a conical stem foot on a lip, a diamond-knurled grip from the foot to mid-stem, a seam at the trumpet's foot, and
// a hat with a rim band over a short inverted frustum. The base top is polished flat: the "bulb" under the stem foot
// in the rose photo is its mirror image. The hat's underside isn't shown: a flat plate with the LED ring, as Casares'.
const nerio: KitSpec = {
  body: {
    profile: [
      [0, 1.2], [4.56, 1.2, 1], [4.66, 1.24], [4.72, 1.32], [4.73, 1.42, 1],
      // lower band, a fine bright ledge, then the seam groove under the lid band
      [4.73, 1.84, 1], [4.71, 1.87, 1],
      [4.71, 2.9, 1], [4.66, 2.93, 1], [4.66, 2.97, 1], [4.73, 3, 1],
      [4.73, 3.3, 1], [4.71, 3.42], [4.65, 3.48], [4.56, 3.5, 1],
      // the stem's conical foot on a short lip
      [1.4, 3.5, 1], [1.38, 3.56, 1], [1.22, 3.64], [1.06, 3.74], [0.93, 3.86], [0.83, 4], [0.75, 4.17], [0.69, 4.35],
      [0.64, 4.55], [0.61, 4.72], [0.6, 4.85, 1],
      // stem: the grip, plain stem, a seam at the trumpet's foot, the trumpet into the hat
      [0.6, 13.43, 1], [0.6, 14.4], [0.6, 15.4], [0.6, 16.4], [0.6, 17.4], [0.6, 18.4], [0.6, 19.4], [0.6, 20.4],
      [0.6, 20.86, 1], [0.58, 20.88, 1], [0.58, 20.92, 1], [0.61, 20.94, 1],
      [0.625, 21.15], [0.645, 21.35], [0.67, 21.6], [0.71, 21.85], [0.755, 22.08], [0.81, 22.3], [0.875, 22.52],
      [0.945, 22.72], [1.015, 22.9], [1.09, 23.06], [1.165, 23.2], [1.24, 23.32], [1.3, 23.42], [1.36, 23.47, 1],
      [0, 23.47],
    ],
    foot: { r: 4.15, h: 1.2, rBottom: 4.08, round: 0.4 },
    knurl: { from: 4.85, to: 13.43, pitch: 0.15, angle: 30, cross: 0.8 },
  },
  hat: {
    profile: [
      // flat LED plate, the inverted frustum, a thin ledge, then the rim band and the flat top
      [1.36, 23.45], [3.42, 23.45, 1], [3.5, 23.5, 1], [3.88, 24.2, 1], [4.05, 24.22, 1], [4.07, 24.26, 1],
      [4.07, 24.93, 1], [4.05, 24.985], [4.0, 25, 1], [0, 25],
    ],
    led: { y: 23.44, rIn: 1.45, rOut: 3.35 },
  },
  light: { kelvin: 2700, lumen: 550, y: 23.44, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default nerio;
