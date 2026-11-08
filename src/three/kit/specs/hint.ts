import type { KitSpec } from ".";

// The Uzun (tall) Hint, the product's main photo. The datasheet (175 mm, Ø120 hat 35 mm thick, 100 mm base) draws
// and photographs the Kısa: the Kısa photo fits it. The Uzun shares the Kısa's base and stem (Ø78 drum, Ø15 stem, in
// the same ratio in both photos), so its height, 230 mm, comes from that Ø78 base; its drum then measures 100 mm high,
// as the datasheet's. Its hat is its own, thinner: Ø127, 31 mm. A painted drum with a softly rounded bottom edge, a
// rounded collar at the stem's foot, a flat disc hat. Charge port and touch key are underneath, unseen; the hat's
// underside isn't shown, so its LED plate follows Agena's: recessed a little inside a thin rim.
const hint: KitSpec = {
  body: {
    profile: [
      [0, 0.12], [3.66, 0.12, 1], [3.76, 0.15], [3.83, 0.21], [3.87, 0.29], [3.89, 0.38], [3.895, 0.48, 1],
      // drum, a small roll into its flat top, then the collar at the stem's foot
      [3.92, 10.0, 1], [3.91, 10.09], [3.88, 10.15], [3.82, 10.19], [3.74, 10.2, 1],
      [1.0, 10.2, 1], [1.0, 10.42], [0.98, 10.51], [0.93, 10.57], [0.86, 10.6, 1], [0.78, 10.6, 1],
      [0.78, 19.95, 1], [0, 19.95],
    ],
    foot: { r: 3.66, h: 0.12 },
  },
  hat: {
    profile: [
      [0.78, 19.94], [5.92, 19.94, 1], [5.95, 19.8, 1], [6.24, 19.77, 1], [6.33, 19.79], [6.37, 19.86, 1],
      [6.37, 22.8, 1], [6.355, 22.9], [6.32, 22.965], [6.25, 22.995], [6.2, 23, 1], [0, 23],
    ],
    led: { y: 19.93, rIn: 0.85, rOut: 5.9 },
  },
  light: { kelvin: 2700, lumen: 550, y: 19.93, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default hint;
