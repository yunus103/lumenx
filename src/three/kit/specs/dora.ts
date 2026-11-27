import type { KitSpec } from ".";

// Height 205 mm from the gallery's dimension photo (which also labels an 110 mm body, a 55 mm stem and a 30 mm hat),
// proportions from the studio photo: body and stem match the labels, while the hat measures Ø107 at the rim, Ø88 on
// top and ~37 mm high, and the lower bead Ø85 (labelled 95/80/30, base Ø80; the dimension photo's own arrows span the
// larger sizes). The hat's underside is in no photo: a flat wooden plate round the brass bushing with an LED ring
// reaching most of the way to the rim, as Poyraz's; the night photos show the stem lit under it.
const dora: KitSpec = {
  body: {
    // a vertical pith far behind the lamp: straight streaks on the neck as in the night photo; the rings kept faint, since
    // they draw ovals on the beads that the day photo, fine level flecks all over, does not show
    grain: { pith: [0.4, 8, -30], dir: [0.02, 1, 0], ring: 0.2, contrast: 0.2, pores: 2 },
    profile: [
      // lower bead on the rubber foot
      [0, 0.25], [3.3, 0.25, 1], [3.55, 0.36], [3.73, 0.56], [3.87, 0.8], [3.99, 1.07], [4.09, 1.3], [4.16, 1.55], [4.21, 1.82],
      [4.23, 2.08], [4.21, 2.38], [4.15, 2.68], [4.04, 2.97], [3.88, 3.24], [3.64, 3.47], [3.4, 3.66], [3.24, 3.77, 1],
      // middle bead, its flat underside tucked into the crease
      [3.34, 3.84], [3.44, 3.93], [3.53, 4.07], [3.61, 4.25], [3.68, 4.45], [3.73, 4.65], [3.77, 4.88], [3.78, 5.1],
      [3.76, 5.32], [3.72, 5.54], [3.65, 5.76], [3.54, 5.98], [3.39, 6.2], [3.18, 6.42], [2.94, 6.62], [2.74, 6.76, 1],
      // a fine groove under the neck, then the neck's concave flare up to the brass plate
      [2.64, 6.79, 1], [2.64, 6.85, 1], [2.71, 6.88, 1],
      [2.67, 7.1], [2.58, 7.35], [2.47, 7.6], [2.36, 7.9], [2.27, 8.2], [2.19, 8.5], [2.12, 8.8], [2.06, 9.1],
      [2.01, 9.4], [1.965, 9.7], [1.925, 10], [1.89, 10.3], [1.86, 10.6], [1.835, 10.85], [1.82, 10.96, 1],
      // thin brass plate, the round bushing on it, the stem, and a short bushing up into the hat
      [1.78, 10.96, 1], [1.78, 11.08], [1.76, 11.11], [1.73, 11.12, 1],
      [0.64, 11.12, 1], [0.71, 11.15], [0.745, 11.21], [0.755, 11.28], [0.73, 11.37], [0.67, 11.45], [0.57, 11.52],
      [0.475, 11.55, 1],
      [0.475, 16.42, 1], [0.6, 16.44], [0.66, 16.48], [0.69, 16.55, 1], [0.69, 16.82, 1], [0, 16.82],
    ],
    foot: { r: 3.2, h: 0.25 },
    fixed: [{ from: 10.96, to: 16.82, finish: "gold", brush: 0.4 }],
  },
  hat: {
    // a side-grain blank of its own: level streaks round the cone, parallel lines across the top
    grain: { pith: [0, -80, -5], dir: [1, 0.03, 0.08], ring: 0.3, contrast: 0.9, pores: 0.5 },
    profile: [
      // flat underside, the rim rolling up into the straight cone, a softened top edge
      [0.69, 16.82], [4.8, 16.82, 1], [5.0, 16.85], [5.14, 16.91], [5.24, 16.99], [5.3, 17.08], [5.33, 17.18],
      [5.24, 17.46], [5.12, 17.86], [5.0, 18.26], [4.88, 18.66], [4.76, 19.06], [4.64, 19.46], [4.52, 19.86],
      [4.41, 20.22], [4.37, 20.32], [4.31, 20.4], [4.22, 20.465], [4.1, 20.5, 1],
      // brass touch disc on the top, barely proud
      [1.04, 20.5, 1], [1.04, 20.505, 1], [1.04, 20.53], [1.02, 20.55], [0.96, 20.56], [0, 20.56],
    ],
    led: { y: 16.81, rIn: 0.75, rOut: 4.3, wash: { metal: 0.15 } },
    fixed: [{ from: 20.505, to: 20.6, finish: "gold", brush: 0.4 }],
  },
  details: [
    { type: "usbc", y: 1.35, x: 2.27, side: "front", r: 0.63 },
    { type: "hole", y: 1.27, x: 0.58, side: "front", r: 0.09 },
  ],
  // the photos' stain (glossy red-brown stained oak), not the ceviz calibrated on Defne
  woodTone: { ceviz: { early: "#c16a2e", late: "#793813", rough: 0.4, clearcoat: 0.5, coatRough: 0.22, contrast: 1.4 } },
  light: { kelvin: 2700, lumen: 550, y: 16.81, dimmer: [0.4, 0.7, 1], body: 0.012, bounce: 200 },
};

export default dora;
