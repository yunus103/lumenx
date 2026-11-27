import type { KitSpec } from ".";

// Height 177 mm from the gallery's dimension photo (2.2 + 5.5 + 10 cm), proportions from the studio photo: a Ø68.6
// pear (label 6.7), a Ø9.2 hat (label 9), the Ø9 mm stem. Every photo draws the hat ~2.6 cm tall, not the label's
// 2.2, and the pear with its collar ~10.6: photo proportions kept. The brass (collar, stem, bushing, top key) stays
// brass whatever the wood, so it is a fixed gold. The underside close-up shows a wide pale recessed disc round the
// stem that glows as a band at night: a wide LED disc. USB-C port and hole low on the back of the pear.
const acelya: KitSpec = {
  body: {
    // a vertical pith just outside the front of the bulb: straight streaks on the neck, arcs round the bulb
    grain: { pith: [1.0, 3.5, 4.2], dir: [0.04, 1, -0.07], ring: 0.2, contrast: 0.38 },
    profile: [
      [0, 0.06], [1.15, 0.06, 1], [1.36, 0.1], [1.56, 0.17], [1.86, 0.29], [2.14, 0.44], [2.37, 0.64], [2.6, 0.88], [2.8, 1.15],
      [2.97, 1.43], [3.11, 1.72], [3.23, 2.02], [3.32, 2.34], [3.38, 2.67], [3.415, 3.0], [3.43, 3.33], [3.415, 3.65],
      [3.375, 3.98], [3.31, 4.31], [3.22, 4.62], [3.105, 4.93], [2.975, 5.23], [2.835, 5.52], [2.69, 5.81],
      [2.56, 6.12], [2.45, 6.43], [2.36, 6.74], [2.3, 7.07], [2.265, 7.4], [2.24, 7.73], [2.22, 8.05], [2.195, 8.38],
      [2.16, 8.71], [2.085, 9.03], [1.94, 9.32], [1.73, 9.58], [1.48, 9.79], [1.24, 9.97], [1.04, 10.1],
      [0.92, 10.18, 1], [0.8, 10.2, 1],
      // brass: the round bead collar, the stem, the bushing under the hat
      [0.7, 10.2, 1], [0.72, 10.27], [0.73, 10.37], [0.71, 10.47], [0.66, 10.55], [0.58, 10.6], [0.5, 10.62, 1],
      [0.44, 10.62, 1], [0.44, 14.8, 1], [0.5, 14.82], [0.57, 14.86], [0.61, 14.92], [0.62, 15.0, 1], [0, 15.0],
    ],
    foot: { r: 1.15, h: 0.06 },
    fixed: [{ from: 10.2, to: 15.0, finish: "gold" }],
  },
  hat: {
    grain: { pith: [0, -10, -28], dir: [1, 0.03, 0.08], ring: 0.15, contrast: 0.28, pores: 0.5 },
    profile: [
      // the recessed LED disc, the flat underside ring, the pillow roll, the flat top
      [0.62, 15.08], [3.25, 15.08, 1], [3.28, 15.0, 1],
      [3.45, 15.0], [3.7, 15.0], [3.964, 15.049], [4.228, 15.191], [4.439, 15.412], [4.574, 15.691], [4.62, 16.0],
      [4.62, 16.207], [4.62, 16.413], [4.62, 16.62], [4.574, 16.929], [4.439, 17.208], [4.228, 17.429], [3.964, 17.571],
      [3.7, 17.616], [3.45, 17.62], [3.1, 17.62], [2.7, 17.62], [2.3, 17.62], [1.9, 17.62], [1.5, 17.62], [1.08, 17.62, 1],
      // the flush brass key
      [1.03, 17.62, 1], [1.03, 17.59, 1], [0, 17.59],
    ],
    led: { y: 15.07, rIn: 0.63, rOut: 3.23, wash: { metal: 0.08 } },
    fixed: [{ from: 17.59, to: 17.62, finish: "gold" }],
  },
  details: [
    { type: "usbc", y: 1.8, x: 0.8, side: "back", r: 0.64 },
    { type: "hole", y: 1.85, x: -0.85, side: "back", r: 0.09 },
  ],
  // the photos' stain (glossy red-brown stained oak), not the ceviz calibrated on Defne
  woodTone: { ceviz: { early: "#c16a2e", late: "#793813", rough: 0.4, clearcoat: 0.5, coatRough: 0.22, contrast: 1.4 } },
  light: { kelvin: 2700, lumen: 550, y: 15.07, dimmer: [0.4, 0.7, 1], body: 0.012, bounce: 200 },
};

export default acelya;
