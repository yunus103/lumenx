import type { KitSpec } from ".";

// Height 275 mm and a Ø210 hat from the gallery's dimension photo (no datasheet), proportions from the studio photo,
// which agree with them. The same photo labels the base Ø85, but every photo measures ~Ø95-97 at 275 mm high.
// A turned beech cone on a thin black rubber foot, a solid wooden mushroom hat with a flat underside lit edge to edge
// at night, and a flat brass touch key on top of the hat.
const alba: KitSpec = {
  body: {
    // beech, one block for body and hat: a vertical pith far behind the lamp gives straight streaks on the front of
    // the cone and the photo's wide flat arcs across the front of the dome
    grain: { pith: [0.3, 12, -14], dir: [0.02, 1, 0], ring: 0.16, contrast: 0.45 },
    profile: [
      [0, 0.15], [4.7, 0.15, 1], [4.78, 0.18], [4.81, 0.26], [4.79, 0.4],
      // a straight cone, evenly spaced points
      [4.75, 0.6], [4.69, 1], [4.6, 1.6], [4.44, 2.6], [4.28, 3.6], [4.12, 4.6], [3.96, 5.6], [3.8, 6.6], [3.64, 7.6],
      [3.48, 8.6], [3.32, 9.6], [3.16, 10.6], [3.01, 11.6], [2.85, 12.6], [2.69, 13.6], [2.53, 14.6], [2.37, 15.6],
      [2.21, 16.6], [2.05, 17.6], [1.89, 18.6], [1.73, 19.6], [1.62, 20.3], [1.56, 20.7, 1], [0, 20.7],
    ],
    foot: { r: 4.68, h: 0.15 },
  },
  hat: {
    profile: [
      // the flat underside (the LED disc), a small round into the dome's near-vertical rim
      [1.5, 20.7], [10.5, 20.7, 1], [10.64, 20.72], [10.75, 20.78], [10.82, 20.88],
      // the dome, a superellipse (exponent 2.35) 6.45 cm high
      [10.84, 20.99], [10.82, 21.67], [10.66, 22.34], [10.46, 22.98], [10.2, 23.6], [9.87, 24.17], [9.47, 24.69],
      [8.98, 25.15], [8.44, 25.56], [7.87, 25.91], [7.33, 26.21], [6.74, 26.48], [6.13, 26.7], [5.48, 26.88],
      [4.82, 27.04], [4.13, 27.16], [3.42, 27.26], [2.69, 27.34], [2.02, 27.39], [1.4, 27.42], [1.12, 27.43, 1],
      // the flat brass touch key, a little proud of the wood
      [1.12, 27.47], [1.1, 27.49], [1.06, 27.5], [0, 27.5],
    ],
    // the night photos light the top of the cone under the hat
    led: { y: 20.69, rIn: 1.6, rOut: 10.3, wash: { metal: 0.15, wood: 3 } },
    fixed: [{ from: 27.43, to: 27.6, finish: "gold" }],
  },
  // the photos' stain (pale honey beech), not the kayin calibrated on Defne
  woodTone: { kayin: { early: "#f0ab58", late: "#b06e30", rough: 0.55, clearcoat: 0.12 } },
  light: { kelvin: 2700, lumen: 550, y: 20.69, dimmer: [0.4, 0.7, 1], body: 0.012, bounce: 200 },
};

export default alba;
