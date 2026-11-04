import { Metadata } from "next";
import { cachedFetch } from "@/sanity/lib/client";
import { aboutPageQuery } from "@/sanity/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/layout/PageHero";
import { RichText } from "@/components/ui/RichText";
import { SanityImage } from "@/components/ui/SanityImage";
import { AboutPage as AboutPageType } from "@/types";

// The featured product's photo is embedded here; "product:list" is what a product's photo change invalidates.
const getPage = () => cachedFetch<AboutPageType | null>(aboutPageQuery, {}, { next: { tags: ["about", "product:list"] } });

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPage();
  return buildMetadata({
    title: data?.pageTitle,
    description: data?.summary,
    canonicalPath: "/hakkimizda",
    pageSeo: data?.seo,
  });
}

export default async function AboutPage() {
  const data = await getPage();
  const product = data?.featuredProduct;

  return (
    <div className="paper ab">
      <PageHero title={data?.heroTitle ?? data?.pageTitle ?? ""} />
      <section className="wrap ab-body">
        <div className="ab-text">
          <RichText value={data?.body} />
        </div>
        {product?.image?.asset && (
          <div className="ab-photo">
            <SanityImage image={product.image} alt={product.name} fill sizes="(max-width: 960px) 90vw, 40vw" quality={85} priority />
          </div>
        )}
      </section>
    </div>
  );
}
