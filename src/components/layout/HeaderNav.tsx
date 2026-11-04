"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { SanityImage } from "@/components/ui/SanityImage";
import type { NavItem, NavSubLink } from "@/types";

const OPEN_DELAY = 110;
const CLOSE_DELAY = 180;
// A hover opens the panel a moment before the click lands; that click must not close it again.
const CLICK_GRACE = 450;

/** On the home page "/#isik" becomes "#isik", so the browser scrolls instead of reloading. */
export const navHref = (href: string, isHome: boolean) => (isHome && href.startsWith("/#") ? href.slice(1) : href);

export const subLinksOf = (item: NavItem) => item.subLinks?.filter((s): s is NavSubLink & { href: string } => !!s.href) ?? [];

const pathOf = (href: string) => href.split(/[?#]/)[0].replace(/\/$/, "");

/** The link the current page belongs to: the longest internal href (own or a sub link's) that prefixes the path. */
function activeIndex(links: NavItem[] | undefined, pathname: string) {
  // product pages live at /urun/[slug] but belong to the catalogue
  const path = pathname.startsWith("/urun/") ? "/urunler" : pathname;
  let best = -1;
  let bestLen = 0;
  links?.forEach((l, i) => {
    for (const href of [l.href, ...subLinksOf(l).map((s) => s.href)]) {
      if (!href.startsWith("/") || href.startsWith("/#")) continue;
      const p = pathOf(href);
      if (p && p.length > bestLen && (path === p || path.startsWith(`${p}/`))) {
        best = i;
        bestLen = p.length;
      }
    }
  });
  return best;
}

const LINE_SPRING = { type: "spring", stiffness: 420, damping: 38 } as const;

export function ChevronIcon() {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true">
      <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

interface HeaderNavProps {
  links?: NavItem[];
  isHome: boolean;
  /** Index of the link whose mega menu is open. */
  open: number | null;
  onOpenChange: (index: number | null) => void;
}

// Desktop nav. Links with sub links open a full-width panel under the header: on hover (with a short intent
// delay, mouse only), on click, or from the keyboard (Enter/Space, ArrowDown moves into the panel).
export function HeaderNav({ links, isHome, open, onOpenChange }: HeaderNavProps) {
  const active = activeIndex(links, usePathname());
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const hoverOpenedAt = useRef(0);
  const focusFirst = useRef(false);
  const openRef = useRef(open);
  useEffect(() => {
    openRef.current = open;
  }, [open]);

  const schedule = (next: number | null, delay: number) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      if (next !== null && openRef.current !== next) hoverOpenedAt.current = Date.now();
      onOpenChange(next);
    }, delay);
  };
  useEffect(() => () => clearTimeout(timer.current), []);

  useEffect(() => {
    if (open === null) return;
    if (focusFirst.current) {
      focusFirst.current = false;
      panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      onOpenChange(null);
      triggers.current[open]?.focus();
    };
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) onOpenChange(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open, onOpenChange]);

  const item = open !== null ? links?.[open] : undefined;
  const subs = item ? subLinksOf(item) : [];
  const withMedia = subs.some((s) => s.image?.asset);

  const onEnter = (i: number) => (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    schedule(i, open === null ? OPEN_DELAY : 0);
  };
  const onLeave = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    if (open === null) clearTimeout(timer.current);
    else schedule(null, CLOSE_DELAY);
  };

  return (
    // display: contents, so the nav stays a flex item of the header row while focus and pointer checks
    // treat nav and panel as one region
    <div
      ref={rootRef}
      className="nav-root"
      // only when focus moves somewhere else; a click on the panel's background blurs to nothing and is not a leave
      onBlur={(e) => {
        if (open !== null && e.relatedTarget && !e.currentTarget.contains(e.relatedTarget)) onOpenChange(null);
      }}
    >
      <nav className="nav" aria-label="Ana menü">
        {links?.map((l, i) =>
          subLinksOf(l).length ? (
            <div className="nav-item" key={`${l.href}-${i}`} onPointerEnter={onEnter(i)} onPointerLeave={onLeave}>
              <button
                ref={(el) => {
                  triggers.current[i] = el;
                }}
                type="button"
                className="nav-trigger"
                aria-expanded={open === i}
                aria-controls={open === i ? "hdr-mega" : undefined}
                onClick={() => {
                  clearTimeout(timer.current);
                  if (open === i && Date.now() - hoverOpenedAt.current < CLICK_GRACE) return;
                  onOpenChange(open === i ? null : i);
                }}
                onKeyDown={(e) => {
                  if (e.key !== "ArrowDown") return;
                  e.preventDefault();
                  focusFirst.current = true;
                  if (open === i) panelRef.current?.querySelector<HTMLElement>("a")?.focus();
                  else onOpenChange(i);
                }}
              >
                {l.label}
                <ChevronIcon />
                {active === i && <motion.span className="nav-line" layoutId="nav-line" transition={LINE_SPRING} />}
              </button>
            </div>
          ) : (
            <Link
              key={`${l.href}-${i}`}
              href={navHref(l.href, isHome)}
              target={l.openInNewTab ? "_blank" : undefined}
              rel={l.openInNewTab ? "noopener" : undefined}
              aria-current={active === i ? "page" : undefined}
              onPointerEnter={(e) => e.pointerType === "mouse" && open !== null && schedule(null, CLOSE_DELAY)}
            >
              {l.label}
              {active === i && <motion.span className="nav-line" layoutId="nav-line" transition={LINE_SPRING} />}
            </Link>
          )
        )}
      </nav>

      <AnimatePresence>
        {item && (
          <motion.div
            key="mega"
            ref={panelRef}
            id="hdr-mega"
            className="mega"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4, transition: { duration: 0.18 } }}
            transition={{ duration: 0.32, ease: [0.2, 0.7, 0.2, 1] }}
            onPointerEnter={(e) => e.pointerType === "mouse" && clearTimeout(timer.current)}
            onPointerLeave={onLeave}
          >
            {/* keyed, so switching between two menus replays the entrance instead of swapping in place */}
            <div className="wrap mega-in" key={open}>
              <div className="mega-lead">
                <Link className="mega-title" href={navHref(item.href, isHome)} onClick={() => onOpenChange(null)}>
                  {item.label}
                  <ArrowIcon />
                </Link>
                {item.description && <p>{item.description}</p>}
              </div>
              <ul className={`mega-list${withMedia ? " with-media" : ""}`}>
                {subs.map((s, j) => (
                  <li key={`${s.href}-${j}`} style={{ "--i": j } as React.CSSProperties}>
                    <Link
                      className="mega-link"
                      href={navHref(s.href, isHome)}
                      target={s.openInNewTab ? "_blank" : undefined}
                      rel={s.openInNewTab ? "noopener" : undefined}
                      onClick={() => onOpenChange(null)}
                    >
                      {withMedia && (
                        <span className="mega-ph">{s.image?.asset && <SanityImage image={s.image} alt="" fill sizes="(max-width: 1280px) 22vw, 280px" noBlur />}</span>
                      )}
                      <span className="mega-label">
                        {s.label}
                        <ArrowIcon />
                      </span>
                      {s.description && <small>{s.description}</small>}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {item && <div className="mega-scrim" aria-hidden="true" />}
    </div>
  );
}
