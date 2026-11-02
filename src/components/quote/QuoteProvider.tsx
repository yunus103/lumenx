"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { SanityImage } from "@/components/ui/SanityImage";
import { waLink } from "@/lib/catalog";
import type { SanityImage as SanityImageType } from "@/types";
import { CloseIcon, WaIcon } from "./icons";

// The demo's quote list: kept in localStorage, sent as one prefilled WhatsApp message. Items store their own
// description so a renamed or removed product never breaks a saved list.
export interface QuoteItem {
  slug: string;
  name: string;
  detail: string;
  qty: number;
  image?: SanityImageType;
}

interface QuoteContextValue {
  count: number;
  bump: number;
  add: (item: QuoteItem) => void;
  open: () => void;
  whatsappNumber?: string;
}

const QuoteContext = createContext<QuoteContextValue | null>(null);

export function useQuote() {
  const ctx = useContext(QuoteContext);
  if (!ctx) throw new Error("useQuote must be used inside QuoteProvider");
  return ctx;
}

const STORAGE_KEY = "lumenx-quote";
const sameLine = (a: QuoteItem, b: QuoteItem) => a.slug === b.slug && a.detail === b.detail;

function isQuoteItem(x: unknown): x is QuoteItem {
  const it = x as QuoteItem;
  return !!it && typeof it.slug === "string" && typeof it.name === "string" && typeof it.detail === "string" && Number.isInteger(it.qty) && it.qty > 0;
}

function readStore(): QuoteItem[] {
  try {
    const v: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(v) ? v.filter(isQuoteItem) : [];
  } catch {
    return [];
  }
}

const emptyForm = { name: "", company: "", phone: "", city: "", note: "" };

export function QuoteProvider({ children, whatsappNumber }: { children: React.ReactNode; whatsappNumber?: string }) {
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [bump, setBump] = useState(0);
  const [form, setForm] = useState(emptyForm);
  const [copyLabel, setCopyLabel] = useState("Talep metnini kopyala");
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    setItems(readStore());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* private mode */
    }
  }, [items, loaded]);

  const open = useCallback(() => {
    clearTimeout(toastTimer.current);
    setToast(null);
    lastFocus.current = document.activeElement as HTMLElement | null;
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setVisible(false);
    setTimeout(() => setIsOpen(false), 400);
    lastFocus.current?.focus();
  }, []);

  // Slide in after mount, lock the page behind it and keep focus inside.
  useEffect(() => {
    if (!isOpen) return;
    const outside = document.querySelectorAll<HTMLElement>("[data-inert-when-modal]");
    requestAnimationFrame(() => setVisible(true));
    document.body.style.overflow = "hidden";
    outside.forEach((el) => (el.inert = true));
    const t = setTimeout(() => closeRef.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key !== "Tab" || !panelRef.current) return;
      const f = [...panelRef.current.querySelectorAll<HTMLElement>("button, a[href], input, textarea")].filter((x) => x.offsetParent);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) {
        e.preventDefault();
        f[f.length - 1].focus();
      } else if (!e.shiftKey && document.activeElement === f[f.length - 1]) {
        e.preventDefault();
        f[0].focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
      outside.forEach((el) => (el.inert = false));
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, close]);

  const add = useCallback((item: QuoteItem) => {
    setItems((list) => {
      const ex = list.find((x) => sameLine(x, item));
      return ex ? list.map((x) => (x === ex ? { ...x, qty: x.qty + item.qty } : x)) : [...list, item];
    });
    setToast(`${item.name} · ${item.qty} adet eklendi`);
    setBump((b) => b + 1);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3800);
  }, []);

  const quoteText = () => {
    let t = "Merhaba, aşağıdaki ürünler için teklif almak istiyorum.\n\n";
    items.forEach((it, i) => {
      t += `${i + 1}) ${it.name}, ${it.qty} adet\n   ${it.detail}\n`;
    });
    const info = [
      ["Ad soyad", form.name],
      ["Firma", form.company],
      ["Telefon", form.phone],
      ["Şehir", form.city],
      ["Not", form.note],
    ].filter(([, v]) => v.trim());
    if (info.length) t += "\n" + info.map(([k, v]) => `${k}: ${v.trim()}`).join("\n");
    return t;
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(quoteText());
      setCopyLabel("Kopyalandı");
    } catch {
      setCopyLabel("Kopyalanamadı; WhatsApp ile gönderin");
    }
    setTimeout(() => setCopyLabel("Talep metnini kopyala"), 2200);
  };

  const count = items.reduce((s, x) => s + x.qty, 0);
  const field = (key: keyof typeof emptyForm) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  return (
    <QuoteContext.Provider value={{ count, bump, add, open, whatsappNumber }}>
      {children}

      {isOpen && (
        <div className={`drawer${visible ? " open" : ""}`}>
          <div className="scrim" onClick={close} />
          <aside className="panel" role="dialog" aria-modal="true" aria-labelledby="drawerTitle" ref={panelRef}>
            <div className="panel-h">
              <h2 id="drawerTitle">Teklif listesi</h2>
              <button className="x" type="button" onClick={close} aria-label="Kapat" ref={closeRef}>
                <CloseIcon />
              </button>
            </div>
            <div className="panel-b">
              <div className="qitems">
                {items.length ? (
                  items.map((it, i) => (
                    <div className="qi" key={`${it.slug}-${it.detail}`}>
                      <div className="relative h-[60px] w-[60px] overflow-hidden rounded bg-white">
                        {it.image && <SanityImage image={it.image} width={120} height={120} fit="max" objectFit="contain" className="h-full w-full object-contain" noBlur />}
                      </div>
                      <div>
                        <b>{it.name}</b> <span className="qn">× {it.qty}</span>
                        <p>{it.detail}</p>
                      </div>
                      <button type="button" onClick={() => setItems((l) => l.filter((_, j) => j !== i))}>
                        Çıkar
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="empty">Listeniz boş. Bir ürün sayfasında seçimlerinizi yapıp “Teklif listesine ekle”ye dokunun.</div>
                )}
              </div>
              <form className="form" onSubmit={(e) => e.preventDefault()} noValidate>
                <h3>İletişim bilgileriniz</h3>
                <div className="row2">
                  <div className="field">
                    <label htmlFor="fName">Ad soyad</label>
                    <input id="fName" autoComplete="name" {...field("name")} />
                  </div>
                  <div className="field">
                    <label htmlFor="fCo">Firma</label>
                    <input id="fCo" autoComplete="organization" {...field("company")} />
                  </div>
                </div>
                <div className="row2">
                  <div className="field">
                    <label htmlFor="fTel">Telefon</label>
                    <input id="fTel" type="tel" autoComplete="tel" inputMode="tel" {...field("phone")} />
                  </div>
                  <div className="field">
                    <label htmlFor="fCity">Şehir</label>
                    <input id="fCity" autoComplete="address-level2" {...field("city")} />
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="fNote">Not</label>
                  <textarea id="fNote" placeholder="Proje, teslim tarihi, mekân bilgisi" {...field("note")} />
                </div>
              </form>
            </div>
            <div className="panel-f">
              <a
                className="btn btn-wa"
                href={waLink(whatsappNumber, items.length ? quoteText() : "Merhaba, ürünleriniz hakkında bilgi almak istiyorum.")}
                target="_blank"
                rel="noopener"
              >
                <WaIcon />
                WhatsApp ile teklif iste
              </a>
              <button className="btn btn-line" type="button" onClick={copy}>
                {copyLabel}
              </button>
              <p>Mesaj, seçtiğiniz ürünler ve iletişim bilgilerinizle hazır açılır; göndermeden önce düzenleyebilirsiniz.</p>
            </div>
          </aside>
        </div>
      )}

      <div className={`toast${toast ? " show" : ""}`} role="status" aria-live="polite">
        <span>{toast}</span>
        <button type="button" onClick={open}>
          Listeyi aç
        </button>
      </div>
    </QuoteContext.Provider>
  );
}

export function OpenQuoteButton({ className, children }: { className?: string; children: React.ReactNode }) {
  const { open } = useQuote();
  return (
    <button className={className} type="button" onClick={open}>
      {children}
    </button>
  );
}
