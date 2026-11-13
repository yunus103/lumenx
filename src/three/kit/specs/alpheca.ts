import type { KitSpec } from ".";

// Height 140 mm (call button included) from the datasheet; its 100 mm is the hat's diameter, which the photos'
// proportions give at that height (Ø97.5). A brushed drum on a black rubber foot, flaring into a slim stem under a flat
// cylinder hat. The call button on top is a frustum in the selected finish (every finish photo shows it so; what
// looks like a lower cone is its reflection in the polished top). The hat's underside is unseen: the LED disc and
// lip copy Agena's.
const alpheca: KitSpec = {
  body: {
    profile: [
      [0, 0.45], [4.73, 0.45, 1], [4.76, 0.47], [4.77, 0.51, 1],
      // drum wall, a small roll onto the shoulder, then the concave flare into the stem, evenly spaced
      [4.77, 2.8, 1], [4.75, 2.9], [4.7, 2.96], [4.6, 3.0, 1],
      [4.3, 3.12], [3.95, 3.3], [3.62, 3.52], [3.33, 3.78], [3.07, 4.08], [2.83, 4.4], [2.6, 4.73], [2.4, 5.07],
      [2.22, 5.42], [2.05, 5.78], [1.89, 6.15], [1.76, 6.52], [1.63, 6.9], [1.52, 7.28], [1.43, 7.66], [1.36, 8.04],
      [1.31, 8.42], [1.28, 8.8], [1.26, 9.18], [1.25, 9.62, 1], [0, 9.62],
    ],
    foot: { r: 4.7, h: 0.45 },
    brush: 0.5,
  },
  hat: {
    profile: [
      [1.25, 9.62], [4.3, 9.62, 1], [4.33, 9.45, 1], [4.62, 9.4, 1], [4.76, 9.43], [4.85, 9.5], [4.89, 9.62, 1],
      [4.89, 12.86, 1], [4.875, 12.94], [4.83, 12.98, 1],
      // call button: a cone, a rounded top edge and a small hole in the middle
      [1.13, 12.98, 1], [0.84, 13.84, 1], [0.8, 13.94], [0.74, 13.98, 1],
      [0.18, 13.98, 1], [0.18, 13.9, 1], [0, 13.9],
    ],
    led: { y: 9.61, rIn: 1.28, rOut: 4.28, wash: { metal: 0 } },
    brush: 0.5,
  },
  light: { kelvin: 2700, lumen: 550, y: 9.61, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default alpheca;
