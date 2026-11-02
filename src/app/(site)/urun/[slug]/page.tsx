import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cachedFetch } from "@/sanity/lib/client";
import { productBySlugQuery, productSlugsQuery, productsPageQuery, relatedProductsQuery } from "@/sanity/lib/queries";
import { buildMetadata, getLayoutData, portableTextToPlainText } from "@/lib/seo";
import { mergeSpecs, shortName } from "@/lib/catalog";
import { Configurator } from "@/components/product/Configurator";
import { RichText } from "@/components/ui/RichText";
import { SanityImage } from "@/components/ui/SanityImage";
import { JsonLd, breadcrumbListJsonLd, productJsonLd } from "@/components/seo/JsonLd";
import type { Product, ProductsPage, RelatedProduct } from "@/types";

type Props = { params: Promise<{ slug: string }> };

const getProduct = (slug: string) =>
  cachedFetch<Product | null>(productBySlugQuery, { slug }, { next: { tags: [`product:detail:${slug}`, "product:all"] } });

export async function generateStaticParams() {
  const items = await cachedFetch<Array<{ slug: string }>>(productSlugsQuery, {}, { next: { tags: ["product:list"] } });
  return (items ?? []).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) return {};
  return buildMetadata({
    title: p.name,
    description: p.summary || portableTextToPlainText(p.description),
    ogImage: p.gallery?.[0],
    canonicalPath: `/urun/${slug}`,
    pageSeo: p.seo,
  });
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) notFound();

  const [related, page, { settings }] = await Promise.all([
    cachedFetch<RelatedProduct[]>(relatedProductsQuery, { categoryId: p.category._id, id: p._id }, { next: { tags: ["product:list", "product:all"] } }),
    cachedFetch<ProductsPage | null>(productsPageQuery, {}, { next: { tags: ["productsPage"] } }),
    getLayoutData(),
  ]);

  // GROQ returns null, not undefined, for missing arrays
  const specs = mergeSpecs(p.category?.defaultSpecs ?? [], p.specs ?? []);
  const hasAbout = !!p.description?.length || !!p.datasheets?.length;
  const crumbs = [
    { label: page?.pageTitle ?? "", href: "/urunler" },
    { label: p.category.title, href: `/urunler/${p.category.slug.current}` },
    { label: p.name, href: `/urun/${slug}` },
  ];

  return (
    <div className="wrap pv">
      <JsonLd data={productJsonLd(p, settings?.siteName)} />
      <JsonLd data={breadcrumbListJsonLd(crumbs)} />
      <nav className="crumbs" aria-label="Konum">
        <Link href={crumbs[0].href}>{crumbs[0].label}</Link>
        <span aria-hidden="true">/</span>
        <Link href={crumbs[1].href}>{crumbs[1].label}</Link>
        <span aria-hidden="true">/</span>
        <span style={{ color: "var(--fg)" }}>{shortName(p.name, p.category.title)}</span>
      </nav>

      <Configurator product={p} />

      {(hasAbout || specs.length > 0) && (
        <div className="p-info">
          {hasAbout && (
            <section className="p-about" aria-labelledby="aboutH">
              <h2 id="aboutH">Ürün hakkında</h2>
              {!!p.description?.length && <RichText value={p.description} className="prose-invert prose-base" />}
              {!!p.datasheets?.length && (
                <div className="sheets">
                  {p.datasheets.map((d) => (
                    <a key={d.url} className="btn btn-line" href={d.url} target="_blank" rel="noopener">
                      {d.title} (PDF)
                    </a>
                  ))}
                </div>
              )}
            </section>
          )}
          {specs.length > 0 && (
            <section className="specs" aria-labelledby="specH">
              <h2 id="specH">Teknik özellikler</h2>
              <dl className="spec-table">
                {specs.map((s) => (
                  <div className="spec-row" key={s.label}>
                    <dt>{s.label}</dt>
                    <dd>{s.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
        </div>
      )}

      {!!related?.length && (
        <section className="related" aria-labelledby="relH">
          <h2 id="relH">Diğer ürünler</h2>
          <div className="rel-row">
            {related.map((o) => (
              <Link className="rel" key={o._id} href={`/urun/${o.slug.current}`}>
                {o.cover && <SanityImage image={o.cover} width={120} height={120} fit="max" objectFit="contain" noBlur />}
                <div>
                  <b>{shortName(o.name, o.category?.title)}</b>
                  <span>{o.category?.title}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
