import type { KitSpec } from ".";

// Height 220 mm from the datasheet, proportions from the product render: a Ø141 hat on a Ø73-74 tube, not the
// datasheet's Ø120 (its own drawing draws the same ~1.55 height-to-hat ratio as the render, the datasheet photo too).
// A tube with a slight draft and a small roll at the foot runs up into a drum hat whose broad shoulder, flatter than
// a quarter circle, bends into a slightly domed top. The hat's underside is unseen: an LED ring around the tube
// inside a thin rim, as on Orben.
const verona: KitSpec = {
  body: {
    profile: [
      [0, 0.1], [3.54, 0.1, 1], [3.586, 0.109], [3.625, 0.135], [3.651, 0.174], [3.66, 0.22, 1],
      [3.71, 13.6, 1], [0, 13.6],
    ],
    foot: { r: 3.45, h: 0.1 },
  },
  hat: {
    profile: [
      [3.73, 13.6], [6.83, 13.6, 1], [6.86, 13.4, 1], [6.98, 13.4], [7.04, 13.42], [7.07, 13.47, 1],
      // drum wall, then the shoulder and the domed top (a superellipse fitted to the render), evenly spaced so the
      // spline can't fold
      [7.07, 13.802], [7.07, 14.134], [7.07, 14.466], [7.07, 14.798], [7.07, 15.13], [7.07, 15.462], [7.07, 15.794],
      [7.07, 16.126], [7.07, 16.458], [7.07, 16.79], [7.069, 17.121], [7.068, 17.453], [7.066, 17.785], [7.06, 18.117],
      [7.046, 18.449], [7.022, 18.78], [6.981, 19.109], [6.917, 19.435], [6.825, 19.754], [6.696, 20.059],
      [6.529, 20.346], [6.323, 20.606], [6.084, 20.837], [5.819, 21.036], [5.535, 21.207], [5.236, 21.351],
      [4.928, 21.474], [4.612, 21.577], [4.292, 21.664], [3.968, 21.736], [3.642, 21.797], [3.313, 21.846],
      [2.984, 21.887], [2.654, 21.919], [2.323, 21.945], [1.991, 21.964], [1.66, 21.979], [1.328, 21.989],
      [0.996, 21.995], [0.664, 21.998], [0.332, 22], [0, 22],
    ],
    // the night photos show the tube glowing under the hat and fading down
    led: { y: 13.59, rIn: 3.75, rOut: 6.81, wash: { metal: 0.2 } },
  },
  // the touch key: a chrome ring round a white centre, Ø17
  details: [{ type: "button", y: 4.1, x: 2.7, side: "front", r: 0.85, ring: "krom", centre: { finish: "beyaz", r: 0.6 } }],
  light: { kelvin: 2700, lumen: 550, y: 13.59, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default verona;
