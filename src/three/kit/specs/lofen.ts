import type { KitSpec } from ".";

// Height 270 mm from the datasheet, proportions from the main (copper) photo: hat Ø156 (the datasheet's 200 mm is a
// template value; its own drawing is 0.5 hats wide per height), base disc Ø99 (the datasheet's "100mm Alt") over a
// Ø81 drum. Two-tone as the main and lifestyle photos show: the hat, the base disc and the finial take the finish;
// the drum, the stem with its flared neck and collar, and the bowl under the hat are black, and the hat's underside
// is white (a sliver of it shows between the rim and the bowl). The light is assumed to come from an LED hidden in the
// bowl's top, lighting the white underside (`inside`); there is no night photo. The underside is hidden, drawn as a
// 2 mm shell under the top. Charge port and touch key are underneath, unseen.
const lofen: KitSpec = {
  body: {
    profile: [
      [0, 0.25], [3.98, 0.25, 1], [4.04, 0.29], [4.06, 0.36, 1],
      // black drum, then a 0.1 mm step so the drum's zone ends below the disc's underside
      [4.06, 2.59, 1], [4.06, 2.6, 1],
      // the disc: flat underside, a rounded edge, the flat top out to the neck
      [4.86, 2.6, 1], [4.92, 2.62], [4.95, 2.67], [4.95, 2.78], [4.92, 2.83], [4.86, 2.85, 1],
      [1.12, 2.85, 1], [1.12, 2.86, 1],
      // the neck: a rounded bead on the disc, flaring up into the stem
      [1.17, 2.89], [1.19, 2.95], [1.15, 3.04], [1.02, 3.11], [0.9, 3.19], [0.79, 3.3], [0.69, 3.44], [0.61, 3.58],
      [0.55, 3.72], [0.51, 3.86], [0.5, 4.0, 1],
      [0.5, 21.44, 1],
      // collar, then the bowl, its top flat in to the post that carries the hat
      [0.6, 21.46], [0.62, 21.53], [0.6, 21.6, 1],
      [0.7, 21.66], [1.04, 21.8], [1.38, 21.93], [1.73, 22.12], [2.07, 22.36], [2.42, 22.7], [2.68, 23.06], [2.79, 23.3],
      [2.81, 23.47, 1],
      [0.5, 23.47, 1], [0.5, 26.195, 1], [0, 26.195],
    ],
    foot: { r: 4.0, h: 0.25 },
    fixed: [
      { from: 0, to: 2.59, finish: "siyah" },
      { from: 2.86, to: 26.195, finish: "siyah" },
    ],
  },
  hat: {
    profile: [
      // white underside, out to the rim
      [0.5, 26.195], [1.158, 26.116], [1.816, 26.027], [2.475, 25.92], [3.133, 25.785], [3.791, 25.615], [4.449, 25.405],
      [5.107, 25.148], [5.765, 24.841], [6.424, 24.479], [7.082, 24.07], [7.74, 23.66, 1],
      // the rim's rounded edge
      [7.81, 23.64], [7.85, 23.67], [7.83, 23.718, 1],
      // the domed top, then the finial
      [7.193, 24.186], [6.555, 24.6], [5.918, 24.962], [5.281, 25.272], [4.644, 25.534], [4.006, 25.751], [3.369, 25.928],
      [2.732, 26.071], [2.095, 26.185], [1.457, 26.277], [0.82, 26.357, 1],
      [0.82, 26.55], [0.78, 26.72], [0.65, 26.88], [0.4, 26.97], [0, 27],
    ],
    led: { y: 24.0, rIn: 3.0, rOut: 7.0 },
    inside: { from: 23.66, to: 26.195, finish: "beyaz" },
  },
  light: { kelvin: 2700, lumen: 550, y: 23.9, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default lofen;
