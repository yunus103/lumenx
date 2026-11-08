import type { KitSpec } from ".";

// Height 280 mm from the datasheet, proportions from the one photo (rose): a Ø131 hat over a Ø108 base. The datasheet
// drawing has the photo's proportions too (2.15 hats high), so its 120 mm hat label doesn't fit its own 280 mm height.
// The base top is flat and polished (the stem's ring mirrors in it), on a thin black rubber foot. The hat is a thin
// spun dome with a ball knob; its underside isn't in the photo, so the LED plate is recessed 3 mm as Sirius's.
// Charge port and touch key are underneath, unseen.
const heli: KitSpec = {
  body: {
    profile: [
      [0, 0.2], [5.25, 0.2, 1], [5.33, 0.23], [5.37, 0.3], [5.38, 0.4, 1],
      // drum wall, a soft roll into the flat top
      [5.36, 3.9, 1], [5.33, 4.06], [5.26, 4.15], [5.15, 4.2, 1],
      // ring where the stem stands on the base, its top edge bevelled
      [1.04, 4.2, 1], [1.04, 4.49], [1.02, 4.56], [0.96, 4.59, 1],
      // straight stem, then the collar it runs into the hat with
      [0.874, 4.59, 1], [0.874, 20.88, 1], [0.99, 20.88, 1], [0.99, 21.66, 1], [0, 21.66],
    ],
    foot: { r: 5.3, h: 0.2 },
  },
  hat: {
    profile: [
      [0.99, 21.64], [6.4, 21.64, 1], [6.44, 21.35, 1], [6.53, 21.35, 1], [6.555, 21.42],
      // dome, points spaced evenly along the arc
      [6.45, 21.781], [6.302, 22.199], [6.131, 22.612], [5.939, 23.013], [5.716, 23.4], [5.463, 23.764],
      [5.189, 24.116], [4.903, 24.456], [4.585, 24.77], [4.258, 25.069], [3.903, 25.341], [3.54, 25.594],
      [3.152, 25.817], [2.758, 26.02], [2.35, 26.201], [1.927, 26.333], [1.495, 26.446], [1.056, 26.512],
      [0.616, 26.57, 1],
      // ball knob
      [0.749, 26.803], [0.815, 27.027], [0.816, 27.262], [0.75, 27.488], [0.624, 27.685], [0.446, 27.839],
      [0.232, 27.936], [0, 27.97],
    ],
    led: { y: 21.63, rIn: 1.0, rOut: 6.38 },
  },
  light: { kelvin: 2700, lumen: 550, y: 21.63, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default heli;
