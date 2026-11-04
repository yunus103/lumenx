"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useMemo, useState, type ReactNode } from "react";
import { MediaLightbox, prefetchLightboxImage, type LightboxSlide } from "@/components/ui/Lightbox";
import { SanityImage } from "@/components/ui/SanityImage";
import { urlForImage } from "@/sanity/lib/image";
import { videoEmbed } from "@/lib/video";
import type { ReferenceMedia, SanityImage as SanityImageType } from "@/types";

const MAX_THUMBS = 6;

interface Thumb {
  image?: SanityImageType;
  /** Provider thumbnail of an embed without a poster. */
  src?: string;
  /** An uploaded video without a poster: the tile shows its first frame. */
  videoSrc?: string;
  video: boolean;
}

function toSlides(title: string, cover: SanityImageType, media: ReferenceMedia[] = []) {
  const slides: LightboxSlide[] = [{ kind: "image", image: cover }];
  const thumbs: Thumb[] = [{ image: cover, video: false }];
  for (const m of media) {
    if (m._type === "image") {
      // the cover is often also the first gallery photo
      if (!m.asset || m.asset._id === cover.asset._id) continue;
      slides.push({ kind: "image", image: m, caption: m.caption });
      thumbs.push({ image: m, video: false });
      continue;
    }
    const poster = m.poster?.asset ? m.poster : undefined;
    if (m.fileUrl) {
      slides.push({ kind: "video", src: m.fileUrl, type: m.mimeType, poster: poster && urlForImage(poster)?.width(1600).auto("format").url(), caption: m.caption });
      thumbs.push({ image: poster, videoSrc: poster ? undefined : m.fileUrl, video: true });
    } else if (m.url) {
      const embed = videoEmbed(m.url);
      if (!embed) continue;
      slides.push({ kind: "embed", src: embed.src, title: m.caption || title, caption: m.caption });
      thumbs.push({ image: poster, src: poster ? undefined : embed.thumb, video: true });
    }
  }
  return { slides, thumbs };
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M7 5.5v9l7.5-4.5z" fill="currentColor" />
    </svg>
  );
}

interface ReferenceGalleryProps {
  title: string;
  cover: SanityImageType;
  media?: ReferenceMedia[];
  photoLabel?: string;
  videoLabel?: string;
  priority?: boolean;
  /** Overlaid on the cover's lower edge (the name, place and year). */
  caption: ReactNode;
  /** Between the cover and the thumbnail strip (summary, products). */
  children?: ReactNode;
}

const EASE = [0.2, 0.7, 0.2, 1] as const;

// A full-bleed cover that settles from a slow zoom as it enters, the text under it, then the strip. Every tile
// opens the same viewer.
export function ReferenceGallery({ title, cover, media, photoLabel, videoLabel, priority, caption, children }: ReferenceGalleryProps) {
  const { slides, thumbs } = useMemo(() => toSlides(title, cover, media), [title, cover, media]);
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);
  // The first cover is the LCP image: it must not wait for hydration to become visible.
  const still = useReducedMotion() || priority;

  const videos = thumbs.filter((t) => t.video).length;
  const photos = thumbs.length - videos;
  const rest = thumbs.slice(1, 1 + MAX_THUMBS);
  const hidden = thumbs.length - 1 - rest.length;

  return (
    <>
      <div className="ref-hero">
        <button
          type="button"
          className="ref-open"
          aria-label={`${title} galerisini aç`}
          onClick={() => setOpen(0)}
          onPointerEnter={() => prefetchLightboxImage(cover)}
        >
          <motion.span
            className="ref-hero-img"
            initial={still ? false : { scale: 1.14, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ scale: { duration: 2.4, ease: EASE }, opacity: { duration: 1 } }}
          >
            <SanityImage image={cover} fill sizes="100vw" quality={80} priority={priority} />
          </motion.span>
        </button>
        <div className="wrap ref-cap">
          {caption}
          {thumbs.length > 1 && (
            <p className="ref-count num">
              {photos > 0 && (
                <span>
                  {photos} {photoLabel}
                </span>
              )}
              {videos > 0 && (
                <span>
                  {videos} {videoLabel}
                </span>
              )}
            </p>
          )}
        </div>
      </div>

      <div className="wrap ref-body">
        {children}
        {rest.length > 0 && (
          <ul className="ref-strip">
            {rest.map((t, i) => {
              const more = i === rest.length - 1 && hidden > 0;
              return (
                <li key={i}>
                  <button
                    type="button"
                    aria-label={`${title}, ${t.video ? videoLabel : photoLabel} ${i + 2} / ${thumbs.length}`}
                    onClick={() => setOpen(i + 1)}
                    onPointerEnter={() => t.image && !t.video && prefetchLightboxImage(t.image)}
                  >
                    {t.image ? (
                      <SanityImage image={t.image} fill sizes="(max-width: 760px) 33vw, 200px" noBlur />
                    ) : t.videoSrc ? (
                      // #t nudges iOS Safari, which otherwise paints no frame until play
                      <video src={`${t.videoSrc}#t=0.1`} preload="metadata" muted playsInline aria-hidden="true" tabIndex={-1} />
                    ) : (
                      // a YouTube thumbnail (not a Sanity asset), already sized by YouTube
                      // eslint-disable-next-line @next/next/no-img-element
                      t.src && <img src={t.src} alt="" loading="lazy" decoding="async" />
                    )}
                    {t.video && (
                      <span className="ref-play">
                        <PlayIcon />
                      </span>
                    )}
                    {more && <span className="ref-more num">+{hidden}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <MediaLightbox slides={slides} index={open} onIndexChange={setOpen} onClose={close} label={title} />
    </>
  );
}
