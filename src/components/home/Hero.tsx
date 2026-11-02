"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { rgbStr } from "@/lib/light";
import type { HomePage } from "@/types";

// Pre-rendered frames of the 3D scene, cross-faded (the demo's hero). Frames live in public/renders.
const KS = [2700, 3000, 4000] as const;
const LEVELS = [0, 0.38, 0.68, 1];
const LEVEL_NAMES = ["Kapalı", "Düşük", "Orta", "Yüksek"];

type HeroProps = Partial<
  Pick<HomePage, "heroTitle" | "heroText" | "heroPrimaryLabel" | "heroPrimaryLink" | "heroSecondaryLabel" | "heroSecondaryLink" | "heroCaption">
>;

function Frame({ k, on, eager }: { k: string; on: boolean; eager: boolean }) {
  // Frames other than the first load only after the visitor touches the light, or once the page is idle.
  const src = (d: string) => (eager ? `/renders/hero-${d}-${k}.webp` : undefined);
  return (
    <picture className={`hero-frame${on ? " on" : ""}`} data-k={k}>
      <source media="(max-width: 759px)" srcSet={src("m")} />
      <img src={src("d")} alt="" width={2400} height={1350} fetchPriority={k === "2700" ? "high" : undefined} />
    </picture>
  );
}

export function Hero(props: HeroProps) {
  const [k, setK] = useState<number>(2700);
  const [lv, setLv] = useState(3);
  const [loadAll, setLoadAll] = useState(false);

  useEffect(() => {
    document.documentElement.style.setProperty("--glow", rgbStr(k));
  }, [k]);

  useEffect(() => {
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (saveData) return;
    const t = setTimeout(() => setLoadAll(true), 1500);
    return () => clearTimeout(t);
  }, []);

  const pickK = (v: number) => {
    setLoadAll(true);
    setK(v);
    if (!lv) setLv(3);
  };
  const pickL = (v: number) => {
    setLoadAll(true);
    setLv(v);
  };

  const caption = lv
    ? `${props.heroCaption} · ${k} K · ${LEVEL_NAMES[lv].toLocaleLowerCase("tr")}`
    : `${props.heroCaption} · kapalı`;

  return (
    <section className="hero" id="top" aria-label="Giriş">
      <div className="hero-media" style={{ "--lv": LEVELS[lv] } as React.CSSProperties}>
        <Frame k="off" on={false} eager={loadAll} />
        {KS.map((x) => (
          <Frame key={x} k={String(x)} on={x === k} eager={x === 2700 || loadAll} />
        ))}
        <button className="hero-hit" type="button" aria-label="Lambaya dokunun: ışık seviyesini değiştirir" onClick={() => pickL((lv + 3) % 4)} />
      </div>
      <div className="wrap hero-in">
        <div className="hero-copy">
          <h1>{props.heroTitle}</h1>
          {props.heroText && <p className="lede">{props.heroText}</p>}
          <div className="cta-row">
            {props.heroPrimaryLabel && props.heroPrimaryLink && (
              <Link className="btn btn-light" href={props.heroPrimaryLink}>
                {props.heroPrimaryLabel}
              </Link>
            )}
            {props.heroSecondaryLabel && props.heroSecondaryLink && (
              <Link className="btn btn-line" href={props.heroSecondaryLink}>
                {props.heroSecondaryLabel}
              </Link>
            )}
          </div>
        </div>
        <div className="hero-ctl" role="group" aria-label="Işık denemesi">
          <div className="seg seg-k">
            {KS.map((x) => (
              <button key={x} type="button" aria-pressed={x === k} onClick={() => pickK(x)}>
                <i style={{ "--c": rgbStr(x) } as React.CSSProperties} />
                {x} K
              </button>
            ))}
          </div>
          <div className="seg seg-l" role="group" aria-label="Işık seviyesi">
            {LEVEL_NAMES.map((n, i) => (
              <button key={n} type="button" aria-pressed={i === lv} onClick={() => pickL(i)}>
                {n}
              </button>
            ))}
          </div>
          {props.heroCaption && <p className="hero-cap">{caption}</p>}
        </div>
      </div>
    </section>
  );
}
