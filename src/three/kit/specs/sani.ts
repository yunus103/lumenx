import type { KitSpec } from ".";

// Height 220 mm from the datasheet, proportions from the three photos (siyah, rose, satine nikel): a Ø89 hat over a
// Ø83 base, so the datasheet's Ø100 is its template value. Charge port and touch key are underneath, unseen.
const sani: KitSpec = {
  body: {
    profile: [
      [0, 0.3], [4.1, 0.3, 1], [4.15, 0.33], [4.17, 0.4, 1],
      // drum with a soft roll into its flat top, then a small rounded collar at the foot of the stem
      [4.17, 3.5, 1], [4.15, 3.67], [4.08, 3.81], [3.95, 3.91], [3.78, 3.95, 1],
      [0.8, 3.95, 1], [0.8, 4.27], [0.78, 4.35], [0.74, 4.4], [0.69, 4.42, 1],
      [0.69, 17.1, 1], [0, 17.1],
    ],
    foot: { r: 4.08, h: 0.3 },
  },
  hat: {
    profile: [
      // a rounded boss where the stem enters, the flat LED plate, a thin lip at the rim
      [0.69, 16.88], [0.8, 16.94], [0.86, 17.03], [0.88, 17.16, 1], [4.28, 17.16, 1],
      [4.3, 17.08, 1], [4.39, 17.08], [4.43, 17.12], [4.44, 17.2, 1],
      // straight drum, a rounded edge and the shallow dome of the top
      [4.44, 21.1, 1], [4.42, 21.34], [4.35, 21.52], [4.22, 21.65], [4.02, 21.73, 1],
      [3.0, 21.86], [2.0, 21.95], [1.0, 21.99], [0, 22],
    ],
    led: { y: 17.15, rIn: 0.95, rOut: 4.26 },
  },
  light: { kelvin: 2700, lumen: 550, y: 17.15, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default sani;
