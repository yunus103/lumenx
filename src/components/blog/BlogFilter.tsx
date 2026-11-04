"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PostRow } from "@/components/blog/PostRow";
import type { BlogCategory, BlogPost } from "@/types";

interface BlogFilterProps {
  posts: BlogPost[];
  categories: BlogCategory[];
  allLabel?: string;
  emptyText?: string;
}

const readCategory = () => new URLSearchParams(window.location.search).get("category");

export function BlogFilter({ posts, categories, allLabel, emptyText }: BlogFilterProps) {
  const [current, setCurrent] = useState<string | null>(null);

  // The server renders the unfiltered list; the URL (?category=) is applied after hydration and on back/forward.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrent(readCategory());
    const onPop = () => setCurrent(readCategory());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const countFor = (slug?: string) => posts.filter((p) => p.category?.slug?.current === slug).length;
  const tabs = [
    { slug: null, title: allLabel, n: posts.length },
    ...categories.map((c) => ({ slug: c.slug.current, title: c.title, n: countFor(c.slug.current) })).filter((t) => t.n),
  ];

  const select = (e: React.MouseEvent<HTMLAnchorElement>, slug: string | null) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    setCurrent(slug);
    history.pushState(null, "", slug ? `/blog?category=${slug}` : "/blog");
  };

  const shown = current ? posts.filter((p) => p.category?.slug?.current === current) : posts;

  return (
    <>
      {tabs.length > 1 && (
        <div className="blog-bar">
          <nav className="wrap cat-tabs" aria-label="Blog kategorileri">
            {tabs.map((t) => {
              const active = t.slug === current;
              return (
                <a
                  key={t.slug ?? "all"}
                  href={t.slug ? `/blog?category=${t.slug}` : "/blog"}
                  onClick={(e) => select(e, t.slug)}
                  aria-current={active ? "page" : undefined}
                >
                  {t.title}
                  <sup>{t.n}</sup>
                  {active && <motion.span className="cat-tab-line" layoutId="blog-tab-line" transition={{ type: "spring", stiffness: 420, damping: 38 }} />}
                </a>
              );
            })}
          </nav>
        </div>
      )}
      <div className="wrap">
        {shown.length ? (
          <ol className="blog-list" key={current ?? "all"}>
            {shown.map((post, i) => (
              <li key={post.slug.current}>
                <PostRow post={post} priority={i === 0} />
              </li>
            ))}
          </ol>
        ) : (
          <p className="blog-empty">{emptyText}</p>
        )}
      </div>
    </>
  );
}
