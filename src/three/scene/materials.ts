import { coarse } from "../env";
import { texCache } from "../textures";
import type { Viewer } from "../Viewer";

export type SceneMaterials = ReturnType<typeof sceneMaterials>;

// The furniture and tableware materials of a scene, created per build (the viewer disposes them on clear()).
export function sceneMaterials(v: Viewer) {
  const wood = texCache.wood!;
  const woodMat = (rep: [number, number]) => {
    const a = wood.albedo.clone();
    const b = wood.bump.clone();
    a.repeat.set(...rep);
    b.repeat.set(...rep); // clones share the uploaded image; no re-upload needed
    v.texs.push(a, b);
    return v.mat({ map: a, bumpMap: b, bumpScale: 0.25, roughnessMap: b, roughness: 0.58, clearcoat: 0.35, clearcoatRoughness: 0.28 }, true);
  };
  const plaster = texCache.plaster!;
  return {
    woodMat,
    wall: v.mat({ color: "#6a625a", roughness: 0.95, bumpMap: plaster, bumpScale: 2 }),
    // a touch under paper white: in the sun it stays porcelain instead of a blooming disc
    ceramic: v.mat({ color: "#e6e2da", roughness: 0.35, clearcoat: 1, clearcoatRoughness: 0.12 }, true),
    // transmission costs a full extra scene pass per frame; phones get a plain transparent glass. Glass has no
    // diffuse colour of its own: a white one read as milk under a nearby lamp
    glass: coarse
      ? v.mat({ color: "#1c2026", metalness: 0, roughness: 0.05, transparent: true, opacity: 0.14, depthWrite: false, clearcoat: 1 }, true)
      : v.mat({ color: "#ffffff", metalness: 0, roughness: 0.03, transmission: 1, thickness: 0.004, ior: 1.5, specularIntensity: 1 }, true),
    steel: v.mat({ color: "#d9d9d6", metalness: 1, roughness: 0.18 }),
    // opaque: a transmissive wine would be missing from the glass's transmission pass (it only sees opaque objects)
    wine: v.mat({ color: "#1c0206", roughness: 0.08, clearcoat: 1, clearcoatRoughness: 0.03 }, true),
    linen: v.mat({ color: "#5e1424", roughness: 0.92, sheen: 1, sheenRoughness: 0.6, sheenColor: "#b04a5c" }, true),
    floor: v.mat({ color: "#2a2420", roughness: 0.7 }),
    rubber: v.mat({ color: "#111111", roughness: 0.9 }),
  };
}
