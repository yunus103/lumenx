"use client";

import Link from "next/link";
import { useState } from "react";
import { SanityImage } from "@/components/ui/SanityImage";
import { finishKind, shortName } from "@/lib/catalog";
import { swatchBg } from "@/lib/light";
import type { SpotlightProduct } from "@/types";

interface LampSpotlightProps {
  title?: string;
  linkLabel?: string;
  products: SpotlightProduct[];
}

export function LampSpotlight({ title, linkLabel, products }: LampSpotlightProps) {
  const [index, setIndex] = useState(0);
  const active = products[index];
  const activeName = shortName(active.name, active.category);

  return (
    <section className="spot" aria-labelledby="spotH">
      <div className="wrap spot-in">
        <div className="spot-head">
          <h2 id="spotH">{title}</h2>
          <div className="spot-list" role="group" aria-labelledby="spotH">
            {products.map((p, i) => (
              <button key={p._id} type="button" aria-pressed={i === index} onClick={() => setIndex(i)}>
                {shortName(p.name, p.category)}
              </button>
            ))}
          </div>
        </div>
        <div className="spot-stage">
          {/* All photos stay mounted: they load together as the section nears the viewport, so a switch is instant. */}
          {products.map((p, i) => (
            <div className={`spot-img${i === index ? " on" : ""}`} key={p._id} aria-hidden={i !== index}>
              <SanityImage image={p.night} alt={p.name} fill sizes="(max-width: 960px) 90vw, 560px" quality={85} />
            </div>
          ))}
        </div>
        <div className="spot-detail" key={active._id} aria-live="polite">
          {active.line && <p>{active.line}</p>}
          {!!active.finishes?.length && (
            <div className="spot-dots" role="img" aria-label={active.finishes.map((f) => f.name).join(", ")}>
              {active.finishes.map((f) => (
                <i key={f._id} title={f.name} style={{ background: swatchBg(f.hex ?? "#888888", finishKind(f) === "metal") }} />
              ))}
            </div>
          )}
          <Link className="btn btn-light" href={`/urun/${active.slug.current}`} aria-label={`${activeName}: ${linkLabel}`}>
            {linkLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
