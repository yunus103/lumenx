import Link from "next/link";
import { SanityImage } from "@/components/ui/SanityImage";
import { ReferenceGallery } from "@/components/reference/ReferenceGallery";
import type { Reference, ReferencesPage } from "@/types";

interface ReferenceItemProps {
  reference: Reference;
  page: ReferencesPage | null;
  priority?: boolean;
}

export function ReferenceItem({ reference: r, page, priority }: ReferenceItemProps) {
  const headingId = `ref-${r._id}`;
  const paragraphs = r.summary?.split(/\n\s*\n/).filter(Boolean);
  const hasProducts = !!r.products?.length;

  return (
    <article className="ref" id={r.slug} aria-labelledby={headingId}>
      <ReferenceGallery
        title={r.title}
        cover={r.cover}
        media={r.media}
        photoLabel={page?.photoLabel}
        videoLabel={page?.videoLabel}
        priority={priority}
        caption={
          <div className="ref-name">
            <h2 id={headingId}>{r.title}</h2>
            {(r.location || r.year) && (
              <p className="ref-place">
                {r.location && <span>{r.location}</span>}
                {r.year && <span className="num">{r.year}</span>}
              </p>
            )}
          </div>
        }
      >
        {(r.logo?.asset || paragraphs) && (
          <div className="ref-copy">
            {r.logo?.asset && (
              <span className="ref-logo">
                <SanityImage image={r.logo} alt={r.title} width={320} height={96} fit="max" sizes="180px" noBlur />
              </span>
            )}
            {paragraphs && (
              <div className="ref-text">
                {paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            )}
          </div>
        )}
        {hasProducts && (
          <div className="ref-prods">
            <h3>{page?.productsLabel}</h3>
            <ul>
              {r.products?.map((p) => (
                <li key={p._id}>
                  <Link href={`/urun/${p.slug.current}`}>
                    <span className="ref-prod-ph">{p.cover && <SanityImage image={p.cover} alt="" fill sizes="48px" objectFit="contain" noBlur />}</span>
                    <span className="ref-prod-name">{p.name}</span>
                    <svg viewBox="0 0 16 16" aria-hidden="true">
                      <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </ReferenceGallery>
    </article>
  );
}
