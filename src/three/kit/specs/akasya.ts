import type { KitSpec } from ".";

// Height 250 mm and a Ø65 hat top from the 2027 catalogue (and the dimension photo in the gallery), proportions from
// the photos: they give a Ø85 wood body and a Ø124 hat, not the Ø70 base of the catalogue and the dimension photo,
// nor the latter's Ø120 hat.
// The metal (collar plate, bushing, stem, hat) is copper in the catalogue, the night photo and one studio photo and
// brass in two others, on the same walnut: it doesn't follow the wood, so it is a fixed copper here. The hat's
// underside isn't in any photo, so its LED plate recessed inside the rim follows Sirius.
const akasya: KitSpec = {
  body: {
    // stained beech: one tall bullseye on the front-left of the barrel, where the pith, leaning ~19° outward, comes
    // to the surface at its widest; rings ~1.7 mm
    grain: { pith: [-1.56, 5.7, 3.85], dir: [-0.124, 0.946, 0.306], ring: 0.17, contrast: 0.6 },
    profile: [
      // the bottom rolls in to a small flat (unseen: the shadow hides it), the barrel's curve stays convex all the way
      [0, 0.1], [1.6, 0.1], [1.84, 0.124], [2.07, 0.195], [2.305, 0.314], [2.53, 0.478], [2.75, 0.687], [2.9, 0.86],
      [3.06, 1.06], [3.21, 1.26], [3.34, 1.47], [3.46, 1.7], [3.59, 1.95], [3.7, 2.22], [3.8, 2.5], [3.88, 2.78],
      [3.95, 3.06], [4.02, 3.36], [4.08, 3.66], [4.13, 3.96], [4.17, 4.28], [4.2, 4.6], [4.22, 4.9], [4.25, 5.3], [4.26, 5.7], [4.26, 6.1], [4.25, 6.5],
      [4.22, 6.9], [4.19, 7.3], [4.15, 7.7], [4.1, 8.1], [4.03, 8.5], [3.94, 8.9], [3.84, 9.3], [3.71, 9.7],
      [3.57, 10.05], [3.41, 10.4], [3.23, 10.72], [3.02, 11.0], [2.77, 11.25], [2.48, 11.45, 1], [2.38, 11.45, 1],
      // flat collar plate, the round-topped bushing on it, the stem running up into the hat
      [2.38, 11.71], [2.36, 11.76], [2.31, 11.78, 1],
      [0.79, 11.78, 1], [0.79, 12.08], [0.76, 12.2], [0.68, 12.27], [0.6, 12.28, 1],
      [0.535, 12.28, 1], [0.535, 20.26, 1], [0, 20.26],
    ],
    foot: { r: 1.55, h: 0.1 },
    // satin-brushed copper in the photos
    fixed: [{ from: 11.45, to: 20.26, finish: "rose", brush: 0.45 }],
  },
  hat: {
    profile: [
      // LED plate, the thin spun cone's inside down to a rounded rim
      [0.52, 20.1], [5.82, 20.1, 1], [6.08, 19.85, 1], [6.13, 19.84], [6.17, 19.87], [6.19, 19.9, 1],
      // straight cone, a crisp roll into the flat top
      [3.47, 23.8, 1], [3.44, 23.85], [3.39, 23.88, 1],
      // domed finial on a short drum
      [0.89, 23.88, 1], [0.89, 24.11], [0.86, 24.34], [0.77, 24.555], [0.63, 24.74], [0.445, 24.88], [0.23, 24.97],
      [0, 25],
    ],
    // the night photo shows the stem lit under the hat
    led: { y: 20.09, rIn: 0.6, rOut: 5.8, wash: { metal: 0.15 } },
    fixed: [{ from: 19.84, to: 25, finish: "rose", brush: 0.45 }],
  },
  details: [
    { type: "button", y: 4.68, x: -2.66, side: "front", r: 0.3 },
    { type: "usbc", y: 2.62, x: -2.5, side: "front", r: 0.56 },
    { type: "hole", y: 2.8, x: -3.65, side: "front", r: 0.1 },
  ],
  light: { kelvin: 2700, lumen: 550, y: 20.09, dimmer: [0.4, 0.7, 1], body: 0.012, bounce: 200 },
};

export default akasya;
