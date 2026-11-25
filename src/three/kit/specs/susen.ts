import type { KitSpec } from ".";

// No datasheet. Height 240 mm is the sum of the product page's dimension figure (base 25 + stem 190 + hat 25 mm); its
// "20 cm" total (also the 2027 catalogue's H 200) fits neither those parts nor its own drawing, which, like the photos,
// draws the lamp 2.2 times as tall as its Ø110 base. Proportions from the photos. A flat cushion base on a black rubber
// foot, a thin stem, and a small 45° cone hat over a short white opal drum round the stem's top, which glows in all
// three lit photos and lights the stem (the unlit studio photo shows that drum in the finish). Charge port and touch
// key are underneath, unseen.
const susen: KitSpec = {
  body: {
    profile: [
      [0, 0.4], [4.64, 0.4, 1],
      // the cushion: a full roll round the side into a nearly flat, slightly domed top
      [4.757, 0.434], [4.95, 0.534], [5.116, 0.693], [5.243, 0.9], [5.323, 1.141], [5.35, 1.4], [5.325, 1.667],
      [5.251, 1.921], [5.132, 2.148], [4.973, 2.338], [4.784, 2.481], [4.573, 2.57], [4.35, 2.6], [3.7, 2.638],
      [3.05, 2.669], [2.4, 2.693], [1.75, 2.709], [1.15, 2.718], [0.62, 2.72, 1],
      // a small rounded collar where the stem stands
      [0.62, 2.8], [0.615, 2.88], [0.59, 2.93], [0.54, 2.95, 1],
      [0.45, 2.95, 1], [0.45, 21.58, 1], [0, 21.58],
    ],
    foot: { r: 4.62, h: 0.4, rBottom: 4.45 },
  },
  hat: {
    profile: [
      // flat underside, a rounded bottom edge into a short upright rim, then a straight cone to a blunt point
      [0.64, 21.58], [1.81, 21.58, 1], [1.95, 21.595], [2.05, 21.625], [2.11, 21.67], [2.145, 21.72], [2.16, 21.78],
      [2.16, 21.85, 1], [2.13, 21.88, 1], [1.935, 22.078], [1.74, 22.276], [1.545, 22.474], [1.35, 22.673], [1.155, 22.871],
      [0.96, 23.069], [0.765, 23.267], [0.57, 23.465], [0.375, 23.663], [0.19, 23.862], [0.13, 23.93], [0.07, 23.975], [0, 24],
    ],
    led: { y: 21.39, rIn: 0.46, rOut: 0.58, wash: { metal: 0.12 } },
    opal: { y: 21.4, h: 0.18, r: 0.64, transmission: 0.02 },
  },
  light: { kelvin: 2700, lumen: 550, y: 21.39, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default susen;
