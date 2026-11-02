// Prices are stored in USD. Until the daily TCMB rate is wired in (plan step 6) they are shown in USD.
export function formatPrice(priceUsd?: number, premiumPriceUsd?: number) {
  const prices = [priceUsd, premiumPriceUsd].filter((v): v is number => typeof v === "number" && v > 0);
  if (!prices.length) return null;
  return `${Math.min(...prices).toLocaleString("tr-TR")} USD`;
}
