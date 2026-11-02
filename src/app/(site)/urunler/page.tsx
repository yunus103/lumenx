import { Metadata } from "next";
import { cachedFetch } from "@/sanity/lib/client";
import { productCategoriesQuery, productListQuery, productsPageQuery } from "@/sanity/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { Catalog } from "@/components/product/Catalog";
import type { CategoryListItem, ProductCardData, ProductsPage } from "@/types";

const getPage = () => cachedFetch<ProductsPage | null>(productsPageQuery, {}, { next: { tags: ["productsPage"] } });

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage();
  return buildMetadata({ title: page?.pageTitle, description: page?.pageSubtitle, canonicalPath: "/urunler", pageSeo: page?.seo });
}

export default async function ProductsPage() {
  const tags = { next: { tags: ["product:list", "product:all"] } };
  const [page, categories, products] = await Promise.all([
    getPage(),
    cachedFetch<CategoryListItem[]>(productCategoriesQuery, {}, tags),
    cachedFetch<ProductCardData[]>(productListQuery, {}, tags),
  ]);

  return (
    <Catalog
      title={page?.pageTitle ?? ""}
      intro={page?.pageSubtitle}
      allLabel={page?.allLabel}
      categories={categories ?? []}
      products={products ?? []}
    />
  );
}
