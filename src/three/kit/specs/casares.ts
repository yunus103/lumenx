import type { KitSpec } from ".";

// The Premium Casares (Light Design's Premium photos and the restaurant photos), not the rounder Ekonomik one in some
// of the shop's variant photos. Height 300 mm from the datasheet, proportions from the krom photo: a Ø133 hat, as the
// datasheet's Ø130, over a Ø109 base. The base top is flat and polished: what looks like a cone under the stem's foot
// is its mirror image (plain in the gold photo). The knurled grip on the lower stem is drawn smooth. The hat's
// underside isn't shown: a flat plate with the LED ring, as Vita's. Charge port and touch key are underneath, unseen;
// the ring on the hat's top is drawn as a fine groove.
const casares: KitSpec = {
  body: {
    profile: [
      [0, 1.05], [5.22, 1.05, 1], [5.33, 1.08], [5.4, 1.14], [5.43, 1.24, 1],
      // two drum bands split by a seam groove (its points are corners: a run this short would be smoothed away)
      [5.43, 2.22, 1], [5.35, 2.27, 1], [5.35, 2.31, 1], [5.43, 2.36, 1],
      [5.43, 3.36, 1], [5.41, 3.42], [5.36, 3.44, 1],
      // the stem's conical foot, standing on a short lip
      [1.36, 3.44, 1], [1.37, 3.5, 1], [1.25, 3.75], [1.12, 4], [0.99, 4.25], [0.87, 4.5], [0.77, 4.75], [0.69, 5],
      [0.655, 5.2], [0.65, 5.35, 1],
      // stem with seams at the grip's top and at the trumpet's foot, then the trumpet into the hat
      [0.65, 15.2, 1], [0.62, 15.23, 1], [0.62, 15.27, 1], [0.65, 15.3, 1],
      [0.65, 25.36, 1], [0.62, 25.39, 1], [0.62, 25.43, 1], [0.66, 25.46, 1],
      [0.675, 25.7], [0.69, 25.95], [0.705, 26.2], [0.74, 26.45], [0.785, 26.7], [0.85, 26.95], [0.92, 27.2],
      [1.01, 27.45], [1.11, 27.7], [1.19, 27.92], [1.27, 28.12], [1.38, 28.3], [1.45, 28.4, 1], [0, 28.4],
    ],
    foot: { r: 4.95, h: 1.05 },
  },
  hat: {
    profile: [
      // flat LED plate, an inverted frustum, a thin ledge, then the rim band of the flat top plate
      [1.45, 28.38], [5.84, 28.38, 1], [6.38, 29.2, 1], [6.6, 29.23, 1], [6.63, 29.28], [6.63, 29.34, 1],
      [6.63, 29.93, 1], [6.61, 29.98], [6.56, 30, 1],
      // the touch key's ring
      [2.06, 30, 1], [2.03, 29.97, 1], [1.97, 29.97, 1], [1.94, 30, 1], [0, 30],
    ],
    led: { y: 28.37, rIn: 1.5, rOut: 5.55 },
  },
  light: { kelvin: 2700, lumen: 550, y: 28.37, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default casares;
