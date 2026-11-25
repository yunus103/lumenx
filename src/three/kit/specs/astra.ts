import type { KitSpec } from ".";

// Height 340 mm from the 2027 catalogue and the dimension photo in the product gallery (no datasheet PDF), proportions
// from the studio photo: a Ø218 hat over a Ø149 base, where the photo's labels say Ø210 and Ø140 (the catalogue: Ø210
// and its template Ø100). Its 6.5 cm hat and 26 cm stem match the photo at 340 mm; the base disc measures 6 mm where
// it says 5. A thin flat disc on a black rubber foot, a plain Ø14 stem, a shallow spun dome with a flattish top and a
// small dome finial. The hat's underside shows only as a cream sliver: its LED plate is recessed 3 mm inside the rim
// as Heli's. Charge port and touch key are underneath, unseen.
const astra: KitSpec = {
  body: {
    profile: [
      [0, 0.1], [7.38, 0.1, 1], [7.44, 0.13], [7.46, 0.2, 1],
      // the disc's wall, a small roll into the flat top
      [7.46, 0.54, 1], [7.44, 0.6], [7.39, 0.62, 1],
      [0.7, 0.62, 1], [0.7, 26.75, 1], [0, 26.75],
    ],
    foot: { r: 7.25, h: 0.1 },
    // the base top shows a spun sheen
    brush: 0.4,
  },
  hat: {
    profile: [
      // recessed LED plate, the inner wall, a thin rim
      [0.7, 26.75], [10.78, 26.75, 1], [10.8, 26.45, 1], [10.9, 26.45, 1],
      // dome, points spaced evenly along the arc
      [10.888, 26.502], [10.828, 26.867], [10.763, 27.232], [10.690, 27.595], [10.604, 27.956], [10.501, 28.311],
      [10.378, 28.661], [10.235, 29.002], [10.072, 29.335], [9.889, 29.657], [9.688, 29.967], [9.469, 30.266],
      [9.220, 30.552], [8.951, 30.821], [8.663, 31.068], [8.356, 31.293], [8.038, 31.499], [7.712, 31.693],
      [7.382, 31.867], [7.050, 32.018], [6.709, 32.153], [6.364, 32.277], [6.015, 32.393], [5.664, 32.493],
      [5.308, 32.582], [4.947, 32.656], [4.583, 32.716], [4.217, 32.767], [3.850, 32.812], [3.482, 32.850],
      [3.113, 32.886], [2.744, 32.917], [2.375, 32.943], [2.005, 32.966], [1.635, 32.986], [1.345, 33.004, 1],
      // finial: a thin ring under a small dome
      [1.3, 33.11], [1.3, 33.16, 1], [1.2, 33.2, 1], [1.18, 33.3], [1.12, 33.42], [1.02, 33.55],
      [0.88, 33.68], [0.68, 33.8], [0.44, 33.9], [0.2, 33.97], [0, 34],
    ],
    led: { y: 26.74, rIn: 0.75, rOut: 10.76, wash: { metal: 0.2 } },
    // the photos show fine horizontal brushing on the hat
    brush: 0.5,
  },
  light: { kelvin: 2700, lumen: 550, y: 26.74, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default astra;
