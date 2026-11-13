import type { KitSpec } from ".";

// Height 230 mm from the datasheet (its "100mm 230mm" is hat Ø100 and height 230, labels swapped), proportions from
// the seven finish photos (one studio render recoloured: the outlines are identical). Not a bell: a cone hat on a thin
// stem over a drum with a trumpet flare. The call button is a clear acrylic cap (`glass`) over a chrome pin in a recess
// on the hat's flat top, the same on every finish photo (`fixed`). The photos show the hat's top face and the base's
// top from well above while the hat's rim is seen nearly level (a composite): fitted with the camera at 24 cm.
// The hat's underside isn't in any photo: a flat LED plate with a small boss round the stem, as on Rigel. No night photo: no stem wash.
const pollux: KitSpec = {
  body: {
    profile: [
      [0, 0.55], [4.74, 0.55, 1], [4.8, 0.59], [4.82, 0.68, 1],
      // drum wall, a rounded shoulder into the sloping top, then the concave trumpet up to a collar bead
      [4.82, 1.2], [4.82, 1.8], [4.82, 2.45, 1], [4.8, 2.62], [4.74, 2.78], [4.62, 2.92], [4.45, 3.03], [4.2, 3.12],
      [3.8, 3.25], [3.4, 3.38], [3.0, 3.53], [2.68, 3.7], [2.38, 3.9], [2.08, 4.12], [1.8, 4.34], [1.56, 4.58],
      [1.37, 4.82], [1.24, 5.05], [1.11, 5.32], [0.99, 5.6], [0.87, 5.88], [0.76, 6.15], [0.65, 6.42, 1],
      [0.73, 6.46], [0.78, 6.54], [0.79, 6.64], [0.78, 6.74], [0.73, 6.82], [0.65, 6.86, 1],
      [0.46, 6.88, 1], [0.46, 15.85, 1], [0, 15.85],
    ],
    foot: { r: 4.77, h: 0.55, rBottom: 4.7 },
  },
  hat: {
    profile: [
      // boss round the stem, flat LED plate, a rounded rim
      [0.46, 15.6], [0.55, 15.63], [0.6, 15.7], [0.62, 15.78], [0.62, 15.85, 1], [4.86, 15.85, 1],
      [4.94, 15.88], [4.99, 15.95], [5.0, 16.05, 1],
      // a straight cone, evenly spaced, a small rounded edge into the flat top
      [5.02, 16.1], [4.9, 16.7], [4.77, 17.3], [4.64, 17.9], [4.5, 18.5], [4.36, 19.1], [4.22, 19.7],
      [4.08, 20.3], [3.94, 20.9], [3.8, 21.5], [3.71, 21.9], [3.66, 22.1], [3.63, 22.24], [3.6, 22.32],
      [3.55, 22.37], [3.48, 22.39, 1],
      // the recess round the button, its floor and the pin inside the clear cap (`glass`)
      [1.2, 22.4, 1], [1.2, 22.28, 1], [0.08, 22.28, 1], [0.08, 22.8, 1], [0.13, 22.82], [0.14, 22.86], [0.1, 22.89],
      [0, 22.9],
    ],
    led: { y: 15.84, rIn: 0.7, rOut: 4.8 },
    fixed: [{ from: 22.28, to: 22.9, finish: "krom" }],
  },
  // the call button's clear cap: tapered, a rounded top edge, standing in the recess
  glass: {
    profile: [[1.0, 22.28], [0.99, 22.4], [0.96, 22.55], [0.93, 22.7], [0.9, 22.8], [0.86, 22.88], [0.78, 22.94], [0.66, 22.97], [0, 22.97]],
    thickness: 0.12,
  },
  light: { kelvin: 2700, lumen: 550, y: 15.84, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default pollux;
