import { Metadata } from "next";
import { cachedFetch } from "@/sanity/lib/client";
import { blogListQuery, homeMaterialsQuery, homePageQuery, productFallbackQuery, referenceListQuery } from "@/sanity/lib/queries";
import { buildMetadata, getLayoutData } from "@/lib/seo";
import { Hero } from "@/components/home/Hero";
import { CategoryCards } from "@/components/home/CategoryCards";
import { LampSpotlight } from "@/components/home/LampSpotlight";
import { Collection } from "@/components/home/Collection";
import { MaterialStrip } from "@/components/home/MaterialStrip";
import { KelvinGuide } from "@/components/home/KelvinGuide";
import { ReferencesBand } from "@/components/home/ReferencesBand";
import { HomeBlog } from "@/components/home/HomeBlog";
import { CtaBand } from "@/components/home/CtaBand";
import { ViewerWarmup } from "@/components/product/ViewerWarmup";
import { BlogPost, HomePage as HomePageType, MaterialFinish, ProductCardData, ProductTab, Reference } from "@/types";

const getHome = () =>
  cachedFetch<HomePageType>(homePageQuery, {}, { next: { tags: ["home", "home:products"] } });

export async function generateMetadata(): Promise<Metadata> {
  const data = await getHome();
  return buildMetadata({ canonicalPath: "/", pageSeo: data?.seo });
}

export default async function HomePage() {
  const [data, { settings }, posts, finishes] = await Promise.all([
    getHome(),
    getLayoutData(),
    cachedFetch<BlogPost[]>(blogListQuery, {}, { next: { tags: ["blog:list", "blog:categories"] } }),
    cachedFetch<MaterialFinish[]>(homeMaterialsQuery, {}, { next: { tags: ["home:products"] } }),
  ]);

  const tabs: ProductTab[] = data?.productTabs?.length
    ? data.productTabs
    : [{ _key: "all", title: "", products: (await cachedFetch<ProductCardData[]>(productFallbackQuery, {}, { next: { tags: ["product:list", "product:all"] } })) ?? [] }];

  const references = settings?.referencesEnabled
    ? await cachedFetch<Reference[]>(referenceListQuery, {}, { next: { tags: ["reference:list", "product:list"] } })
    : null;
  const referenceCover = references?.[0]?.cover;

  return (
    <div className="home-flow">
      <Hero
        heroTitle={data?.heroTitle}
        heroText={data?.heroText}
        heroPrimaryLabel={data?.heroPrimaryLabel}
        heroPrimaryLink={data?.heroPrimaryLink}
        heroSecondaryLabel={data?.heroSecondaryLabel}
        heroSecondaryLink={data?.heroSecondaryLink}
        heroCaption={data?.heroCaption}
      />
      {!!data?.categoryCards?.length && <CategoryCards cards={data.categoryCards} countLabel={data.categoryCountLabel} />}
      {!!data?.spotlightProducts?.length && (
        <LampSpotlight title={data.spotlightTitle} linkLabel={data.spotlightLinkLabel} products={data.spotlightProducts} />
      )}
      <Collection title={data?.collectionTitle} text={data?.collectionText} linkLabel={data?.collectionLinkLabel} tabs={tabs} />
      {!!finishes?.length && <MaterialStrip title={data?.materialTitle} text={data?.materialText} finishes={finishes} />}
      <KelvinGuide title={data?.kelvinTitle} text={data?.kelvinText} />
      {referenceCover && (
        <ReferencesBand
          referencesTitle={data?.referencesTitle}
          referencesText={data?.referencesText}
          referencesLinkLabel={data?.referencesLinkLabel}
          cover={referenceCover}
        />
      )}
      {!!posts?.length && <HomeBlog title={data?.blogTitle} linkLabel={data?.blogLinkLabel} posts={posts.slice(0, 3)} />}
      <CtaBand
        ctaTitle={data?.ctaTitle}
        ctaSteps={data?.ctaSteps}
        ctaNote={data?.ctaNote}
        ctaQuoteLabel={data?.ctaQuoteLabel}
        ctaWhatsappLabel={data?.ctaWhatsappLabel}
        whatsappNumber={settings?.contactInfo?.whatsappNumber}
      />
      <ViewerWarmup />
    </div>
  );
}
