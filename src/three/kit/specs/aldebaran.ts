import type { KitSpec } from ".";

// Height 320 mm from the datasheet, proportions from the one (gold) photo. A bullet body (a drum under a superelliptic
// dome) on a black rubber foot ring, a thin rod in a small collar, a wide spun dome hat with a low knob. The hat's
// underside isn't in the photo, so the LED disc is recessed inside a thin rim as on Sirius. Charge port and touch key
// are underneath, unseen.
const aldebaran: KitSpec = {
  body: {
    profile: [
      [0, 0.45], [4.82, 0.45, 1], [4.87, 0.48], [4.88, 0.55, 1],
      // drum, evenly spaced, running into the bullet dome
      [4.88, 1.1], [4.88, 1.65], [4.88, 2.2], [4.88, 2.75], [4.88, 3.3], [4.88, 3.85], [4.88, 4.4], [4.88, 4.95],
      [4.88, 5.5], [4.88, 6.05], [4.88, 6.6], [4.88, 7.15], [4.88, 7.7], [4.88, 8.25], [4.88, 8.8], [4.88, 9.35],
      [4.88, 9.9], [4.88, 10.45], [4.88, 11.0], [4.88, 11.55], [4.88, 12.1], [4.88, 12.5], [4.88, 12.9],
      [4.866, 13.437], [4.813, 13.971], [4.709, 14.497], [4.548, 15.009], [4.328, 15.498], [4.046, 15.954],
      [3.705, 16.369], [3.311, 16.733], [2.871, 17.04], [2.395, 17.287], [1.892, 17.475], [1.372, 17.605], [0.84, 17.683, 1],
      // collar at the foot of the rod
      [0.84, 17.86], [0.82, 17.91], [0.78, 17.93, 1],
      [0.66, 17.93, 1], [0.66, 24.62, 1], [0, 24.62],
    ],
    foot: { r: 4.83, h: 0.45 },
  },
  hat: {
    profile: [
      [0.66, 24.6], [10.84, 24.6, 1], [10.88, 24.38, 1], [11.05, 24.38, 1], [11.09, 24.43], [11.1, 24.53],
      // superelliptic dome, evenly spaced
      [11.1, 24.65], [11.073, 25.437], [10.96, 26.216], [10.735, 26.971], [10.393, 27.679], [9.942, 28.325],
      [9.401, 28.897], [8.79, 29.393], [8.127, 29.818], [7.426, 30.177], [6.697, 30.477], [5.949, 30.724],
      [5.187, 30.924], [4.415, 31.082], [3.637, 31.203], [2.854, 31.291], [2.068, 31.35], [1.281, 31.384, 1],
      // low knob
      [1.23, 31.43], [1.13, 31.52], [0.96, 31.65], [0.73, 31.78], [0.46, 31.9], [0.21, 31.975], [0, 32],
    ],
    led: { y: 24.59, rIn: 0.7, rOut: 10.8 },
  },
  light: { kelvin: 2700, lumen: 550, y: 24.59, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default aldebaran;
