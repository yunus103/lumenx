"use client";

import Link from "next/link";
import { useState } from "react";
import { SanityImage } from "@/components/ui/SanityImage";
import { type FinishKind, finishInfo, finishKind, photoFor, shortName } from "@/lib/catalog";
import { swatchBg } from "@/lib/light";
import type { Finish, MaterialFinish } from "@/types";

const KINDS: FinishKind[] = ["metal", "wood", "paint"];

// finishInfo's headline for a painted finish is its RAL code, which the caption shows next to the finish name.
function detail(f: Finish) {
  const { line } = finishInfo(f);
  return finishKind(f) === "paint" && f.ral ? `RAL ${f.ral}, ${line}` : line;
}

interface MaterialStripProps {
  title?: string;
  text?: string;
  finishes: MaterialFinish[];
}

export function MaterialStrip({ title, text, finishes }: MaterialStripProps) {
  const groups = KINDS.map((k) => finishes.filter((f) => finishKind(f) === k)).filter((g) => g.length);
  const ordered = groups.flat();
  const [activeId, setActiveId] = useState(ordered[0]._id);
  const [peekId, setPeekId] = useState<string>();
  const active = ordered.find((f) => f._id === activeId) ?? ordered[0];
  const shown = ordered.find((f) => f._id === peekId) ?? active;

  return (
    <section className="band paper ms" aria-labelledby="msH">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <h2 id="msH">{title}</h2>
            {text && <p>{text}</p>}
          </div>
        </div>
        <div className="ms-strip" role="group" aria-labelledby="msH">
          {groups.map((group) => (
            <div className="ms-group" key={finishKind(group[0])} style={{ "--n": group.length } as React.CSSProperties}>
              {group.map((f) => (
                <button
                  key={f._id}
                  className="ms-sw"
                  type="button"
                  aria-pressed={f._id === active._id}
                  aria-label={`${f.name}, ${detail(f)}`}
                  style={{ background: swatchBg(f.hex ?? "#888888", finishKind(f) === "metal") }}
                  onClick={() => setActiveId(f._id)}
                  onPointerEnter={() => setPeekId(f._id)}
                  onPointerLeave={() => setPeekId(undefined)}
                  onFocus={() => setPeekId(f._id)}
                  onBlur={() => setPeekId(undefined)}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="ms-body">
          <p className="ms-cap" aria-live="polite">
            <strong>{shown.name}</strong>
            <span>{detail(shown)}</span>
          </p>
          <div className="ms-tiles" key={active._id}>
            {active.products.map((p) => {
              const { image } = photoFor(p.variantPhotos, p.cover, active._id);
              return (
                <Link className="ms-tile" key={p._id} href={`/urun/${p.slug.current}`}>
                  <span className="ms-tile-media">
                    {image && <SanityImage image={image} alt="" fill sizes="(max-width: 760px) 50vw, 220px" objectFit="contain" />}
                  </span>
                  <span className="ms-tile-name">{shortName(p.name, p.category)}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
