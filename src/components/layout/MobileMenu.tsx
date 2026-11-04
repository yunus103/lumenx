"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronIcon, navHref, subLinksOf } from "@/components/layout/HeaderNav";
import { waLink } from "@/lib/catalog";
import type { ContactInfo, NavItem } from "@/types";

const EASE = [0.2, 0.7, 0.2, 1] as const;

export type MenuContact = Pick<ContactInfo, "phone" | "whatsappNumber" | "email">;

interface MobileMenuProps {
  links?: NavItem[];
  contact?: MenuContact;
  isHome: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Under 900px the nav moves into a full-height panel under the header. The header row (logo, search, quote
// list, this button) stays usable; the page behind is locked and inert, focus cycles between button and panel.
export function MobileMenu({ links, contact, isHome, open, onOpenChange }: MobileMenuProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState<number | null>(null);

  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setExpanded(null);
  }

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const outside = [...document.querySelectorAll<HTMLElement>("[data-inert-when-modal]")].filter((el) => !el.contains(panel));
    document.body.style.overflow = "hidden";
    outside.forEach((el) => (el.inert = true));
    panel?.querySelector<HTMLElement>("a, button")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
        btnRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || !panel || !btnRef.current) return;
      const f = [btnRef.current, ...panel.querySelectorAll<HTMLElement>("a[href], button")];
      const i = f.indexOf(document.activeElement as HTMLElement);
      if (i === -1) return;
      const next = e.shiftKey ? (i === 0 ? f.length - 1 : i - 1) : i === f.length - 1 ? 0 : i + 1;
      // only wrap at the ends; in between the browser's own order is the same
      if ((e.shiftKey && i === 0) || (!e.shiftKey && i === f.length - 1)) {
        e.preventDefault();
        f[next].focus();
      }
    };
    // growing past the breakpoint hides the panel through CSS; close it so the page unlocks too
    const mq = matchMedia("(min-width: 901px)");
    const onMq = () => mq.matches && onOpenChange(false);
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      document.body.style.overflow = "";
      outside.forEach((el) => (el.inert = false));
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [open, onOpenChange]);

  if (!links?.length) return null;
  const close = () => onOpenChange(false);
  const tel = contact?.phone?.replace(/[^\d+]/g, "");
  const hasContact = contact?.phone || contact?.whatsappNumber || contact?.email;

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className="mnav-btn"
        aria-expanded={open}
        aria-controls="mnav"
        aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
        onClick={() => onOpenChange(!open)}
      >
        <span aria-hidden="true" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            id="mnav"
            className="mnav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <nav className="wrap" aria-label="Ana menü">
              <motion.ul
                className="mnav-list"
                initial="hidden"
                animate="shown"
                variants={{ shown: { transition: { staggerChildren: 0.045, delayChildren: 0.06 } } }}
              >
                {links.map((l, i) => {
                  const subs = subLinksOf(l);
                  const isOpen = expanded === i;
                  return (
                    <motion.li
                      key={`${l.href}-${i}`}
                      variants={{ hidden: { opacity: 0, y: 14 }, shown: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } } }}
                    >
                      <div className="mnav-row">
                        <Link
                          href={navHref(l.href, isHome)}
                          target={l.openInNewTab ? "_blank" : undefined}
                          rel={l.openInNewTab ? "noopener" : undefined}
                          onClick={close}
                        >
                          {l.label}
                        </Link>
                        {subs.length > 0 && (
                          <button
                            type="button"
                            className="mnav-toggle"
                            aria-expanded={isOpen}
                            aria-controls={`mnav-sub-${i}`}
                            aria-label={`${l.label} alt menüsü`}
                            onClick={() => setExpanded(isOpen ? null : i)}
                          >
                            <ChevronIcon />
                          </button>
                        )}
                      </div>
                      <AnimatePresence initial={false}>
                        {subs.length > 0 && isOpen && (
                          <motion.ul
                            id={`mnav-sub-${i}`}
                            className="mnav-sub"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: EASE }}
                          >
                            {subs.map((s, j) => (
                              <li key={`${s.href}-${j}`}>
                                <Link
                                  href={navHref(s.href, isHome)}
                                  target={s.openInNewTab ? "_blank" : undefined}
                                  rel={s.openInNewTab ? "noopener" : undefined}
                                  onClick={close}
                                >
                                  {s.label}
                                  {s.description && <small>{s.description}</small>}
                                </Link>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </motion.li>
                  );
                })}
              </motion.ul>
            </nav>
            {/* labels match the footer's */}
            {hasContact && (
              <motion.dl
                className="wrap mnav-contact"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.25, ease: EASE }}
              >
                {contact?.phone && (
                  <div>
                    <dt>Telefon</dt>
                    <dd>
                      <a className="num" href={`tel:${tel}`}>
                        {contact.phone}
                      </a>
                    </dd>
                  </div>
                )}
                {contact?.whatsappNumber && (
                  <div>
                    <dt>WhatsApp</dt>
                    <dd>
                      <a className="num" href={waLink(contact.whatsappNumber, "")} target="_blank" rel="noopener">
                        {contact.phone ?? contact.whatsappNumber}
                      </a>
                    </dd>
                  </div>
                )}
                {contact?.email && (
                  <div>
                    <dt>E-posta</dt>
                    <dd>
                      <a href={`mailto:${contact.email}`}>{contact.email}</a>
                    </dd>
                  </div>
                )}
              </motion.dl>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
