import type { KitSpec } from ".";

// Height 195 mm from the gallery's dimension photo, proportions from the studio photo (its silhouette top is the back
// of the hat's top face, seen from ~8 deg above, so heights are stretched 2.6% to put the top face itself at 195 mm):
// a Ø67 body (label 65) and a Ø105 hat rim (label 95; the dimension photo itself measures ~104), its top Ø84 (the
// label's Ø38 spans the brass disc's surround, a template value). The hat's underside is in no photo: a recessed LED
// plate inside a thin rim, as Aran's.
const deren: KitSpec = {
  body: {
    // oak: a vertical pith well behind the body gives straight streaks on the wall and long arcs on the dome
    grain: { pith: [0.3, 4, -22], dir: [0, 1, 0], ring: 0.18, contrast: 0.3, pores: 1.6 },
    profile: [
      [0, 0.205], [3.24, 0.205, 1], [3.3, 0.236], [3.33, 0.308], [3.335, 0.411],
      // straight wall, evenly spaced, into a quarter-ellipse dome (centre 8.09, 33.4 x 32.6 mm), cut flat at the plate
      [3.335, 0.924], [3.335, 1.437], [3.335, 1.95], [3.335, 2.463], [3.335, 2.976], [3.335, 3.489], [3.335, 4.003],
      [3.335, 4.516], [3.335, 5.029], [3.335, 5.542], [3.335, 6.055], [3.335, 6.568], [3.335, 7.082], [3.335, 7.595],
      [3.335, 8.087], [3.322, 8.375], [3.283, 8.66], [3.219, 8.941], [3.13, 9.215], [3.016, 9.48], [2.879, 9.735],
      [2.719, 9.977], [2.539, 10.204], [2.339, 10.414], [2.12, 10.607, 1],
      // thin brass plate, the round-topped bushing on it, the stem running up into the hat
      [2.1, 10.607, 1], [2.12, 10.628], [2.13, 10.669], [2.13, 10.73], [2.11, 10.771], [2.07, 10.787, 1],
      [0.74, 10.787, 1], [0.75, 10.848], [0.75, 10.951], [0.72, 11.053], [0.64, 11.125], [0.54, 11.151, 1],
      [0.48, 11.151, 1], [0.48, 15.785, 1], [0, 15.785],
    ],
    foot: { r: 3.22, h: 0.205 },
    fixed: [{ from: 10.607, to: 15.785, finish: "gold", brush: 0.35 }],
  },
  hat: {
    // a side-grain blank of its own: level streaks round the cone (the photo's cross-hatched oak rays), parallel on top
    grain: { pith: [0, 18, -70], dir: [1, 0.01, 0.05], ring: 0.15, contrast: 0.35, pores: 1.0 },
    profile: [
      // LED plate recessed inside a thin rim, the rim rolling round into the widest point, the straight cone, a
      // softened top edge
      [0.48, 15.836], [4.5, 15.836, 1], [4.5, 15.785, 1], [4.95, 15.785], [5.1, 15.81], [5.2, 15.87], [5.255, 15.96],
      [5.275, 16.06], [5.27, 16.15], [5.197, 16.45], [5.124, 16.75], [5.051, 17.05], [4.978, 17.35],
      [4.905, 17.65], [4.833, 17.95], [4.760, 18.25], [4.687, 18.55], [4.614, 18.85], [4.541, 19.15],
      [4.5, 19.3], [4.44, 19.4], [4.35, 19.465], [4.22, 19.5, 1],
      // brass disc on the top, nearly flush
      [1, 19.5, 1], [1, 19.503, 1], [1, 19.531], [0.98, 19.546], [0.85, 19.546], [0, 19.546],
    ],
    // the night photo shows the stem lit under the hat
    led: { y: 15.83, rIn: 0.55, rOut: 4.45, wash: { metal: 0.15 } },
    fixed: [{ from: 19.503, to: 19.6, finish: "gold", brush: 0.3 }],
  },
  details: [
    { type: "usbc", y: 1.81, x: -1.0, side: "front", r: 0.65 },
    { type: "hole", y: 2.3, x: -2.68, side: "front", r: 0.08 },
  ],
  // the photos' stain (lacquered golden-brown oak), not the ceviz calibrated on Defne
  woodTone: { ceviz: { early: "#bd7730", late: "#774014", rough: 0.5, clearcoat: 0.25, coatRough: 0.25, contrast: 1.4 } },
  light: { kelvin: 2700, lumen: 550, y: 15.83, dimmer: [0.4, 0.7, 1], body: 0.012, bounce: 200 },
};

export default deren;
