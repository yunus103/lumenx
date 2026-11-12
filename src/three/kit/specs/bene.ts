import type { KitSpec } from ".";

// Height 135 mm from the datasheet (top of the finial), proportions from the one product photo (gold), measured on the
// datasheet cover's copy of it, where the white dome stands out against grey: a Ø105.6 dome, a Ø76.6 drum and a Ø78
// black foot. The datasheet's "115mm" dome and "100mm" base don't fit the photo at 135 mm high. The photo was shot
// from ~10 cm high and ~40 cm away, so it sees the dome from above and none of its underside: the inside is assumed
// as on Evora, a thin rim and the LED disc ~2.5 mm up it. Charge port and touch key are underneath (datasheet).
const bene: KitSpec = {
  body: {
    profile: [
      // a short drum on the foot, a sharp crease into the straight cone, which runs up into the hat
      [0, 0.42], [3.83, 0.42, 1], [3.83, 0.9], [3.83, 1.4], [3.83, 1.89, 1],
      [3.595, 2.395], [3.36, 2.899], [3.125, 3.404], [2.89, 3.908], [2.655, 4.413], [2.42, 4.918], [2.185, 5.422],
      [1.95, 5.927], [1.715, 6.432], [1.481, 6.936], [1.246, 7.441], [1.011, 7.945], [0.776, 8.45, 1], [0, 8.45],
    ],
    // the black foot stands ~0.7 mm proud of the drum, its bottom edge rounded
    foot: { r: 3.9, h: 0.42, round: 0.15 },
    // the photo's brass is satin brushed: fine streaks on the drum and cone
    brush: 0.4,
  },
  hat: {
    profile: [
      // LED disc, a short inner wall down to the thin rim
      [0.78, 8.45], [5.12, 8.45, 1], [5.17, 8.22, 1], [5.19, 8.19], [5.25, 8.19], [5.28, 8.22, 1],
      // the dome, a squat superellipse (4.5 cm high), points spaced evenly along it
      [5.229, 8.501], [5.158, 8.779], [5.075, 9.053], [4.98, 9.322], [4.872, 9.587], [4.752, 9.847],
      [4.616, 10.099], [4.467, 10.343], [4.305, 10.579], [4.131, 10.806], [3.945, 11.023], [3.745, 11.228],
      [3.536, 11.423], [3.316, 11.606], [3.086, 11.776], [2.846, 11.933], [2.6, 12.079], [2.347, 12.212],
      [2.088, 12.333], [1.823, 12.441], [1.553, 12.538], [1.279, 12.617], [1, 12.682], [0.712, 12.746, 1],
      // the finial: a short drum under a flattened cap, brass like the body in the photo
      [0.7, 12.765], [0.7, 13.08, 1], [0.688, 13.181], [0.647, 13.273], [0.578, 13.348], [0.494, 13.404],
      [0.401, 13.445], [0.303, 13.472], [0.203, 13.489], [0.102, 13.498], [0, 13.5],
    ],
    led: { y: 8.44, rIn: 0.8, rOut: 5.1 },
    // the dome is white on every finish (the product text: a white dome on a metal body); only the gold photo exists.
    // It is glossy there, with sharp reflections: `beyaz` (0.5) would be satin
    fixed: [{ from: 8.19, to: 12.746, finish: "beyaz", rough: 0.06 }],
  },
  light: { kelvin: 2700, lumen: 550, y: 8.44, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default bene;
