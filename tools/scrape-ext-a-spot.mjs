// Scrapes the spot pages of source "a" into tools/data/ext-raw/a-spot.json and downloads gallery images.
// Usage: node tools/scrape-ext-a-spot.mjs
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ORIGIN = "https://abalighting.com";
const LISTINGS = ["gu-10/round", "gu-10/square", "spot-lights/round-spot", "spot-lights/square-spot", "overplast/gu-10"];
const OUT_IMG = new URL("./data/ext-images/a-spot/", import.meta.url);
const OUT_RAW = new URL("./data/ext-raw/a-spot.json", import.meta.url);

const get = async (url) => {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return r;
};
const decode = (s) => s.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const clean = (s) => decode(s.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();

await mkdir(OUT_IMG, { recursive: true });
await mkdir(new URL("./", OUT_RAW), { recursive: true });

const urls = new Set();
for (const l of LISTINGS) {
  const html = await (await get(`${ORIGIN}/tr/urunler/${l}`)).text();
  for (const m of html.matchAll(/href="(\/tr\/urunler\/[^"/]+\/[^"/]+\/[^"/]+)"/g)) urls.add(m[1]);
}

const products = [];
for (const u of [...urls].sort()) {
  const html = await (await get(ORIGIN + u)).text();
  const title = clean(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? html.match(/<h\d[^>]*>([^<]*)<\/h\d>\s*<ul class="breadcrumb|<h\d[^>]*>([^<]+)<\/h\d>/)?.[1] ?? "");
  const slider = html.match(/<div class="slider ">([\s\S]*?)<\/div>/)?.[1] ?? "";
  const imgs = [...new Set([...slider.matchAll(/src="([^"]+)"/g)].map((m) => m[1].replace("abalighting.com//", "abalighting.com/")))].map((s) => (s.startsWith("/") ? ORIGIN + s : s));
  const side = {};
  for (const m of html.matchAll(/<strong class="color-danger text-uppercase">([^<]+)<\/strong>([\s\S]*?)<\/li>/g)) side[m[1]] = clean(m[2]);
  const table = {};
  for (const m of html.matchAll(/<td><strong>([^<]+?):?\s*<\/strong>([\s\S]*?)<\/td>/g)) table[clean(m[1])] = clean(m[2]);
  const desc = clean(html.match(/id="technic"[^>]*>([\s\S]*?)<\/div>\s*<div class="tab-pane/)?.[1] ?? "");
  const files = [];
  for (const [i, src] of imgs.entries()) {
    const name = `${u.split("/").slice(-2).join("-")}-${i + 1}${path.extname(src) || ".jpg"}`;
    const buf = Buffer.from(await (await get(src)).arrayBuffer());
    await writeFile(new URL(name, OUT_IMG), buf);
    files.push({ file: `tools/data/ext-images/a-spot/${name}`, url: src });
  }
  products.push({ url: ORIGIN + u, title, side, table, desc, images: files });
  console.log(u, imgs.length);
}
await writeFile(OUT_RAW, JSON.stringify({ products }, null, 1));
