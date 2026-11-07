import type { KitSpec } from ".";

// Height 220 mm from the datasheet, proportions from the photo: its Ø120 hat and Ø100 base are Agena's numbers again
// and don't fit the photo, where the hat is 1.3 bases wide and the height 1.73 hats. Touch key and charge port are
// underneath, unseen. The white diffuser band under the hat is a separate, painted ring here (the kit's LED is a flat disc).
const baro: KitSpec = {
  body: {
    profile: [
      [0, 0.5], [4.84, 0.5, 1], [4.89, 0.54], [4.91, 0.62, 1],
      [4.91, 1.48], [4.91, 2.35, 1], [4.88, 2.52], [4.8, 2.64], [4.6, 2.72, 1],
      // nearly flat top, a soft cone rising to the stem, which ends in a bead sitting in a fine groove
      [3.75, 2.79], [2.95, 2.86], [2.6, 2.95], [2.2, 3.13], [1.8, 3.33], [1.5, 3.5, 1],
      [1.46, 3.5, 1], [1.46, 3.4, 1], [1.345, 3.4, 1], [1.37, 3.45], [1.38, 3.53], [1.36, 3.64], [1.335, 3.8],
      // straight taper, evenly spaced so the curve stays a line
      [1.31, 4.9], [1.285, 6.2], [1.26, 7.5], [1.235, 8.8], [1.21, 10.1], [1.185, 11.4], [1.16, 12.7],
      [1.135, 14], [1.11, 15.3], [1.085, 16.6], [1.06, 17.9], [1.04, 19.1, 1], [1.04, 19.2, 1], [0, 19.2],
    ],
    foot: { r: 4.82, h: 0.5 },
  },
  hat: {
    profile: [
      [1, 19], [6.28, 19, 1], [6.3, 19.2, 1], [6.38, 19.2, 1],
      [6.38, 20.1], [6.38, 20.95], [6.38, 21.55, 1], [6.35, 21.7], [6.26, 21.8], [6.1, 21.85, 1],
      // low round boss on top
      [3.5, 21.85, 1], [3.42, 21.87], [3.37, 21.91], [3.32, 21.96], [3.22, 21.99], [3.1, 22, 1], [0, 22],
    ],
    led: { y: 18.99, rIn: 1.1, rOut: 6.25 },
  },
  light: { kelvin: 2700, lumen: 550, y: 18.99, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default baro;
