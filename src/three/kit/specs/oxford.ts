import type { KitSpec } from ".";

// Height 220 mm and the Ø160 hat from the datasheet; the white product photo and the datasheet's two photos agree on
// both and give the rest. The marble photo has a thicker hat and neck, as if another casting: not followed. A straight
// cone bends into a short drum over a black rubber foot ring. The hat's underside isn't shown: rim band, recess and
// LED disc follow Agena's. Charge port and touch key are underneath, unseen.
const oxford: KitSpec = {
  body: {
    profile: [
      [0, 0.42], [4.74, 0.42, 1], [4.82, 0.46], [4.86, 0.56],
      // drum, bending into the straight cone; points evenly spaced along it so the spline can't fold
      [4.86, 1.0], [4.86, 1.5], [4.85, 1.85], [4.81, 2.2], [4.638, 3], [4.426, 4], [4.214, 5], [4.003, 6],
      [3.791, 7], [3.579, 8], [3.367, 9], [3.156, 10], [2.944, 11], [2.732, 12], [2.521, 13], [2.309, 14],
      [2.097, 15], [1.885, 16], [1.674, 17], [1.6, 17.35], [1.58, 17.65, 1], [0, 17.65],
    ],
    foot: { r: 4.74, h: 0.42 },
  },
  hat: {
    // a flat drum: LED plate 2 mm up inside a thin rim band
    profile: [
      [1.55, 17.63], [7.3, 17.63, 1], [7.33, 17.43, 1], [7.96, 17.43, 1], [8.02, 17.45], [8.05, 17.52, 1],
      [8.05, 21.86, 1], [8.03, 21.95], [7.96, 22, 1], [0, 22],
    ],
    led: { y: 17.62, rIn: 1.65, rOut: 7.27 },
  },
  light: { kelvin: 2700, lumen: 550, y: 17.62, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default oxford;
