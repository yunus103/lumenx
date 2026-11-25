// Scrapes the outdoor-fitting shop: listing pages -> product pages -> raw text + images.
// Output: tools/data/ext-raw/b.json and tools/data/ext-images/b/. Curated data lives in tools/data/ext/b.json.
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const BASE = "https://www.bollardaydinlatma.com";
const LISTS = ["direkler", "bollard", "aplik", "set-ustu"];
const OUT = new URL("./data/", import.meta.url);
const IMG = new URL("./ext-images/b/", OUT);
await mkdir(IMG, { recursive: true });
await mkdir(new URL("./ext-raw/", OUT), { recursive: true });

const get = async (u) => (await fetch(u.startsWith("http") ? u : BASE + u)).text();
const text = (h) =>
  h.replace(/<(script|style)[\s\S]*?<\/\1>/g, "").replace(/<\/(p|div|tr|li|h\d|br)>|<br\s*\/?>/g, "\n")
    .replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/[ \t]+/g, " ").replace(/\n\s*\n+/g, "\n").trim();

const urls = new Map();
for (const l of LISTS) {
  const h = await get(`/kategori/${l}`);
  for (const m of h.matchAll(/href="(\/urun\/[^"]+)"/g)) (urls.get(m[1]) ?? urls.set(m[1], []).get(m[1])).push(l);
}
const products = [];
for (const [url, lists] of urls) {
  let h = await get(url);
  for (let t = 0; t < 4 && !/data-zoom-image=/.test(h); t++) {
    await new Promise((r) => setTimeout(r, 1500));
    h = await get(url);
  }
  const title = (h.match(/<title>([^<]*)/)?.[1] ?? "").replace("{urun_fiyat}", "").trim();
  const detail = h.match(/<div class="product-detail">([\s\S]*?)<div class="col-12" data-tab-content="2">/)?.[1] ?? "";
  const imgs = [...new Set([...h.matchAll(/data-zoom-image="([^"]+)"/g)].map((m) => m[1].split("?")[0]))];
  const files = [];
  for (const [i, src] of imgs.entries()) {
    const full = "https:" + src;
    const name = `${String(products.length).padStart(2, "0")}-${i + 1}${src.match(/\.\w+$/)?.[0] ?? ".jpg"}`;
    const buf = Buffer.from(await (await fetch(full)).arrayBuffer());
    await writeFile(new URL(name, IMG), buf);
    files.push({ file: `tools/data/ext-images/b/${name}`, url: full });
  }
  products.push({ url: BASE + url, lists, title, text: text(detail), images: files });
}
// The Alaçatı heated-pole page only has a poster with the shop logo on top; keep just its photo area.
await sharp(fileURLToPath(new URL("./20-1.png", IMG))).extract({ left: 0, top: 220, width: 405, height: 900 }).jpeg({ quality: 92 }).toFile(fileURLToPath(new URL("./20-crop.jpg", IMG)));
await sharp(fileURLToPath(new URL("./19-1.png", IMG))).extract({ left: 0, top: 230, width: 390, height: 920 }).jpeg({ quality: 92 }).toFile(fileURLToPath(new URL("./19-crop.jpg", IMG)));
await writeFile(new URL("./ext-raw/b.json", OUT), JSON.stringify(products, null, 1));
console.log(products.length, "pages");
