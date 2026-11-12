import type { KitSpec } from ".";

// Height 360 mm and Ø180 hat from the datasheet. One product photo (black); the datasheet's copy of it, on grey,
// shows the white bowl that the shop's white-background copy loses. Two-tone: a shallow black dome with a knob, under
// it a smooth white opal bowl (not stepped: the stairs in the shop photo's outline are JPEG blocks), lit from inside;
// the photo shows the stem's shadow through it up to the hat, left out (the opal isn't see-through). Profiles fitted
// to the grey copy's outline with the camera at the rim's height (the rim's edge is a straight line in it). Touch key
// and charge port are underneath.
const nade: KitSpec = {
  body: {
    profile: [
      [0, 0.1], [4.83, 0.1, 1], [4.88, 0.14], [4.89, 0.2, 1],
      // bottom plate, a fine seam groove, then the drum with a soft top edge
      [4.89, 0.5, 1], [4.85, 0.53, 1], [4.85, 0.57, 1], [4.92, 0.6, 1],
      [4.92, 1.6], [4.92, 2.6], [4.92, 3.6], [4.92, 4.66, 1], [4.91, 4.73], [4.88, 4.775], [4.83, 4.797], [4.77, 4.8, 1],
      // flat top, ferrule round the stem
      [3.0, 4.805], [0.79, 4.81, 1], [0.79, 5.4], [0.79, 5.99, 1], [0.78, 6.12], [0.75, 6.18], [0.72, 6.2, 1],
      [0.6, 6.2, 1], [0.6, 10.1], [0.6, 14.0], [0.6, 17.9], [0.6, 21.8], [0.6, 25.7, 1],
      // collar under the bowl
      [0.72, 25.7, 1], [0.79, 25.77, 1], [0.79, 27.2, 1], [0, 27.2],
    ],
    foot: { r: 4.81, h: 0.1 },
  },
  hat: {
    profile: [
      [0, 32.35], [8.92, 32.35, 1], [8.98, 32.38], [9.0, 32.44, 1],
      // the dome, evenly spaced points; a little steeper at the rim than a spherical cap
      [8.55, 32.829], [8.08, 33.157], [7.58, 33.445], [7.05, 33.695], [6.52, 33.916], [5.98, 34.112], [5.42, 34.289],
      [4.87, 34.451], [4.31, 34.6], [3.75, 34.736], [3.18, 34.858], [2.61, 34.965], [2.04, 35.054], [1.47, 35.124],
      [0.89, 35.173, 1],
      // knob
      [0.89, 35.93, 1], [0.885, 35.975], [0.865, 35.995], [0.84, 36, 1], [0, 36],
    ],
    led: { y: 32.33, rIn: 0.6, rOut: 5 },
    opal: {
      profile: [
        [0.79, 27.2], [1.14, 27.45], [1.59, 27.66], [2.04, 27.88], [2.49, 28.11], [2.93, 28.35], [3.36, 28.6],
        [3.79, 28.86], [4.21, 29.13], [4.63, 29.42], [5.03, 29.71], [5.43, 30.01], [5.82, 30.33], [6.2, 30.65],
        [6.58, 30.98], [6.95, 31.32], [7.32, 31.66], [7.68, 32.01], [8.05, 32.35],
      ],
      transmission: 0.015,
    },
  },
  light: { kelvin: 2700, lumen: 550, y: 31.5, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default nade;
