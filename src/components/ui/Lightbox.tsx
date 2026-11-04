"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SanityImage } from "@/components/ui/SanityImage";
import { Expand, X, ChevronLeft, ChevronRight } from "lucide-react";
import { urlForImage } from "@/sanity/lib/image";
import { SanityImage as SanityImageType } from "@/types";

/**
 * Thumbnail'e hover edildiğinde tam boyutlu lightbox görselini önceden yükler.
 * Tarayıcı cache'e aldığı için tıklandığında anında açılır.
 */
export function prefetchLightboxImage(image: SanityImageType) {
  if (typeof window === "undefined" || !image?.asset) return;
  try {
    const url = urlForImage(image)
      ?.auto("format")
      .width(1920)
      .fit("max") // Upscale'i önle
      .quality(90)
      .url();
    if (!url) return;
    if (document.querySelector(`link[href="${url}"]`)) return;
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.as = "image";
    link.href = url;
    document.head.appendChild(link);
  } catch {
    // prefetch başarısız olursa sessizce geç
  }
}

export type LightboxSlide =
  | { kind: "image"; image: SanityImageType; caption?: string }
  /** An uploaded file; `poster` is a ready URL. */
  | { kind: "video"; src: string; type?: string; poster?: string; caption?: string }
  /** A YouTube / Vimeo player URL. */
  | { kind: "embed"; src: string; title: string; caption?: string };

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.9,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    scale: 0.9,
  }),
};

interface MediaLightboxProps {
  slides: LightboxSlide[];
  /** Index of the open slide; null keeps the lightbox closed. */
  index: number | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
  label?: string;
}

function Slide({ slide }: { slide: LightboxSlide }) {
  if (slide.kind === "image") {
    return (
      <SanityImage
        image={slide.image}
        fill
        fit="max"
        quality={90}
        sizes="(max-width: 1920px) 100vw, 1920px"
        className="pointer-events-none select-none"
        objectFit="contain"
      />
    );
  }
  // Only the open slide is mounted, so a video loads when it is shown and stops when the viewer moves on.
  // Never autoplay: the visitor starts it, and with it the sound.
  if (slide.kind === "video") {
    return (
      <video className="max-h-full max-w-full rounded-sm bg-black" controls playsInline preload="metadata" poster={slide.poster}>
        <source src={slide.src} type={slide.type} />
      </video>
    );
  }
  return (
    <div className="aspect-video w-full max-w-[calc(85vh*16/9)] overflow-hidden rounded-sm bg-black">
      <iframe
        src={slide.src}
        title={slide.title}
        className="h-full w-full border-0"
        allow="fullscreen; picture-in-picture; encrypted-media"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}

/** The fullscreen viewer for photos and videos, for galleries that render their own thumbnails. */
export function MediaLightbox({ slides, index, onIndexChange, onClose, label = "Galeri" }: MediaLightboxProps) {
  const [direction, setDirection] = useState(0);
  const closeRef = useRef<HTMLButtonElement>(null);
  const isOpen = index !== null;
  const slide = index !== null ? slides[index] : undefined;

  const paginate = useCallback(
    (newDirection: number) => {
      if (index === null) return;
      setDirection(newDirection);
      onIndexChange((index + newDirection + slides.length) % slides.length);
    },
    [index, slides.length, onIndexChange]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (index === null) return;
      if (e.key === "Escape") onClose();
      // a focused video uses the arrows to seek
      if ((e.target as HTMLElement | null)?.tagName === "VIDEO") return;
      if (e.key === "ArrowLeft") paginate(-1);
      if (e.key === "ArrowRight") paginate(1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [index, paginate, onClose]);

  // Lock the page while open and hand focus back to the opener on close.
  useEffect(() => {
    if (!isOpen) return;
    const opener = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
      opener?.focus();
    };
  }, [isOpen]);

  const arrow = (dir: -1 | 1, className: string, size: number) => (
    <button
      aria-label={dir < 0 ? "Önceki" : "Sonraki"}
      className={className}
      onClick={(e) => {
        e.stopPropagation();
        paginate(dir);
      }}
    >
      {dir < 0 ? (
        <ChevronLeft size={size} className="transform group-hover:-translate-x-2 transition-transform" />
      ) : (
        <ChevronRight size={size} className="transform group-hover:translate-x-2 transition-transform" />
      )}
    </button>
  );

  return (
    <AnimatePresence initial={false} custom={direction}>
      {index !== null && slide && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={label}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 px-4 md:px-12 backdrop-blur-sm touch-none"
          onClick={onClose}
        >
          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 p-6 md:p-10 flex justify-between items-center z-10">
            <div className="flex items-center gap-4">
              <div className="text-white font-display text-sm tracking-[0.2em] uppercase opacity-70 tabular-nums">
                {index + 1} <span className="mx-2 text-white/30">/</span> {slides.length}
              </div>
              {/* phones: swiping is off on videos (it would fight the player), so the arrows live up here */}
              {slides.length > 1 && (
                <div className="flex md:hidden">
                  {arrow(-1, "w-10 h-10 flex items-center justify-center text-white/60 hover:text-white", 22)}
                  {arrow(1, "w-10 h-10 flex items-center justify-center text-white/60 hover:text-white", 22)}
                </div>
              )}
            </div>
            <button
              ref={closeRef}
              aria-label="Kapat"
              className="w-12 h-12 flex items-center justify-center text-white/50 hover:text-white transition-colors cursor-pointer group"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
            >
              <X size={36} className="transform group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>

          {/* Navigation Arrows */}
          {slides.length > 1 && (
            <>
              {arrow(-1, "hidden md:flex absolute left-4 md:left-10 top-1/2 -translate-y-1/2 w-16 h-16 items-center justify-center text-white/40 hover:text-white transition-all cursor-pointer z-20 group", 56)}
              {arrow(1, "hidden md:flex absolute right-4 md:right-10 top-1/2 -translate-y-1/2 w-16 h-16 items-center justify-center text-white/40 hover:text-white transition-all cursor-pointer z-20 group", 56)}
            </>
          )}

          {/* Main Media Container */}
          <div className="relative w-full h-[70vh] md:h-[85vh] flex items-center justify-center overflow-hidden">
            <motion.div
              key={index}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.3 },
              }}
              drag={slide.kind === "image" ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                if (offset.x > 100 || (offset.x > 20 && velocity.x > 500)) {
                  paginate(-1);
                } else if (offset.x < -100 || (offset.x < -20 && velocity.x < -500)) {
                  paginate(1);
                }
              }}
              className={`absolute w-full h-full flex items-center justify-center ${slide.kind === "image" ? "cursor-grab active:cursor-grabbing" : ""}`}
              onClick={(e) => e.stopPropagation()}
            >
              <Slide slide={slide} />
            </motion.div>
          </div>

          {slide.caption && (
            <p className="absolute bottom-6 md:bottom-10 left-0 right-0 px-6 text-center text-sm text-white/70" onClick={(e) => e.stopPropagation()}>
              {slide.caption}
            </p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface LightboxProps {
  images: SanityImageType[];
  /** Index of the open image; null keeps the lightbox closed. */
  index: number | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

/** Photos only: the product gallery's viewer. */
export function Lightbox({ images, ...props }: LightboxProps) {
  const slides = useMemo(() => images.map((image): LightboxSlide => ({ kind: "image", image })), [images]);
  return <MediaLightbox slides={slides} {...props} />;
}

interface LightboxGalleryProps {
  images: SanityImageType[];
}

export function LightboxGallery({ images }: LightboxGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const close = useCallback(() => setSelectedImage(null), []);

  if (!images || images.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-16">
        {images.map((image, i) => (
          <div
            key={i}
            className="group relative cursor-pointer overflow-hidden rounded-sm aspect-[4/3] bg-backgroundLight"
            onClick={() => setSelectedImage(i)}
            onMouseEnter={() => prefetchLightboxImage(image)}
          >
            <SanityImage
              image={image}
              width={800}
              height={600}
              sizes="(max-width: 768px) 50vw, 33vw"
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            {/* Hover overlay with icon */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500">
                <Expand size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <Lightbox images={images} index={selectedImage} onIndexChange={setSelectedImage} onClose={close} />
    </>
  );
}
