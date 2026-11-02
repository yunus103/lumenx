import Link from "next/link";
import { ProductGrid } from "@/components/product/ProductCard";
import type { CategoryListItem, ProductCardData } from "@/types";

interface CatalogProps {
  title: string;
  intro?: string;
  allLabel?: string;
  categories: CategoryListItem[];
  activeSlug?: string;
  products: ProductCardData[];
}

// Filter chips list the leaf categories (those nobody uses as a parent); parents get their own page and,
// later, a mega menu.
function leafCategories(categories: CategoryListItem[]) {
  const parents = new Set(categories.map((c) => c.parent?._id).filter(Boolean));
  return categories.filter((c) => c.count > 0 && !parents.has(c._id));
}

export function Catalog({ title, intro, allLabel, categories, activeSlug, products }: CatalogProps) {
  return (
    <section className="band paper catalog" aria-labelledby="catH">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <h1 id="catH">{title}</h1>
            {intro && <p>{intro}</p>}
          </div>
          <nav className="filters" aria-label="Kategoriler">
            <Link href="/urunler" aria-current={!activeSlug ? "page" : undefined}>
              {allLabel}
            </Link>
            {leafCategories(categories).map((c) => (
              <Link key={c._id} href={`/urunler/${c.slug.current}`} aria-current={c.slug.current === activeSlug ? "page" : undefined}>
                {c.title}
              </Link>
            ))}
          </nav>
        </div>
        <ProductGrid products={products} />
      </div>
    </section>
  );
}
