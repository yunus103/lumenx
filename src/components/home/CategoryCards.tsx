import Link from "next/link";
import { SanityImage } from "@/components/ui/SanityImage";
import { shortName } from "@/lib/catalog";
import type { CategoryCard } from "@/types";

// Stations come as Ekonomik/Premium pairs of one model and wall lights all end in the same module wording,
// so the card lists each model once, by the part that tells them apart.
function modelNames(models: CategoryCard["models"]) {
  const names = models.map((m) => shortName(m.name, m.category).split(" - ")[0].replace(/ Kablosuz Modüllü$/, ""));
  return [...new Set(names)].slice(0, 4).join(", ");
}

const SIZES = ["(max-width: 760px) 100vw, 58vw", "(max-width: 760px) 100vw, 42vw"];

export function CategoryCards({ cards, countLabel }: { cards: CategoryCard[]; countLabel?: string }) {
  return (
    <section className="paper home-cats" aria-label="Ürün kategorileri">
      <div className="wrap hc-grid">
        {cards.map((c, i) => (
          <Link className="hc" key={c._key} href={`/urunler/${c.slug}`}>
            {c.image?.asset && <SanityImage image={c.image} alt="" fill sizes={SIZES[i ? 1 : 0]} quality={80} />}
            <div className="hc-cap">
              <h2 className="hc-name">
                {c.title}
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </h2>
              <p className="hc-count">
                {c.count} {countLabel}
              </p>
              <p className="hc-models">{modelNames(c.models)}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
