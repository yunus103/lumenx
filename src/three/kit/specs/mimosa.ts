import type { KitSpec } from ".";

// Height 320 mm from the datasheet, proportions from the photos: they give a Ø94 base and a Ø96 hat, not the
// datasheet's Ø100. The base wall has a slight draft. Charge port and touch key are underneath, unseen; the hat's
// underside isn't in any photo, so its recessed LED panel inside a rim follows Agena.
const mimosa: KitSpec = {
  body: {
    profile: [
      [0, 0.25], [4.35, 0.25, 1], [4.55, 0.32], [4.66, 0.44], [4.71, 0.58], [4.73, 0.8, 1],
      // seam groove just above the bottom roll
      [4.7, 0.83, 1], [4.7, 0.87, 1], [4.73, 0.9, 1],
      // drafted wall, a small roll into the flat top
      [4.65, 7.25, 1], [4.63, 7.38], [4.58, 7.46], [4.5, 7.5, 1],
      [0.93, 7.5, 1],
      // rounded collar where the stem enters
      [0.93, 7.65], [0.9, 7.75], [0.84, 7.81], [0.77, 7.83, 1],
      // straight stem, then the bead under the hat
      [0.76, 29.08, 1], [0.84, 29.12], [0.92, 29.19], [0.95, 29.28], [0.95, 29.38], [0.93, 29.48, 1],
      [0.93, 29.72, 1], [0, 29.72],
    ],
    foot: { r: 4.2, h: 0.25 },
  },
  hat: {
    profile: [
      [0.92, 29.69], [4.33, 29.69, 1], [4.36, 29.51, 1], [4.6, 29.51], [4.71, 29.53], [4.77, 29.58], [4.79, 29.66, 1],
      [4.79, 31.0, 1], [4.775, 31.09], [4.73, 31.14], [4.62, 31.16, 1],
      // domed knob on top
      [0.86, 31.16, 1], [0.86, 31.5], [0.8, 31.62], [0.72, 31.72], [0.61, 31.82], [0.45, 31.91], [0.27, 31.97], [0, 31.99],
    ],
    // the night photos show the stem glowing under the hat and fading down, on the sandy bronze too
    led: { y: 29.68, rIn: 0.97, rOut: 4.3, wash: { metal: 0.2 } },
  },
  light: { kelvin: 2700, lumen: 550, y: 29.68, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default mimosa;
