import Link from "next/link";
import { PostMeta } from "@/components/blog/PostRow";
import type { BlogPost } from "@/types";

export function HomeBlog({ title, linkLabel, posts }: { title?: string; linkLabel?: string; posts: BlogPost[] }) {
  return (
    <section className="band paper" aria-labelledby="hbH">
      <div className="wrap">
        <div className="sec-head">
          <h2 id="hbH">{title}</h2>
          {linkLabel && (
            <Link className="btn btn-paper" href="/blog" prefetch={false}>
              {linkLabel}
            </Link>
          )}
        </div>
        <ol className="hb-list">
          {posts.map((post) => (
            <li className="hb-row" key={post.slug.current}>
              <h3>
                <Link href={`/blog/${post.slug.current}`} prefetch={false} className="post-link">
                  {post.title}
                </Link>
              </h3>
              <PostMeta post={post} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
