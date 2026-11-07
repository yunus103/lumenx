import type { KitSpec } from ".";

// Height 190 mm from the datasheet, proportions from the one photo. The drawing labels its tray width 190 mm and the
// height 130 mm, but draws the lamp 1.55 times as tall as wide, as the photo shows: the labels are swapped. Its Ø100
// base fits the photo's base-to-tray ratio, though at 190 mm high both diameters come out ~5% smaller. Charge port and
// touch key are underneath, unseen. The light ("side and down") is assumed to be an LED ring in the tray's underside,
// lighting the cone.
const vita: KitSpec = {
  body: {
    profile: [
      [0, 0.54], [4.76, 0.54, 1], [4.83, 0.57], [4.85, 0.66],
      // a short drum that bends slowly (over 2 cm, as in the photo) into the straight cone, which ends in a short
      // neck under the tray. Points along the cone keep the spline's spacing even, so it can't fold at the bends.
      [4.85, 1.07], [4.84, 1.5], [4.8, 2], [4.75, 2.4], [4.685, 2.8], [4.6, 3.2], [4.51, 3.6], [4.38, 4.2],
      [4.2, 5], [3.98, 6], [3.76, 7], [3.54, 8], [3.32, 9], [3.1, 10], [2.88, 11], [2.66, 12], [2.44, 13], [2.22, 14],
      [2.0, 15], [1.89, 15.5], [1.8, 15.9], [1.71, 16.25], [1.6, 16.6], [1.54, 16.85], [1.53, 17.05], [1.53, 17.42, 1], [0, 17.42],
    ],
    foot: { r: 4.6, h: 0.54 },
  },
  hat: {
    // a flat plate over an inverted frustum
    profile: [
      [1.5, 17.4], [5.46, 17.4, 1], [5.5, 17.43, 1], [5.88, 18.12, 1], [6.31, 18.14, 1], [6.34, 18.18, 1],
      [6.34, 18.86, 1], [6.32, 18.94], [6.27, 18.985], [6.18, 19, 1], [0, 19],
    ],
    led: { y: 17.39, rIn: 1.6, rOut: 5.2 },
  },
  light: { kelvin: 2700, lumen: 550, y: 17.39, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default vita;
