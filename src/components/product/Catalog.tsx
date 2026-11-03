"use client";

import { motion } from "framer-motion";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ProductGrid } from "@/components/product/ProductCard";
import { CloseIcon, SearchIcon } from "@/components/quote/icons";
import { haystack, matches, queryWords } from "@/lib/search";
import type { CategoryListItem, ProductCardData, ProductsPage } from "@/types";

const BASE = "/urunler";
const PAGE_SIZE = 24;

interface CatalogProps {
  page: ProductsPage | null;
  categories: CategoryListItem[];
  products: ProductCardData[];
}

// The anchor's scroll-margin is the fixed header's height, so CSS stays the one place that knows it.
const hdrOffset = (el: HTMLElement) => parseFloat(getComputedStyle(el).scrollMarginTop);

// Tabs list the leaf categories (those nobody uses as a parent); parents get their own page and,
// later, a mega menu.
function leafCategories(categories: CategoryListItem[]) {
  const parents = new Set(categories.map((c) => c.parent?._id).filter(Boolean));
  return categories.filter((c) => c.count > 0 && !parents.has(c._id));
}

// useSearchParams needs a Suspense boundary on a static page; isolating it here keeps the grid server-rendered.
function QueryFromUrl({ onChange }: { onChange: (q: string) => void }) {
  const q = useSearchParams().get("q") ?? "";
  useEffect(() => onChange(q), [q, onChange]);
  return null;
}

// Every product ships with the page (≈15 KB gzip for 104), so category and search changes never hit the
// server: the URL is updated with the History API, which Next keeps in sync with usePathname/useSearchParams.
export function Catalog({ page, categories, products }: CatalogProps) {
  const pathname = usePathname();
  const activeSlug = pathname.startsWith(`${BASE}/`) ? decodeURIComponent(pathname.slice(BASE.length + 1)) : undefined;
  const active = categories.find((c) => c.slug.current === activeSlug);

  const [query, setQuery] = useState("");
  const written = useRef("");
  const syncFromUrl = useCallback((q: string) => {
    if (q === written.current) return;
    written.current = q;
    setQuery(q);
  }, []);

  // Debounced so typing doesn't flood the history; `written` keeps our own write from echoing back into the input.
  useEffect(() => {
    if (query === written.current) return;
    const t = setTimeout(() => {
      written.current = query;
      const params = new URLSearchParams(location.search);
      if (query) params.set("q", query);
      else params.delete("q");
      const search = params.toString();
      history.replaceState(null, "", search ? `${location.pathname}?${search}` : location.pathname);
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const indexed = useMemo(() => products.map((p) => ({ p, text: haystack(p.name, p.category?.title, p.summary) })), [products]);
  const words = queryWords(query);
  const searched = words.length ? indexed.filter((x) => matches(x.text, words)).map((x) => x.p) : products;

  const parentOf = useMemo(() => new Map(categories.map((c) => [c._id, c.parent?._id])), [categories]);
  const inActive = (p: ProductCardData) => !active || p.category._id === active._id || parentOf.get(p.category._id) === active._id;
  const shown = searched.filter(inActive);
  const countFor = (id: string) => searched.filter((p) => p.category._id === id).length;

  const filterKey = `${activeSlug ?? ""}|${query}`;
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [prevKey, setPrevKey] = useState(filterKey);
  if (filterKey !== prevKey) {
    setPrevKey(filterKey);
    setLimit(PAGE_SIZE);
  }
  const hasMore = shown.length > limit;

  // The button stays as the visible fallback; reaching it loads the next batch on its own.
  const moreRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const el = moreRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setLimit((n) => n + PAGE_SIZE), { rootMargin: "0px 0px 400px" });
    io.observe(el);
    return () => io.disconnect();
  }, [limit, filterKey, hasMore]);

  // While the bar is stuck, a shorter result list would leave the reader in the footer: pin the results' start
  // under the bar instead. Above that point the scroll position is left alone.
  const anchorRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = anchorRef.current;
    if (el && el.getBoundingClientRect().top < hdrOffset(el)) el.scrollIntoView({ block: "start", behavior: "instant" });
  }, [filterKey]);

  // The bar only gets its backdrop and shadow once it is stuck under the header.
  const [stuck, setStuck] = useState(false);
  useEffect(() => {
    const el = anchorRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setStuck(e.boundingClientRect.top < hdrOffset(el)), {
      rootMargin: `-${hdrOffset(el)}px 0px 0px`,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const tabs = [
    { id: "all", href: BASE, title: page?.allLabel, n: searched.length, current: !activeSlug },
    ...leafCategories(categories).map((c) => ({
      id: c._id,
      href: `${BASE}/${c.slug.current}`,
      title: c.title,
      n: countFor(c._id),
      current: c.slug.current === activeSlug,
    })),
  ];

  const heading = active?.title ?? page?.pageTitle ?? "";
  const intro = active ? active.description : page?.pageSubtitle;

  // Keeps the site-name suffix buildMetadata put on the server-rendered title.
  const suffix = useRef<string | null>(null);
  useEffect(() => {
    if (suffix.current === null) {
      const i = document.title.lastIndexOf(" | ");
      suffix.current = i >= 0 ? document.title.slice(i) : "";
      return;
    }
    document.title = `${heading}${suffix.current}`;
  }, [heading]);

  const onChip = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (e.currentTarget.pathname === location.pathname) return;
    history.pushState(null, "", `${e.currentTarget.pathname}${location.search}`);
  };

  return (
    <section className="band paper catalog" aria-labelledby="catH">
      <Suspense fallback={null}>
        <QueryFromUrl onChange={syncFromUrl} />
      </Suspense>
      {/* keyed so a category change replays the entrance instead of swapping text in place */}
      <div className="wrap cat-head" key={activeSlug ?? ""}>
        <h1 id="catH">{heading}</h1>
        {intro && <p>{intro}</p>}
      </div>
      <div className="cat-anchor" ref={anchorRef} />
      <div className={`cat-bar${stuck ? " stuck" : ""}`}>
        <div className="wrap cat-bar-in">
          <nav className="cat-tabs" aria-label="Kategoriler">
            {tabs.map((t) => (
              <a key={t.id} href={t.href} onClick={onChip} aria-current={t.current ? "page" : undefined} data-empty={t.n ? undefined : ""}>
                {t.title}
                <sup>{t.n}</sup>
                {t.current && <motion.span className="cat-tab-line" layoutId="cat-tab-line" transition={{ type: "spring", stiffness: 420, damping: 38 }} />}
              </a>
            ))}
          </nav>
          <label className={`cat-search${query ? " filled" : ""}`}>
            <SearchIcon />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={page?.searchPlaceholder}
              aria-label={page?.searchPlaceholder}
              enterKeyHint="search"
              autoComplete="off"
            />
            {query && (
              <button type="button" aria-label={page?.clearLabel} onClick={() => setQuery("")}>
                <CloseIcon />
              </button>
            )}
          </label>
        </div>
      </div>
      <div className="wrap">
        <p className="cat-count" aria-live="polite">
          {shown.length} {page?.countLabel}
        </p>
        {shown.length ? (
          <ProductGrid key={activeSlug ?? ""} products={shown.slice(0, limit)} />
        ) : (
          <div className="cat-empty">
            <p>{page?.emptyText}</p>
            {query && (
              <button className="btn btn-paper" type="button" onClick={() => setQuery("")}>
                {page?.clearLabel}
              </button>
            )}
          </div>
        )}
        {hasMore && (
          <div className="cat-more">
            <button ref={moreRef} className="btn btn-paper" type="button" onClick={() => setLimit((n) => n + PAGE_SIZE)}>
              {page?.loadMoreLabel}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
