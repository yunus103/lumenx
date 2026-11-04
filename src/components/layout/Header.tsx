"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useQuote } from "@/components/quote/QuoteProvider";
import { ListIcon } from "@/components/quote/icons";
import { HeaderSearch } from "@/components/layout/HeaderSearch";
import { HeaderNav } from "@/components/layout/HeaderNav";
import { MobileMenu, type MenuContact } from "@/components/layout/MobileMenu";
import type { NavItem, SiteSettings } from "@/types";

interface HeaderProps {
  siteName?: string;
  links?: NavItem[];
  search?: Pick<SiteSettings, "searchLabel" | "searchPlaceholder" | "searchAllLabel" | "searchEmptyText">;
  contact?: MenuContact;
}

/** At most one header panel is open: the search, the mobile menu or one mega menu (by link index). */
type Panel = "search" | "mobile" | number | null;

export function Header({ siteName, links, search, contact }: HeaderProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [panel, setPanel] = useState<Panel>(null);
  const { count, bump, open } = useQuote();

  const [prevPath, setPrevPath] = useState(pathname);
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    setPanel(null);
  }

  // Each panel may only close itself, so a late close from one never shuts the one that just opened.
  const setSearch = useCallback((o: boolean) => setPanel((p) => (o ? "search" : p === "search" ? null : p)), []);
  const setMobile = useCallback((o: boolean) => setPanel((p) => (o ? "mobile" : p === "mobile" ? null : p)), []);
  const setMega = useCallback((i: number | null) => setPanel((p) => (i !== null ? i : typeof p === "number" ? null : p)), []);

  useEffect(() => {
    const onScroll = () => setScrolled(scrollY > 40);
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <a className="skip" href="#main">
        İçeriğe geç
      </a>
      <header className={`hdr${scrolled || !isHome ? " solid" : ""}`} data-inert-when-modal>
        <div className="wrap hdr-in">
          <Link className="logo" href="/" aria-label={`${siteName ?? "LUMENX"} ana sayfa`}>
            <Image src="/brand/lumenx-light.svg" alt={siteName ?? "LUMENX"} width={158} height={50} priority unoptimized />
          </Link>
          <HeaderNav links={links} isHome={isHome} open={typeof panel === "number" ? panel : null} onOpenChange={setMega} />
          <div className="hdr-tools">
            <HeaderSearch texts={search} open={panel === "search"} onOpenChange={setSearch} />
            {/* key restarts the bump animation on every add */}
            <button
              className={`qbtn${bump ? " bump" : ""}`}
              key={bump}
              type="button"
              aria-haspopup="dialog"
              onClick={() => {
                setPanel(null);
                open();
              }}
            >
              <ListIcon />
              <span className="qlabel">Teklif listesi</span>
              <span className="n" data-zero={count ? undefined : ""}>
                {count}
              </span>
            </button>
            <MobileMenu links={links} contact={contact} isHome={isHome} open={panel === "mobile"} onOpenChange={setMobile} />
          </div>
        </div>
      </header>
      {/* Only the home hero sits under the fixed header; every other page starts below it. */}
      {!isHome && <div aria-hidden="true" style={{ height: "calc(var(--hdr) + env(safe-area-inset-top, 0px))" }} />}
    </>
  );
}
