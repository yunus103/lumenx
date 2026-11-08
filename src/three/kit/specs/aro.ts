import type { KitSpec } from ".";

// Height 245 mm from the datasheet, proportions from the one photo (gold): a Ø120 hat over a Ø95 base, so the
// datasheet's "115mm" is ~4% under the photo and its "100mm Alt" is the template value. The black rubber foot is 4 mm
// thick in the photo. Charge port and touch key are underneath, unseen; the hat's underside isn't shown, so its rim
// lip, recessed LED plate and disc follow Agena.
const aro: KitSpec = {
  body: {
    profile: [
      [0, 0.42], [4.61, 0.42, 1], [4.69, 0.45], [4.725, 0.52], [4.73, 0.62, 1],
      // a short drum bending into the straight cone of the bell, which runs up into the hat; even spacing keeps
      // the spline from folding along the cone
      [4.73, 1.12], [4.73, 1.61], [4.726, 2.11], [4.682, 2.605], [4.589, 3.1], [4.487, 3.58], [4.384, 4.069],
      [4.282, 4.549], [4.178, 5.038], [4.076, 5.519], [3.973, 6.008], [3.869, 6.497], [3.767, 6.977], [3.663, 7.467],
      [3.562, 7.947], [3.458, 8.436], [3.354, 8.925], [3.252, 9.405], [3.149, 9.895], [3.047, 10.375], [2.943, 10.864],
      [2.841, 11.344], [2.738, 11.834], [2.634, 12.323], [2.532, 12.803], [2.428, 13.292], [2.327, 13.772],
      [2.223, 14.262], [2.119, 14.751], [2.017, 15.231], [1.914, 15.72], [1.812, 16.201], [1.708, 16.69],
      [1.606, 17.17, 1], [0, 17.17],
    ],
    foot: { r: 4.52, h: 0.42 },
  },
  hat: {
    profile: [
      [1.63, 17.17], [5.35, 17.17, 1], [5.38, 16.95, 1], [5.8, 16.95, 1], [5.97, 16.98], [6.0, 17.08, 1],
      // a drum with a slight draft, an elliptical shoulder (3.7 cm across, 2.9 cm up) and a flat top
      [5.994, 17.488], [5.99, 17.896], [5.985, 18.304], [5.981, 18.698], [5.977, 19.106], [5.972, 19.514],
      [5.968, 19.907], [5.964, 20.315], [5.959, 20.723], [5.955, 21.116], [5.951, 21.524], [5.94, 21.925],
      [5.883, 22.323], [5.768, 22.709], [5.589, 23.072], [5.353, 23.397], [5.066, 23.681], [4.741, 23.918],
      [4.386, 24.11], [4.011, 24.258], [3.622, 24.367], [3.225, 24.441], [2.823, 24.483], [2.419, 24.499],
      [2.017, 24.5], [1.611, 24.5], [1.21, 24.5], [0.804, 24.5], [0.402, 24.5], [0, 24.5],
    ],
    led: { y: 17.16, rIn: 1.68, rOut: 5.33 },
  },
  light: { kelvin: 2700, lumen: 550, y: 17.16, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default aro;
