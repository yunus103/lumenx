import type { KitSpec } from ".";

// Height 170 mm from the datasheet (top of the call button's pin), proportions from the seven finish photos (one
// studio render recoloured, shot from ~24 cm high): Ø98 base, Ø101 hat, matching the datasheet's 100 mm. A drum on a
// thin rubber foot, a seam, a soft shoulder flaring up into the stem, a straight cone hat with a flat silver top
// carrying the waiter call button: clear acrylic round a metal pin, the same on every finish. The hat's underside
// isn't in any photo, so its recessed LED panel inside a rim follows Capella garson. No night photo: no stem wash.
const menkent: KitSpec = {
  body: {
    profile: [
      [0, 0.25], [4.84, 0.25, 1], [4.89, 0.28], [4.91, 0.35, 1],
      // drum wall up to the seam, a fine groove
      [4.91, 1.0], [4.91, 1.65], [4.91, 2.3], [4.91, 3.0, 1], [4.89, 3.03], [4.89, 3.05], [4.91, 3.08, 1],
      // the shoulder rolls in and flares up into the stem
      [4.91, 3.5], [4.86, 3.78], [4.7, 3.98], [4.4, 4.13], [4.0, 4.27], [3.6, 4.47], [3.25, 4.76], [2.97, 5.1],
      [2.74, 5.45], [2.52, 5.8], [2.31, 6.15], [2.11, 6.5], [1.94, 6.85], [1.8, 7.2], [1.67, 7.55], [1.56, 7.9],
      [1.46, 8.25], [1.37, 8.6], [1.29, 8.95], [1.22, 9.3], [1.17, 9.65], [1.14, 10.0], [1.13, 10.38, 1], [0, 10.38],
    ],
    foot: { r: 4.8, h: 0.25 },
  },
  hat: {
    profile: [
      [1.15, 10.36], [4.82, 10.36, 1], [4.86, 10.14, 1], [4.98, 10.12], [5.04, 10.18, 1],
      // straight cone, evenly spaced, a small roll into the flat top
      [4.98, 10.6], [4.855, 11.1], [4.73, 11.6], [4.6, 12.1], [4.47, 12.6], [4.345, 13.1], [4.22, 13.6], [4.095, 14.1],
      [3.97, 14.6], [3.85, 15.1], [3.735, 15.6], [3.645, 15.98], [3.615, 16.06], [3.565, 16.095], [3.505, 16.105, 1],
      // the flat top, then the call button's metal pin with a dark cap, inside its clear cap (`glass`)
      [0.16, 16.11, 1], [0.16, 16.93, 1], [0.2, 16.94], [0.2, 16.98], [0.17, 17, 1], [0, 17],
    ],
    led: { y: 10.35, rIn: 1.17, rOut: 4.8 },
    // the top face reads light silver on every finish photo, black included
    fixed: [
      { from: 16.105, to: 16.11, finish: "satine-nikel" },
      { from: 16.11, to: 16.93, finish: "krom" },
      { from: 16.93, to: 17, finish: "siyah" },
    ],
  },
  // the call button: a clear acrylic frustum on every finish photo
  glass: {
    profile: [[1.13, 16.11], [1.11, 16.3], [1.06, 16.52], [1.0, 16.74], [0.95, 16.86], [0.88, 16.91], [0.7, 16.92], [0, 16.92]],
    thickness: 0.3,
  },
  light: { kelvin: 2700, lumen: 550, y: 10.35, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default menkent;
