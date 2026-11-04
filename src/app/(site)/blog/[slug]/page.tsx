import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cachedFetch } from "@/sanity/lib/client";
import { blogPageQuery, blogPostBySlugQuery, blogRelatedPostsQuery, blogSlugsQuery } from "@/sanity/lib/queries";
import { buildMetadata, getLayoutData } from "@/lib/seo";
import { RichText } from "@/components/ui/RichText";
import { SanityImage } from "@/components/ui/SanityImage";
import { JsonLd, articleJsonLd } from "@/components/seo/JsonLd";
import { PostCard, PostMeta } from "@/components/blog/PostRow";
import { BlogPage, BlogPost } from "@/types";

type Props = { params: Promise<{ slug: string }> };

const getPost = (slug: string) =>
  cachedFetch<BlogPost | null>(blogPostBySlugQuery, { slug }, { next: { tags: [`blog:detail:${slug}`, "blog:categories"] } });

export async function generateStaticParams() {
  const posts = await cachedFetch<Array<{ slug: string }>>(blogSlugsQuery, {}, { next: { tags: ["blog:list"] } });
  return (posts || []).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  const baseSeo = await buildMetadata({
    title: post.title,
    description: post.excerpt,
    ogImage: post.mainImage,
    canonicalPath: `/blog/${slug}`,
    pageSeo: post.seo,
  });
  if (post.seoTags?.length) baseSeo.keywords = post.seoTags;
  return baseSeo;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const [post, page, layoutData] = await Promise.all([
    getPost(slug),
    cachedFetch<BlogPage | null>(blogPageQuery, {}, { next: { tags: ["blogPage"] } }),
    getLayoutData(),
  ]);

  if (!post) notFound();

  const related = post.category?._id
    ? await cachedFetch<BlogPost[]>(
        blogRelatedPostsQuery,
        { categoryId: post.category._id, currentPostId: post._id },
        { next: { tags: [`blog:related:${post.category._id}`] } }
      )
    : [];

  return (
    <>
      <JsonLd data={articleJsonLd(post, layoutData?.settings)} />

      <article className="paper read-page">
        <div className="wrap">
          <Link href="/blog" prefetch={false} className="read-back">
            <span aria-hidden="true">←</span> {page?.backLabel}
          </Link>
          <header className={`read-head${post.mainImage ? " has-cover" : ""}`}>
            <div className="read-title">
              <h1>{post.title}</h1>
              <PostMeta post={post} />
              {post.excerpt && <p className="read-lede">{post.excerpt}</p>}
            </div>
            {post.mainImage && (
              <figure className="read-cover">
                <SanityImage image={post.mainImage} fill sizes="(max-width: 899px) 100vw, 520px" priority />
              </figure>
            )}
          </header>
          <div className="read">
            <RichText value={post.body} />
          </div>

          {related?.length > 0 && (
            <section className="read-related" aria-labelledby="relH">
              <h2 id="relH">{page?.relatedTitle}</h2>
              <div className="read-related-grid">
                {related.map((r) => (
                  <PostCard key={r.slug.current} post={r} />
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </>
  );
}
