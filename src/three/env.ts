// Client-only module (the viewer is imported dynamically from an effect, never on the server).

// Touch devices get smaller maps, fewer samples and lower resolution throughout.
export const coarse = matchMedia("(pointer: coarse)").matches;

// Static 3D assets served from public/3d (room bake, textures, Draco decoder).
export const ASSETS = "/3d";
