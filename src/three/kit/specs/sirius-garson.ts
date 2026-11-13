import type { KitSpec } from ".";

// Height 240 mm from the datasheet, proportions from the seven finish photos (one studio render recoloured: the
// outlines are identical). They are shot from close and above (camera ~40 cm high, ~72 cm away: the base's top face
// and the hat's rim show as wide ellipses), which fitted gives Ø98 base and Ø127 hat; the datasheet's Ø100 / Ø120 are
// its template values. The stem is a hexagon (face widths 0.58 : 1 : 0.42 across the photo). The call button keeps one
// satin silver finish on every finish photo (mirror chrome only on the krom one). The hat's underside isn't in any
// photo, so the LED disc is copied from Sirius: a flat plate recessed inside the rim. No night photo: no stem wash.
const siriusGarson: KitSpec = {
  body: {
    profile: [
      [0, 0.55], [4.8, 0.55, 1], [4.85, 0.6], [4.88, 0.7, 1], [4.88, 1.2], [4.88, 1.8],
      // drum wall, a soft roll into the flat top, then the bell collar: a concave flare, a convex shoulder, the neck
      [4.88, 2.45, 1], [4.86, 2.57], [4.79, 2.64], [4.69, 2.67, 1], [3, 2.67, 1], [2.66, 2.77],
      [2.41, 2.93], [2.27, 3.16], [2.18, 3.4], [2.12, 3.64], [2.06, 3.89], [1.97, 4.11],
      [1.85, 4.29], [1.7, 4.46], [1.55, 4.58], [1.46, 4.66], [1.42, 4.7, 1], [1.42, 4.85, 1],
      [1.32, 4.85, 1],
      // hexagonal stem, tapering up into the hat
      [1.3, 4.9, 1], [1.16, 11.5], [0.97, 18.3, 1], [0, 18.3],
    ],
    foot: { r: 4.77, h: 0.55 },
    facets: { n: 6, across: "corners", from: 4.9, to: 18.3, angle: 0 },
  },
  hat: {
    profile: [
      // LED plate, a thin lip below the rim
      [0.97, 18.28], [6.07, 18.28, 1], [6.15, 18, 1], [6.26, 18, 1], [6.3, 18.1], [6.35, 18.3],
      // a deep dome, fuller near the top than an ellipse
      [6.32, 18.61], [6.25, 18.91], [6.17, 19.21], [6.06, 19.5], [5.94, 19.78], [5.8, 20.06],
      [5.65, 20.33], [5.48, 20.59], [5.3, 20.84], [5.11, 21.08], [4.9, 21.31], [4.69, 21.53],
      [4.46, 21.74], [4.22, 21.94], [3.97, 22.12], [3.71, 22.29], [3.45, 22.44], [3.17, 22.58],
      [2.88, 22.71], [2.59, 22.82], [2.3, 22.91], [2, 22.99], [1.69, 23.05], [1.4, 23.1, 1],
      // the call button: a thin flange and a slightly tapered cap with a flat top
      [1.4, 23.2], [1.35, 23.23], [1.2, 23.24, 1], [1.18, 23.4], [1.15, 23.5], [1.12, 23.7],
      [1.08, 23.84], [1.01, 23.94], [0.91, 23.99], [0.7, 24, 1], [0, 24],
    ],
    led: { y: 18.27, rIn: 1, rOut: 6.05 },
    fixed: [{ from: 23.1, to: 24, finish: "satine-nikel" }],
  },
  light: { kelvin: 2700, lumen: 550, y: 18.27, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default siriusGarson;
