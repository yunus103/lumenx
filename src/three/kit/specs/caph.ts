import type { KitSpec } from ".";

// Height 260 mm from the datasheet (to the top of the call button's pin), proportions from the photos: the drawing
// labels the hat and the base 100 mm, but draws the hat 0.47 times the height, as the photos show (hat Ø126, base
// Ø121). The base's top is low and shallow: on the photo, seen from above, the drum's back rim makes most of the
// outline above it. The call button is part of the hat profile: its finish changes from photo to photo (nickel on
// black, clear on gold, white on white), so it follows the selected finish. The hat's underside is unseen; it is
// Agena's flat ring round a recessed LED disc.
const caph: KitSpec = {
  body: {
    profile: [
      [0, 0.55], [5.95, 0.55, 1], [6.03, 0.58], [6.06, 0.66, 1],
      [6.06, 3.86, 1], [6.04, 4.0], [5.98, 4.11], [5.88, 4.2], [5.72, 4.28], [5.5, 4.34],
      // a low, shallow cone bending into the concave trumpet, which ends in a flat step round the stem
      [5.05, 4.42], [4.55, 4.57], [4.05, 4.72], [3.6, 4.88], [3.2, 5.07], [2.88, 5.29], [2.58, 5.53], [2.26, 5.81],
      [2.01, 6.08], [1.83, 6.3], [1.68, 6.53],
      [1.56, 6.76], [1.44, 7.0], [1.32, 7.23], [1.21, 7.47], [1.12, 7.72], [1.05, 7.95], [0.98, 8.2], [0.91, 8.45],
      [0.85, 8.7], [0.81, 8.95], [0.8, 9.08, 1],
      [0.58, 9.11, 1], [0.58, 19.59, 1], [0, 19.59],
    ],
    foot: { r: 5.88, h: 0.55, rBottom: 5.85 },
  },
  hat: {
    profile: [
      [0.58, 19.64], [5.45, 19.64, 1], [5.48, 19.4, 1], [6.16, 19.4, 1], [6.26, 19.43], [6.3, 19.53, 1],
      [6.3, 24.74, 1], [6.29, 24.79], [6.25, 24.81, 1],
      // the call button: a frustum with a small fillet at its foot and a rounded top, and a pin in its centre
      [1.75, 24.81, 1], [1.56, 24.86], [1.47, 24.98], [1.16, 25.66], [1.1, 25.77], [1.0, 25.81], [0.9, 25.82, 1],
      [0.18, 25.82, 1], [0.17, 25.97], [0.13, 26], [0, 26],
    ],
    led: { y: 19.63, rIn: 0.65, rOut: 5.42 },
  },
  light: { kelvin: 2700, lumen: 550, y: 19.63, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default caph;
