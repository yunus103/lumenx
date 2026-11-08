import type { KitSpec } from ".";

// Height 280 mm from the datasheet, proportions from the one photo (siyah). That photo is shot from close above with
// the camera pitched down, so its verticals converge and the hat looks Ø113 over a Ø82 drum; solving that camera
// from the hat's and the drum's top ellipses gives a hat 1.25 times the drum, as the site's "Üst Kafa 100, Alt 80"
// says, and Ø104 / Ø83 at 280 mm. The review's level camera can't model the pitch, so its fit shows the hat narrow.
// The hat's underside isn't shown; the LED disc is assumed, as on the other flat hats.
const rena: KitSpec = {
  body: {
    profile: [
      [0, 0.25], [4.08, 0.25, 1], [4.12, 0.29], [4.13, 0.37, 1],
      // bottom cap band, a hair inside the drum, under a fine seam
      [4.13, 1.17, 1], [4.1, 1.2, 1], [4.1, 1.24, 1], [4.16, 1.27, 1],
      [4.16, 3.5], [4.16, 6], [4.16, 8.5], [4.16, 11.6],
      // rounded rim into the flat top
      [4.15, 11.8], [4.1, 11.95], [4.0, 12.04], [3.85, 12.08, 1],
      // round nut where the stem enters
      [0.92, 12.08, 1], [0.9, 12.11], [0.88, 12.2], [0.88, 12.38], [0.85, 12.45], [0.77, 12.48, 1],
      [0.68, 12.48, 1], [0.68, 26.1, 1], [0, 26.1],
    ],
    foot: { r: 4.05, h: 0.25 },
  },
  hat: {
    profile: [
      [0.68, 26.08], [5.1, 26.08, 1], [5.17, 26.1], [5.2, 26.14], [5.21, 26.2],
      [5.21, 27.6], [5.19, 27.77], [5.13, 27.9], [5.02, 27.98], [4.88, 28, 1], [0, 28],
    ],
    led: { y: 26.07, rIn: 0.75, rOut: 4.85 },
  },
  light: { kelvin: 2700, lumen: 550, y: 26.07, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default rena;
