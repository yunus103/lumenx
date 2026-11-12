import type { KitSpec } from ".";

// Height 250 mm from the datasheet (top of the ball finial), proportions from the eleven photos (one studio render in
// every finish, the same geometry): a Ø99.6 base and a Ø138 hat. The datasheet's own drawing also measures ~Ø136 at
// its 250 mm height, so its "130mm" hat label doesn't fit. The photos were shot from ~23.5 cm high: they see the hat's
// rim from above and none of its underside, so the light is assumed as on a Flowerpot-style lamp, an LED ring
// recessed around the top of the bowl that hangs under the hat (hidden from a front view, it lights the bowl and the
// table). Charge port and touch key are underneath, unseen.
const zamora: KitSpec = {
  body: {
    profile: [
      // the base wall rolls in onto the black rubber foot
      [0, 0.45], [4.78, 0.45, 1], [4.836, 0.493], [4.885, 0.531], [4.925, 0.577], [4.955, 0.63], [4.974, 0.689],
      [4.98, 0.75], [4.98, 0.93],
      // the dome, a squat superellipse (fuller at the shoulder than an ellipse), points spaced evenly along it
      [4.976, 1.224], [4.959, 1.518], [4.927, 1.81], [4.877, 2.1], [4.808, 2.385],
      [4.719, 2.666], [4.609, 2.939], [4.479, 3.202], [4.328, 3.455], [4.158, 3.694], [3.969, 3.919], [3.762, 4.129],
      [3.54, 4.321], [3.304, 4.497], [3.056, 4.655], [2.798, 4.795], [2.531, 4.918], [2.256, 5.023], [1.976, 5.112],
      [1.691, 5.186], [1.403, 5.244], [1.112, 5.288], [0.75, 5.32, 1],
      // a bead where the stem stands on the base, rounded over at the top
      [0.8, 5.36], [0.82, 5.42], [0.82, 5.49], [0.81, 5.57], [0.78, 5.65], [0.73, 5.73], [0.66, 5.79], [0.6, 5.83],
      [0.54, 5.86, 1],
      // the stem, then the collar under the bowl: a cone up from the stem and a short drum with a flat top
      [0.545, 14.55, 1], [0.605, 14.56], [0.71, 14.61], [0.8, 14.7], [0.83, 14.79], [0.83, 14.9, 1], [0, 14.9],
    ],
    foot: { r: 4.78, h: 0.45 },
  },
  hat: {
    profile: [
      // a short neck on the collar, then the bowl: a spherical cap (R 5.14 cm) up to the hat's underside
      [0.6, 14.89, 1], [0.6, 14.925, 1], [0.847, 14.96], [1.092, 15.007], [1.335, 15.066], [1.574, 15.137],
      [1.81, 15.219], [2.041, 15.313], [2.268, 15.417], [2.489, 15.533], [2.704, 15.659], [2.913, 15.795],
      [3.115, 15.942], [3.31, 16.098], [3.497, 16.263], [3.676, 16.437], [3.846, 16.62, 1],
      // the recess the LED ring sits in, the flat underside, a rounded rim
      [3.866, 16.87, 1], [5.2, 16.87, 1], [5.2, 16.62, 1], [6, 16.62, 1], [6.22, 16.64], [6.42, 16.69], [6.6, 16.77],
      [6.74, 16.88], [6.85, 17.01], [6.91, 17.16],
      // the dome, a superellipse just fuller than an ellipsoid, points spaced evenly along it
      [6.911, 17.46], [6.879, 17.762], [6.836, 18.063], [6.781, 18.362],
      [6.714, 18.659], [6.634, 18.952], [6.543, 19.242], [6.441, 19.528], [6.326, 19.81], [6.199, 20.086],
      [6.061, 20.357], [5.911, 20.621], [5.75, 20.879], [5.578, 21.13], [5.396, 21.372], [5.202, 21.607],
      [4.998, 21.833], [4.785, 22.049], [4.562, 22.255], [4.33, 22.452], [4.089, 22.637], [3.84, 22.812],
      [3.584, 22.975], [3.32, 23.126], [3.05, 23.265], [2.773, 23.392], [2.492, 23.506], [2.205, 23.607],
      [1.914, 23.695], [1.619, 23.77], [1.322, 23.832], [1.022, 23.88], [0.72, 23.916, 1],
      // a thin flange, then the ball finial (chrome on every finish in the photos)
      [0.72, 24, 1], [0.68, 24, 1], [0.731, 24.056], [0.769, 24.145], [0.796, 24.239], [0.809, 24.336],
      [0.807, 24.434], [0.786, 24.529], [0.748, 24.619], [0.694, 24.7], [0.628, 24.772], [0.552, 24.834],
      [0.47, 24.885], [0.381, 24.927], [0.289, 24.959], [0.194, 24.982], [0.098, 24.995], [0, 25],
    ],
    led: { y: 16.86, rIn: 3.886, rOut: 5.18 },
    fixed: [{ from: 24, to: 25, finish: "krom" }],
  },
  light: { kelvin: 2700, lumen: 550, y: 16.86, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default zamora;
