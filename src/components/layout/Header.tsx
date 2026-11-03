"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuote } from "@/components/quote/QuoteProvider";
import { ListIcon } from "@/components/quote/icons";
import { HeaderSearch } from "@/components/layout/HeaderSearch";
import type { NavItem, SiteSettings } from "@/types";

interface HeaderProps {
  siteName?: string;
  links?: NavItem[];
  search?: Pick<SiteSettings, "searchLabel" | "searchPlaceholder" | "searchAllLabel" | "searchEmptyText">;
}

export function Header({ siteName, links, search }: HeaderProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const { count, bump, open } = useQuote();

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
          <nav className="nav" aria-label="Ana menü">
            {links?.map((l) => (
              <Link key={l.href} href={isHome && l.href.startsWith("/#") ? l.href.slice(1) : l.href} target={l.openInNewTab ? "_blank" : undefined}>
                {l.label}
              </Link>
            ))}
          </nav>
          <HeaderSearch texts={search} />
          {/* key restarts the bump animation on every add */}
          <button className={`qbtn${bump ? " bump" : ""}`} key={bump} type="button" aria-haspopup="dialog" onClick={open}>
            <ListIcon />
            <span className="qlabel">Teklif listesi</span>
            <span className="n" data-zero={count ? undefined : ""}>
              {count}
            </span>
          </button>
        </div>
      </header>
      {/* Only the home hero sits under the fixed header; every other page starts below it. */}
      {!isHome && <div aria-hidden="true" style={{ height: "calc(var(--hdr) + env(safe-area-inset-top, 0px))" }} />}
    </>
  );
}
