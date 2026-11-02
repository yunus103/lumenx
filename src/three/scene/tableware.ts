import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { lathe, spline, type Pt } from "../geometry";

export type Tableware = Record<"plate" | "bread" | "napkin" | "wineGlass" | "wine" | "tumbler", THREE.BufferGeometry>;

// Tableware profiles (metres, radius and height), each a closed solid turned from the axis under it, outside
// first, back to the axis inside or on top.
export function tableware(): Tableware {
  // dinner plate, Ø27 cm: a foot ring, a shallow well, the cavetto rising to a wide rim with a rolled edge
  const plate: Pt[] = [
    [0, 0.003], [0.06, 0.003], [0.062, 0], [0.068, 0], [0.07, 0.003], [0.085, 0.008], [0.1, 0.0155], [0.128, 0.0195], [0.134, 0.0205],
    [0.1365, 0.022], [0.1358, 0.0238], [0.133, 0.0245], [0.1, 0.0205], [0.09, 0.017], [0.083, 0.0115], [0.078, 0.009], [0, 0.0085],
  ];
  // wine glass: foot, drawn stem, tulip bowl with a 1.5 mm wall and a rounded rim
  const outer = spline([[0.0062, 0.088], [0.02, 0.095], [0.038, 0.115], [0.045, 0.15], [0.043, 0.185], [0.0398, 0.205]], 40);
  const inner = spline([[0.0384, 0.205], [0.0415, 0.185], [0.0435, 0.15], [0.0365, 0.116], [0.019, 0.0975], [0.004, 0.093]], 40);
  const wineGlass: Pt[] = [
    [0, 0], [0.036, 0], [0.0366, 0.0012], [0.035, 0.0026], [0.012, 0.0045], [0.005, 0.009], [0.0036, 0.016], [0.0034, 0.075], [0.0045, 0.084],
    ...outer, [0.0393, 0.2058], ...inner, [0, 0.0925],
  ];
  // the wine fills the bowl to 13 cm: its inner wall, a hair inside, closed by the surface
  const level = 0.13;
  const wall = inner.filter(([, y]) => y < level).reverse().map(([r, y]): Pt => [r - 0.0004, y]);
  const r = wall[wall.length - 1][0];
  const wine: Pt[] = [[0, 0.0932], ...wall, [r, level], [0, level]];
  // water tumbler: a heavy base and walls flaring a little to the rim
  const tumbler: Pt[] = [[0, 0], [0.031, 0], [0.0322, 0.0015], [0.0345, 0.095], [0.0345, 0.0965], [0.0332, 0.0968], [0.0318, 0.095], [0.0296, 0.013], [0.025, 0.011], [0, 0.0105]];
  // napkin folded in three: the top layer stops short, so its fold shows as a step along the long side
  const nap = (w: number, y: number, dx: number) => new RoundedBoxGeometry(w, 0.005, 0.2, 2, 0.0022).translate(dx, y, 0);
  const napkin = mergeGeometries([nap(0.12, 0.0026, 0), nap(0.084, 0.0076, 0.016)]);
  return {
    plate: lathe(plate),
    bread: lathe(plate.map(([r, y]): Pt => [r * 0.6, y * 0.8])),
    napkin,
    wineGlass: lathe(wineGlass),
    wine: lathe(wine, 64),
    tumbler: lathe(tumbler),
  };
}
