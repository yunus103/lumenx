import type { KitSpec } from ".";

// Height 340 mm from the datasheet, proportions from the photos (all seven finishes, one camera) and the datasheet
// drawing, which agree: tube ~Ø35, base ~Ø121, though the drawing labels them 40 and 110 mm. A clear glass tube over a
// white opal candle (Ø30, up to 19.7 cm) standing in the sleeve. Charge port and touch key are underneath
// (datasheet), unseen.
const furud: KitSpec = {
  body: {
    profile: [
      [0, 0.08], [5.28, 0.08, 1], [5.35, 0.11, 1], [5.372, 0.18, 1], [5.375, 0.26, 1],
      [5.375, 1.08, 1],
      // the disc over the plinth: a rounded edge, round below as above, rolling into a shallow cone
      [5.6, 1.08], [5.8, 1.12], [5.93, 1.2], [6.0, 1.32], [6.035, 1.48], [6.04, 1.65], [6.018, 1.819], [5.955, 1.979],
      [5.853, 2.122], [5.717, 2.241], [5.555, 2.33], [5.375, 2.384, 1],
      // a straight cone up to the sleeve: a curved one shows its spline as faint rings in the polish
      [1.8, 3.06, 1],
      // the sleeve, open at the top round the tube
      [1.8, 7.2, 1], [1.77, 7.2, 1], [1.77, 6.8, 1], [0, 6.8],
    ],
    foot: { r: 5.2, h: 0.08 },
  },
  // the white opal candle, standing on the sleeve's floor; a rounded top edge round a slightly dished top
  opal: {
    profile: [
      [0, 6.85], [1.5, 6.85, 1], [1.5, 19.58, 1], [1.495, 19.65], [1.47, 19.69], [1.43, 19.7, 1],
      [1.2, 19.65], [0.6, 19.57], [0, 19.55],
    ],
    transmission: 0.012,
  },
  // the clear tube, from inside the sleeve up to 34 cm with its rounded rim
  glass: { profile: [[1.76, 6.9], [1.76, 33.925]], thickness: 0.15 },
  // low in the candle: the photos show its lower part warm, as if lit from below
  light: { kelvin: 2700, lumen: 550, y: 10, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default furud;
