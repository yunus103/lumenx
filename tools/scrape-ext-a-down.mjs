// Scrapes the downlight / retail / overplast pages of source "a" into tools/data/ext-raw/a-down.json
// and downloads gallery images and datasheet text. Re-runnable (existing images are kept).
// Usage: node --no-warnings tools/scrape-ext-a-down.mjs
import { writeFile, mkdir, access } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import path from "node:path";

const BASE = "https://abalighting.com";
const LISTINGS = [
  "/tr/urunler/downlight/cob-downlight",
  "/tr/urunler/downlight/smd-downlight",
  "/tr/urunler/retail/retail",
  "/tr/urunler/retail/architectural",
  "/tr/urunler/overplast/led",
];
const ROOT = new URL("./data/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const IMG_DIR = path.join(ROOT, "ext-images/a-down");
await mkdir(IMG_DIR, { recursive: true });

const get = async (u) => {
  const r = await fetch(u);
  if (!r.ok) throw new Error(`${r.status} ${u}`);
  return r;
};
const text = (h) =>
  h.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<br\s*\/?>/g, " ").replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
const exists = (f) => access(f).then(() => true, () => false);

const pdfCache = new Map();
async function pdfText(url) {
  if (pdfCache.has(url)) return pdfCache.get(url);
  const buf = Buffer.from(await (await get(BASE + url)).arrayBuffer());
  const f = path.join(tmpdir(), `a-down-${pdfCache.size}.pdf`);
  await writeFile(f, buf);
  let t = "";
  try { t = execFileSync("pdftotext", ["-layout", "-enc", "UTF-8", f, "-"], { encoding: "utf8" }); } catch { /* no text */ }
  pdfCache.set(url, t);
  return t;
}

const products = [];
for (const l of LISTINGS) {
  const html = await (await get(BASE + l)).text();
  const links = [...new Set([...html.matchAll(new RegExp(`href="(${l}/[^"]+)"`, "g"))].map((m) => m[1]))];
  console.log(l, links.length);
  for (const href of links) {
    const h = await (await get(BASE + href)).text();
    const title = text((h.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) ?? h.match(/<h[2-5][^>]*>\s*([^<]*?(?:Downlight|Spot|Panel)[^<]*)<\/h/i) ?? [])[1] ?? "");
    const titleTag = text((h.match(/<title>([\s\S]*?)<\/title>/) ?? [])[1] ?? "");
    const fields = {};
    for (const m of h.matchAll(/<strong class="color-danger text-uppercase">([^<]+)<\/strong>\s*<br\/?>([\s\S]*?)<\/li>/g)) fields[text(m[1])] = text(m[2]);
    const table = {};
    for (const m of h.matchAll(/<td><strong>([^<]+?):\s*<\/strong>([\s\S]*?)<\/td>/g)) {
      const v = text(m[2]);
      if (v && v !== "-") table[text(m[1])] = v;
    }
    const desc = text((h.match(/id="technic"[\s\S]*?<div class="container[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<div class="tab-pane/) ?? [])[1] ?? "");
    const sliderPart = h.split('class="slider-container')[1]?.split('<div class="tab-pane')[0] ?? "";
    const imgUrls = [...new Set([...sliderPart.matchAll(/src="([^"]*\/storage\/products\/[^"]+)"/g)].map((m) => m[1].replace("//storage", "/storage")))];
    const pdfs = [...new Set([...h.matchAll(/href="(\/storage\/products\/[^"]+\.pdf)"/g)].map((m) => m[1]))];
    const crumbs = [...h.matchAll(/href="\/tr\/urunler\/[^"]*">([^<]*)</g)].map((m) => m[1]).slice(-3);
    const images = [];
    for (const u of imgUrls) {
      const name = u.split("/").pop();
      const file = path.join(IMG_DIR, name);
      if (!(await exists(file))) await writeFile(file, Buffer.from(await (await get(u.startsWith("http") ? u : BASE + u)).arrayBuffer()));
      images.push({ file: `tools/data/ext-images/a-down/${name}`, url: u });
    }
    const datasheets = [];
    for (const p of pdfs) datasheets.push({ url: p, text: await pdfText(p) });
    products.push({ href, listing: l, title: title || titleTag, titleTag, fields, table, desc, images, datasheets: datasheets.map((d) => ({ url: d.url, text: d.text })) });
  }
}
await mkdir(path.join(ROOT, "ext-raw"), { recursive: true });
await writeFile(path.join(ROOT, "ext-raw/a-down.json"), JSON.stringify({ products }, null, 1));
console.log("pages", products.length);
