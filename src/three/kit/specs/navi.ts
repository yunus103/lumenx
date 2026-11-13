import type { KitSpec } from ".";

// Height 340 mm and the Ø130 hat from the datasheet; the rest from the seven photos, which all show the same shape.
// A drum whose lid overlaps it at a seam just under the top edge, a flat spun top, trumpet flares at both ends of a
// thin stem, and a flared cone hat. The battery light is the small hole low on the drum's front right; the charge port
// and touch key are unseen. No photo sees the hat's underside: a flat LED plate just above the cone's lower edge, as on Rigel; the photos
// see a light grey band there, read as the LED disc.
const navi: KitSpec = {
  body: {
    profile: [
      [0, 0.25], [4.8, 0.25, 1], [5.0, 0.28], [5.14, 0.36], [5.23, 0.47], [5.28, 0.61], [5.3, 0.78, 1],
      // drum wall, the seam groove, the lid's wall and its rounded edge into the flat top
      [5.3, 3.04, 1], [5.27, 3.06, 1], [5.27, 3.11, 1], [5.45, 3.13], [5.5, 3.16, 1],
      [5.5, 3.27, 1], [5.49, 3.33], [5.45, 3.39], [5.38, 3.42, 1],
      [2.1, 3.48, 1],
      // the trumpet into the stem, points spaced evenly along it
      [1.926, 3.565], [1.754, 3.656], [1.586, 3.753], [1.422, 3.856], [1.263, 3.968], [1.112, 4.089], [0.969, 4.221],
      [0.84, 4.365], [0.726, 4.522], [0.633, 4.692], [0.565, 4.874], [0.523, 5.063], [0.514, 5.256], [0.51, 5.45, 1],
      [0.49, 29.05, 1],
      // the trumpet under the hat, running up into it
      [0.537, 29.236], [0.601, 29.417], [0.672, 29.596], [0.748, 29.772], [0.828, 29.947], [0.912, 30.12], [0.998, 30.292],
      [1.087, 30.462], [1.177, 30.632], [1.27, 30.8], [1.33, 30.95], [1.35, 31.16, 1], [0, 31.16],
    ],
    foot: { r: 4.8, h: 0.25 },
  },
  hat: {
    profile: [
      // the flat LED plate, then the cone's sharp lower edge
      [1.35, 31.15], [6.26, 31.15, 1], [6.37, 31.06, 1], [6.42, 31.065], [6.435, 31.1, 1],
      // the straight flared cone, a rounded edge into the flat top
      [6.336, 31.289], [6.191, 31.578], [6.047, 31.867], [5.902, 32.156], [5.758, 32.444], [5.613, 32.733], [5.469, 33.022],
      [5.324, 33.311], [5.18, 33.6, 1], [5.13, 33.72], [5.04, 33.85], [4.88, 33.94], [4.66, 33.99], [4.4, 34.0, 1], [0, 34.0],
    ],
    led: { y: 31.14, rIn: 1.45, rOut: 6.15 },
  },
  details: [{ type: "hole", y: 0.6, x: 4.2, side: "front", r: 0.09 }],
  light: { kelvin: 2700, lumen: 550, y: 31.14, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default navi;
