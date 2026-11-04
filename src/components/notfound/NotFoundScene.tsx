"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { NotFoundTexts } from "@/types";

const AUTO_ON_MS = 4000;

function Lamp({ ref }: { ref?: React.Ref<HTMLSpanElement> }) {
  return (
    <span className="nf-lamp" ref={ref}>
      <i className="nf-halo" />
      <svg viewBox="0 0 200 250" fill="none">
        <defs>
          <linearGradient id="nfShade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f8dfb4" />
            <stop offset="1" stopColor="#f2b467" />
          </linearGradient>
          <linearGradient id="nfWood" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#d08443" />
            <stop offset="1" stopColor="#6e351b" />
          </linearGradient>
          <radialGradient id="nfPool" cx=".5" cy=".5" r=".5">
            <stop offset="0" stopColor="rgb(255,190,111)" stopOpacity=".6" />
            <stop offset="1" stopColor="rgb(255,190,111)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse className="nf-lit" cx="100" cy="246" rx="150" ry="16" fill="url(#nfPool)" />
        {/* off: dark outlines; on: the same shapes filled with light, faded in over them */}
        <path className="nf-off" d="M66 34h68l20 78H46z" />
        <path className="nf-lit" d="M66 34h68l20 78H46z" fill="url(#nfShade)" />
        <ellipse className="nf-lit" cx="100" cy="112" rx="54" ry="5" fill="#fff3df" />
        <path className="nf-off" d="M94 112h12v10c0 14 24 38 24 72 0 34-14 54-30 54s-30-20-30-54c0-34 24-58 24-72z" />
        <path className="nf-lit" d="M94 112h12v10c0 14 24 38 24 72 0 34-14 54-30 54s-30-20-30-54c0-34 24-58 24-72z" fill="url(#nfWood)" />
      </svg>
    </span>
  );
}

// The page is a dark room: a soft pool of light follows the pointer (drifts by itself on touch) and lights the
// huge 404 where it passes; reaching the lamp, a tap, or a few seconds switch the lamp on and warm the page.
// Positions are CSS variables written in rAF; the loop stops whenever the light has settled.
export function NotFoundScene({ texts }: { texts: NotFoundTexts | null }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const lampRef = useRef<HTMLSpanElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const hero = heroRef.current;
    const lamp = lampRef.current;
    // Reduced motion: CSS shows the lit state, nothing moves.
    if (!root || !hero || !lamp || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const touch = !matchMedia("(hover: hover)").matches;
    let lit = false;
    let raf = 0;
    const light = () => {
      if (lit) return;
      lit = true;
      setOn(true);
    };
    const lampCenter = () => {
      const r = lamp.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height * 0.3 };
    };

    // the light starts low on the left and travels in
    const pos = { x: innerWidth * 0.16, y: innerHeight * 0.78 };
    const target = { ...pos };

    const frame = (t: number) => {
      const c = lampCenter();
      if (touch) {
        target.x = lit ? c.x : c.x + Math.sin(t / 2600) * innerWidth * 0.34;
        target.y = lit ? c.y : c.y + Math.cos(t / 3400) * innerHeight * 0.16;
      }
      pos.x += (target.x - pos.x) * 0.1;
      pos.y += (target.y - pos.y) * 0.1;

      const r = root.getBoundingClientRect();
      const h = hero.getBoundingClientRect();
      const s = root.style;
      s.setProperty("--x", `${pos.x - r.left}px`);
      s.setProperty("--y", `${pos.y - r.top}px`);
      s.setProperty("--tx", `${pos.x - h.left}px`);
      s.setProperty("--ty", `${pos.y - h.top}px`);
      s.setProperty("--lx", `${c.x - r.left}px`);
      s.setProperty("--ly", `${c.y - r.top}px`);

      if (!touch && Math.hypot(pos.x - c.x, pos.y - c.y) < Math.max(60, lamp.offsetWidth * 0.8)) light();

      const settled = Math.abs(target.x - pos.x) < 0.5 && Math.abs(target.y - pos.y) < 0.5;
      raf = settled && (lit || !touch) ? 0 : requestAnimationFrame(frame);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      target.x = e.clientX;
      target.y = e.clientY;
      kick();
    };
    const onDown = () => {
      light();
      kick();
    };

    const timer = setTimeout(onDown, AUTO_ON_MS);
    addEventListener("pointermove", onMove, { passive: true });
    addEventListener("resize", kick);
    addEventListener("scroll", kick, { passive: true });
    root.addEventListener("pointerdown", onDown);
    kick();
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      removeEventListener("pointermove", onMove);
      removeEventListener("resize", kick);
      removeEventListener("scroll", kick);
      root.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return (
    <div className={`nf${on ? " on" : ""}`} ref={rootRef}>
      {/* without JS the room is simply lit */}
      <noscript>
        <style>{".nf{--lit:1}"}</style>
      </noscript>
      <i className="nf-pool" aria-hidden="true" />
      <i className="nf-warm" aria-hidden="true" />
      <div className="wrap nf-top">
        <Link className="logo" href="/" aria-label={`${texts?.siteName ?? "LUMENX"} ana sayfa`}>
          <Image src="/brand/lumenx-light.svg" alt={texts?.siteName ?? "LUMENX"} width={158} height={50} priority unoptimized />
        </Link>
      </div>
      <main className="wrap nf-in">
        <div className="nf-hero" ref={heroRef} aria-hidden="true">
          <p className="nf-code">
            <span>4</span>
            <Lamp ref={lampRef} />
            <span>4</span>
          </p>
          <p className="nf-code nf-code-lit">
            <span>4</span>
            <span className="nf-gap" />
            <span>4</span>
          </p>
        </div>
        <h1>{texts?.notFoundTitle}</h1>
        {texts?.notFoundText && <p className="nf-text">{texts.notFoundText}</p>}
        <div className="cta-row">
          <Link className="btn btn-amber" href="/urunler">
            {texts?.notFoundCatalogLabel}
          </Link>
          <Link className="btn btn-line" href="/">
            {texts?.notFoundHomeLabel}
          </Link>
        </div>
      </main>
    </div>
  );
}
