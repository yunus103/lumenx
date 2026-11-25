import type { KitSpec } from ".";

// Height 190 mm from the 2027 catalogue and the dimension photo, proportions from the studio photo (seen from ~20°
// above): base Ø77.6, hat Ø72 / top Ø~45, where both sources say Ø70 / Ø65 / Ø45. The metal parts are satin nickel
// whatever wood is picked (`fixed`). The hat's underside is unseen: a flat LED plate as on the other cone hats.
const sumbul: KitSpec = {
  body: {
    grain: { pith: [0.4, 1.4, 0], dir: [0.1, 0.15, 1], ring: 0.18, contrast: 0.58 },
    profile: [
      [0, 0.08], [1.12, 0.08, 1], [1.19, 0.1], [1.64, 0.22], [2.13, 0.47], [2.63, 0.82], [3.0, 1.25], [3.31, 1.7],
      [3.54, 2.15], [3.7, 2.6], [3.8, 3.05], [3.85, 3.48, 1],
      // the thin groove round the bulb, the USB-C port sits in it
      [3.62, 3.5, 1], [3.62, 3.6, 1], [3.86, 3.62, 1],
      [3.88, 4.0], [3.85, 4.5], [3.76, 5.0], [3.59, 5.5], [3.32, 6.0], [3.01, 6.45], [2.86, 6.68],
      // a soft lip where the bulb meets the neck
      [2.78, 6.76], [2.69, 6.8, 1], [2.58, 6.95], [2.43, 7.3], [2.22, 7.7], [2.03, 8.1], [1.88, 8.5], [1.77, 8.9],
      [1.69, 9.2, 1], [1.57, 9.2, 1], [1.57, 9.22, 1],
      // satin nickel: the disc on the wood, the collar at the stem's foot, the stem
      [1.57, 9.38], [1.53, 9.44], [1.46, 9.47, 1], [0.72, 9.47, 1], [0.72, 9.6], [0.68, 9.68], [0.59, 9.72],
      [0.51, 9.73, 1], [0.51, 16.8, 1], [0, 16.8],
    ],
    foot: { r: 1.06, h: 0.08 },
    fixed: [
      // the groove's faces dark: the kit has no occlusion, so its lit floor would read as a light line, not the
      // photo's dark one
      { from: 3.48, to: 3.62, finish: "siyah", rough: 0.7 },
      { from: 9.22, to: 16.8, finish: "satine-nikel" },
    ],
  },
  hat: {
    profile: [
      [0.49, 16.6], [0.51, 16.6], [0.65, 16.64], [0.72, 16.72], [0.74, 16.8, 1], [3.4, 16.8, 1],
      // a short upright skirt at the rim
      [3.45, 16.72, 1], [3.55, 16.72], [3.6, 16.75], [3.61, 16.82, 1], [3.61, 16.96, 1],
      // a straight cone, a rounded shoulder into the flat top
      [3.42, 17.22], [3.28, 17.48], [3.13, 17.75], [2.97, 18.0], [2.81, 18.25], [2.66, 18.5], [2.53, 18.69],
      [2.44, 18.81], [2.33, 18.92], [2.18, 18.98], [2, 19, 1], [0, 19],
    ],
    led: { y: 16.79, rIn: 0.76, rOut: 3.3, wash: { metal: 0 } },
    // the photo shows fine horizontal brushing on the hat
    fixed: [{ from: 16.6, to: 19, finish: "satine-nikel", brush: 0.45 }],
  },
  details: [
    { type: "button", y: 5.95, x: -1.9, side: "front", r: 0.27 },
    { type: "usbc", y: 3.65, x: -2.1, side: "front", r: 0.68 },
  ],
  light: { kelvin: 2700, lumen: 550, y: 16.79, dimmer: [0.4, 0.7, 1], body: 0.015, bounce: 200 },
};

export default sumbul;
