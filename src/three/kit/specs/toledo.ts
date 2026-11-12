import type { KitSpec } from ".";

// Height 350 mm and the Ø170 bell from the datasheet; the black photo has the same proportions (the rose, gold,
// satin and white photos are ~3.5% squatter: resized). A bell over a thin stem on a Ø97 dome base. Details from all
// seven photos: a knob with a dark neck groove on the crown, a thick round-nosed rim, a Ø19 cap where the stem meets
// the hat (rounded underneath), a collar on the base and a thin dark foot. The hat's underside isn't in any photo:
// the LED plate is recessed 3.5 mm inside the rim, as Heli's. Charge port and touch key are underneath, unseen.
const toledo: KitSpec = {
  body: {
    profile: [
      [0, 0.2], [4.76, 0.2, 1], [4.82, 0.24], [4.84, 0.32],
      // a short wall rounding into the dome, the collar, the stem and the cap it runs into the hat with
      [4.839, 0.6], [4.827, 0.9], [4.789, 1.3], [4.704, 1.7], [4.564, 2.1], [4.36, 2.5], [4.116, 2.88], [3.829, 3.24],
      [3.487, 3.58], [3.071, 3.88], [2.626, 4.13], [2.151, 4.33], [1.654, 4.48], [1.143, 4.57], [0.78, 4.61, 1],
      [0.77, 4.84], [0.72, 4.94], [0.62, 4.99], [0.455, 5.01, 1],
      [0.455, 19.38, 1], [0.62, 19.385], [0.76, 19.4], [0.86, 19.43], [0.92, 19.47], [0.95, 19.53],
      [0.95, 20.12, 1], [0, 20.12],
    ],
    foot: { r: 4.8, h: 0.2 },
  },
  hat: {
    profile: [
      // LED plate, a short inner wall down to the rim, its round nose, then the flare and the bell, evenly spaced
      [0.95, 20.12], [7.8, 20.12, 1], [7.85, 19.77, 1], [8.27, 19.77], [8.36, 19.8], [8.41, 19.88], [8.43, 19.99],
      [8.42, 20.1], [8.38, 20.19], [8.29, 20.27], [8.13, 20.35], [7.723, 20.469], [7.31, 20.561], [6.912, 20.704],
      [6.549, 20.921], [6.224, 21.193],
      [5.952, 21.517], [5.711, 21.865], [5.504, 22.235], [5.326, 22.619], [5.172, 23.014], [5.039, 23.416],
      [4.925, 23.824], [4.827, 24.236], [4.739, 24.651], [4.662, 25.068], [4.592, 25.486], [4.527, 25.904],
      [4.466, 26.324], [4.409, 26.743], [4.352, 27.163], [4.297, 27.583], [4.242, 28.004], [4.187, 28.424],
      [4.131, 28.844], [4.072, 29.263], [4.010, 29.682], [3.942, 30.101], [3.867, 30.518], [3.782, 30.933],
      [3.685, 31.345], [3.572, 31.753], [3.441, 32.156], [3.271, 32.544], [3.028, 32.889], [2.712, 33.171],
      [2.362, 33.409], [1.982, 33.595], [1.593, 33.764], [1.19, 33.872], [0.86, 33.945], [0.73, 33.985, 1],
      // a dark neck groove under the knob, a short cylinder with an elliptic cap
      [0.6, 33.99, 1], [0.6, 34.13, 1], [0.69, 34.14, 1], [0.69, 34.3], [0.69, 34.47],
      [0.648, 34.651], [0.529, 34.811], [0.345, 34.929], [0.179, 34.982], [0, 35],
    ],
    led: { y: 20.11, rIn: 1.0, rOut: 7.78 },
  },
  light: { kelvin: 2700, lumen: 550, y: 20.11, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default toledo;
