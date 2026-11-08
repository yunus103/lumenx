import type { KitSpec } from ".";

// Height 280 mm from the datasheet, proportions from the one photo (the hat comes out Ø124 against the sheet's Ø120,
// the dome Ø97 against its Ø100). A dome on a thin black rubber foot, a straight stem in a rounded collar, a mushroom
// hat. The photo's stem and collar are brass against the painted body; the kit takes one finish. Charge port and touch
// key are underneath, unseen.
const mensa: KitSpec = {
  body: {
    profile: [
      [0, 0.42], [4.5, 0.42, 1], [4.66, 0.46], [4.77, 0.57], [4.82, 0.77], [4.85, 1.05],
      // the dome: a near-vertical lower wall rounding into a flat crown
      [4.83, 1.6], [4.77, 2.2], [4.64, 2.7], [4.45, 3.2], [4.12, 3.7], [3.7, 4.12], [3.18, 4.5], [2.6, 4.8],
      [2.0, 5.02], [1.4, 5.15], [0.9, 5.2, 1],
      // the rounded collar the stem stands in
      [0.76, 5.21], [0.78, 5.32], [0.79, 5.43], [0.76, 5.55], [0.66, 5.62], [0.56, 5.65, 1], [0.42, 5.66, 1],
      [0.42, 24.15, 1], [0, 24.15],
    ],
    foot: { r: 4.5, h: 0.42 },
  },
  hat: {
    // the underside is a flat LED disc in a shallow curved rim (the photo's hat outline dips to the stem, more
    // than its camera, level with the hat, can show of a flat bottom)
    profile: [
      [0.42, 24.15], [3.4, 24.15, 1], [4.3, 24.25], [5.3, 24.4], [5.85, 24.52], [6.08, 24.61], [6.17, 24.7], [6.2, 24.82],
      [6.17, 25.1], [6.09, 25.5], [5.98, 25.95], [5.79, 26.35], [5.52, 26.72], [5.14, 27.05], [4.66, 27.32], [4.1, 27.54],
      [3.3, 27.72], [2.4, 27.86], [1.4, 27.95], [0, 28],
    ],
    led: { y: 24.14, rIn: 0.5, rOut: 3.35 },
  },
  light: { kelvin: 2700, lumen: 550, y: 24.14, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default mensa;
