// Scrapes source "l" (BigCommerce shop) into tools/data/ext-raw/l.json and tools/data/ext-images/l/.
// Usage: node tools/scrape-ext-l.mjs   (the curated tools/data/ext/l.json is written by hand from the raw file)
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const BASE = "https://ledlinear.com.tr";
const OUT = new URL("./data/", import.meta.url);
await mkdir(new URL("./ext-images/l/", OUT), { recursive: true });
await mkdir(new URL("./ext-raw/", OUT), { recursive: true });

const get = async (u) => (await fetch(u)).text();
const decode = (s) =>
  s.replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16))).replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
    .replace(/&(\w+);/g, (m, n) => ({ amp: "&", quot: '"', nbsp: " ", lt: "<", gt: ">", ouml: "ö", uuml: "ü", ccedil: "ç", Ouml: "Ö", Uuml: "Ü", Ccedil: "Ç" })[n] ?? m);

const listPages = [`${BASE}/kuyumcu-aydinlatma/`, `${BASE}/kuyumcu-aydinlatma/?page=2`, `${BASE}/profil-barled-aydinlatma/`, `${BASE}/profil-barled-aydinlatma/?page=2`];
const skip = /bahce|bollard|galeri|politika|sozlesme|wallwasher|aydinlatma\/$|barled-aydinlatma\/$/;
const urls = new Map();
for (const lp of listPages) {
  const html = await get(lp);
  const cat = lp.includes("kuyumcu") ? "kuyumcu-aydinlatma" : "lineer-ve-profil";
  for (const m of html.matchAll(/class="card-figure"[\s\S]*?href="(https:\/\/ledlinear\.com\.tr\/[^"]+\/)"/g)) if (!skip.test(m[1])) urls.set(m[1], cat);
}

const products = [];
for (const [url, listCategory] of urls) {
  const html = await get(url);
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1])).find((j) => j["@type"] === "Product");
  const imgs = [...new Set([...html.matchAll(/images\/stencil\/1280x1280\/products\/(\d+\/\d+\/[^"?]+)/g)].map((m) => m[1]))].filter((p) => !/logo/i.test(p));
  const images = [];
  for (const rel of imgs) {
    const src = `https://cdn11.bigcommerce.com/s-vtja9zyaao/images/stencil/1280x1280/products/${rel}`;
    const file = `tools/data/ext-images/l/${path.basename(url.replace(/\/$/, ""))}-${rel.split("/")[1]}${path.extname(rel)}`.toLowerCase();
    await writeFile(new URL(`../${file}`, import.meta.url), Buffer.from(await (await fetch(src)).arrayBuffer()));
    images.push({ file, url: src });
  }
  products.push({ url, listCategory, name: decode(ld.name), description: decode(ld.description ?? ""), images });
  console.log(ld.name, images.length);
}
await writeFile(new URL("./ext-raw/l.json", OUT), JSON.stringify({ source: "l", products }, null, 2));
