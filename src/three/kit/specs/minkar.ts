import type { KitSpec } from ".";

// Height 140 mm and Ø100 from the datasheet; proportions from the photos (all five finishes, Ø101 at 140 mm). A
// metal drum under a light grey dome, the same in every finish photo: a frosted opal diffuser (top-level `opal`),
// the lamp's only light-giving part. A fine groove near the bottom and a rounded bottom edge; a small indicator dot on
// the front at the bottom. Touch key and charge port are underneath (datasheet), unseen.
const minkar: KitSpec = {
  body: {
    profile: [
      [0, 0.1], [4.92, 0.1, 1], [4.99, 0.12], [5.04, 0.16], [5.065, 0.21], [5.07, 0.27, 1],
      // the fine groove near the bottom
      [5.07, 0.53, 1], [5.045, 0.55, 1], [5.045, 0.59, 1], [5.07, 0.61, 1],
      [5.07, 1.4], [5.07, 2.2], [5.07, 3.0], [5.07, 3.72, 1],
      // the drum's rim rolls in under the dome
      [5.06, 3.8], [5.03, 3.86], [4.98, 3.9, 1], [0, 3.9],
    ],
    foot: { r: 4.9, h: 0.1 },
  },
  // the satin light grey opal dome, standing in the drum's rim: a V seam where the two meet, a straight wall, a superellipse top (n 3.6)
  opal: {
    profile: [
      [0, 3.86], [4.96, 3.86, 1], [5.02, 3.9], [5.06, 3.97], [5.08, 4.04],
      [5.085, 4.1], [5.085, 4.402], [5.085, 4.705], [5.085, 5.007], [5.085, 5.31], [5.085, 5.612], [5.085, 5.914],
      [5.085, 6.217], [5.085, 6.519], [5.085, 6.822], [5.085, 7.124], [5.085, 7.426], [5.085, 7.729], [5.085, 8.031],
      [5.085, 8.334], [5.085, 8.636], [5.085, 8.938], [5.085, 9.241], [5.084, 9.543], [5.081, 9.846], [5.075, 10.148],
      [5.064, 10.45], [5.045, 10.752], [5.017, 11.053], [4.977, 11.353], [4.921, 11.65], [4.845, 11.943],
      [4.747, 12.229], [4.622, 12.504], [4.468, 12.764], [4.283, 13.003], [4.069, 13.216], [3.829, 13.399],
      [3.568, 13.552], [3.292, 13.675], [3.006, 13.772], [2.712, 13.845], [2.415, 13.899], [2.115, 13.938],
      [1.814, 13.965], [1.512, 13.982], [1.21, 13.992], [0.907, 13.997], [0.605, 13.999], [0.302, 14], [0, 14],
    ],
    transmission: 0.012,
    rough: 0.5,
    tint: "#b5b5b3",
  },
  details: [{ type: "button", y: 0.3, x: 0, side: "front", r: 0.08, ring: "krom" }],
  light: { kelvin: 2700, lumen: 550, y: 7, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default minkar;
