import type { KitSpec } from ".";

// Height 160 mm from the datasheet (top of the knob), proportions from the one photo (gold): a Ø125 dome hat over a
// Ø92 base. The datasheet says Ø135, and its drawing puts the 135 line on the hat but starts the 160 line at the dome,
// below the knob; at Ø135 the lamp would stand 173 mm. The base is a short drum with a crisp shoulder into a straight
// cone, on a black rubber foot; the hat a near-hemispherical spun dome with an oblate ball knob on a thin washer. Its
// underside isn't in the photo, so the LED plate is recessed 3 mm as Heli's. Charge port and touch key are underneath,
// unseen.
const torino: KitSpec = {
  body: {
    profile: [
      [0, 0.5], [4.52, 0.5, 1], [4.562, 0.507], [4.584, 0.527], [4.59, 0.55, 1],
      // straight drum, a crisp 1.5 mm round shoulder, then the straight cone up into the hat (no points along the
      // cone: a straight run stays straight, its reflections don't waver); corners where the runs meet tangentially
      [4.59, 1.623, 1], [4.589, 1.639], [4.586, 1.656], [4.582, 1.671], [4.576, 1.687, 1], [1.071, 9.15, 1], [0, 9.15],
    ],
    foot: { r: 4.65, h: 0.5 },
    // the photo shows fine horizontal brushing on hat and cone
    brush: 0.5,
  },
  hat: {
    profile: [
      [1.051, 9.15], [6.134, 9.15, 1], [6.194, 8.88, 1], [6.254, 8.88, 1],
      // dome, a superellipse fitted to the photo, points spaced evenly along the arc
      [6.274, 8.936], [6.258, 9.272], [6.208, 9.666], [6.131, 10.054], [6.028, 10.437], [5.902, 10.813], [5.754, 11.181], [5.585, 11.539],
      [5.395, 11.888], [5.186, 12.224], [4.958, 12.549], [4.713, 12.86], [4.449, 13.157], [4.17, 13.438],
      [3.874, 13.702], [3.564, 13.948], [3.239, 14.175], [2.9, 14.382], [2.55, 14.567], [2.188, 14.73],
      [1.817, 14.868], [1.437, 14.982], [1.051, 15.07], [0.66, 15.133, 1],
      // thin washer, then the oblate ball knob
      [0.66, 15.178], [0.635, 15.203, 1], [0.569, 15.203], [0.605, 15.297], [0.624, 15.395], [0.627, 15.495], [0.617, 15.595], [0.587, 15.69],
      [0.536, 15.776], [0.467, 15.849], [0.385, 15.906], [0.294, 15.948], [0.199, 15.977], [0.1, 15.994], [0, 16],
    ],
    led: { y: 9.14, rIn: 1.101, rOut: 6.094 },
    brush: 0.5,
  },
  light: { kelvin: 2700, lumen: 550, y: 9.14, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default torino;
