import type { Finish3D, Shade3D } from "./finishes";
import type { Mode, ModelFamily } from "./models";

// What the viewer renders: everything the visitor can change that the scene shows.
export interface ViewerState {
  finish: Finish3D;
  shade: Shade3D | null;
  // armatures are painted in a RAL colour instead of a finish
  ralHex?: string;
  k: number;
  on: boolean;
  lvl: number;
  power: "ekonomik" | "premium";
  mode: Mode;
  // armature profile height (rebuilds the geometry)
  prof?: string;
}

export interface ViewerModel {
  key: string;
  family: ModelFamily;
}

export type Variant = "detail" | "hero" | "card";
