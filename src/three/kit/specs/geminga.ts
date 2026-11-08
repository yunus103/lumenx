import type { KitSpec } from ".";

// Height 300 mm and the Ø100 base from the datasheet, proportions from the one photo (its 45 mm hat fits the photo's
// Ø43-44). A drum with a shallow conical top, a trumpet flaring into a very thin stem with a bead at each end, and a
// small straight cone hat over an LED ring around a short hub. Black foot ring under the drum.
const geminga: KitSpec = {
  body: {
    profile: [
      [0, 0.3], [4.86, 0.3, 1], [4.9, 0.35], [4.92, 0.46, 1],
      [4.92, 1.1], [4.92, 1.75], [4.92, 2.4], [4.915, 2.78], [4.89, 2.95], [4.83, 3.05], [4.74, 3.1, 1],
      // shallow cone of the top, bending into the trumpet
      [4.1, 3.26], [3.5, 3.4], [2.95, 3.53], [2.5, 3.66], [2.15, 3.82], [1.9, 4.02], [1.72, 4.3], [1.6, 4.62],
      [1.48, 4.97], [1.3, 5.3], [1.07, 5.65], [0.89, 6.02], [0.77, 6.4], [0.69, 6.72], [0.66, 6.86, 1],
      [0.69, 6.9], [0.72, 7.02], [0.7, 7.15], [0.6, 7.22, 1], [0.43, 7.26, 1],
      // the stem thickens slightly upwards, into a bead under the hat's hub
      [0.465, 27.12, 1], [0.62, 27.15], [0.72, 27.23], [0.76, 27.35], [0.72, 27.48], [0.62, 27.55, 1], [0, 27.55],
    ],
    foot: { r: 4.7, h: 0.3 },
  },
  hat: {
    // a hub disc under the LED ring (the white band the photo shows under the rim), a thin rim, then a straight cone
    // to a rounded tip
    profile: [
      [0.58, 27.55], [0.83, 27.55, 1], [0.86, 27.58], [0.86, 27.7, 1], [2.1, 27.7, 1], [2.12, 27.67, 1], [2.16, 27.66],
      [2.19, 27.7, 1], [2.19, 27.82, 1], [0.24, 29.85, 1], [0.12, 29.96], [0, 30],
    ],
    led: { y: 27.69, rIn: 0.9, rOut: 2.08 },
  },
  light: { kelvin: 2700, lumen: 550, y: 27.69, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default geminga;
