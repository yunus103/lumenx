// Scrapes every Light Design product page into tools/data/lightdesign.json.
// Each ikas storefront page embeds the full product in __NEXT_DATA__, so no HTML parsing is needed.
// Usage: node tools/scrape-lightdesign.mjs
import { writeFile, mkdir } from "node:fs/promises";

const SITE = "https://lightdesign.com.tr";
const CDN = "https://cdn.myikas.com/images/8f38c025-b866-495f-a2cf-a6d9e04c83a1";
const OUT = new URL("./data/lightdesign.json", import.meta.url);

const imageUrl = (id, fileName = "image") => `${CDN}/${id}/1080/${fileName}.webp`;

async function productUrls() {
  const xml = await (await fetch(`${SITE}/products.xml`)).text();
  return [...xml.matchAll(/<loc>(https:\/\/lightdesign\.com\.tr\/[^<]+)<\/loc>/g)].map((m) => m[1]);
}

async function pageData(url) {
  const html = await (await fetch(url)).text();
  const json = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/)?.[1];
  return json ? JSON.parse(json).props.pageProps.pageSpecificData : null;
}

function normalize(d, url) {
  const images = [];
  const seen = new Set();
  for (const v of d.variants) {
    for (const img of v.images) {
      if (seen.has(img.imageId)) continue;
      seen.add(img.imageId);
      images.push({ id: img.imageId, fileName: img.fileName, url: imageUrl(img.imageId, img.fileName) });
    }
  }

  return {
    id: d.id,
    slug: d.metaData.slug,
    url,
    name: d.name,
    descriptionHtml: d.description,
    shortDescription: d.shortDescription,
    metaTitle: d.metaData.pageTitle,
    metaDescription: d.metaData.description,
    categories: d.categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug, path: c.categoryPath })),
    tags: d.tags.map((t) => t.name),
    variantTypes: d.variantTypes.map(({ variantType: t }) => ({
      id: t.id,
      name: t.name,
      selectionType: t.selectionType,
      values: t.values.map((v) => ({
        id: v.id,
        name: v.name,
        colorCode: v.colorCode || null,
        thumbnail: v.thumbnailImageId ? imageUrl(v.thumbnailImageId) : null,
      })),
    })),
    variants: d.variants.map((v) => ({
      id: v.id,
      active: v.isActive,
      values: v.variantValues.map((x) => x.name),
      imageIds: v.images.map((i) => i.imageId),
      priceTry: v.prices?.[0]?.sellPrice ?? null,
    })),
    images,
    attributes: d.attributes
      .filter((a) => a.value)
      .map((a) => ({ name: a.productAttribute?.name, html: a.value })),
  };
}

const urls = await productUrls();
const byId = new Map();
const failed = [];

for (const url of urls) {
  const d = await pageData(url).catch(() => null);
  if (!d) {
    failed.push(url);
    continue;
  }
  // Same product can be listed under several slugs; keep the one ikas reports as canonical.
  const p = normalize(d, url);
  const prev = byId.get(p.id);
  if (!prev || url.endsWith(`/${p.slug}`)) byId.set(p.id, p);
}

await mkdir(new URL("./data/", import.meta.url), { recursive: true });
await writeFile(OUT, JSON.stringify({ scrapedAt: new Date().toISOString(), failed, products: [...byId.values()] }, null, 2));
console.log(`${urls.length} urls → ${byId.size} unique products, ${failed.length} failed`);
