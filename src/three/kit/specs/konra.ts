import type { KitSpec } from ".";

// Height 220 mm from the datasheet, proportions from the white photo: a Ø111 hat over a Ø93 base. The datasheet's
// Ø130 hat fits none of the images (its own drawing gives ~Ø116, the marble photo ~Ø123). Charge port and touch key
// are underneath, unseen; the hat's underside isn't shown, so its LED disc follows Esna: a flat plate filling the
// underside to the rim.
const konra: KitSpec = {
  body: {
    profile: [
      [0, 0.41], [4.56, 0.41, 1], [4.6, 0.44], [4.62, 0.5],
      // a bell-shaped cone: near upright at the base, steepest in the middle, easing into the neck under the hat.
      // Points every 0.8 cm keep the spline from folding.
      [4.6, 0.9], [4.56, 1.5], [4.49, 2.2], [4.386, 3.0], [4.258, 3.8], [4.111, 4.6], [3.95, 5.4], [3.777, 6.2],
      [3.598, 7.0], [3.414, 7.8], [3.23, 8.6], [3.046, 9.4], [2.866, 10.2], [2.69, 11.0], [2.522, 11.8],
      [2.362, 12.6], [2.21, 13.4], [2.069, 14.2], [1.937, 15.0], [1.829, 15.7], [1.75, 16.36, 1], [0, 16.36],
    ],
    foot: { r: 4.45, h: 0.41 },
  },
  hat: {
    profile: [
      [1.74, 16.34], [5.44, 16.34, 1], [5.5, 16.36], [5.53, 16.4],
      // a half-ellipsoid dome (a 5.54, b 5.66), points evenly spaced along it
      [5.535, 16.6], [5.523, 16.785], [5.471, 17.228], [5.386, 17.665], [5.268, 18.093], [5.125, 18.491],
      [4.943, 18.896], [4.731, 19.285], [4.49, 19.656], [4.22, 20.007], [3.925, 20.334], [3.605, 20.637],
      [3.263, 20.914], [2.901, 21.162], [2.521, 21.38], [2.125, 21.567], [1.716, 21.722], [1.296, 21.843],
      [0.869, 21.93], [0.436, 21.982], [0, 22],
    ],
    led: { y: 16.33, rIn: 1.85, rOut: 5.3 },
  },
  // the Mermer option (Light Design; not a finish in Sanity): a glossy white print with thin black veins, on beyaz
  marble: { finish: "beyaz", vein: "#0d0d0d", scale: 6, width: 0.55, rough: 0.2 },
  light: { kelvin: 2700, lumen: 550, y: 16.33, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default konra;
