"use client";

import { MotionConfig, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ProductGrid } from "@/components/product/ProductCard";
import type { ProductTab } from "@/types";

const SIZES = "(max-width: 760px) 50vw, (max-width: 1280px) 25vw, 300px";

// The anchor's scroll-margin is the fixed header's height, so CSS stays the one place that knows it.
const hdrOffset = (el: HTMLElement) => parseFloat(getComputedStyle(el).scrollMarginTop);

interface CollectionProps {
  title?: string;
  text?: string;
  linkLabel?: string;
  tabs: ProductTab[];
}

export function Collection({ title, text, linkLabel, tabs }: CollectionProps) {
  const [activeKey, setActiveKey] = useState(tabs[0]?._key);
  const anchorRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);

  // Switching tabs while the bar is stuck starts the new list right under it, not somewhere further down.
  useLayoutEffect(() => {
    const el = anchorRef.current;
    if (el && el.getBoundingClientRect().top < hdrOffset(el)) el.scrollIntoView({ block: "start", behavior: "instant" });
  }, [activeKey]);

  useEffect(() => {
    const el = anchorRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setStuck(e.boundingClientRect.top < hdrOffset(el)), {
      rootMargin: `-${hdrOffset(el)}px 0px 0px`,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="band paper home-products" id="koleksiyon" aria-labelledby="kolH">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <h2 id="kolH">{title}</h2>
            {text && <p>{text}</p>}
          </div>
        </div>
      </div>
      {/* The bar's parent is the section, so it stays under the header only while the section is on screen. */}
      {tabs.length > 1 && (
        <>
          <div ref={anchorRef} className="cat-anchor" aria-hidden="true" />
          <div className={`cat-bar home-bar${stuck ? " stuck" : ""}`}>
            <MotionConfig reducedMotion="user">
              <div className="wrap cat-bar-in">
                <div className="cat-tabs" role="group" aria-labelledby="kolH">
                  {tabs.map((t) => (
                    <button key={t._key} type="button" aria-pressed={t._key === activeKey} onClick={() => setActiveKey(t._key)}>
                      {t.title}
                      {t._key === activeKey && <motion.span className="cat-tab-line" layoutId="home-tab-line" transition={{ type: "spring", stiffness: 420, damping: 38 }} />}
                    </button>
                  ))}
                </div>
              </div>
            </MotionConfig>
          </div>
        </>
      )}
      <div className="wrap">
        {/* Hidden tabs stay in the HTML for crawlers; their lazy images load only once shown. */}
        {tabs.map((t) => (
          <div key={t._key} hidden={t._key !== activeKey}>
            <ProductGrid products={t.products} sizes={SIZES} />
          </div>
        ))}
        {linkLabel && (
          <div className="mt-12 flex justify-center">
            <Link className="btn btn-paper" href="/urunler">
              {linkLabel}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
