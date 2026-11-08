import type { KitSpec } from ".";

// Height 360 mm from the datasheet, proportions from the gold photo: its base comes out Ø99 (the sheet's "100mm Alt"),
// its hat Ø186 against the sheet's 170 mm. The white drum under the hat is an opal diffuser (the shade, `opal`), the
// gold ring under it is the body's top. Touch key on the base's top face; charge port
// underneath, unseen.
const karo: KitSpec = {
  body: {
    profile: [
      [0, 0.1], [4.88, 0.1, 1], [4.93, 0.14], [4.94, 0.2, 1],
      // bottom plate, a fine groove, then the drum
      [4.94, 0.5, 1], [4.9, 0.53, 1], [4.9, 0.57, 1], [4.97, 0.6, 1],
      [4.97, 1.5], [4.97, 2.4], [4.97, 3.3], [4.97, 4.15, 1], [4.96, 4.2], [4.93, 4.24], [4.88, 4.26, 1],
      // the top face rises 0.2 mm to the collar, so the touch key finds a surface to sit on
      [3.0, 4.269], [0.73, 4.28, 1],
      [0.73, 5.0], [0.73, 5.65], [0.71, 5.72], [0.67, 5.75, 1], [0.59, 5.75, 1],
      // stem, widening slightly upward as in the photo, evenly spaced
      [0.6, 7.75], [0.611, 9.75], [0.622, 11.75], [0.633, 13.75], [0.644, 15.75], [0.655, 17.75], [0.666, 19.75],
      [0.677, 21.75], [0.688, 23.75], [0.7, 25.8, 1],
      // gold ring under the drum
      [5.3, 25.8, 1], [5.38, 25.83], [5.42, 25.91], [5.42, 26.13], [5.42, 26.34], [5.38, 26.42], [5.3, 26.45, 1], [0, 26.45],
    ],
    foot: { r: 4.85, h: 0.1 },
  },
  shade: { y: 26.45, h: 5.15, rBottom: 5.2, rTop: 5.2, thickness: 0.08, tape: 0, opal: true, transmission: 0.011, liner: 0.03 },
  hat: {
    // a flat disc with a rolled edge under a shallow, slightly domed cone; a capped finial on top
    profile: [
      [5.1, 31.6], [7.1, 31.6], [9.05, 31.6, 1], [9.2, 31.62], [9.28, 31.68], [9.3, 31.74], [9.25, 31.8], [9.12, 31.84, 1],
      [8.31, 32.26], [7.51, 32.654], [6.7, 33.018], [5.9, 33.353], [5.09, 33.656], [4.28, 33.924], [3.48, 34.155], [2.67, 34.344], [1.87, 34.482],
      [1.06, 34.55, 1],
      [1.06, 35.03], [1.024, 35.259], [0.918, 35.5], [0.75, 35.707], [0.53, 35.866], [0.274, 35.966], [0, 36],
    ],
    led: { y: 31.55, rIn: 1, rOut: 4.9 },
  },
  details: [{ type: "button", y: 4.269, x: 2.5, side: "front", r: 0.6 }],
  light: { kelvin: 2700, lumen: 550, y: 29, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default karo;
