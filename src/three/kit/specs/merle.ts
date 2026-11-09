import type { KitSpec } from ".";

// Height 350 mm, Ø175 hat and Ø100 base from the datasheet and the product page; they agree with the one photo
// (black). The hat is two parts: a shallow convex shade with a domed knob on top, and under it a smaller bowl on the
// stem, a 1.6 mm slot between them that shows white in the photo. That slot is drawn as an opal band with the LED
// disc inside it; where the light really comes out (the slot only, or also under the shade's overhang) no photo
// shows. The base is a plain drum with a seam groove near the bottom and a ferrule round the stem.
const merle: KitSpec = {
  body: {
    profile: [
      [0, 0.2], [4.86, 0.2, 1], [4.89, 0.23], [4.9, 0.3, 1],
      // seam groove; the band under it is a little narrower
      [4.9, 1.95, 1], [4.86, 1.98, 1], [4.86, 2.06, 1], [4.96, 2.09, 1],
      [4.96, 3.85, 1], [4.94, 3.95], [4.88, 4.02], [4.78, 4.05, 1],
      // flat top, ferrule with a chamfered top, thin stem, collar under the bowl
      [0.62, 4.05, 1], [0.62, 4.95, 1], [0.55, 5.05, 1], [0.45, 5.08, 1],
      [0.45, 27.92, 1], [0.6, 27.92, 1], [0.67, 27.99, 1], [0.67, 29, 1],
      // the bowl's convex underside, evenly spaced points
      [1.15, 29.04], [1.67, 29.13], [2.19, 29.26], [2.71, 29.41], [3.18, 29.58], [3.65, 29.75], [4.08, 29.94],
      [4.48, 30.14], [4.85, 30.36], [5.18, 30.58], [5.52, 30.8], [5.75, 31], [5.85, 31.14], [5.84, 31.23], [5.79, 31.27, 1],
      [0, 31.27],
    ],
    foot: { r: 4.86, h: 0.2 },
  },
  hat: {
    profile: [
      [0, 31.43], [9.04, 31.43, 1], [9.12, 31.46], [9.13, 31.52, 1],
      // the shade's convex top, evenly spaced points, up to the knob
      [8.65, 31.8], [8.18, 32.12], [7.55, 32.45], [6.93, 32.74], [6.25, 33.02], [5.57, 33.27], [4.9, 33.5],
      [4.22, 33.68], [3.54, 33.84], [2.87, 33.96], [2.19, 34.06], [1.51, 34.13], [1.33, 34.16, 1],
      [1.33, 34.26], [1.3, 34.38], [1.22, 34.5], [1.1, 34.6], [0.95, 34.7], [0.78, 34.79], [0.6, 34.88], [0.4, 34.96],
      [0.2, 34.995], [0, 35],
    ],
    led: { y: 31.42, rIn: 0.3, rOut: 5.65 },
    opal: { y: 31.28, h: 0.14, r: 5.78, transmission: 0.02 },
  },
  light: { kelvin: 2700, lumen: 550, y: 31.35, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default merle;
