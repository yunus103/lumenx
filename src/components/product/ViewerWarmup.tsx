"use client";

import { useEffect } from "react";

// Warms up the 3D code and the restaurant room in the background so the first product page opens fast (the
// room is most of a kit lamp page's download). Skipped on data saver, as in the demo.
export function ViewerWarmup() {
  useEffect(() => {
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (saveData) return;
    const t = setTimeout(() => {
      const idle = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 1));
      idle(() => {
        import("@/three/Viewer")
          .then((m) => Promise.all([m.loadTextures(), m.preloadRoom("aksam")]))
          .catch(() => {});
      });
    }, 2500);
    return () => clearTimeout(t);
  }, []);
  return null;
}
