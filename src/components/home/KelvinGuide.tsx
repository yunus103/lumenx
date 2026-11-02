"use client";

import { useEffect, useRef, useState } from "react";
import { KINFO, nearestKelvin, rgbStr } from "@/lib/light";

// Six rendered frames of the same table; the slider blends the two neighbours of the chosen value.
const FRAMES = [2700, 3000, 3500, 4000, 5000, 6500];
const TRACK = `linear-gradient(90deg, ${FRAMES.map((k) => `rgb(${rgbStr(k)}) ${((k - 2700) / 38).toFixed(1)}%`).join(", ")})`;

export function KelvinGuide({ title, text }: { title?: string; text?: string }) {
  const [k, setK] = useState(3000);
  const [inView, setInView] = useState(false);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => {
        if (!es[0].isIntersecting) return;
        setInView(true);
        io.disconnect();
      },
      { rootMargin: "400px" }
    );
    if (stage.current) io.observe(stage.current);
    return () => io.disconnect();
  }, []);

  let i = FRAMES.findIndex((x) => x >= k);
  if (i <= 0) i = 1;
  const a = FRAMES[i - 1];
  const b = FRAMES[i];
  const t = (k - a) / (b - a);
  const name = KINFO[nearestKelvin(k)][0];

  return (
    <section className="band kelvin" id="isik" aria-labelledby="kH">
      <div className="wrap kel">
        <div className="kel-stage" ref={stage}>
          <div className="kel-frames">
            {FRAMES.map((f, j) => (
              // eslint-disable-next-line @next/next/no-img-element -- static renders blended by opacity
              <img
                key={f}
                src={j === 1 || inView ? `/renders/kelvin-${f}.webp` : undefined}
                alt={j === 1 ? "Altıgen LED armatürün yemek masası üzerindeki ışığı" : ""}
                width={1800}
                height={1180}
                decoding="async"
                className={f === a ? "base" : undefined}
                style={{ opacity: f === a ? 1 : f === b ? t : 0 }}
              />
            ))}
          </div>
          <div className="kel-read">
            <span className="kel-k">
              {k}
              <small>K</small>
            </span>
            <span className="kel-name">{name}</span>
          </div>
        </div>
        <div className="kel-side">
          <h2 id="kH">{title}</h2>
          {text && <p>{text}</p>}
          <div className="kel-ctl">
            <label htmlFor="kelRange" className="sr">
              Renk sıcaklığı
            </label>
            <input
              className="krange"
              id="kelRange"
              type="range"
              min={2700}
              max={6500}
              step={50}
              value={k}
              aria-valuetext={`${k} Kelvin, ${name}`}
              onChange={(e) => setK(+e.target.value)}
              style={{ "--track": TRACK, "--kc": rgbStr(k) } as React.CSSProperties}
            />
            <div className="kscale" aria-hidden="true">
              <span>2700 K</span>
              <span>4000 K</span>
              <span>6500 K</span>
            </div>
          </div>
          <div className="kuses">
            {Object.entries(KINFO).map(([kv, [n, u]]) => (
              <button key={kv} className="kuse" type="button" aria-current={+kv === nearestKelvin(k)} onClick={() => setK(+kv)}>
                <b>
                  <i style={{ background: `rgb(${rgbStr(+kv)})` }} />
                  {kv} K
                </b>
                <span>
                  {n}. {u}.
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
