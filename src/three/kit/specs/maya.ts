import type { KitSpec } from ".";

// Height 185 mm from the 2027 catalogue and the gallery's dimension photo, proportions from the studio photo: a Ø69
// pear (catalogue base Ø70) and a Ø100 hat. The dimension photo labels the hat Ø90 and the night photo measures Ø94,
// so the studio photo's hat may be drawn large. The metal (collar, stem, the cap under the hat, the hat) can't follow
// the wood: fixed gold brass and black paint. All photos show the walnut; none shows the beech. The hat's underside
// isn't in any photo, so its LED plate recessed inside the rim follows Akasya and Sümbül.
const maya: KitSpec = {
  body: {
    // walnut: the pith runs front to back through the bulb, so its rings show as round bullseyes on the front-left
    // (studio photo) and the back, with long arcs up the neck
    grain: { pith: [0.2, 3.1, 0], dir: [-0.3, 0.05, 1], ring: 0.34, contrast: 0.38 },
    profile: [
      // the bulb rounds under onto the rubber foot
      [0, 0.08], [1.98, 0.08, 1], [2.1, 0.11], [2.22, 0.18], [2.33, 0.27], [2.43, 0.38], [2.52, 0.5],
      [2.7, 0.72], [2.86, 0.95], [3.0, 1.2], [3.12, 1.45], [3.22, 1.72], [3.3, 2.0], [3.37, 2.3], [3.42, 2.6],
      [3.44, 2.9], [3.44, 3.2], [3.41, 3.5], [3.36, 3.8], [3.29, 4.1], [3.2, 4.4], [3.1, 4.7], [2.98, 5.0],
      [2.84, 5.28], [2.69, 5.54], [2.55, 5.8], [2.44, 6.1], [2.36, 6.4], [2.3, 6.7], [2.27, 7.0], [2.255, 7.35],
      [2.25, 7.7], [2.24, 8.0], [2.2, 8.35], [2.14, 8.68], [2.05, 8.97], [1.92, 9.25], [1.75, 9.5], [1.54, 9.72],
      [1.3, 9.89], [1.08, 9.99], [0.92, 10.03, 1], [0.81, 10.03, 1],
      // brass: the round-topped collar on the wood (a dark seam under it), the stem, the cap under the hat
      [0.77, 10.04, 1], [0.77, 10.08, 1], [0.8, 10.1, 1], [0.8, 10.36], [0.77, 10.42], [0.72, 10.46], [0.65, 10.49, 1],
      [0.47, 10.5, 1], [0.47, 15.66, 1], [0.62, 15.67], [0.68, 15.7], [0.7, 15.75, 1], [0.7, 15.97, 1], [0, 15.97],
    ],
    foot: { r: 1.95, h: 0.08 },
    fixed: [{ from: 10.04, to: 15.97, finish: "gold" }],
  },
  hat: {
    profile: [
      // LED plate, the thin spun cone's inside down to a rounded rim
      [0.68, 15.97], [4.72, 15.97, 1], [4.9, 15.8, 1], [4.96, 15.8], [5.0, 15.84], [5.02, 15.9, 1],
      // straight 45° cone, a crisp roll into the flat Ø45 top
      [2.45, 18.42, 1], [2.41, 18.48], [2.34, 18.5, 1], [0, 18.5],
    ],
    // the night photos show the stem lit under the hat
    led: { y: 15.96, rIn: 0.72, rOut: 4.7, wash: { metal: 0.05 } },
    fixed: [{ from: 15.8, to: 18.5, finish: "siyah" }],
  },
  details: [
    { type: "button", y: 4.12, x: -1.26, side: "back", r: 0.33 },
    { type: "usbc", y: 2.29, x: -1.48, side: "back", r: 0.61 },
    { type: "hole", y: 2.59, x: -2.98, side: "back", r: 0.07 },
  ],
  light: { kelvin: 2700, lumen: 550, y: 15.96, dimmer: [0.4, 0.7, 1], body: 0.03, bounce: 200 },
};

export default maya;
