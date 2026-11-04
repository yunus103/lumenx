import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cachedFetch } from "@/sanity/lib/client";
import { referenceListQuery, referencesPageQuery } from "@/sanity/lib/queries";
import { buildMetadata, getLayoutData } from "@/lib/seo";
import { PageHero } from "@/components/layout/PageHero";
import { ReferenceItem } from "@/components/reference/ReferenceItem";
import type { Reference, ReferencesPage as ReferencesPageType } from "@/types";

const getPage = () => cachedFetch<ReferencesPageType | null>(referencesPageQuery, {}, { next: { tags: ["referencesPage"] } });

// The switch lives in siteSettings, which the "layout" tag already revalidates.
async function assertEnabled() {
  const { settings } = await getLayoutData();
  if (!settings?.referencesEnabled) notFound();
}

export async function generateMetadata(): Promise<Metadata> {
  await assertEnabled();
  const page = await getPage();
  return buildMetadata({ title: page?.pageTitle, description: page?.pageSubtitle, canonicalPath: "/referanslar", pageSeo: page?.seo });
}

export default async function ReferencesPage() {
  await assertEnabled();
  const [page, references] = await Promise.all([
    getPage(),
    // product names and slugs are embedded, so a product change refreshes the page too
    cachedFetch<Reference[]>(referenceListQuery, {}, { next: { tags: ["reference:list", "product:list"] } }),
  ]);

  return (
    <div className="refs-page">
      <PageHero title={page?.pageTitle ?? ""} subtitle={page?.pageSubtitle} />
      {references?.length ? (
        <div className="refs">
          {references.map((r, i) => (
            <ReferenceItem key={r._id} reference={r} page={page} priority={i === 0} />
          ))}
        </div>
      ) : (
        <p className="wrap refs-empty">{page?.emptyText}</p>
      )}
    </div>
  );
}
