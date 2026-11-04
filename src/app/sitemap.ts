import { MetadataRoute } from "next";
import { cachedFetch } from "@/sanity/lib/client";
import { allSlugsForSitemapQuery } from "@/sanity/lib/queries";
import { getSiteUrl } from "@/lib/utils";

type SitemapItem = {
  slug: string;
  _updatedAt?: string;
};

type SitemapPage = {
  _updatedAt?: string;
  noIndex?: boolean;
};

type SitemapData = {
  pages?: Record<"home" | "about" | "contact" | "blog" | "products" | "references", SitemapPage | null>;
  referencesEnabled?: boolean;
  blogPosts?: SitemapItem[];
  products?: SitemapItem[];
  categories?: SitemapItem[];
  legalPages?: SitemapItem[];
};

function lastModified(updatedAt?: string) {
  return updatedAt ? new Date(updatedAt) : undefined;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const data = await cachedFetch<SitemapData>(
    allSlugsForSitemapQuery,
    {},
    // "layout" too: flipping siteSettings.referencesEnabled only revalidates that tag.
    { next: { tags: ["sitemap", "layout"] } }
  );
  const pages = data?.pages;

  const staticRouteEntries: MetadataRoute.Sitemap = [
    { url: base, lastModified: lastModified(pages?.home?._updatedAt), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/hakkimizda`, lastModified: lastModified(pages?.about?._updatedAt), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/iletisim`, lastModified: lastModified(pages?.contact?._updatedAt), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/urunler`, lastModified: lastModified(pages?.products?._updatedAt), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/blog`, lastModified: lastModified(pages?.blog?._updatedAt), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/referanslar`, lastModified: lastModified(pages?.references?._updatedAt), changeFrequency: "monthly", priority: 0.7 },
  ];

  const staticRoutes = staticRouteEntries.filter((route) => {
    const path = route.url.replace(base, "") || "/";
    if (path === "/") return !pages?.home?.noIndex;
    if (path === "/hakkimizda") return !pages?.about?.noIndex;
    if (path === "/iletisim") return !pages?.contact?.noIndex;
    if (path === "/blog") return !pages?.blog?.noIndex;
    if (path === "/urunler") return !pages?.products?.noIndex;
    if (path === "/referanslar") return data?.referencesEnabled === true && !pages?.references?.noIndex;
    return true;
  });

  const dynamicRoutes: MetadataRoute.Sitemap = [
    ...(data?.blogPosts?.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: lastModified(p._updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })) || []),
    ...(data?.legalPages?.map((p) => ({
      url: `${base}/${p.slug}`,
      lastModified: lastModified(p._updatedAt),
      changeFrequency: "yearly" as const,
      priority: 0.2,
    })) || []),
    ...(data?.categories?.map((c) => ({
      url: `${base}/urunler/${c.slug}`,
      lastModified: lastModified(c._updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })) || []),
    ...(data?.products?.map((p) => ({
      url: `${base}/urun/${p.slug}`,
      lastModified: lastModified(p._updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })) || []),
  ];

  return [...staticRoutes, ...dynamicRoutes];
}
