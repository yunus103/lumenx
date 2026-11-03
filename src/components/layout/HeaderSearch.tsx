"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { SanityImage } from "@/components/ui/SanityImage";
import { CloseIcon, SearchIcon } from "@/components/quote/icons";
import { fold, haystack, matches, queryWords } from "@/lib/search";
import type { SearchItem, SiteSettings } from "@/types";

const MAX_RESULTS = 6;

type SearchTexts = Pick<SiteSettings, "searchLabel" | "searchPlaceholder" | "searchAllLabel" | "searchEmptyText">;

// One request per visit, started on hover so the index is usually there before the panel opens.
let indexPromise: Promise<SearchItem[]> | undefined;
function loadIndex() {
  indexPromise ??= fetch("/api/search-index")
    .then((r) => r.json() as Promise<SearchItem[]>)
    .catch(() => {
      indexPromise = undefined;
      return [];
    });
  return indexPromise;
}

const catalogHref = (q: string) => `/urunler?q=${encodeURIComponent(q.trim())}`;

// The open panel turns the header solid through CSS (`.hdr:has(.hsearch-panel)`), so no state leaves here.
export function HeaderSearch({ texts }: { texts?: SearchTexts }) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<SearchItem[] | null>(null);
  const [active, setActive] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  const toggle = (next: boolean) => {
    setOpen(next);
    if (next) loadIndex().then(setItems);
  };

  const [prevPath, setPrevPath] = useState(pathname);
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  const indexed = useMemo(
    () => items?.map((it) => ({ it, text: haystack(it.name, it.category, it.summary), name: fold(it.name) })) ?? [],
    [items]
  );
  const words = queryWords(query);
  // Name hits first; filter keeps index order (category, then name) within each group.
  const results = words.length
    ? indexed
        .filter((x) => matches(x.text, words))
        .sort((a, b) => Number(matches(b.name, words)) - Number(matches(a.name, words)))
        .map((x) => x.it)
    : [];
  const top = results.slice(0, MAX_RESULTS);

  const close = () => {
    setOpen(false);
    btnRef.current?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") close();
    else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!top.length) return;
      // -1 is the input itself, so the cycle runs input → results → input.
      const step = e.key === "ArrowDown" ? 1 : -1;
      setActive((i) => {
        const next = i + step;
        return next < -1 ? top.length - 1 : next >= top.length ? -1 : next;
      });
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pick = top[active];
    if (pick) router.push(`/urun/${pick.slug}`);
    else if (query.trim()) router.push(catalogHref(query));
  };

  return (
    <div className="hsearch" ref={rootRef} onPointerEnter={() => loadIndex()}>
      <button
        ref={btnRef}
        className="hsearch-btn"
        type="button"
        aria-label={texts?.searchLabel}
        aria-expanded={open}
        onClick={() => toggle(!open)}
      >
        <SearchIcon />
      </button>
      {open && (
        <div className="hsearch-panel">
          <form className="wrap hsearch-in" role="search" onSubmit={onSubmit}>
            <div className="hsearch-field">
              <SearchIcon />
              <input
                ref={inputRef}
                type="search"
                role="combobox"
                aria-label={texts?.searchLabel}
                aria-expanded={top.length > 0}
                aria-controls={listId}
                aria-autocomplete="list"
                aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
                placeholder={texts?.searchPlaceholder}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(-1);
                }}
                onKeyDown={onKeyDown}
                enterKeyHint="search"
                autoComplete="off"
              />
              <button type="button" aria-label="Aramayı kapat" onClick={close}>
                <CloseIcon />
              </button>
            </div>
            {words.length > 0 && items && (
              <div className="hsearch-results">
                {top.length ? (
                  <ul id={listId} role="listbox" className="hsearch-list">
                    {top.map((it, i) => (
                      <li key={it._id} id={`${listId}-${i}`} role="option" aria-selected={i === active}>
                        <Link href={`/urun/${it.slug}`} tabIndex={-1} onPointerEnter={() => setActive(i)}>
                          <span className="hsearch-thumb">
                            {it.cover && <SanityImage image={it.cover} alt="" fill sizes="56px" objectFit="contain" />}
                          </span>
                          <span className="hsearch-text">
                            <b>{it.name}</b>
                            {it.category && <small>{it.category}</small>}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="hsearch-empty">{texts?.searchEmptyText}</p>
                )}
                {results.length > 0 && (
                  <Link className="hsearch-all" href={catalogHref(query)}>
                    {texts?.searchAllLabel} ({results.length})
                  </Link>
                )}
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
