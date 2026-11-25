// Imports the non-Light Design products (tools/data/ext/*.json) into Sanity: armatures, outdoor fittings and
// the price-list-only lamps. Each source file is written by its scraper and holds finished products.
// Usage: node --no-warnings --env-file=.env.local tools/import-external.mjs [--dry] [--overwrite] [--prune] [--only <source>]
//
// Source file shape (tools/data/ext/<source>.json):
// {
//   "source": "a",                      short source key (never a brand name; stored only in product.source)
//   "products": [{
//     "key": "a-aura-gu10-spot",       stable id → _id product-ext-<key>; never change it once imported
//     "name": "Aura GU10 Spot",         model name + type, Turkish; no source brand or brand codes
//     "slug": "aura-gu10-spot",         turkishSlugify(name); unique across the whole dataset
//     "category": "spot-armaturler",    a slug from CATEGORIES below (or an existing one, e.g. sarjli-masa-lambasi)
//     "description": ["…", "…"],        1–3 plain paragraphs
//     "images": [{ "file": "tools/data/ext-images/a/<name>.jpg", "url": "…" }],   gallery order, first is the cover
//     "finishes": ["beyaz", "siyah"],   existing finish slugs only (see FINISHES in import-lightdesign.mjs)
//     "kelvin": [3000, 4000],           optional; only 2700, 3000, 4000, 6500
//     "options": [{ "name": "Ölçü", "values": ["2\"", "3\""] }],   variants merged into one product
//     "specs": [["Güç", "7–30 W"], …],  label/value rows (the category table is empty for these categories)
//     "chargeOptions": false,           optional, default false
//     "priceUsd": 95, "premiumPriceUsd": 105,   optional
//     "sourceUrls": ["…"]               every source page merged into this product
//   }]
// }
//
// IDs are deterministic, so reruns update instead of duplicating. Without --overwrite, existing products are
// left alone (Studio edits win); with it, every product in the files is replaced. --prune (only without --only)
// deletes external products that are no longer in any file.
import { createClient } from "@sanity/client";
import { readFile, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";

const args = process.argv.slice(2);
const DRY = args.includes("--dry");
const OVERWRITE = args.includes("--overwrite");
const ONLY = args.includes("--only") ? args[args.indexOf("--only") + 1] : null;
const PRUNE = args.includes("--prune") && !ONLY;

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: "2025-01-01",
  useCdn: false,
});

const ROOT = new URL("../", import.meta.url);
const EXT = new URL("./data/ext/", import.meta.url);

// Two levels only: the catalogue counts a category's own products plus its direct children's.
const ROOTS = [
  { slug: "armaturler", title: "Armatürler", order: 10, kelvin: [3000, 4000] },
  { slug: "dis-mekan", title: "Dış Mekân", order: 20, kelvin: [3000] },
];
export const CATEGORIES = [
  { slug: "spot-armaturler", title: "Spot Armatürler", parent: "armaturler", order: 11, kelvin: [3000, 4000] },
  { slug: "downlight", title: "Downlight", parent: "armaturler", order: 12, kelvin: [3000, 4000] },
  { slug: "ray-ve-magaza", title: "Ray ve Mağaza Armatürleri", parent: "armaturler", order: 13, kelvin: [3000, 4000] },
  { slug: "sarkit-armaturler", title: "Sarkıt Armatürler", parent: "armaturler", order: 14, kelvin: [3000, 4000] },
  { slug: "siva-alti-armaturler", title: "Sıva Altı Armatürler", parent: "armaturler", order: 15, kelvin: [3000, 4000] },
  { slug: "lineer-ve-profil", title: "Lineer ve Profil", parent: "armaturler", order: 16, kelvin: [3000, 4000] },
  { slug: "kuyumcu-aydinlatma", title: "Kuyumcu Aydınlatma", parent: "armaturler", order: 17, kelvin: [4000] },
  { slug: "aydinlatma-direkleri", title: "Aydınlatma Direkleri", parent: "dis-mekan", order: 21, kelvin: [3000] },
  { slug: "bollard-ve-set-ustu", title: "Bollard ve Set Üstü", parent: "dis-mekan", order: 22, kelvin: [3000] },
  { slug: "dis-mekan-aplik", title: "Dış Mekân Aplik", parent: "dis-mekan", order: 23, kelvin: [3000] },
];
const EXISTING_CATEGORIES = ["sarjli-masa-lambasi", "garson-cagirma", "aplik-ve-lambader", "sarj-istasyonlari"];

const KELVINS = new Set([2700, 3000, 4000, 6500]);
// Source sites and their product codes must never reach the site; component brands (Osram, Samsung) may.
// "Bollard aydınlatma" is also a plain product phrase, so only the shop's domain form is matched.
// Letter lookarounds instead of \b, which treats "ü" as a boundary; shop codes match case-sensitively
// ("ölçümleri" would otherwise hit ML…).
const BRAND = /(?<!\p{L})aba(?!\p{L})|aba ?light|more ?light|led ?linear|light ?design|bollardaydinlatma|www\.|\.com\b/iu;
const SHOP_CODE = /(?<!\p{L})ML[A-Z]{2,}(?!\p{L})/u;

// ─── Load and check ────────────────────────────────────────────────────────────

const files = (await readdir(EXT)).filter((f) => f.endsWith(".json") && (!ONLY || f === `${ONLY}.json`));
const products = [];
for (const f of files) {
  const data = JSON.parse(await readFile(new URL(f, EXT), "utf8"));
  for (const p of data.products) products.push({ ...p, _source: data.source, _file: f });
}

const finishSlugs = new Set(await client.fetch(`*[_type == "finish"].slug.current`));
const takenSlugs = new Map(
  (await client.fetch(`*[_type == "product" && !(_id match "product-ext-*")]{ "s": slug.current, _id }`)).map((d) => [d.s, d._id])
);
const categorySlugs = new Set([...CATEGORIES.map((c) => c.slug), ...EXISTING_CATEGORIES]);

const errors = [];
const seenKeys = new Set();
const seenSlugs = new Set();
for (const p of products) {
  const at = `${p._file} ${p.key}`;
  if (!p.key || seenKeys.has(p.key)) errors.push(`${at}: missing or duplicate key`);
  seenKeys.add(p.key);
  if (!p.slug || seenSlugs.has(p.slug) || takenSlugs.has(p.slug)) errors.push(`${at}: slug "${p.slug}" missing or taken`);
  seenSlugs.add(p.slug);
  if (!categorySlugs.has(p.category)) errors.push(`${at}: unknown category "${p.category}"`);
  if (!p.images?.length) errors.push(`${at}: no images`);
  if (!p.description?.length) errors.push(`${at}: no description`);
  for (const f of p.finishes ?? []) if (!finishSlugs.has(f)) errors.push(`${at}: unknown finish "${f}"`);
  for (const k of p.kelvin ?? []) if (!KELVINS.has(k)) errors.push(`${at}: kelvin ${k} not allowed`);
  const text = [p.name, ...(p.description ?? []), ...(p.specs ?? []).flat(), ...(p.options ?? []).flatMap((o) => [o.name, ...o.values])].join("\n");
  const hit = text.match(BRAND) ?? text.match(SHOP_CODE);
  if (hit) errors.push(`${at}: brand text "${hit[0]}"`);
}
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

// ─── Documents ─────────────────────────────────────────────────────────────────

const ref = (_ref, _key) => ({ _type: "reference", _ref, ...(_key && { _key }) });
const imageRef = (assetId, _key) => ({ _type: "image", _key, asset: { _type: "reference", _ref: assetId } });
const imageId = (img) => createHash("sha1").update(img.url || img.file).digest("hex").slice(0, 16);
const blocks = (paragraphs) =>
  paragraphs.map((text, i) => ({ _type: "block", _key: `p${i}`, style: "normal", markDefs: [], children: [{ _type: "span", _key: `p${i}s0`, text, marks: [] }] }));

function categoryDocs() {
  const rootDocs = ROOTS.map((r) => ({
    _id: `productCategory-${r.slug}`,
    _type: "productCategory",
    title: r.title,
    slug: { _type: "slug", current: r.slug },
    order: r.order,
    kelvinOptions: r.kelvin,
  }));
  const leafDocs = CATEGORIES.map((c) => ({
    _id: `productCategory-${c.slug}`,
    _type: "productCategory",
    title: c.title,
    slug: { _type: "slug", current: c.slug },
    parent: ref(`productCategory-${c.parent}`),
    order: c.order,
    kelvinOptions: c.kelvin,
    defaultSpecs: [],
  }));
  return [...rootDocs, ...leafDocs];
}

function productDoc(p, assetIds) {
  return {
    _id: `product-ext-${p.key}`,
    _type: "product",
    name: p.name,
    slug: { _type: "slug", current: p.slug },
    category: ref(`productCategory-${p.category}`),
    description: blocks(p.description),
    gallery: p.images.map((img) => imageRef(assetIds.get(imageId(img)), imageId(img).slice(0, 8))),
    finishes: (p.finishes ?? []).map((f) => ref(`finish-${f}`, f)),
    ...(p.kelvin?.length && { kelvinOptions: p.kelvin }),
    options: (p.options ?? []).map((o, i) => ({ _type: "productOption", _key: `o${i}`, name: o.name, values: o.values })),
    specs: (p.specs ?? []).map(([label, value], i) => ({ _type: "specRow", _key: `s${i}`, label, value })),
    chargeOptions: p.chargeOptions ?? false,
    ...(p.priceUsd != null && { priceUsd: p.priceUsd }),
    ...(p.premiumPriceUsd != null && { premiumPriceUsd: p.premiumPriceUsd }),
    source: { name: p._source, id: p.key, url: p.sourceUrls?.[0] },
  };
}

// ─── Images ────────────────────────────────────────────────────────────────────

async function uploadImages() {
  const all = new Map();
  for (const p of products) p.images.forEach((img, i) => all.set(imageId(img), { ...img, name: `${p.slug}-${i + 1}` }));
  const existing = await client.fetch(`*[_type == "sanity.imageAsset" && source.name == "ext" && source.id in $ids]{ _id, "sid": source.id }`, {
    ids: [...all.keys()],
  });
  const assetIds = new Map(existing.map((a) => [a.sid, a._id]));
  const todo = [...all].filter(([id]) => !assetIds.has(id));
  console.log(`images: ${all.size} total, ${assetIds.size} already in Sanity, ${todo.length} to upload`);
  let done = 0;
  const worker = async () => {
    for (let item = todo.shift(); item; item = todo.shift()) {
      const [id, img] = item;
      const buffer = img.file ? await readFile(new URL(img.file, ROOT)) : Buffer.from(await (await fetch(img.url)).arrayBuffer());
      // neutral filename and source: asset documents are readable through the API
      const asset = await client.assets.upload("image", buffer, {
        filename: `${img.name}${path.extname(img.file || new URL(img.url).pathname) || ".jpg"}`,
        source: { name: "ext", id },
      });
      assetIds.set(id, asset._id);
      if (++done % 25 === 0) console.log(`  uploaded ${done}`);
    }
  };
  await Promise.all(Array.from({ length: 6 }, worker));
  return assetIds;
}

// ─── Run ───────────────────────────────────────────────────────────────────────

if (DRY) {
  const byCat = Object.groupBy(products, (p) => p.category);
  for (const [cat, list] of Object.entries(byCat)) console.log(`${cat} (${list.length}): ${list.map((p) => p.name).join(" | ")}`);
  console.log(`${products.length} products, ${products.reduce((n, p) => n + p.images.length, 0)} images, no errors`);
  process.exit(0);
}

const assetIds = await uploadImages();
const tx = client.transaction();
for (const doc of categoryDocs()) tx.createIfNotExists(doc);
for (const p of products) {
  const doc = productDoc(p, assetIds);
  OVERWRITE ? tx.createOrReplace(doc) : tx.createIfNotExists(doc);
}
if (PRUNE) {
  const keep = new Set(products.map((p) => `product-ext-${p.key}`));
  const gone = (await client.fetch(`*[_type == "product" && _id match "product-ext-*"]._id`)).filter((id) => !keep.has(id));
  for (const id of gone) tx.delete(id);
  console.log(`pruned: ${gone.join(", ") || "none"}`);
}
await tx.commit({ visibility: "async" });
console.log(`imported ${products.length} products${OVERWRITE ? " (overwrite)" : ""} from ${files.join(", ")}`);
