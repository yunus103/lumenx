import type { KitSpec } from ".";

// Height 390 mm from the datasheet, proportions from the black studio photo, which shows the base's top and the hat's
// top from about 47.5 cm up (both ellipses agree on that camera). Base Ø121 over Ø101 (the datasheet's Ø120 and
// "Alt 100mm"), 3 cm high; the 61 mm finial as the datasheet's 60. The hat measures Ø215 with a Ø130 top where the
// datasheet says Ø200 and Ø120 (the same 0.6 ratio), 5.35 cm high where it says 60 mm. The finial is visible down to
// the top's front edge, so the top is a shallow dish (also drawn so on the datasheet). The datasheet's night photo
// shows the underside: a cream interior out to a thin rim round a black lens-shaped LED housing (0.55 of the rim's
// width) hanging ~1.4 cm below it; the interior is the hat's flat underside ring painted `beyaz` (`inside`), lit by the
// LED hidden in the housing's edge, as the photo shows no glowing disc.
// Charge port and touch key are underneath, unseen.
const bella: KitSpec = {
  body: {
    profile: [
      [0, 0.4], [5.03, 0.4, 1], [5.06, 0.43], [5.07, 0.48, 1], [5.191, 0.754], [5.312, 1.028], [5.434, 1.301], [5.555, 1.575],
      [5.676, 1.849], [5.798, 2.123], [5.919, 2.396], [6.04, 2.67], [6.07, 2.77], [6.07, 2.85], [6.03, 2.92], [5.96, 2.96],
      [5.86, 2.97, 1], [1.02, 2.97, 1], [1.02, 3.14], [1, 3.21], [0.95, 3.26], [0.87, 3.28, 1], [0.64, 3.28, 1], [0.64, 26.75, 1],
      [0, 26.75],
    ],
    foot: { r: 5.05, h: 0.4, rBottom: 4.95, round: 0.12 },
  },
  hat: {
    profile: [
      [0.64, 26.168], [1.285, 26.221], [1.93, 26.311], [2.575, 26.439], [3.22, 26.605], [3.865, 26.811], [4.51, 27.06], [5.155, 27.355],
      [5.8, 27.7, 1], [10.55, 27.7, 1], [10.61, 27.55, 1], [10.67, 27.535], [10.715, 27.56], [10.73, 27.61, 1], [10.456, 27.951], [10.181, 28.293],
      [9.907, 28.634], [9.633, 28.975], [9.358, 29.317], [9.084, 29.658], [8.81, 29.999], [8.535, 30.341], [8.261, 30.682], [7.987, 31.023],
      [7.712, 31.365], [7.438, 31.706], [7.164, 32.047], [6.889, 32.389], [6.615, 32.73], [6.51, 32.83], [6.45, 32.88], [6.36, 32.9],
      [5.644, 32.825], [4.928, 32.75], [4.211, 32.675], [3.495, 32.6], [2.779, 32.525], [2.062, 32.45], [1.346, 32.375], [0.63, 32.3, 1],
      [0.597, 32.833], [0.563, 33.367], [0.53, 33.9], [0.497, 34.433], [0.463, 34.967], [0.43, 35.5], [0.397, 36.033], [0.363, 36.567],
      [0.33, 37.1], [0.297, 37.633], [0.263, 38.167], [0.23, 38.7], [0.207, 38.83], [0.16, 38.915], [0.104, 38.967], [0.05, 38.993],
      [0, 39],
    ],
    led: { y: 27.69, rIn: 5.82, rOut: 10.54 },
    inside: { from: 27.7, to: 27.7, finish: "beyaz" },
  },
  light: { kelvin: 2700, lumen: 550, y: 27.69, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default bella;
