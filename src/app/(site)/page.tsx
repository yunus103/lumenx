import { Metadata } from "next";
import { cachedFetch } from "@/sanity/lib/client";
import { homePageQuery, productFallbackQuery } from "@/sanity/lib/queries";
import { buildMetadata, getLayoutData } from "@/lib/seo";
import { Hero } from "@/components/home/Hero";
import { Collection } from "@/components/home/Collection";
import { KelvinGuide } from "@/components/home/KelvinGuide";
import { ProjectsBand } from "@/components/home/ProjectsBand";
import { CtaBand } from "@/components/home/CtaBand";
import { ViewerWarmup } from "@/components/product/ViewerWarmup";
import { HomePage as HomePageType, ProductCardData } from "@/types";

const getHome = () =>
  cachedFetch<HomePageType>(homePageQuery, {}, { next: { tags: ["home", "home:featured", "product:all"] } });

export async function generateMetadata(): Promise<Metadata> {
  const data = await getHome();
  return buildMetadata({ canonicalPath: "/", pageSeo: data?.seo });
}

export default async function HomePage() {
  const [data, { settings }] = await Promise.all([getHome(), getLayoutData()]);

  const products = data?.featuredProducts?.length
    ? data.featuredProducts
    : await cachedFetch<ProductCardData[]>(productFallbackQuery, {}, { next: { tags: ["product:list", "product:all"] } });

  return (
    <>
      <Hero
        heroTitle={data?.heroTitle}
        heroText={data?.heroText}
        heroPrimaryLabel={data?.heroPrimaryLabel}
        heroPrimaryLink={data?.heroPrimaryLink}
        heroSecondaryLabel={data?.heroSecondaryLabel}
        heroSecondaryLink={data?.heroSecondaryLink}
        heroCaption={data?.heroCaption}
      />
      <Collection title={data?.collectionTitle} text={data?.collectionText} linkLabel={data?.collectionLinkLabel} products={products ?? []} />
      <KelvinGuide title={data?.kelvinTitle} text={data?.kelvinText} />
      <ProjectsBand
        projectsTitle={data?.projectsTitle}
        projectsText={data?.projectsText}
        stationsTitle={data?.stationsTitle}
        stationsText={data?.stationsText}
      />
      <CtaBand
        ctaTitle={data?.ctaTitle}
        ctaText={data?.ctaText}
        ctaQuoteLabel={data?.ctaQuoteLabel}
        ctaWhatsappLabel={data?.ctaWhatsappLabel}
        whatsappNumber={settings?.contactInfo?.whatsappNumber}
      />
      <ViewerWarmup />
    </>
  );
}
