"use client";

import Link from "next/link";
import { useState } from "react";
import { ProductGrid } from "@/components/product/ProductCard";
import type { CategoryRef, ProductCardData } from "@/types";

interface CollectionProps {
  title?: string;
  text?: string;
  linkLabel?: string;
  products: ProductCardData[];
}

export function Collection({ title, text, linkLabel, products }: CollectionProps) {
  const [filter, setFilter] = useState<string | null>(null);
  const categories = [...new Map(products.map((p) => [p.category._id, p.category])).values()] as CategoryRef[];
  const shown = filter ? products.filter((p) => p.category._id === filter) : products;

  return (
    <section className="band paper" id="koleksiyon" aria-labelledby="kolH">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <h2 id="kolH">{title}</h2>
            {text && <p>{text}</p>}
          </div>
          {categories.length > 1 && (
            <div className="filters" role="group" aria-label="Ürün filtresi">
              <button type="button" aria-pressed={!filter} onClick={() => setFilter(null)}>
                Tümü
              </button>
              {categories.map((c) => (
                <button key={c._id} type="button" aria-pressed={filter === c._id} onClick={() => setFilter(c._id)}>
                  {c.title}
                </button>
              ))}
            </div>
          )}
        </div>
        <ProductGrid products={shown} />
        {linkLabel && (
          <div className="mt-12 flex justify-center">
            <Link className="btn btn-paper" href="/urunler">
              {linkLabel}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
