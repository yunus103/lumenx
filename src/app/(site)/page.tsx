import { Metadata } from "next";
import { cachedFetch } from "@/sanity/lib/client";
import {
  homePageQuery,
  blogFallbackQuery,
} from "@/sanity/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { HeroSection } from "@/components/home/HeroSection";
import { AboutSection } from "@/components/home/AboutSection";
import { BlogSection } from "@/components/home/BlogSection";
import { HomePage as HomePageType, BlogPost } from "@/types";

export async function generateMetadata(): Promise<Metadata> {
  const data = await cachedFetch<HomePageType>(homePageQuery, {}, { next: { tags: ["home", "home:featured"] } });
  return buildMetadata({
    canonicalPath: "/",
    pageSeo: data?.seo,
  });
}

export default async function HomePage() {
  // 1. First fetch the main homepage configuration
  const data = await cachedFetch<HomePageType>(homePageQuery, {}, { next: { tags: ["home", "home:featured"] } });

  const needsFallbackPosts = !data?.featuredPosts || data.featuredPosts.length === 0;
  const fallbackPosts = needsFallbackPosts
    ? await cachedFetch<BlogPost[]>(blogFallbackQuery, {}, { next: { tags: ["blog:list", "blog:categories"] } })
    : [];

  const postsToDisplay = data?.featuredPosts && data.featuredPosts.length > 0
    ? data.featuredPosts
    : fallbackPosts;

  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero Section */}
      <HeroSection data={data} />

      {/* 2. Hakkımızda Bölümü */}
      <AboutSection
        title={data?.aboutTitle}
        subtitle={data?.aboutSubtitle}
        text={data?.aboutText}
        image={data?.aboutImage}
        ctaLabel={data?.aboutCtaLabel}
        ctaLink={data?.aboutCtaLink}
      />

      {/* 5. Son Blog Yazıları */}
      <BlogSection
        title={data?.blogTitle}
        subtitle={data?.blogSubtitle}
        posts={postsToDisplay}
      />
    </div>
  );
}
