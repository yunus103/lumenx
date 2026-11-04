import Link from "next/link";
import { ProductGrid } from "@/components/product/ProductCard";
import type { ProductCardData } from "@/types";

interface CollectionProps {
  title?: string;
  text?: string;
  linkLabel?: string;
  products: ProductCardData[];
}

export function Collection({ title, text, linkLabel, products }: CollectionProps) {
  return (
    <section className="band paper" id="koleksiyon" aria-labelledby="kolH">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <h2 id="kolH">{title}</h2>
            {text && <p>{text}</p>}
          </div>
        </div>
        <ProductGrid products={products} />
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
