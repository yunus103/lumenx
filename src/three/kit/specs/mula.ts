import type { KitSpec } from ".";

// Height 150 mm from the datasheet, proportions from the bronz photo: a Ø111 hemispherical hat over a Ø85 drum, not
// the datasheet's Ø120 / Ø100 (template values). A short polished drum on a thin black rubber foot, its narrow top
// ring rounding into a concave trumpet stem that runs up into the hat. The hat is a thin spun hemisphere (centred on
// its rim) with an oblate ball knob; its underside isn't in any photo, so the LED plate is recessed 3 mm as Heli's.
// Charge port and touch key are underneath, unseen.
const mula: KitSpec = {
  body: {
    profile: [
      [0, 0.22], [4.12, 0.22, 1], [4.2, 0.25], [4.25, 0.31], [4.26, 0.4, 1],
      // drum wall, points spaced evenly, a soft roll into the narrow top ring
      [4.26, 0.77], [4.26, 1.14], [4.26, 1.51], [4.26, 1.88], [4.26, 2.25], [4.26, 2.6],
      [4.25, 2.68], [4.22, 2.76], [4.17, 2.81], [4.1, 2.83, 1],
      // concave fillet into the trumpet stem
      [3.95, 2.85], [3.8, 2.9], [3.64, 2.98], [3.48, 3.09], [3.33, 3.21], [3.2, 3.32],
      [3.068, 3.45], [2.827, 3.689], [2.603, 3.943], [2.396, 4.211], [2.205, 4.491], [2.033, 4.783], [1.877, 5.084],
      [1.737, 5.392], [1.611, 5.707], [1.498, 6.026], [1.397, 6.35], [1.306, 6.676], [1.223, 7.005], [1.148, 7.335],
      [1.079, 7.667], [1.015, 8.0], [0.98, 8.33], [0.97, 8.62], [0.97, 8.92, 1], [0, 8.92],
    ],
    foot: { r: 3.98, h: 0.22 },
  },
  hat: {
    profile: [
      [0.97, 8.9], [5.42, 8.9, 1], [5.45, 8.62, 1], [5.53, 8.62, 1],
      // hemisphere, points spaced evenly along the arc
      [5.55, 8.68], [5.534, 9.038], [5.496, 9.394], [5.434, 9.747], [5.35, 10.095], [5.244, 10.437], [5.116, 10.771],
      [4.967, 11.097], [4.797, 11.412], [4.607, 11.715], [4.398, 12.006], [4.17, 12.282], [3.925, 12.544],
      [3.664, 12.789], [3.388, 13.016], [3.097, 13.226], [2.794, 13.416], [2.479, 13.586], [2.153, 13.735],
      [1.819, 13.864], [1.477, 13.97], [1.129, 14.054], [0.776, 14.115], [0.42, 14.154, 1],
      // oblate ball knob
      [0.49, 14.299], [0.53, 14.435], [0.529, 14.576], [0.485, 14.711], [0.402, 14.83], [0.287, 14.922],
      [0.15, 14.98], [0, 15],
    ],
    led: { y: 8.89, rIn: 1.0, rOut: 5.4 },
  },
  light: { kelvin: 2700, lumen: 550, y: 8.89, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default mula;
