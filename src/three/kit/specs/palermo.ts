import type { KitSpec } from ".";

// A price-list lamp: no datasheet and one small photo (2027 price list, 202 x 263 px). Proportions from that photo;
// the height, 220 mm, is assumed from the closest finished lamps: Oxford (a dome-topped mushroom on a cone and drum,
// 220 mm, Ø97 base, same price band), and at 220 mm the base comes out Ø98, as the other charging lamps' Ø92-99 bases.
// The hat is then Ø174. A straight cone bends softly into a short drum with a rounded bottom edge on a foot ring; the
// hat is a thin spun dome (a superellipse fitted to the photo, meeting the rim at ~22° from vertical) over a short
// vertical lip. Its underside isn't in the photo, so the LED plate is recessed 3 mm as Torino's. Charge port and touch
// key are underneath, unseen.
const palermo: KitSpec = {
  body: {
    profile: [
      [0, 0.35], [4.7, 0.35, 1], [4.79, 0.385], [4.86, 0.46], [4.89, 0.55], [4.896, 0.65],
      // drum, a soft knee (an arc tangent to both), then the straight cone, points evenly spaced along each run
      [4.896, 1.016], [4.896, 1.381], [4.896, 1.747, 1],
      [4.893, 1.886], [4.884, 2.024], [4.87, 2.161], [4.85, 2.298], [4.824, 2.434, 1],
      [4.604, 3.465], [4.385, 4.496], [4.165, 5.527], [3.946, 6.559], [3.726, 7.59], [3.507, 8.621], [3.287, 9.652],
      [3.068, 10.683], [2.848, 11.714], [2.629, 12.745], [2.409, 13.777], [2.189, 14.808], [1.97, 15.839],
      [1.75, 16.87, 1], [0, 16.87],
    ],
    foot: { r: 4.7, h: 0.35 },
    // the price list calls it brushed, and the photo's cone highlight shows faint horizontal streaks
    brush: 0.4,
  },
  hat: {
    profile: [
      [1.75, 16.87], [8.6, 16.87, 1], [8.58, 16.57, 1], [8.68, 16.57, 1], [8.68, 16.74, 1],
      // dome, points spaced evenly along the arc
      [8.543, 17.076], [8.392, 17.406], [8.228, 17.729], [8.05, 18.046], [7.858, 18.354], [7.653, 18.653],
      [7.434, 18.943], [7.203, 19.222], [6.958, 19.49], [6.701, 19.746], [6.432, 19.989], [6.151, 20.22],
      [5.86, 20.436], [5.559, 20.638], [5.248, 20.826], [4.929, 20.999], [4.603, 21.157], [4.269, 21.301],
      [3.93, 21.43], [3.586, 21.544], [3.237, 21.644], [2.884, 21.73], [2.529, 21.803], [2.171, 21.863],
      [1.811, 21.911], [1.45, 21.947], [1.088, 21.973], [0.726, 21.99], [0.363, 21.998], [0, 22],
    ],
    led: { y: 16.86, rIn: 1.8, rOut: 8.56 },
    brush: 0.4,
  },
  light: { kelvin: 2700, lumen: 550, y: 16.86, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default palermo;
