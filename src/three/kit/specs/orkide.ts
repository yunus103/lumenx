import type { KitSpec } from ".";

// A price-list lamp with no datasheet: H 225 mm, base Ø80 and head Ø70 from the 2027 catalogue (page 32, the same
// photo as the price list's, a little larger). Proportions from that photo: the head Ø70 is the hat's flat top, the
// rim comes out Ø100 and the lower bulge Ø85 (the catalogue's Ø80 may be rounded down). Turned oak: a rounded underside
// on a felt pad, two stacked bulges with a V groove between them, a concave cone up to a copper collar plate, its
// round bushing and the copper stem. The metal is brushed copper on the only photo and can't follow the wood: fixed
// `bronz` (closer to the photo's brown copper than the pinker `rose`).
// The hat's underside isn't in the photo, so its LED plate recessed inside the rim follows Akasya.
const orkide: KitSpec = {
  body: {
    grain: { pith: [-1.2, 2.6, 3.7], dir: [1, 0.08, -0.5], ring: 0.18, contrast: 0.36 },
    profile: [
      [0, 0.1], [2.5, 0.1, 1],
      // the rounded underside and the lower bulge, up to the V groove
      [2.85, 0.14], [3.13, 0.24], [3.37, 0.4], [3.56, 0.6], [3.71, 0.84], [3.83, 1.1], [3.93, 1.38], [4.03, 1.66],
      [4.11, 1.95], [4.18, 2.24], [4.22, 2.5], [4.23, 2.74], [4.203, 3.037], [4.144, 3.333],
      [4.053, 3.621], [3.928, 3.895], [3.771, 4.152], [3.54, 4.386], [3.25, 4.59, 1],
      // the upper bulge, its shoulder meeting the cone at a soft crease
      [3.44, 4.775], [3.597, 4.975], [3.688, 5.2], [3.752, 5.435], [3.781, 5.677], [3.764, 5.919], [3.711, 6.157],
      [3.619, 6.382], [3.483, 6.583], [3.317, 6.761], [3.128, 6.914], [2.926, 7.051], [2.72, 7.18, 1],
      [2.591, 7.475], [2.492, 7.781], [2.421, 8.095], [2.349, 8.408], [2.284, 8.724], [2.228, 9.04], [2.172, 9.357],
      [2.117, 9.674], [2.061, 9.991], [2.011, 10.309], [1.978, 10.629], [1.95, 10.95, 1],
      // copper: the collar plate with a rounded top edge, the round bushing, the stem running up into the hat
      [1.97, 10.95, 1], [1.98, 10.97], [1.98, 11.23], [1.95, 11.3], [1.88, 11.32, 1],
      [0.74, 11.32, 1], [0.74, 11.56], [0.71, 11.65], [0.63, 11.69], [0.56, 11.7, 1],
      [0.5, 11.7, 1], [0.5, 17.2, 1], [0, 17.2],
    ],
    foot: { r: 2.5, h: 0.1 },
    fixed: [{ from: 10.95, to: 17.2, finish: "bronz", brush: 0.45 }],
  },
  hat: {
    profile: [
      [0.48, 17.05],
      // LED plate, the thin spun cone's inside down to a small rounded bead at the rim
      [4.8, 17.05, 1], [4.92, 16.8, 1], [4.95, 16.76], [5.0, 16.75], [5.04, 16.78], [5.05, 16.84, 1],
      // straight cone, a soft roll into the flat top
      [3.53, 22.12, 1], [3.5, 22.22], [3.44, 22.28], [3.36, 22.3, 1], [0, 22.3],
    ],
    led: { y: 17.04, rIn: 0.55, rOut: 4.78 },
    fixed: [{ from: 16.75, to: 22.3, finish: "bronz", brush: 0.45 }],
  },
  details: [
    { type: "button", y: 5.5, x: 2.3, side: "front", r: 0.28 },
    { type: "usbc", y: 2.1, x: 2.4, side: "front", r: 0.58 },
    { type: "hole", y: 1.9, x: 0.5, side: "front", r: 0.08 },
  ],
  light: { kelvin: 2700, lumen: 550, y: 17.04, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default orkide;
