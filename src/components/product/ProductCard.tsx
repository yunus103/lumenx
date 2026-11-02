"use client";

import Link from "next/link";
import { useState } from "react";
import { SanityImage } from "@/components/ui/SanityImage";
import { finishKind, finishWord, photoFor, shortName } from "@/lib/catalog";
import { swatchBg } from "@/lib/light";
import { formatPrice } from "@/lib/price";
import type { ProductCardData } from "@/types";

export function ProductCard({ p }: { p: ProductCardData }) {
  const [finishId, setFinishId] = useState(p.finishes?.[0]?._id);
  const href = `/urun/${p.slug.current}`;
  const name = shortName(p.name, p.category?.title);
  const word = finishWord(p.finishes);
  const { image } = photoFor(p.variantPhotos, p.cover, finishId);
  const price = formatPrice(p.priceUsd, p.premiumPriceUsd);

  return (
    <div className="card">
      <div className="card-media">
        <Link className="card-cover" href={href} tabIndex={-1} aria-hidden="true" />
        {image && (
          <SanityImage
            image={image}
            alt={p.name}
            fill
            sizes="(max-width: 620px) 100vw, (max-width: 1000px) 50vw, 400px"
            objectFit="contain"
            className="ph"
          />
        )}
      </div>
      <div className="card-body">
        <h3>
          <Link href={href}>{name}</Link>
        </h3>
        <span className="price">{price ? `${price}’den` : "Projeye özel"}</span>
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

export function ProductGrid({ products }: { products: ProductCardData[] }) {
  return (
    <div className="pgrid">
      {products.map((p) => (
        <ProductCard key={p._id} p={p} />
      ))}
    </div>
  );
}
