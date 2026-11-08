import type { KitSpec } from ".";

// Height 225 mm from the datasheet, proportions from the one photo: a Ø101 hat (the datasheet's Ø100) over a Ø93
// drum, so the datasheet's Ø100 base doesn't fit. Charge port and touch key are underneath, unseen; the hat's
// underside isn't in the photo, so its recessed LED panel inside a rim follows Mimosa.
const pandora: KitSpec = {
  body: {
    profile: [
      [0, 0.45], [4.4, 0.45, 1], [4.52, 0.5], [4.59, 0.6], [4.62, 0.75, 1],
      // straight drum wall, a small roll into the flat top
      [4.665, 7.5, 1], [4.64, 7.65], [4.57, 7.76], [4.46, 7.82], [4.32, 7.85, 1],
      [0.76, 7.85, 1],
      // rounded bead where the stem enters
      [0.76, 8.1], [0.73, 8.18], [0.66, 8.23], [0.57, 8.25, 1],
      // stem with a slight taper (Ø11.4 to Ø12.4), then the rounded collar under the hat
      [0.578, 10.25], [0.586, 12.24], [0.594, 14.23], [0.603, 16.22], [0.612, 18.21], [0.62, 20.2, 1],
      [0.72, 20.22], [0.79, 20.26], [0.83, 20.31], [0.84, 20.37, 1],
      [0.84, 20.68, 1], [0, 20.68],
    ],
    foot: { r: 4.4, h: 0.45 },
  },
  hat: {
    profile: [
      [0.84, 20.65], [4.65, 20.65, 1], [4.68, 20.53, 1], [4.91, 20.53], [5.01, 20.55], [5.08, 20.6], [5.11, 20.68, 1],
      [5.12, 22.17, 1], [5.11, 22.24], [5.08, 22.28], [5.02, 22.3, 1],
      [0, 22.3],
    ],
    led: { y: 20.64, rIn: 0.9, rOut: 4.65 },
  },
  light: { kelvin: 2700, lumen: 550, y: 20.64, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default pandora;
