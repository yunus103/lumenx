import type { KitSpec } from ".";

// Height 270 mm from the datasheet, proportions from the photos: they give a Ø94 base and a Ø104 hat, not the
// datasheet's Ø120. Charge port and touch key are underneath, unseen; the hat's underside isn't in any photo, so its
// recessed LED panel inside a rim follows Agena.
const capella: KitSpec = {
  body: {
    profile: [
      [0, 0.6], [4.6, 0.6, 1], [4.69, 0.63], [4.73, 0.7], [4.74, 0.8, 1],
      // drum wall, a small roll into the flat top
      [4.7, 4.24, 1], [4.69, 4.31], [4.66, 4.35], [4.61, 4.36, 1],
      [1.1, 4.36, 1],
      // ring round the foot of the stem
      [1.1, 4.68], [1.08, 4.74], [1.03, 4.76, 1],
      [0.87, 4.76, 1], [0.87, 19.3, 1], [0, 19.3],
    ],
    foot: { r: 4.68, h: 0.6 },
  },
  hat: {
    profile: [
      [0.9, 19.27], [4.6, 19.27, 1], [4.63, 19.06, 1], [5.08, 19.0, 1], [5.18, 19.03], [5.22, 19.1, 1],
      // straight cone, evenly spaced, rolling into the flat top
      [5.01, 19.95], [4.8, 20.8], [4.6, 21.65], [4.39, 22.5], [4.18, 23.35], [3.97, 24.2], [3.76, 25.05],
      [3.6, 25.7], [3.56, 25.86], [3.49, 25.95], [3.38, 26.0, 1],
      // knob with a rounded top
      [0.94, 26.0, 1], [0.94, 26.45], [0.92, 26.57], [0.88, 26.68], [0.79, 26.79], [0.61, 26.89], [0.3, 26.97], [0, 27.0],
    ],
    led: { y: 19.26, rIn: 0.92, rOut: 4.58 },
  },
  light: { kelvin: 2700, lumen: 550, y: 19.26, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default capella;
