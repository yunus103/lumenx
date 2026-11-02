// Imports tools/data/lightdesign.json (from scrape-lightdesign.mjs) into Sanity.
// Usage: node --env-file=.env.local tools/import-lightdesign.mjs [--overwrite]
//
// IDs are deterministic (product-ld-<ikas id>, finish-<slug>, productCategory-<slug>), so reruns never duplicate.
// By default existing documents are left alone, so edits made in the Studio (prices, texts, AI variant photos)
// survive a rerun; --overwrite replaces every imported product with the scraped version.
import { createClient } from "@sanity/client";
import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import { turkishSlugify } from "../src/sanity/lib/slugify.ts";

const overwrite = process.argv.includes("--overwrite");
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: "2025-01-01",
  useCdn: false,
});

const DATA = new URL("./data/lightdesign.json", import.meta.url);
const IMAGES = new URL("./data/images/", import.meta.url);

// ─── Catalogue ─────────────────────────────────────────────────────────────────

const TABLE_SPECS = [
  ["Işık kaynağı", "Samsung 2835 SMD LED"],
  ["Işık ayarı", "Dokunmatik, 3 kademe dimmer"],
  ["Güç", "3 W (Ekonomik) / 5 W (Premium)"],
  ["Batarya", "Li-ion 1×18650 1500 mAh / 2×18650 1500–2200 mAh"],
  ["Şarj süresi", "Ortalama 8 saat"],
  ["Güç girişi", "5 V / 2 A"],
  ["Koruma sınıfı", "IP20, iç mekân"],
  ["Sertifikalar", "CE, ISO, RoHS, MSDS"],
  ["Şarj seçenekleri", "Tekli kaset veya 9 / 18 / 27 / 36'lı istasyon"],
  ["Garanti", "Elektronik aksamda 2 yıl"],
  ["Menşei", "Türkiye"],
];

const ROOT_CATEGORY = { slug: "sarjli-urunler", title: "Şarjlı Ürünler", order: 0 };
const CATEGORIES = [
  { slug: "sarjli-masa-lambasi", title: "Şarjlı Masa Lambası", order: 1, kelvin: [2700], specs: TABLE_SPECS },
  { slug: "garson-cagirma", title: "Garson Çağırma", order: 2, kelvin: [2700] },
  { slug: "aplik-ve-lambader", title: "Aplik ve Lambader", order: 3, kelvin: [2700] },
  { slug: "sarj-istasyonlari", title: "Şarj İstasyonları", order: 4, kelvin: [] },
];

function categoryOf(p) {
  // Lowercased with the Turkish locale: the /i flag doesn't fold "İ" to "i".
  const text = `${p.name} ${p.categories.map((c) => c.path.join(" ")).join(" ")}`.toLocaleLowerCase("tr-TR");
  if (/şarj (istasyonu|kaseti)/.test(text)) return "sarj-istasyonlari";
  if (/garson|çağrı/.test(text)) return "garson-cagirma";
  if (/aplik|lambader/.test(text)) return "aplik-ve-lambader";
  return "sarjli-masa-lambasi";
}

// Light Design's colour names, normalised. Hex/RAL for the plated metals come from the demo (nearest references).
const FINISHES = [
  { name: "Gold", hex: "#D8BE7E", type: "Metalik kaplama", ral: "1036", ralName: "İnci altın" },
  { name: "Rose", hex: "#DCA690", type: "Metalik kaplama", aliases: ["roze gold"] },
  { name: "Bronz", hex: "#9A5A35", type: "Metalik kaplama", ral: "8029", ralName: "İnci bakır" },
  { name: "Satine Nikel", hex: "#B9B5AC", type: "Saten kaplama", ral: "9007", ralName: "Gri alüminyum" },
  { name: "Krom", hex: "#E2E4E8", type: "Parlak kaplama", ral: "9006", ralName: "Beyaz alüminyum" },
  { name: "Eskitme", hex: "#6B4E31", type: "Patina kaplama" },
  { name: "Prinç Eskitme", hex: "#8A6B3A", type: "Patina kaplama" },
  { name: "Gümüş", hex: "#C9CBCF", type: "Metalik kaplama" },
  { name: "Siyah", hex: "#141415", type: "Toz boya", ral: "9005", ralName: "Derin siyah" },
  { name: "Beyaz", hex: "#EDECE6", type: "Toz boya", ral: "9016", ralName: "Trafik beyazı" },
  { name: "Antrasit", hex: "#293133", type: "Toz boya", ral: "7016", ralName: "Antrasit gri" },
  { name: "Füme", hex: "#4A4A4F", type: "Toz boya" },
  { name: "Gri", hex: "#8B8C88", type: "Toz boya" },
  { name: "Krem", hex: "#E6DCC0", type: "Toz boya" },
  { name: "Kırmızı", hex: "#B0111F", type: "Toz boya" },
  { name: "Pembe", hex: "#E3A6B4", type: "Toz boya" },
  { name: "Mor", hex: "#6B3F7A", type: "Toz boya" },
  { name: "Turuncu", hex: "#E07A2E", type: "Toz boya" },
  { name: "Mavi", hex: "#2F5D9B", type: "Toz boya" },
  { name: "Gökyüzü Mavisi", hex: "#8EC3E6", type: "Toz boya" },
  { name: "Fıstık Yeşil", hex: "#9DBF6B", type: "Toz boya" },
  { name: "Ceviz", hex: "#6A3820", type: "Masif ahşap" },
  { name: "Kayın", hex: "#C98A45", type: "Masif ahşap" },
  { name: "Ahşap", hex: "#A8723D", type: "Masif ahşap" },
].map((f, i) => ({ ...f, slug: turkishSlugify(f.name), order: i }));

const finishByAlias = new Map(
  FINISHES.flatMap((f) => [f.name, ...(f.aliases ?? [])].map((a) => [a.toLocaleLowerCase("tr-TR"), f]))
);

const COLOUR_TYPES = new Set(["Renk", "Renk-Ekonomik"]);
const PRICE_TYPES = new Set(["Şarj Seçeneği"]);

// ─── HTML → Portable Text ──────────────────────────────────────────────────────

const decode = (s) =>
  s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));

function spans(inner, blockKey) {
  const children = [];
  let bold = false;
  for (const part of inner.split(/(<\/?(?:strong|b)\b[^>]*>)/i)) {
    if (/^<(strong|b)\b/i.test(part)) bold = true;
    else if (/^<\/(strong|b)/i.test(part)) bold = false;
    else {
      const text = decode(part.replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, "")).replace(/\s+/g, " ");
      if (text.trim()) children.push({ _type: "span", _key: `${blockKey}s${children.length}`, text, marks: bold ? ["strong"] : [] });
    }
  }
  if (children.length) {
    children[0].text = children[0].text.trimStart();
    children.at(-1).text = children.at(-1).text.trimEnd();
  }
  return children;
}

function htmlToBlocks(html) {
  const blocks = [];
  for (const [, tag, inner] of html.matchAll(/<(p|h[1-6]|li)\b[^>]*>([\s\S]*?)<\/\1>/gi)) {
    const _key = `b${blocks.length}`;
    const children = spans(inner, _key);
    if (!children.length) continue;
    const t = tag.toLowerCase();
    blocks.push({
      _type: "block",
      _key,
      style: t.startsWith("h") ? "h3" : "normal",
      markDefs: [],
      children,
      ...(t === "li" && { listItem: "bullet", level: 1 }),
    });
  }
  return blocks;
}

// ─── Images ────────────────────────────────────────────────────────────────────

async function uploadImages(products) {
  const all = new Map();
  for (const p of products) for (const img of p.images) all.set(img.id, img);

  const existing = await client.fetch(
    `*[_type == "sanity.imageAsset" && source.name == "lightdesign" && source.id in $ids]{ _id, "sid": source.id }`,
    { ids: [...all.keys()] }
  );
  const assetIds = new Map(existing.map((a) => [a.sid, a._id]));
  const todo = [...all.values()].filter((img) => !assetIds.has(img.id));
  console.log(`images: ${all.size} total, ${assetIds.size} already in Sanity, ${todo.length} to upload`);

  await mkdir(IMAGES, { recursive: true });
  let done = 0;
  const worker = async () => {
    for (let img = todo.shift(); img; img = todo.shift()) {
      const file = new URL(`${img.id}.webp`, IMAGES);
      const cached = await access(file).then(() => true, () => false);
      const buffer = cached ? await readFile(file) : Buffer.from(await (await fetch(img.url)).arrayBuffer());
      if (!cached) await writeFile(file, buffer);
      const asset = await client.assets.upload("image", buffer, {
        filename: `${img.fileName || img.id}.webp`,
        source: { name: "lightdesign", id: img.id, url: img.url },
      });
      assetIds.set(img.id, asset._id);
      if (++done % 25 === 0) console.log(`  uploaded ${done}`);
    }
  };
  await Promise.all(Array.from({ length: 6 }, worker));
  return assetIds;
}

// ─── Documents ─────────────────────────────────────────────────────────────────

const ref = (_ref, _key) => ({ _type: "reference", _ref, ...(_key && { _key }) });
const imageRef = (assetId, _key) => ({ _type: "image", ...(_key && { _key }), asset: { _type: "reference", _ref: assetId } });

function categoryDocs() {
  const root = {
    _id: `productCategory-${ROOT_CATEGORY.slug}`,
    _type: "productCategory",
    title: ROOT_CATEGORY.title,
    slug: { _type: "slug", current: ROOT_CATEGORY.slug },
    order: ROOT_CATEGORY.order,
    kelvinOptions: [2700],
  };
  return [
    root,
    ...CATEGORIES.map((c) => ({
      _id: `productCategory-${c.slug}`,
      _type: "productCategory",
      title: c.title,
      slug: { _type: "slug", current: c.slug },
      parent: ref(root._id),
      order: c.order,
      kelvinOptions: c.kelvin,
      ...(c.specs && { defaultSpecs: c.specs.map(([label, value], i) => ({ _type: "specRow", _key: `s${i}`, label, value })) }),
    })),
  ];
}

function finishDocs() {
  return FINISHES.map((f) => ({
    _id: `finish-${f.slug}`,
    _type: "finish",
    name: f.name,
    slug: { _type: "slug", current: f.slug },
    hex: f.hex,
    finishType: f.type,
    ...(f.ral && { ral: f.ral, ralName: f.ralName }),
    order: f.order,
  }));
}

function productDoc(p, assetIds) {
  const colourTypeIdx = p.variantTypes.findIndex((t) => COLOUR_TYPES.has(t.name));
  const colourValues = p.variantTypes.filter((t) => COLOUR_TYPES.has(t.name)).flatMap((t) => t.values.map((v) => v.name));
  const finishes = [...new Set(colourValues.map((n) => finishByAlias.get(n.toLocaleLowerCase("tr-TR"))?.slug))]
    .filter(Boolean)
    .map((slug) => `finish-${slug}`);

  // ikas reorders one shared gallery per colour; the first image of a colour's variant is that colour's photo.
  const mainByColour = new Map();
  if (colourTypeIdx >= 0) {
    for (const v of p.variants) {
      const finish = finishByAlias.get(v.values[colourTypeIdx]?.toLocaleLowerCase("tr-TR"));
      if (finish && !mainByColour.has(finish.slug)) mainByColour.set(finish.slug, v.imageIds[0]);
    }
  }
  const variantPhotos =
    new Set(mainByColour.values()).size > 1
      ? [...mainByColour].map(([slug, imageId]) => ({
          _type: "variantPhoto",
          _key: slug,
          finish: ref(`finish-${slug}`),
          image: imageRef(assetIds.get(imageId)),
        }))
      : [];

  const options = p.variantTypes
    .filter((t) => !COLOUR_TYPES.has(t.name) && !PRICE_TYPES.has(t.name))
    .map((t) => ({ _type: "productOption", _key: t.id.slice(0, 8), name: t.name, values: t.values.map((v) => v.name) }));

  const datasheets = p.attributes
    .filter((a) => /^Data Sheets/i.test(a.name))
    .flatMap((a) => [...a.html.matchAll(/href="([^"]+\.pdf)"/gi)].map((m) => ({ title: a.name.replace(/^Data Sheets\s*/i, ""), url: m[1] })))
    .map((d, i) => ({ _type: "datasheet", _key: `d${i}`, title: `${d.title} Teknik Föyü`, url: d.url }));

  const name = p.name.trim();
  return {
    _id: `product-ld-${p.id}`,
    _type: "product",
    name,
    slug: { _type: "slug", current: turkishSlugify(name) },
    category: ref(`productCategory-${categoryOf(p)}`),
    description: htmlToBlocks(p.descriptionHtml),
    gallery: p.images.map((img) => imageRef(assetIds.get(img.id), img.id.slice(0, 8))),
    finishes: finishes.map((id) => ref(id, id.replace(/^finish-/, ""))),
    variantPhotos,
    options,
    chargeOptions: p.variantTypes.some((t) => PRICE_TYPES.has(t.name)),
    datasheets,
    source: { name: "lightdesign", id: p.id, url: p.url },
  };
}

// ─── Run ───────────────────────────────────────────────────────────────────────

const { products } = JSON.parse(await readFile(DATA, "utf8"));

if (process.argv.includes("--dry")) {
  const fake = new Map(products.flatMap((p) => p.images.map((i) => [i.id, `image-${i.id}`])));
  const docs = products.map((p) => productDoc(p, fake));
  const unmapped = new Set(products.flatMap((p) => p.variantTypes.filter((t) => COLOUR_TYPES.has(t.name)).flatMap((t) => t.values.map((v) => v.name)))
    .filter((n) => !finishByAlias.has(n.toLocaleLowerCase("tr-TR"))));
  const byCat = Object.groupBy(docs, (d) => d.category._ref);
  console.log("unmapped colours:", [...unmapped]);
  for (const [cat, list] of Object.entries(byCat)) console.log(cat, list.length, list.slice(0, 40).map((d) => d.name).join(" | "));
  console.log("with variantPhotos:", docs.filter((d) => d.variantPhotos.length).length, "with datasheets:", docs.filter((d) => d.datasheets.length).length);
  console.log(JSON.stringify(docs.find((d) => d.name.startsWith("Defne")), null, 1).slice(0, 2500));
  process.exit(0);
}

const assetIds = await uploadImages(products);

const tx = client.transaction();
for (const doc of [...categoryDocs(), ...finishDocs()]) tx.createIfNotExists(doc);
for (const p of products) {
  const doc = productDoc(p, assetIds);
  overwrite ? tx.createOrReplace(doc) : tx.createIfNotExists(doc);
}
await tx.commit({ visibility: "async" });

const slugs = products.map((p) => turkishSlugify(p.name.trim()));
const dupes = slugs.filter((s, i) => slugs.indexOf(s) !== i);
console.log(`imported ${products.length} products${overwrite ? " (overwrite)" : ""}; duplicate slugs: ${dupes.length ? dupes.join(", ") : "none"}`);
