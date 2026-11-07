import type { KitSpec } from ".";

// Height 220 mm from the datasheet, proportions from the one photo: it gives a Ø122 hat over a Ø97 base, so the
// datasheet's Ø110 doesn't fit either. The hat's underside isn't shown; the LED disc is an assumption, a flat plate
// filling the underside up to the rounded rim.
const fuga: KitSpec = {
  body: {
    profile: [
      [0, 0.5], [4.78, 0.5, 1], [4.84, 0.53], [4.85, 0.58, 1],
      // drum with a slight draft; a wide fillet into the straight cone (it reads as a soft band, not a line)
      [4.79, 2.4, 1], [4.785, 2.52], [4.765, 2.62], [4.735, 2.69], [4.7, 2.75, 1],
      [4.25, 3.68], [3.8, 4.61], [3.35, 5.54], [2.9, 6.47], [2.45, 7.39], [2.0, 8.31], [1.55, 9.23], [1.09, 10.17, 1],
      // flush seam groove, then the steeper collar cone and a stepped seam under the stem
      [1.04, 10.185, 1], [1.04, 10.205, 1], [1.065, 10.22, 1],
      [0.955, 10.76], [0.85, 11.27], [0.745, 11.78], [0.64, 12.3, 1],
      [0.57, 12.32, 1], [0.57, 12.35, 1], [0.615, 12.37, 1],
      [0.615, 20.3, 1], [0, 20.3],
    ],
    foot: { r: 4.7, h: 0.5 },
  },
  hat: {
    profile: [
      [0.64, 20.28], [5.92, 20.28, 1], [6.04, 20.31], [6.09, 20.36], [6.1, 20.42],
      // lens-shaped skirt rising to the flat top
      [6.03, 20.56], [5.91, 20.69], [5.71, 20.96], [5.46, 21.23], [5.17, 21.5], [4.88, 21.74],
      [4.68, 21.88], [4.5, 21.96], [4.3, 22, 1], [0, 22],
    ],
    led: { y: 20.27, rIn: 0.7, rOut: 5.8 },
  },
  light: { kelvin: 2700, lumen: 550, y: 20.27, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default fuga;
