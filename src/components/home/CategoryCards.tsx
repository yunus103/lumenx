import Link from "next/link";
import { SanityImage } from "@/components/ui/SanityImage";
import type { HomePage } from "@/types";

export function CategoryCards({ cards }: { cards: NonNullable<HomePage["categoryCards"]> }) {
  return (
    <section className="paper home-cats" aria-label="Ürün kategorileri">
      <div className="wrap hc-grid">
        {cards.map((c) => (
          <Link className="hc" key={c._key} href={`/urunler/${c.slug}`}>
            {c.image?.asset && <SanityImage image={c.image} alt="" fill sizes="(max-width: 760px) 100vw, 33vw" quality={80} />}
            <h2 className="hc-name">
              {c.title}
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </h2>
          </Link>
        ))}
      </div>
    </section>
  );
}
