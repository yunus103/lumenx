# LUMENX: project brief

Read this first in every session. It holds the client, the agreed scope, the decisions taken so far and the plan. Update it when a decision changes.

## Client and brand

- **Client:** Frekans Elektrik Aydınlatma (Beyoğlu, İstanbul). The lead came from a Meta ad; the job was won with the 3D demo (see "Demo" below).
- **This site is the LUMENX brand**, a new, tidier brand of the same owner. It is a completely separate site from `frekanselektrikaydinlatma.com` (their WooCommerce store), which stays untouched. No redirects between them.
- **Products:** LUMENX products are manufactured by **Light Design** (`lightdesign.com.tr`), the owner's partner. Using Light Design's product photos and texts is approved; don't raise rights questions about it.
- **Buyers:** hotels, restaurants, cafés, luxury venues. They pick a body finish (with RAL code), a shade, a light colour (Kelvin), see it realistically in 3D, then send a quote request.
- **Tone from the client:** "Ağır olmasın, tık tık baksın, karar versin."
- **Contact (from the demo):** phone/WhatsApp 0552 700 02 34 (`905527000234`); address Bereketzade Mah. Okçumusa Cad. İpek Çıkmazı Sk. Alkan İş Hanı No:2 Kat:4 İç Kapı No:25, Beyoğlu / İstanbul. No verified email yet.

## Scope (from the signed offer, 27.10.2026)

- Pages: Ana Sayfa, Hakkımızda, Ürünler (catalogue filterable by category), Referanslar, Blog, İletişim.
- Product detail: photos, info, colour options; 3D model where modelled.
- Blog delivered ready for posts (no post content).
- Daily USD rate fetched automatically and used for prices.
- 3D: a realistic room (1–2 environments per product type), turn the product, change light and body colour on the model.
- **250 products, all modelled in 3D.** "Close to the photo, not identical" is in the offer.
- Admin panel (Sanity) delivered so the client can update products and prices later; we upload all products initially.
- Hosting and maintenance free for year one. Deadline: roughly end of 2026.

## Decisions (2026-11-02)

- **Routes:** `/`, `/hakkimizda`, `/urunler`, `/urunler/[kategori]`, `/urun/[slug]`, `/referanslar`, `/blog`, `/blog/[slug]`, `/iletisim`, `/studio`.
  - **Delete** the boilerplate's `/hizmetler` and `/projeler` (routes, schemas, queries, types, structure, revalidate config, webhook filter). This overrides the boilerplate's "never delete pages" rule for this project.
  - Product URLs are flat (`/urun/[slug]`) so a category change never breaks them; category pages exist for SEO ("şarjlı masa lambası").
- **Referanslar:** a page of images and videos of installations. A global switch in `siteSettings` (`referencesEnabled`, default off) hides it from navigation and makes the route return 404.
- **Prices:**
  - Each product has a **base price in USD**.
  - Shown in TL, converted with the daily rate (TCMB), labelled as a starting / quote price; the real price is negotiated.
  - **One global switch** in `siteSettings` (not per product): show TL price / show no price. Built now so a later "hide prices" request costs nothing.
- **Kelvin:** options per product, with a category default (all table lamps are 2700 K). With a single option, the existing Kelvin card shows that one value as info instead of three choices.
- **Product texts:** scraped texts get their obvious errors fixed (e.g. Light Design's Defne page says "aluminium body", it is wood) and are lightly rewritten so they don't duplicate Light Design word for word. Quick pass, not a copywriting project.
- **Products first, models later:** upload all products without 3D first, then model them one by one. A product without a model shows its photo gallery and configurator without the viewer.
- **3D data lives in code, catalogue data in Sanity:** a product has an optional `modelKey` string. Kit specs (profiles, grain, light tuning) are code in the repo, versioned in git, never edited by the client. Modelling a product = add its spec + fill `modelKey`.
- **Environment:** the existing restaurant room covers all table lamps. An outdoor kit and room are discussed once the full product list arrives; not a blocker now.
- **Quote list:** keep the demo's flow (localStorage list, sent as one prefilled WhatsApp message).
- **Webhook:** every new or removed `_type` must be reflected in `src/app/api/revalidate/route.ts`, the README's webhook filter, and the Sanity dashboard webhook (see CLAUDE.md "Adding Content Types").

## Product sources

- **Light Design (`lightdesign.com.tr`), all products.** Built on ikas (Next.js storefront).
  - `https://lightdesign.com.tr/products.xml` lists 106 product URLs, with duplicates (suffixes like `defne-sarjli-masa-lambasi-3-3`): expect ~90–100 unique products. Collections: `collections.xml`.
  - Each product page embeds `<script id="__NEXT_DATA__">` with `props.pageProps.pageSpecificData`: name, description, `variantTypes` (e.g. "Renk": Ceviz / Kayın, with thumbnail image ids), categories (with path, e.g. Şarjlı Ürünler › Şarjlı Masa Lambası) and images on `cdn.myikas.com`. No HTML parsing needed.
- **Frekans (`frekanselektrikaydinlatma.com`), some products.** WooCommerce; which ones is up to the client.
- **The rest** (to reach ~250) comes from the client's product list.
- **Import plan:** a Node script scrapes to JSON, downloads images, and imports into the single `production` dataset with `SANITY_API_WRITE_TOKEN` from `.env.local` (Editor rights; used only by scripts, never by the site). Idempotent: deterministic `_id`s from the source slug, so reruns update instead of duplicating.
- `.env.local` is tracked in git (boilerplate convention); Yunus removes it from the history before going to Vercel.

## Demo (the reference implementation)

- Local: `C:\PROJECTS\WebProject\frekans-demo` (own git history, `HANDOFF.md` there is the detailed 3D log: lighting recipe, room pipeline, dead ends). Hosted copy: `yaytech-demos` repo, `sites/lumenx/`.
- Static site, no framework: `index.html`, `css/style.css`, `js/*.js`, three.js 0.169 via importmap.
- **What carries over:**
  - Design language: `css/style.css` tokens and components (header, hero with lamp light switching, collection grid with hover-lit cards, Kelvin guide, quote drawer, footer).
  - 3D: `js/kit.js` (lamp builder and shaders), `js/kit-specs.js` (per-product specs), `js/viewer.js` (scenes, room, tone), `js/props.js` (cutlery).
  - Product configurator logic from `js/app.js`, catalogue tables from `js/data.js` (finishes `FIN`, shades `SHADE`, `RAL`, `KINFO`, specs, `kColor()`).
  - Room: `assets/room/` (`room.glb`, `room.json`, lightmaps, albedos as `-hi`/`-lo` WebP), `assets/tex/` (wood, linen, plaster), the Blender pipeline `tools/room/` (`room-src/` with the `.blend` is gitignored; backup in OneDrive `Yedek/frekans-demo/2026-10-30-room-pass2`).
  - Renders: `assets/renders/` (hero, Kelvin frames, cards, og) and the offline renderer `tools/render.html`.
- **Not to carry:** `pilot/` (stale), `assets/_snap`, `src/*.png` uploads, the hash router.
- **Design tokens (demo `:root`):** burgundy background `--ink #66142a` (`--ink-2 #561125`, `--ink-3 #4a0e1f`), text `--fg #f3eadf`, `--fg-2 #cdc2b6`, `--muted #b9aea5`, amber accent `--amber #e89d46` / `#f2b467`, wine `#63142a` / `#7a1b35`, paper band `#efe9e0` / `#e6ded2` with ink `#1e1517`, WhatsApp `#1a7f48`, radius 6px, wrap 1280px. Font: **Saira** (variable width, expanded and light for headings, echoing the wordmark). Dark site with one light paper band for the catalogue.
- **Brand assets:** `assets/brand/lumenx.svg`, `lumenx-light.svg`, `lumenx-mark.svg` (favicon).

## Porting notes

- `three` becomes an npm dependency (needs Yunus's approval when added). The viewer is a client component loaded with `next/dynamic` and `ssr: false`; the kit stays framework-free so it ports as plain modules.
- Static 3D assets (room, textures) go in `public/` with the code; product photos go to Sanity.
- The boilerplate's own section designs are placeholders; replacing them with the demo's design is expected.
- Keep the demo's performance work: one-step open with the room preloaded, `Viewer.compile()` with the composer target bound, shadows updated only after a build, touch devices get `-lo` maps and fewer samples.

## Modelling strategy

- Most products are rechargeable table lamps: turned shapes (base, body, shade or hat, top cap), so they fit the kit (`LatheGeometry` profiles + materials). Target 5–10 min per product.
- Defne is the quality bar the client approved.
- Biggest speed-up to build: a script that extracts the lathe profile automatically from a studio photo on a plain background (Defne's profile was traced by hand at 39 px/cm).
- Outdoor fittings will need a second kit and room (later).

## Plan

1. **Setup (Yunus):** repo from template (done: `yunus103/lumenx`), Sanity project + tokens in `.env.local`, Vercel project.
2. **Scraper early:** real data (variant counts, missing photos, categories) shapes the catalogue and detail designs.
3. **Design system port:** tokens into `src/styles/theme.css`, Saira via `next/font`, header, footer, Sanity-driven home page. Remove `/hizmetler` and `/projeler`.
4. **Product schema, catalogue and detail pages**, with the 3D viewer port.
5. **Other pages:** Hakkımızda, İletişim, Referanslar (switch), Blog styling, 404, KVKK / cookie text.
6. **USD rate and prices** with the global switch.
7. **Modelling in batches** (profile extraction tool first).
8. **Finish:** SEO, real-phone tests, admin panel guide for the client.

## Open questions

- The client's full product list (beyond Light Design).
- Domain for the LUMENX site.
- Verified email address for the site.
- Which Frekans products to include.
