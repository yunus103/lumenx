import type { KitSpec } from ".";

// Height 300 mm from the datasheet, proportions from the rose photo (the seven finish photos agree within a few %).
// The datasheet's drawing traces the photo, so its "130mm" hat and "100mm" base labels don't fit it; at 300 mm the
// hat comes out Ø115 and the base's lid Ø100. A drum on a thin black rubber foot: a slightly proud bottom band under a
// seam groove, the wall, and a thin lid with a rounded edge that overhangs it. A thin rod runs up through a flat hat
// (a thin plate over a narrower band) and pokes out above it, sitting in a shadow gap in the lid and the hat. The
// hat's underside isn't in any photo: the LED disc is recessed 2 mm as Agena's. Charge port and touch key are
// underneath, unseen.
// The rounded edges are only a few mm long, too short for the spline's samples (spread by length over the whole
// profile, mostly the rod), so every point on them is a corner.
const kuma: KitSpec = {
  body: {
    profile: [
      [0, 0.15], [4.46, 0.15, 1], [4.498, 0.158, 1], [4.531, 0.179, 1], [4.552, 0.212, 1], [4.56, 0.25, 1],
      // bottom band, seam groove, wall
      [4.56, 0.71, 1], [4.53, 0.73, 1], [4.5, 0.75, 1], [4.535, 0.78, 1],
      [4.535, 3.72, 1],
      // the lid
      [4.875, 3.72, 1], [4.917, 3.728, 1], [4.953, 3.752, 1], [4.977, 3.788, 1], [4.985, 3.83, 1], [4.977, 3.872, 1],
      [4.953, 3.908, 1], [4.917, 3.932, 1], [4.875, 3.94, 1],
      [0.7, 3.94, 1], [0.7, 3.88, 1], [0.585, 3.88, 1],
      [0.585, 25.6, 1], [0, 25.6],
    ],
    foot: { r: 4.5, h: 0.15 },
    // the rose, gold and bronz photos show satin brushed metal (krom is polished: no lines on it)
    brush: 0.5,
  },
  hat: {
    profile: [
      [0.62, 25.26], [4.82, 25.26, 1], [4.85, 25.06, 1],
      // band
      [5, 25.06, 1], [5.035, 25.069, 1], [5.061, 25.095, 1], [5.07, 25.13, 1],
      [5.07, 26.02, 1],
      // plate, its lower edge bevelled
      [5.695, 26.04, 1], [5.732, 26.05, 1], [5.76, 26.077, 1], [5.77, 26.115, 1],
      [5.77, 26.5, 1], [5.762, 26.53, 1], [5.74, 26.552, 1], [5.71, 26.56, 1],
      // the rod's end
      [0.65, 26.56, 1], [0.65, 26.51, 1], [0.555, 26.51, 1],
      [0.555, 29.9, 1], [0.547, 29.938, 1], [0.526, 29.971, 1], [0.493, 29.992, 1], [0.455, 30, 1], [0, 30],
    ],
    led: { y: 25.25, rIn: 0.62, rOut: 4.8 },
    brush: 0.5,
  },
  light: { kelvin: 2700, lumen: 550, y: 25.25, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default kuma;
