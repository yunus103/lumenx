import Link from "next/link";
import { SanityImage } from "@/components/ui/SanityImage";
import { formatDate } from "@/lib/utils";
import type { BlogPost } from "@/types";

export function PostMeta({ post, className = "" }: { post: BlogPost; className?: string }) {
  return (
    <p className={`post-meta ${className}`}>
      {post.publishedAt && <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>}
      {post.category && <span>{post.category.title}</span>}
    </p>
  );
}

// One list entry: text on the left, the photo on the right; on phones the photo comes first.
export function PostRow({ post, priority = false }: { post: BlogPost; priority?: boolean }) {
  return (
    <article className="post">
      <div className="post-body">
        <h2>
          <Link href={`/blog/${post.slug.current}`} prefetch={false} className="post-link">
            {post.title}
          </Link>
        </h2>
        <PostMeta post={post} />
        {post.excerpt && <p className="post-ex">{post.excerpt}</p>}
      </div>
      {post.mainImage && (
        <div className="post-media">
          <SanityImage image={post.mainImage} fill sizes="(max-width: 759px) 100vw, 40vw" priority={priority} />
        </div>
      )}
    </article>
  );
}

// Compact card for the related posts under an article.
export function PostCard({ post }: { post: BlogPost }) {
  return (
    <article className="post-card">
      {post.mainImage && (
        <div className="post-media">
          <SanityImage image={post.mainImage} fill sizes="(max-width: 759px) 100vw, 33vw" />
        </div>
      )}
      <h3>
        <Link href={`/blog/${post.slug.current}`} prefetch={false} className="post-link">
          {post.title}
        </Link>
      </h3>
      <PostMeta post={post} />
    </article>
  );
}
