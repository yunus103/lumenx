import type { KitSpec } from ".";

// Height 250 mm, Ø160 hat and Ø100 base from the datasheet drawing (the Light Design page says the same); the
// proportions come from the studio photo and the beyaz photo on the wall, which agree: a Ø162 hat 7.55 cm high (0.94
// of a half ellipse's height, up to 1.4 mm inside one on its lower side) and a Ø99 base. The studio photo's base sits
// 2.5 mm right of its hat's axis, so its widths are measured edge to edge; review.py measures from the hat's axis and
// scores the cone ~1.3 mm too wide low down. A straight cone bends at 2.3-3.2 cm into a nearly upright skirt on a 6 mm
// black foot, whose bottom edge is rounded in the photos. The hat is a thin spun shell; the
// close-up of its underside shows a flat diffuser plate across it, recessed about 8 mm. Charge port and touch key are
// underneath.
const suma: KitSpec = {
  body: {
    profile: [
      [0, 0.6], [4.874, 0.6, 1], [4.919, 0.61], [4.934, 0.64],
      // the bend into the cone and the cone itself, evenly spaced so the spline can't fold
      [4.904, 1.14], [4.874, 1.64], [4.844, 2.14], [4.805, 2.63], [4.725, 3.13], [4.62, 3.61], [4.514, 4.1],
      [4.407, 4.59], [4.301, 5.08], [4.195, 5.57], [4.089, 6.05], [3.983, 6.54], [3.877, 7.03], [3.77, 7.52],
      [3.664, 8], [3.558, 8.49], [3.452, 8.98], [3.346, 9.47], [3.24, 9.96], [3.133, 10.44], [3.027, 10.93],
      [2.921, 11.42], [2.815, 11.91], [2.709, 12.4], [2.603, 12.88], [2.496, 13.37], [2.39, 13.86],
      [2.284, 14.35], [2.178, 14.83], [2.072, 15.32], [1.966, 15.81], [1.859, 16.3], [1.753, 16.79],
      [1.647, 17.27], [1.541, 17.76],
      [1.435, 18.25, 1], [0, 18.25],
    ],
    foot: { r: 4.87, h: 0.6, rBottom: 4.7, round: 0.35 },
  },
  hat: {
    profile: [
      // the diffuser plate, the inside of the shell down to its thin edge
      [1.44, 18.2], [7.8, 18.2, 1], [7.92, 17.42, 1], [8.04, 17.42, 1],
      // the dome, points spaced evenly along the arc
      [8.09, 17.45, 1], [8.068, 17.871], [8.016, 18.29], [7.917, 18.7], [7.797, 19.104], [7.666, 19.506],
      [7.52, 19.902], [7.359, 20.292], [7.182, 20.675], [6.987, 21.049], [6.771, 21.412], [6.537, 21.762],
      [6.284, 22.1], [6.016, 22.426], [5.729, 22.735], [5.427, 23.03], [5.107, 23.306], [4.772, 23.562],
      [4.423, 23.798], [4.059, 24.013], [3.683, 24.204], [3.298, 24.376], [2.903, 24.524], [2.5, 24.649],
      [2.091, 24.756], [1.678, 24.842], [1.262, 24.91], [0.843, 24.96], [0.422, 24.99], [0, 25],
    ],
    led: { y: 18.19, rIn: 1.46, rOut: 7.78, wash: { metal: 0 } },
  },
  light: { kelvin: 2700, lumen: 550, y: 18.19, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default suma;
