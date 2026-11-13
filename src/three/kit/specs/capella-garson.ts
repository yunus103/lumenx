import type { KitSpec } from ".";

// Height 275 mm from the datasheet (top of the call button), proportions from the photos (Ø97 base, Ø111 hat; the
// datasheet says Ø115). Capella's shape with a flat hat top carrying the waiter call button. Charge port and touch
// key are underneath, unseen; the hat's underside isn't in any photo, so its recessed LED panel inside a rim follows
// Capella.
const capellaGarson: KitSpec = {
  body: {
    profile: [
      [0, 0.55], [4.74, 0.55, 1], [4.79, 0.58], [4.83, 0.65], [4.84, 0.75, 1],
      // drum wall, a small roll into the flat top
      [4.84, 4.2, 1], [4.83, 4.29], [4.79, 4.36], [4.72, 4.4, 1],
      [1.08, 4.4, 1],
      // collar round the foot of the stem, its top edge rounded
      [1.08, 4.52], [1.08, 4.62], [1.06, 4.69], [1.0, 4.72, 1],
      // the stem, slightly tapered
      [0.75, 4.72, 1], [0.81, 19.15, 1], [0, 19.15],
    ],
    foot: { r: 4.8, h: 0.55, rBottom: 4.76 },
  },
  hat: {
    profile: [
      [0.83, 19.12], [4.92, 19.12, 1], [4.95, 18.91, 1], [5.34, 18.85, 1], [5.46, 18.87], [5.53, 18.92], [5.56, 19.0, 1],
      // straight cone, evenly spaced, rolling into the flat top
      [5.375, 19.7], [5.19, 20.45], [5.005, 21.2], [4.82, 21.95], [4.635, 22.7], [4.45, 23.45], [4.265, 24.2],
      [4.08, 24.95], [3.895, 25.7], [3.78, 26.17], [3.75, 26.33], [3.71, 26.43], [3.65, 26.48], [3.56, 26.5, 1],
      [0, 26.5],
    ],
    led: { y: 19.11, rIn: 0.85, rOut: 4.9 },
  },
  // the call button: clear acrylic in every finish's photo (frosted-looking on some), drawn as thick clear glass
  glass: {
    profile: [[0.99, 26.5], [0.99, 26.65], [0.975, 26.85], [0.955, 27.05], [0.93, 27.2], [0.9, 27.32], [0.84, 27.42], [0.7, 27.48], [0.4, 27.5], [0, 27.5]],
    thickness: 0.45,
  },
  light: { kelvin: 2700, lumen: 550, y: 19.11, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default capellaGarson;
