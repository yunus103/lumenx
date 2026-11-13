import type { KitSpec } from ".";

// Height 280 mm from the datasheet, proportions from the siyah studio photo (its advertising banner masked out) and
// the clean pembe-3 photo, which agree: a Ø111 base and a Ø133 hat, not the datasheet's template Ø120 / 100 mm.
// Matte ABS (the Ekonomik datasheet). The hat is a spherical cap (R 6.74 cm) with a knob, over a white diffuser
// recessed inside its thin rim (the photos lying on their side show it nearly rim to rim). The base has a seam groove
// low on the drum, a stepped boss where the stem enters and a grey indicator dot at the front; underneath it is a
// black felt pad. Charge port unseen.
const plastica: KitSpec = {
  body: {
    profile: [
      [0, 0.1], [4.9, 0.1, 1], [5.15, 0.15], [5.38, 0.28], [5.5, 0.42], [5.56, 0.6],
      // seam groove of the bottom cap
      [5.56, 1.14, 1], [5.53, 1.17, 1], [5.53, 1.21, 1], [5.56, 1.24, 1],
      // wall, a soft roll into the top face, then the sloped boss and its shelf
      [5.56, 3.2, 1], [5.53, 3.42], [5.45, 3.58], [5.32, 3.7], [5.1, 3.79, 1],
      [4.4, 3.9, 1], [4.25, 4.0], [4.0, 4.15], [3.6, 4.33], [3.2, 4.48], [2.8, 4.6], [2.45, 4.67, 1],
      [2.27, 4.7, 1],
      // rounded ring, a fillet into the tapered stem, running up into the hat
      [2.26, 4.95], [2.2, 5.1], [2.05, 5.18], [1.75, 5.22], [1.6, 5.26], [1.54, 5.31], [1.52, 5.38, 1],
      [1.14, 21.8, 1], [0, 21.8],
    ],
    foot: { r: 5.0, h: 0.1 },
  },
  hat: {
    profile: [
      [1.12, 21.76], [6.36, 21.76, 1], [6.4, 21.5, 1], [6.56, 21.47], [6.63, 21.52],
      // spherical cap, evenly spaced along the arc
      [6.65, 21.6], [6.509, 22.249], [6.306, 22.88], [6.041, 23.489], [5.718, 24.068], [5.339, 24.613],
      [4.909, 25.118], [4.431, 25.579], [3.91, 25.99], [3.351, 26.348], [2.76, 26.649], [2.142, 26.891],
      [1.503, 27.07], [0.85, 27.186, 1],
      // knob
      [0.85, 27.3], [0.83, 27.5], [0.76, 27.7], [0.62, 27.86], [0.42, 27.96], [0.22, 27.995], [0, 28],
    ],
    // the night photo shows the stem lit under the hat, fading down
    led: { y: 21.75, rIn: 1.17, rOut: 6.34, wash: { metal: 0 } },
  },
  details: [{ type: "button", y: 3.1, x: -0.2, side: "front", r: 0.25, ring: "satine-nikel" }],
  light: { kelvin: 2700, lumen: 350, y: 21.75, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default plastica;
