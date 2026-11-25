import type { KitSpec } from ".";

// Height 265 mm from the 2027 catalogue and the gallery's dimension photo (26.5 cm); proportions from the front photo,
// which give a Ø105 base and a Ø134 hat (Ø89 across its flat top). Both sources say Ø100 base and Ø120 hat, the
// catalogue's template values (Vela has the same), and the dimension photo draws them wider than labelled. Its 13 cm
// stem fits. Charge port and touch key are underneath, unseen. No photo sees the hat's underside: a recessed LED plate
// in a flat rim ring, as on Polaris.
const aster: KitSpec = {
  body: {
    profile: [
      // a bottom plate under a seam groove, then the drum
      [0, 0.12], [5.22, 0.12, 1], [5.26, 0.15], [5.27, 0.25], [5.27, 0.56, 1], [5.2, 0.59, 1], [5.2, 0.64, 1],
      [5.26, 0.67, 1],
      [5.26, 1.4], [5.26, 2.2], [5.26, 2.92],
      // a round edge into the near-flat top, then the concave flare up to the stem, evenly spaced
      [5.245, 3.04], [5.2, 3.13], [5.1, 3.19], [4.9, 3.24], [4.4, 3.33], [3.9, 3.41], [3.45, 3.54], [3.07, 3.72],
      [2.8, 3.95], [2.58, 4.2], [2.28, 4.44], [1.97, 4.7], [1.75, 5.0], [1.53, 5.3], [1.33, 5.6], [1.17, 5.9],
      [1.03, 6.2], [0.92, 6.5], [0.83, 6.8], [0.77, 7.03], [0.72, 7.22, 1],
      // a short ring with a groove where the stem starts
      [0.64, 7.23, 1], [0.64, 7.31, 1], [0.6, 7.33, 1], [0.6, 7.36, 1], [0.63, 7.38, 1], [0.63, 7.44, 1], [0.52, 7.46, 1],
      [0.52, 20.52, 1], [0, 20.52],
    ],
    foot: { r: 5.1, h: 0.12 },
  },
  hat: {
    profile: [
      // recessed LED plate, a flat rim ring with a round edge
      [0.52, 20.52], [5.6, 20.52, 1], [5.62, 20.56, 1], [6.4, 20.56, 1], [6.55, 20.59], [6.65, 20.65], [6.71, 20.74, 1],
      // a straight cone, evenly spaced, rounding over into the flat top
      [6.55, 21.21], [6.39, 21.69], [6.22, 22.16], [6.06, 22.63], [5.9, 23.11], [5.74, 23.58], [5.58, 24.06],
      [5.42, 24.53], [5.25, 25.0], [5.09, 25.48], [4.93, 25.95], [4.88, 26.14], [4.8, 26.28], [4.7, 26.39],
      [4.58, 26.47], [4.44, 26.5, 1], [0, 26.5],
    ],
    led: { y: 20.51, rIn: 0.57, rOut: 5.58 },
  },
  light: { kelvin: 2700, lumen: 550, y: 20.51, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default aster;
