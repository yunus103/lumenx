"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { PriceMode } from "@/types";

// undefined: on its way; null: not available
const PriceContext = createContext<{ mode: PriceMode; rate?: number | null }>({ mode: "hidden" });

// The rate is fetched once per visit and only when prices are shown in TL.
export function PriceProvider({ mode, children }: { mode: PriceMode; children: React.ReactNode }) {
  const [rate, setRate] = useState<number | null>();

  useEffect(() => {
    if (mode !== "tl") return;
    fetch("/api/usd-rate")
      .then((r) => r.json() as Promise<{ rate: number | null }>)
      .then((d) => setRate(d.rate))
      .catch(() => setRate(null));
  }, [mode]);

  return <PriceContext.Provider value={{ mode, rate }}>{children}</PriceContext.Provider>;
}

// The lowest of the prices entered. While the rate is on its way, `pending` text of a typical width holds the line's place.
export function usePrice(...prices: (number | undefined)[]) {
  const { mode, rate } = useContext(PriceContext);
  const entered = prices.filter((v): v is number => !!v && v > 0);
  if (!entered.length || mode === "hidden" || rate === null) return { text: null, pending: false, total: () => null };
  const usd = Math.min(...entered);
  const format = (v: number) => (mode === "usd" ? `${v.toLocaleString("tr-TR")} USD` : `₺${v.toLocaleString("tr-TR")}`);
  if (mode === "tl" && rate === undefined) return { text: "₺0.000", pending: true, total: () => "₺00.000" };
  // the total multiplies the rounded unit price, so the two figures on the page always agree
  const unit = mode === "usd" ? usd : Math.round((usd * rate!) / 10) * 10;
  return { text: format(unit), pending: false, total: (qty: number) => format(unit * qty) };
}
