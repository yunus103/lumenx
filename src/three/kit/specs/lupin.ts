import type { KitSpec } from ".";

// Height 265 mm from the gallery's dimension photo (no datasheet), proportions from the walnut studio photo, which the
// beech one matches. The same photo labels the hat Ø180 x 65 mm, the cone 200 mm and its base Ø65, but at 265 mm high
// both studio photos and the labelled photo's own drawing measure the hat ~Ø195 x 74 mm, the cone ~191 mm and the base
// ~Ø90 (as Alba's labelled base, these labels don't fit the photos).
// A turned cone (slightly concave) on a thin black rubber foot, a solid wooden dome hat with a rounded rim and a flat
// underside lit edge to edge at night (hidden in every photo: copied from Alba), and a flat brass touch key on top.
const lupin: KitSpec = {
  body: {
    // one block for body and hat, as Alba: a vertical pith far behind gives near-straight streaks up the cone with a few
    // long arches, and wide flat arcs across the front of the dome as on the walnut photo
    grain: { pith: [0.3, 12, -20], dir: [0.02, 1, 0], ring: 0.24, contrast: 0.45 },
    profile: [
      [0, 0.15], [4.22, 0.15, 1], [4.36, 0.17], [4.46, 0.23], [4.51, 0.32], [4.53, 0.45], [4.49, 0.7],
      // the cone, evenly spaced points
      [4.45, 1], [4.32, 2], [4.19, 3], [4.06, 4], [3.93, 5], [3.8, 6], [3.67, 7], [3.53, 8], [3.39, 9], [3.26, 10],
      [3.12, 11], [2.98, 12], [2.84, 13], [2.7, 14], [2.56, 15], [2.41, 16], [2.27, 17], [2.12, 18],
      [2.04, 18.6], [1.98, 19.15, 1], [0, 19.15],
    ],
    foot: { r: 4.2, h: 0.15 },
  },
  hat: {
    profile: [
      // the flat underside (the LED disc), rounding into the rim
      [1.6, 19.15], [8.7, 19.15, 1], [9.05, 19.2], [9.32, 19.3], [9.52, 19.42], [9.64, 19.55], [9.71, 19.68],
      // the dome, a superellipse (exponent 2.25) centred at y 18.8, evenly spaced along the arc
      [9.73, 19.8], [9.62, 20.27], [9.49, 20.78], [9.34, 21.29], [9.16, 21.78], [8.96, 22.25], [8.71, 22.71],
      [8.43, 23.14], [8.12, 23.54], [7.78, 23.92], [7.39, 24.27], [6.98, 24.59], [6.54, 24.88], [6.09, 25.15],
      [5.62, 25.39], [5.14, 25.6], [4.65, 25.78], [4.15, 25.94], [3.64, 26.07], [3.13, 26.18], [2.61, 26.27],
      [2.09, 26.34], [1.57, 26.39], [1.3, 26.41, 1],
      // the flat brass touch key (Ø26 from the top-down photo), a little proud of the wood
      [1.3, 26.46], [1.28, 26.49], [1.24, 26.5], [0, 26.5],
    ],
    // the night photos light the top of the cone under the hat
    led: { y: 19.14, rIn: 2.05, rOut: 8.9, wash: { metal: 0.15, wood: 3 } },
    fixed: [{ from: 26.41, to: 26.6, finish: "gold" }],
  },
  // the photos' stain (lacquered dark red-brown wood), not the ceviz calibrated on Defne
  woodTone: { ceviz: { early: "#9b5225", late: "#612a0e", rough: 0.45, clearcoat: 0.35, coatRough: 0.2, contrast: 1.4 } },
  light: { kelvin: 2700, lumen: 550, y: 19.14, dimmer: [0.4, 0.7, 1], body: 0.012, bounce: 200 },
};

export default lupin;
