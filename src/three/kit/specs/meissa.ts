import type { KitSpec } from ".";

// Height 280 mm from the datasheet. The one photo is taken from close up (about 50 cm away, level with the hat top),
// so sizes come from a pinhole camera fitted to its ellipses and widths: that gives the hat Ø100, as the datasheet
// says, and the drum Ø93. Charge port and touch key are underneath, unseen; the hat's underside isn't shown either,
// so the LED disc is assumed flush with a thin rim, like Agena's.
// review.py fits a level camera, which this tilted photo (the stem narrows downwards on screen) can't match: it
// asks for a wider hat and a narrower drum. Through the fitted tilted camera the outline agrees within ~1 px.
const meissa: KitSpec = {
  body: {
    profile: [
      [0, 0.73], [4.6, 0.73, 1], [4.62, 0.75], [4.65, 0.81, 1],
      // a plain drum with crisp, slightly rounded edges and a flat top, a small ferrule round the stem
      [4.65, 4.28, 1], [4.63, 4.36], [4.57, 4.39], [4.5, 4.4, 1],
      [0.78, 4.4, 1], [0.78, 4.65], [0.76, 4.7], [0.72, 4.72, 1], [0.63, 4.72, 1],
      // a straight stem, with a short boss under the hat
      [0.63, 24.98, 1], [0.74, 24.99, 1], [0.75, 25.36, 1], [0, 25.36],
    ],
    foot: { r: 4.62, h: 0.73 },
  },
  hat: {
    profile: [
      [0.74, 25.35], [4.82, 25.35, 1], [4.86, 25.31, 1], [4.9, 25.31], [4.96, 25.34], [5, 25.42, 1],
      [5, 27.9, 1], [4.98, 27.97], [4.92, 28, 1], [0, 28],
    ],
    led: { y: 25.34, rIn: 0.8, rOut: 4.8 },
  },
  light: { kelvin: 2700, lumen: 550, y: 25.34, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default meissa;
