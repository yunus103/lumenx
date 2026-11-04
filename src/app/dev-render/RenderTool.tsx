"use client";

import { useEffect, useRef } from "react";
import { finish3D, shade3D } from "@/three/finishes";
import type { Mode } from "@/three/models";
import type { ViewerModel, ViewerState } from "@/three/types";
import type { Viewer } from "@/three/Viewer";

interface Shot {
  out: string;
  size: [number, number];
  pos: [number, number, number];
  target: [number, number, number];
  fov: number;
  k?: number;
  on?: boolean;
  lvl?: number;
  mode?: Mode;
  finish?: string;
  samples?: number;
  quality?: number;
}

const DEFNE: ViewerModel = { key: "defne", family: "kit" };

// Each frame averages renders shifted by less than a pixel, in linear light: antialiasing no real-time frame can
// afford, with the viewer's lamp, room and post-processing otherwise untouched.
const toLinear = Float32Array.from({ length: 256 }, (_, i) => {
  const c = i / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
});
const toSrgb = (c: number) => 255 * (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);
const halton = (i: number, b: number) => {
  let f = 1;
  let r = 0;
  for (let n = i; n > 0; n = Math.floor(n / b)) {
    f /= b;
    r += f * (n % b);
  }
  return r;
};

export function RenderTool() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let viewer: Viewer | null = null;

    const shot = async ({ out, size: [w, h], pos, target, fov, k = 2700, on = true, lvl = 2, mode = "gece", finish = "ceviz", samples = 24, quality = 0.86 }: Shot) => {
      const m = await import("@/three/Viewer");
      const { loadRoom } = await import("@/three/scene/room");
      await m.loadTextures();
      const room = await loadRoom(mode);
      await room.perMode(mode);
      host.current!.style.width = `${w}px`;
      host.current!.style.height = `${h}px`;
      const state: ViewerState = {
        finish: finish3D({ slug: { current: finish } }),
        shade: shade3D({ slug: { current: "keten" } }),
        k,
        on,
        lvl,
        power: "premium",
        mode,
      };
      if (!viewer) {
        viewer = new m.Viewer(host.current!, { interactive: false, preserve: true, maxDpr: 1 });
        await viewer.open(DEFNE, state);
      }
      const v = viewer;
      v.resize();
      // no pull-back for narrow frames: each shot states its own camera
      v.fitAspect = 0;
      v.setCamera(pos, target, fov);
      v.apply(state);

      const canvas = Object.assign(document.createElement("canvas"), { width: w, height: h });
      const g = canvas.getContext("2d", { willReadFrequently: true })!;
      const sum = new Float32Array(w * h * 3);
      for (let i = 0; i < samples; i++) {
        v.cam.setViewOffset(w, h, halton(i + 1, 2) - 0.5, halton(i + 1, 3) - 0.5, w, h);
        v.render();
        g.drawImage(v.r.domElement, 0, 0);
        const d = g.getImageData(0, 0, w, h).data;
        for (let p = 0; p < w * h; p++) {
          sum[p * 3] += toLinear[d[p * 4]];
          sum[p * 3 + 1] += toLinear[d[p * 4 + 1]];
          sum[p * 3 + 2] += toLinear[d[p * 4 + 2]];
        }
        await new Promise((r) => setTimeout(r));
      }
      v.cam.clearViewOffset();
      const img = g.createImageData(w, h);
      for (let p = 0; p < w * h; p++) {
        img.data[p * 4] = toSrgb(sum[p * 3] / samples);
        img.data[p * 4 + 1] = toSrgb(sum[p * 3 + 1] / samples);
        img.data[p * 4 + 2] = toSrgb(sum[p * 3 + 2] / samples);
        img.data[p * 4 + 3] = 255;
      }
      g.putImageData(img, 0, 0);
      const blob = await new Promise<Blob>((res) => canvas.toBlob((b) => res(b!), out.endsWith(".jpg") ? "image/jpeg" : "image/webp", quality));
      await fetch(`/dev-render/save?name=${encodeURIComponent(out)}`, { method: "POST", body: blob });
      return `${out} ${Math.round(blob.size / 1024)} KB`;
    };

    Object.assign(window, { shot });
    return () => {
      viewer?.dispose();
    };
  }, []);

  return <div ref={host} style={{ position: "fixed", left: 0, top: 0 }} />;
}
