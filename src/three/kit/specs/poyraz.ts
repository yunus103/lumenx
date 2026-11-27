import type { KitSpec } from ".";

// Height 220 mm from the gallery's dimension photo (which also labels a 30 mm hat, 90 mm stem and 100 mm body),
// proportions from the studio photo: a Ø92 ball on a Ø58 foot ring and a Ø95 hat (both labelled Ø90; the base label
// is a template value, its own arrow spans the foot ring). Every photo is shot from above, so the hat's top face and
// near rim make it look ~42 mm thick on the level-camera fit; it is 33 mm here, between that, the label and the night
// photo (~32-34 mm). The copper (collar plate, bushing, stem, the touch disc on the hat) stays copper on the walnut hat
// of the second photo, so it is a fixed rose. The hat's underside is in no day photo: a flat wooden plate with an LED
// disc reaching nearly to the rim, as the night photo's thin bright line under the hat shows.
const poyraz: KitSpec = {
  body: {
    // oak-like stained wood: a horizontal pith through the ball's centre, turned towards the camera, puts the photo's
    // bullseye on the front-right of the ball; rings ~1.8 mm
    grain: { pith: [0, 5.15, 0], dir: [0.72, 0.04, 0.69], ring: 0.18, contrast: 0.5 },
    profile: [
      // straight foot ring
      [0, 0.08], [2.78, 0.08, 1], [2.86, 0.11], [2.9, 0.2], [2.9, 0.55], [2.9, 0.9], [2.9, 1.25], [2.9, 1.6, 1],
      // an oblate ball (Ø92.4 x 94.4 mm round y 5.15), evenly spaced
      [3.045, 1.6, 1], [3.338, 1.887], [3.606, 2.199], [3.845, 2.533], [4.054, 2.886], [4.232, 3.256], [4.377, 3.64],
      [4.489, 4.036], [4.567, 4.439], [4.61, 4.847], [4.619, 5.258], [4.592, 5.668], [4.531, 6.074], [4.435, 6.473],
      [4.305, 6.863], [4.142, 7.24], [3.948, 7.601], [3.723, 7.945], [3.469, 8.268], [3.187, 8.567], [2.881, 8.84, 1],
      // a fine groove under the wooden collar ring, its top edge eased
      [2.8, 8.86, 1], [2.8, 8.92, 1], [2.86, 8.95, 1], [2.86, 9.3], [2.86, 9.62], [2.84, 9.69], [2.79, 9.72, 1],
      // thin copper plate, the round-topped bushing on it, the stem running up into the hat
      [2.5, 9.72, 1], [2.5, 9.81], [2.48, 9.84], [2.44, 9.85, 1],
      [0.72, 9.85, 1], [0.72, 9.99], [0.69, 10.07], [0.62, 10.12], [0.54, 10.13, 1],
      [0.48, 10.13, 1], [0.48, 18.7, 1], [0, 18.7],
    ],
    foot: { r: 2.75, h: 0.08 },
    fixed: [{ from: 9.72, to: 18.7, finish: "rose", brush: 0.35 }],
  },
  hat: {
    // a side-grain blank of its own, its pith running out through the front of the rim: the photos' oval rings there, streaks across the top
    grain: { pith: [0, 20.1, 5.4], dir: [1, 0, 0], ring: 0.18, contrast: 0.5, pores: 0.6 },
    profile: [
      // flat underside round the LED, the rim rolling up into the widest point and over into the flat top
      [0.48, 18.7], [3.7, 18.7, 1], [3.95, 18.72], [4.2, 18.79], [4.4, 18.9], [4.55, 19.05], [4.65, 19.24], [4.71, 19.45],
      [4.73, 19.7], [4.72, 19.95], [4.69, 20.2], [4.63, 20.45], [4.54, 20.7], [4.4, 20.97], [4.2, 21.22], [3.94, 21.45],
      [3.6, 21.64], [3.17, 21.79], [2.65, 21.9], [2.05, 21.96], [1.45, 21.99], [0.9, 22, 1],
      // copper touch disc set flush in a fine groove
      [0.88, 21.97, 1], [0.84, 21.97, 1], [0.82, 22, 1], [0, 22],
    ],
    // the night photo shows the stem lit under the hat
    led: { y: 18.69, rIn: 0.5, rOut: 3.65, wash: { metal: 0.15 } },
    fixed: [{ from: 21.97, to: 22, finish: "rose", brush: 0.35 }],
  },
  light: { kelvin: 2700, lumen: 550, y: 18.69, dimmer: [0.4, 0.7, 1], body: 0.012, bounce: 200 },
};

export default poyraz;
