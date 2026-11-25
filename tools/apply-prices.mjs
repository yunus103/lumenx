// Writes the 2027 price list (tools/data/prices-2027.mjs) onto the Light Design products and clears the
// prices of those not in the list (the sample 65/75 prices included).
// Usage: node --no-warnings --env-file=.env.local tools/apply-prices.mjs [--dry]
import { createClient } from "@sanity/client";
import { PRICES } from "./data/prices-2027.mjs";

const DRY = process.argv.includes("--dry");
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: "2025-01-01",
  useCdn: false,
});

const keys = Object.keys(PRICES).sort((a, b) => b.length - a.length);
const keyFor = (slug) => keys.find((k) => slug === k || slug.startsWith(`${k}-`));

// A lamp sold only as Premium keeps its tier switch if it has one, so the price sits on the Premium tier;
// otherwise the single price is the product's price.
function fields(entry, chargeOptions) {
  if (entry.single != null) return { priceUsd: entry.single };
  if (entry.eko != null) return { priceUsd: entry.eko, premiumPriceUsd: entry.premium };
  return chargeOptions ? { premiumPriceUsd: entry.premium } : { priceUsd: entry.premium };
}

const products = await client.fetch(`*[_type == "product" && _id match "product-ld-*"]{ _id, name, "slug": slug.current, chargeOptions }`);
const used = new Set();
const unpriced = [];
const tx = client.transaction();
for (const p of products) {
  const key = keyFor(p.slug);
  if (!key) {
    unpriced.push(p.name);
    tx.patch(p._id, (patch) => patch.unset(["priceUsd", "premiumPriceUsd"]));
    continue;
  }
  used.add(key);
  const set = fields(PRICES[key], p.chargeOptions);
  // Sanity applies a patch's unset after its set, so only unset what isn't being set
  const drop = ["priceUsd", "premiumPriceUsd"].filter((f) => !(f in set));
  tx.patch(p._id, (patch) => patch.set(set).unset(drop));
}

console.log(`priced: ${products.length - unpriced.length}, cleared (not in list): ${unpriced.length}`);
console.log(`  not in list: ${unpriced.join(", ") || "none"}`);
console.log(`  list entries with no product: ${keys.filter((k) => !used.has(k)).join(", ") || "none"}`);
if (!DRY) {
  await tx.commit({ visibility: "async" });
  console.log("written");
}
