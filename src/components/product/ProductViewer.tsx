"use client";

import { useEffect, useRef } from "react";
import type { ViewerModel, ViewerState } from "@/three/types";
import type { Viewer } from "@/three/Viewer";

interface ProductViewerProps {
  model: ViewerModel;
  state: ViewerState;
  onReady: () => void;
  onFail: () => void;
  onInteract: () => void;
}

// Visible state only: the scene re-lights when one of these changes (each apply re-renders shadows + probe).
const visualKey = (s: ViewerState) => JSON.stringify(s);

// Owns one three.js Viewer for the product page. The engine is loaded on demand, so pages without a model and the
// server never pull in three.js.
export function ProductViewer({ model, state, onReady, onFail, onInteract }: ProductViewerProps) {
  const host = useRef<HTMLDivElement>(null);
  const viewer = useRef<Viewer | null>(null);
  const stateRef = useRef(state);
  const lastKey = useRef("");
  const callbacks = useRef({ onReady, onFail, onInteract });
  stateRef.current = state;
  callbacks.current = { onReady, onFail, onInteract };

  useEffect(() => {
    let cancelled = false;
    let v: Viewer | null = null;
    (async () => {
      const m = await import("@/three/Viewer");
      // let the product page paint before the scene is built
      await new Promise((r) => requestAnimationFrame(() => setTimeout(r)));
      await Promise.all([m.loadTextures(), model.family === "kit" && m.preloadRoom(stateRef.current.mode)]);
      if (cancelled || !host.current) return;
      const s = stateRef.current;
      v = new m.Viewer(host.current, { onInteract: () => callbacks.current.onInteract() });
      await v.open(model, s);
      if (cancelled) return;
      viewer.current = v;
      lastKey.current = visualKey(s);
      // options picked while the scene was loading
      if (stateRef.current.prof !== s.prof) v.build(model, stateRef.current);
      else if (visualKey(stateRef.current) !== lastKey.current) v.apply(stateRef.current);
      lastKey.current = visualKey(stateRef.current);
      callbacks.current.onReady();
    })().catch((err) => {
      console.error(err);
      if (cancelled) return;
      callbacks.current.onFail();
    });
    return () => {
      cancelled = true;
      v?.dispose();
      viewer.current = null;
    };
  }, [model]);

  useEffect(() => {
    const v = viewer.current;
    if (!v) return;
    const key = visualKey(state);
    if (key === lastKey.current) return;
    const prev = JSON.parse(lastKey.current) as ViewerState;
    lastKey.current = key;
    if (prev.prof !== state.prof) v.build(model, state);
    else v.apply(state);
  }, [state, model]);

  return <div ref={host} className="absolute inset-0" />;
}
