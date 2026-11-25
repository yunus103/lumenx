import type { KitSpec } from ".";

// No datasheet yet (new product). Sizes from the gallery's dimension photo: 26 cm high, a Ø14.5 × 5 cm hat, a 20 cm
// stem, a Ø10 base 7 mm thick; its drawing agrees with them, and so does the 2027 catalogue (H 260, Ø145 / Ø100). The white studio photo draws the base wider (~Ø11.7 at
// the same hat), the lifestyle photo ~Ø10.5, so the labels win. A brushed metal disc base on a black rubber foot, a
// small collar where the stem stands, a thin straight stem and a wide drum hat with a flat top. The hat's underside
// isn't in any photo: the LED plate is recessed inside a thin rim as on Agena. The night photo lights the stem.
const bahar: KitSpec = {
  body: {
    profile: [
      [0, 0.3], [4.9, 0.3, 1], [4.96, 0.33], [4.99, 0.39], [5.0, 0.45, 1],
      // disc wall, a small roll into the flat top
      [5.0, 0.86, 1], [4.99, 0.93], [4.95, 0.98], [4.88, 1.0, 1],
      // collar where the stem stands
      [0.83, 1.0, 1], [0.83, 1.2, 1], [0.82, 1.26], [0.79, 1.3], [0.74, 1.32, 1],
      // stem, running up into the hat
      [0.67, 1.32, 1], [0.67, 5.3], [0.67, 9.27], [0.67, 13.26], [0.67, 17.25], [0.67, 21.24, 1], [0, 21.24],
    ],
    foot: { r: 4.85, h: 0.3 },
    brush: 0.3,
  },
  hat: {
    profile: [
      // LED plate, a thin lip below the rim
      [0.67, 21.24], [7.07, 21.24, 1], [7.1, 21.0, 1], [7.19, 21.0], [7.23, 21.02], [7.25, 21.07, 1],
      // drum wall, a small roll into the flat top
      [7.25, 22.2], [7.25, 23.4], [7.25, 24.6], [7.25, 25.8, 1], [7.24, 25.89], [7.21, 25.95], [7.16, 25.99], [7.09, 26.0, 1], [0, 26.0],
    ],
    led: { y: 21.23, rIn: 0.72, rOut: 7.0, wash: { metal: 0.25 } },
    brush: 0.3,
  },
  light: { kelvin: 2700, lumen: 550, y: 21.23, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default bahar;
