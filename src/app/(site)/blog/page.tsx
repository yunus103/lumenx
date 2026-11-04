import { Metadata } from "next";
import { cachedFetch } from "@/sanity/lib/client";
import { blogListQuery, blogCategoriesQuery, blogPageQuery } from "@/sanity/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { BlogFilter } from "@/components/blog/BlogFilter";
import { PageHero } from "@/components/layout/PageHero";
import { BlogPage as BlogPageType, BlogPost, BlogCategory } from "@/types";

const getPage = () => cachedFetch<BlogPageType | null>(blogPageQuery, {}, { next: { tags: ["blogPage"] } });

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getPage();
  return buildMetadata({
    title: pageData?.heroTitle || pageData?.pageTitle,
    description: pageData?.heroSubtitle || pageData?.pageSubtitle,
    canonicalPath: "/blog",
    pageSeo: pageData?.seo,
  });
}

export default async function BlogListPage() {
  const [posts, categories, pageData] = await Promise.all([
    cachedFetch<BlogPost[]>(blogListQuery, {}, { next: { tags: ["blog:list", "blog:categories"] } }),
    cachedFetch<BlogCategory[]>(blogCategoriesQuery, {}, { next: { tags: ["blog:categories"] } }),
    getPage(),
  ]);

  return (
    <>
      {/* paper like the catalogue, so head, tabs and list read as one band */}
      <PageHero className="paper" title={pageData?.heroTitle || pageData?.pageTitle || ""} subtitle={pageData?.heroSubtitle || pageData?.pageSubtitle} />
      <section className="paper blog" aria-label={pageData?.pageTitle}>
        <BlogFilter posts={posts ?? []} categories={categories ?? []} allLabel={pageData?.allLabel} emptyText={pageData?.emptyText} />
      </section>
    </>
  );
}
