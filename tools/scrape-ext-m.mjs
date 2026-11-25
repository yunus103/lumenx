// Scrapes source "m" (WordPress shop) into tools/data/ext-raw/m.json and tools/data/ext-images/m/.
// Usage: node tools/scrape-ext-m.mjs   (the curated tools/data/ext/m.json is written by hand from the raw file)
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const BASE = "https://morelight.com.tr";
const OUT = new URL("./data/", import.meta.url);
const IMG_DIR = new URL("./ext-images/m/", OUT);
await mkdir(IMG_DIR, { recursive: true });
await mkdir(new URL("./ext-raw/", OUT), { recursive: true });

const get = async (u) => (await fetch(u)).text();
const decode = (s) => s.replace(/&#8211;/g, "-").replace(/&amp;/g, "&").replace(/&raquo;/g, "»").replace(/&#038;/g, "&");

const listing = new Set([`${BASE}/led-bar-mllb-2.html`, `${BASE}/dekorratif-led-avize.html`]);
for (const cat of ["sarkit-armaturler", "sivaalti-armaturler"]) {
  const html = await get(`${BASE}/category/urunlerimiz/${cat}`);
  for (const m of html.matchAll(/href="(https:\/\/morelight\.com\.tr\/[a-z-]+-ml[a-z]*\.html)"/g)) listing.add(m[1]);
}

const products = [];
for (const url of listing) {
  let html = await get(url);
  html = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<nav[\s\S]*?<\/nav>|<footer[\s\S]*?<\/footer>|<header[\s\S]*?<\/header>/g, "");
  const main = html.match(/<main[\s\S]*<\/main>/)?.[0] ?? html;
  const title = decode(html.match(/<title>(.*?)<\/title>/s)[1]).replace(/\s*-\s*Morelight.*/, "").trim();
  const body = main.split(/Benzer Ürünler/)[0];
  const images = [...new Set([...body.matchAll(/<img[^>]*?(?:data-src|src)="([^"]+wp-content\/uploads\/20(?:24|25)[^"]+)"/g)].map((m) => m[1].replace(/-\d+x\d+(\.\w+)$/, "$1")))];
  const specs = {};
  for (const m of body.replace(/<[^>]+>/g, "\n").matchAll(/^\s*([A-ZÇĞİÖŞÜ ]{4,}?)\s*:\s*(.+)$/gm)) specs[m[1].trim()] = m[2].trim();
  const text = body.replace(/<[^>]+>/g, "\n").replace(/&nbsp;/g, " ").split("\n").map((s) => s.trim()).filter(Boolean);
  const files = [];
  for (const u of images) {
    const file = `tools/data/ext-images/m/${path.basename(new URL(u).pathname).toLowerCase().replace(/[^a-z0-9.]+/g, "-")}`;
    const res = await fetch(u);
    await writeFile(new URL(`../${file}`, import.meta.url), Buffer.from(await res.arrayBuffer()));
    files.push({ file, url: u });
  }
  products.push({ url, title, specs, text, images: files });
  console.log(title, images.length);
}
await writeFile(new URL("./ext-raw/m.json", OUT), JSON.stringify({ source: "m", products }, null, 2));
