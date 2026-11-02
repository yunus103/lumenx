// Writes the LUMENX copy (tools/data/product-copy.mjs) over the imported Light Design texts: descriptions,
// product spec rows, option and name fixes, category spec tables. The first run saves the values it replaces
// to tools/data/copy-backup.json so the import's texts can be restored by hand.
// Usage: node --env-file=.env.local tools/apply-copy.mjs [--dry]
import fs from "node:fs";
import { createClient } from "@sanity/client";
import { CATEGORY_SPECS, COPY } from "./data/product-copy.mjs";

const DRY = process.argv.includes("--dry");

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: "2025-01-01",
  useCdn: false,
});

// copy is keyed by the Light Design slug; Sanity ids are product-ld-<ikas id> (see import-lightdesign.mjs)
const source = JSON.parse(fs.readFileSync(new URL("./data/lightdesign.json", import.meta.url), "utf8"));
const idBySlug = new Map((source.products ?? source).map((p) => [p.slug, `product-ld-${p.id}`]));

const blocks = (paragraphs) =>
  paragraphs.map((text, i) => ({
    _type: "block",
    _key: `p${i}`,
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: `p${i}s0`, text, marks: [] }],
  }));
const rows = (specs) => specs.map(([label, value], i) => ({ _type: "specRow", _key: `s${i}`, label, value }));

const ids = Object.keys(COPY).map((slug) => idBySlug.get(slug));
const current = await client.fetch(
  `{
    "products": *[_id in $ids]{ _id, name, slug, description, specs, options },
    "categories": *[_type == "productCategory" && slug.current in $cats]{ _id, "slug": slug.current, defaultSpecs }
  }`,
  { ids, cats: Object.keys(CATEGORY_SPECS) }
);
const missing = Object.keys(COPY).filter((slug) => !current.products.some((p) => p._id === idBySlug.get(slug)));
if (missing.length) throw new Error(`products not in Sanity: ${missing.join(", ")}`);

const tx = client.transaction();
for (const [slug, c] of Object.entries(COPY)) {
  const set = { description: blocks(c.d), specs: rows(c.specs ?? []) };
  if (c.name) set.name = c.name;
  if (c.slug) set.slug = { _type: "slug", current: c.slug };
  if (c.options) set.options = c.options.map((o, i) => ({ _type: "productOption", _key: `o${i}`, ...o }));
  tx.patch(idBySlug.get(slug), (p) => p.set(set));
}
for (const cat of current.categories) tx.patch(cat._id, (p) => p.set({ defaultSpecs: rows(CATEGORY_SPECS[cat.slug]) }));

if (DRY) {
  console.log(`dry run: ${Object.keys(COPY).length} products, ${current.categories.length} categories`);
} else {
  // the first run's backup holds the imported texts; later runs must not replace it with rewritten ones
  const backup = new URL("./data/copy-backup.json", import.meta.url);
  if (!fs.existsSync(backup)) fs.writeFileSync(backup, JSON.stringify(current, null, 1));
  await tx.commit({ visibility: "async" });
  console.log(`written: ${Object.keys(COPY).length} products, ${current.categories.length} categories (backup: tools/data/copy-backup.json)`);
}
