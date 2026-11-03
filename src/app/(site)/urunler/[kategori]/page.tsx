import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cachedFetch } from "@/sanity/lib/client";
import {
  categoryBySlugQuery,
  categorySlugsQuery,
  productCategoriesQuery,
  productListQuery,
  productsPageQuery,
} from "@/sanity/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { Catalog } from "@/components/product/Catalog";
import { JsonLd, breadcrumbListJsonLd } from "@/components/seo/JsonLd";
import type { CategoryListItem, ProductCardData, ProductCategory, ProductsPage } from "@/types";

type Props = { params: Promise<{ kategori: string }> };

const tags = { next: { tags: ["product:list", "product:all"] } };
const getCategory = (slug: string) => cachedFetch<ProductCategory | null>(categoryBySlugQuery, { slug }, tags);

export async function generateStaticParams() {
  const cats = await cachedFetch<Array<{ slug: string }>>(categorySlugsQuery, {}, tags);
  return (cats ?? []).map((c) => ({ kategori: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { kategori } = await params;
  const cat = await getCategory(kategori);
  if (!cat) return {};
  return buildMetadata({ title: cat.title, description: cat.description, canonicalPath: `/urunler/${kategori}`, pageSeo: cat.seo });
}

export default async function CategoryPage({ params }: Props) {
  const { kategori } = await params;
  const [cat, page, categories, products] = await Promise.all([
    getCategory(kategori),
    cachedFetch<ProductsPage | null>(productsPageQuery, {}, { next: { tags: ["productsPage"] } }),
    cachedFetch<CategoryListItem[]>(productCategoriesQuery, {}, tags),
    // All products, not just this category's: the catalogue switches categories in the browser.
    cachedFetch<ProductCardData[]>(productListQuery, {}, tags),
  ]);
  if (!cat) notFound();

  return (
    <>
      <JsonLd
        data={breadcrumbListJsonLd([
          { label: page?.pageTitle ?? "", href: "/urunler" },
          { label: cat.title, href: `/urunler/${kategori}` },
        ])}
      />
      <Catalog page={page} categories={categories ?? []} products={products ?? []} />
    </>
  );
}
