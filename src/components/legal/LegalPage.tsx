import { notFound } from "next/navigation";
import { Metadata } from "next";
import { cachedFetch } from "@/sanity/lib/client";
import { legalPageBySlugQuery } from "@/sanity/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { RichText } from "@/components/ui/RichText";
import { formatDate } from "@/lib/utils";
import type { LegalPage as LegalPageType } from "@/types";

const getLegalPage = (slug: string) =>
  cachedFetch<LegalPageType | null>(legalPageBySlugQuery, { slug }, { next: { tags: [`legal:${slug}`] } });

export async function legalMetadata(slug: string): Promise<Metadata> {
  const page = await getLegalPage(slug);
  if (!page) return {};
  return buildMetadata({ title: page.title, canonicalPath: `/${slug}`, pageSeo: page.seo });
}

// Shared by /kvkk and /cerez-politikasi: the blog's reading layout without cover or meta.
export async function LegalPage({ slug }: { slug: string }) {
  const page = await getLegalPage(slug);
  if (!page) notFound();

  return (
    <article className="paper read-page legal">
      <div className="wrap">
        <header className="read-head">
          <div className="read-title">
            <h1>{page.title}</h1>
            {page.updatedAt && (
              <p className="post-meta">
                <span>
                  {page.updatedLabel} <time dateTime={page.updatedAt}>{formatDate(page.updatedAt)}</time>
                </span>
              </p>
            )}
          </div>
        </header>
        <div className="read">
          <RichText value={page.body} />
        </div>
      </div>
    </article>
  );
}
