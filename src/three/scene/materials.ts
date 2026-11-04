import * as THREE from "three";
import { texCache } from "../textures";
import type { Viewer } from "../Viewer";

export type SceneMaterials = ReturnType<typeof sceneMaterials>;

// Thin glass, no refraction: what it reflects is added on top, what is behind it only loses a little light, more at
// grazing angles where the eye looks along the wall. Blended over the frame, so it shows the curtains and everything
// else behind it, for no extra scene pass (transmission's costs one, and that pass has no transparent objects in it).
function thinGlass(v: Viewer) {
  const m = v.mat(
    {
      color: "#000000",
      roughness: 0.03,
      ior: 1.5,
      transparent: true,
      depthWrite: false,
      blending: THREE.CustomBlending,
      blendSrc: THREE.OneFactor,
      blendDst: THREE.OneMinusSrcAlphaFactor,
    },
    true,
  );
  m.userData.envI = 0.45;
  m.onBeforeCompile = (s) => {
    s.fragmentShader = s.fragmentShader
      // it mirrors the room, the shade and the table through the probe, not the bulb its shade hides
      .replace("reflectedLight.directSpecular + reflectedLight.indirectSpecular", "reflectedLight.indirectSpecular")
      .replace(
        "#include <opaque_fragment>",
        `#include <opaque_fragment>
        float edge = pow(1. - saturate(dot(normal, normalize(vViewPosition))), 5.);
        gl_FragColor.rgb *= 1. + edge;
        gl_FragColor.a = .015 + .35 * edge;`,
      );
  };
  return m;
}

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
    // well under paper white and a soft glaze: a plate a hand from the lamp stays porcelain instead of a blooming disc
    ceramic: v.mat({ color: "#b0aba2", roughness: 0.62, specularIntensity: 0.45, clearcoat: 0.15, clearcoatRoughness: 0.45 }, true),
    glass: thinGlass(v),
    steel: v.mat({ color: "#d9d9d6", metalness: 1, roughness: 0.18 }),
    wine: v.mat({ color: "#32030b", roughness: 0.06, clearcoat: 1, clearcoatRoughness: 0.03, envMapIntensity: 0.25, transparent: true, opacity: 0.92 }, true),
    linen: v.mat({ color: "#5e1424", roughness: 0.92, sheen: 1, sheenRoughness: 0.6, sheenColor: "#b04a5c" }, true),
    floor: v.mat({ color: "#2a2420", roughness: 0.7 }),
    rubber: v.mat({ color: "#111111", roughness: 0.9 }),
  };
}
