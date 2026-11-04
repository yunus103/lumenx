"use client";

import Link from "next/link";
import { useState } from "react";
import { SanityImage } from "@/components/ui/SanityImage";
import { BulbIcon } from "@/components/quote/icons";
import { finishKind, finishWord, photoFor, shortName } from "@/lib/catalog";
import { swatchBg } from "@/lib/light";
import { formatPrice } from "@/lib/price";
import type { ProductCardData } from "@/types";

const SIZES = "(max-width: 620px) 100vw, (max-width: 1000px) 50vw, 400px";

export function ProductCard({ p, sizes = SIZES }: { p: ProductCardData; sizes?: string }) {
  const [finishId, setFinishId] = useState(p.finishes?.[0]?._id);
  const [loaded, setLoaded] = useState(false);
  // Hovered swatch: its photo is rendered hidden with the same sizes, so the click swaps to a cached image.
  const [nextFinishId, setNextFinishId] = useState<string>();
  // The night photo is fetched only once the visitor shows interest in this card, not for all 100+ on the page.
  const [wantNight, setWantNight] = useState(false);
  const [lit, setLit] = useState(false);
  const href = `/urun/${p.slug.current}`;
  const name = shortName(p.name, p.category?.title);
  const word = finishWord(p.finishes);
  const { image } = photoFor(p.variantPhotos, p.cover, finishId);
  const nextImage = nextFinishId && photoFor(p.variantPhotos, p.cover, nextFinishId).image;
  const warm = () => p.night && setWantNight(true);
  const price = formatPrice(p.priceUsd, p.premiumPriceUsd);

  return (
    <div className={`card${lit ? " lit" : ""}`} onPointerEnter={warm} onFocus={warm}>
      <div className="card-media" data-loading={image && !loaded ? "" : undefined}>
        <Link className="card-cover" href={href} tabIndex={-1} aria-hidden="true" />
        {image && <SanityImage image={image} alt={p.name} fill sizes={sizes} objectFit="cover" className="ph" onLoad={() => setLoaded(true)} />}
        {nextImage && nextImage !== image && <SanityImage image={nextImage} alt="" fill sizes={sizes} objectFit="cover" className="ph preload" />}
        {p.night && (
          <>
            {wantNight && <SanityImage image={p.night} alt="" fill sizes={sizes} className="night" />}
            {p.kelvin && <span className="card-tag">{p.kelvin} K</span>}
            <button
              className="card-light"
              type="button"
              aria-pressed={lit}
              aria-label={`${name} ışığını yak`}
              onClick={() => {
                setWantNight(true);
                setLit(!lit);
              }}
            >
              <BulbIcon />
            </button>
          </>
        )}
      </div>
      <div className="card-body">
        <h3>
          <Link href={href}>{name}</Link>
        </h3>
        {price && <span className="price">{price}’den</span>}
        <span className="meta">{p.summary || p.category?.title}</span>
        {!!p.finishes?.length && (
          <div className="dots">
            {p.finishes.map((f) => (
              <button
                key={f._id}
                type="button"
                aria-pressed={f._id === finishId}
                aria-label={`${f.name} ${word}`}
                title={f.name}
                onClick={() => setFinishId(f._id)}
                onPointerEnter={() => setNextFinishId(f._id)}
              >
                <i style={{ background: swatchBg(f.hex ?? "#888888", finishKind(f) === "metal") }} />
              </button>
            ))}
            <span>
              {p.finishes.length} {word} rengi
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export function ProductGrid({ products, sizes }: { products: ProductCardData[]; sizes?: string }) {
  return (
    <div className="pgrid">
      {products.map((p) => (
        <ProductCard key={p._id} p={p} sizes={sizes} />
      ))}
    </div>
  );
}
