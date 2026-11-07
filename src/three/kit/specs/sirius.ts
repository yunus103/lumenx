import type { KitSpec } from ".";

// Height 250 mm from the datasheet; its Ø100 base and Ø120 hat fit the photos. The hat is a thin spun dome; its
// underside isn't in any photo, so the LED disc is an assumption: a flat plate recessed 3 mm inside the rim.
const sirius: KitSpec = {
  body: {
    profile: [
      [0, 0.45], [4.88, 0.45, 1], [4.93, 0.5], [4.95, 0.6, 1],
      // wall, a soft roll into the shallow top, then the flared collar with a crisp lip
      [4.95, 2.18, 1], [4.93, 2.3], [4.87, 2.38], [4.77, 2.42, 1],
      [2.85, 2.55], [2.45, 2.66], [2.25, 2.84], [2.16, 3.08], [2.09, 3.4, 1],
      [1.41, 3.45, 1],
      // tapered stem, running up into the hat
      [1.41, 3.5, 1], [1.215, 10], [0.99, 18.1], [0.97, 19.27, 1], [0, 19.27],
    ],
    foot: { r: 4.9, h: 0.45 },
  },
  hat: {
    profile: [
      [0.96, 19.25], [5.77, 19.25, 1], [5.85, 18.95, 1], [5.94, 18.95, 1], [5.95, 19.03],
      [5.91, 19.23], [5.81, 19.55], [5.64, 20], [5.32, 20.7], [4.85, 21.41], [4.32, 22.01], [3.73, 22.55],
      [3.1, 22.95], [2.45, 23.28], [1.6, 23.62], [0.59, 23.83, 1],
      // ball knob
      [0.65, 23.9], [0.72, 24.1], [0.73, 24.26], [0.69, 24.48], [0.56, 24.7], [0.33, 24.89], [0, 25],
    ],
    // the lit beyaz photo shows the stem glowing under the hat; the polished metals show none
    led: { y: 19.24, rIn: 1, rOut: 5.75, wash: { metal: 0 } },
  },
  light: { kelvin: 2700, lumen: 550, y: 19.24, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default sirius;
