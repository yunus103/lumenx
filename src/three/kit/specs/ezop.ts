import type { KitSpec } from ".";

// Height 330 mm from the datasheet, proportions from the one photo (rose). The base comes out Ø98 against the
// datasheet's Ø100. The photo shows the drum faceted: an octagon, a flat facing the camera (the
// front face is 0.45 of the width and each side 0.6 of the front; an octagon gives 0.41 and 0.68, a hexagon 0.5 and
// 0.47, and the top face's back edge is flat only over the octagon's middle side), so Ø98 is across the flats. The
// photo camera is near the hat's height, so the base's top face shows and the hat's barely does. The hat's underside
// isn't in the photo, so the LED disc is copied from Sirius: a flat plate recessed inside the rim. Touch key
// and charge port are underneath, unseen.
const ezop: KitSpec = {
  body: {
    profile: [
      [0, 0.5], [4.88, 0.5, 1], [4.94, 0.54], [4.97, 0.62], [4.97, 0.9], [4.95, 1.2], [4.92, 1.5],
      // drum wall over a hair of a lip at its foot, a soft roll into the flat top, a thin raised plate and the collar the rod stands in
      [4.92, 2.3], [4.92, 3.1], [4.92, 3.95, 1], [4.9, 4.17], [4.85, 4.33], [4.76, 4.46], [4.63, 4.54], [4.48, 4.57, 1],
      [2.42, 4.57, 1], [2.4, 4.68, 1], [0.76, 4.68, 1], [0.78, 4.72], [0.78, 5], [0.76, 5.04, 1],
      [0.65, 5.04, 1],
      // the rod, widening a hair toward the top as on the photo, then a short collar under the hat
      [0.65, 7.5], [0.655, 10], [0.66, 12.5], [0.67, 15], [0.68, 17.5], [0.69, 20], [0.695, 22.5], [0.7, 25],
      [0.7, 28.65, 1], [0.78, 28.65, 1], [0.78, 29.24, 1], [0, 29.24],
    ],
    foot: { r: 4.82, h: 0.5 },
    // octagonal drum and top roll, a flat facing the photo camera; the plate and collar on top are round
    facets: { n: 8, across: "flats", to: 4.6, angle: 8 },
  },
  hat: {
    // a thick disc: a straight rim over a tight 4 mm rounding underneath and a soft 12 mm shoulder on top, the pin
    // running through it; no hub on top or below beyond the rod's collar
    profile: [
      [0.78, 29.22], [5.6, 29.22, 1], [5.73, 29.24], [5.84, 29.3], [5.92, 29.4], [5.96, 29.53],
      [5.96, 29.8], [5.96, 30.05], [5.94, 30.28], [5.89, 30.5], [5.8, 30.7], [5.67, 30.88], [5.5, 31.04],
      [5.29, 31.17], [5.04, 31.27, 1],
      [0.78, 31.42, 1],
      // pin
      [0.78, 32], [0.78, 32.82], [0.77, 32.93], [0.73, 32.99], [0.66, 33, 1], [0, 33],
    ],
    led: { y: 29.21, rIn: 0.85, rOut: 5.2 },
  },
  light: { kelvin: 2700, lumen: 550, y: 29.21, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default ezop;
