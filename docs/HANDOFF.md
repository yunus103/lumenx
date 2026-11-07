# HANDOFF: LUMENX site (updated 2026-11-07, seventh session)

Read `docs/PROJECT.md` first (client, scope, decisions, plan). This file is the state of the work and what comes next.

## Next up

1. **Hero and Kelvin scenes: done for now, closed.** Defne frames from the real viewer (`/dev-render`, development only: `window.shot({...})` in the console; 32 samples, WebP quality .93). Revisit the product, angle or design once all products are modelled. Hero: `pos [-1.3,.22,-.45]`, `target [.05,.16,-.14]`, fov 24, `aksam`; phone: `pos [-1.42,.26,-.5]`, `target [0,.2,0]`, fov 30. Kelvin: `pos [.34,.3,1.08]`, `target [0,.13,0]`, fov 30, `gece`. Frames the code expects: hero `hero-{d,m}-{off,2700,3000,4000}.webp` (d 2400×1350, m 1080×1350), Kelvin `kelvin-{2700,3000,3500,4000,5000,6500}.webp` (1800×1180). The hero caption in Sanity names the pictured product. `og.jpg` still shows the old Avior render. Kelvin options on products stay as they are (Yunus's call).
2. **USD rate and price switch: done** (see "Prices" below).
3. **Now: modelling.** The strategy is agreed and in `docs/PROJECT.md` ("Modelling strategy"). Code-built kit, not Blender GLBs. Everything else is finished for now.
   - **Numbers (2026-11-07):** 104 products uploaded of about 250, deadline roughly the end of 2026. In the kit: `defne`, `agena`. Old demo lamps still to rebuild from zero: `avior`, `alderamin`, `capella`.
   - **Foundation done, Agena approved by Yunus** (`/urun/agena-sarjli-masa-lambasi`). The goal now is speed: go straight to the steps below.
   - **Permissions Yunus gave for this project:** browser and visual tests as many as needed, downloading or opening the datasheets, installing tool dependencies. Subagents are fine for modelling and checking in parallel, at Claude's discretion. Keep working on `main`; commit when he asks, and he normally asks after approving a stage. Still ask before a change that alters how an approved lamp looks.
   - **Next steps, in order:**
     1. **`tools/model/extract.py`:** photo to profile, plus an overlay image to check it. Rebuild it from these findings; the session's trial scripts were temporary. A threshold against the median border colour (Pillow and numpy are installed) came within about 1 mm of Defne's hand profile. It must handle white parts on the grey `#f1f1f1` background and the "TÜRK PATENT" logo at the top right. Glass needs a manual profile. Correct for the camera looking down: find the height where the base reaches full width (the base's ground plane, about 0.9 cm up on Agena), then true y = (photo y − that) × height / (photo height − that), and scale r by the same factor.
     2. **Datasheet harvest into `tools/data/`:** `product.datasheets[].url` for all 86, opened in the browser pane. On a PDF tab, import `pdfjs-dist@4.0.379` from jsdelivr, run `getDocument({data})` on a same-origin fetch, and read page 2's text for `\d+mm` and lumen. Posting the PDF to localhost from that tab failed, so bring text back as the script's return value and read drawings from a screenshot of a page-sized canvas. No `curl` with a browser's User-Agent.
     3. **Review sheet:** per lamp, photo beside day and night renders from `/dev-render` (`window.shot({model, finish, mode, pos, target, fov, size, samples, out})`, Agena front view `pos [0,.2,1.05]`, `target [0,.11,0]`, fov 17). Set `on: false` for daytime. Also a silhouette match score. Same run: upload the night image to `nightImage` and add the lamp to `tools/link-models.mjs`. Keep the Browser pane showing (`mcp__ccd_view__show_pane`), or `requestAnimationFrame` stops and the product page never opens its 3D; `window.shot` itself still works when hidden.
     4. **Five varied lamps, timed:** Mimosa, Olena, Sirius, Vita, Nigora. Report the real time per product to Yunus. Check live edges on the product page too, not only `/dev-render`.
     5. **Batches of about 12 on subagents, one spec file each:** the rest of the roughly 60 metal lamps, including the waiter-call lamps (Capella and Sirius have same-named ones, probably the same shape), and Capella rebuilt from zero. Then fabric and pleated (Avior and Alderamin from zero, then delete the `lamp` family), then glass. Yunus reviews sheets, not lamps one by one.
     6. **The ~150 new products** when the list arrives.
   - **To fix along the way:** powder coat has no micro texture (visible in the photos of matte lamps), patina (`eskitme`) is plain, white paint looks a little pink in the evening, and background copies in chrome look whitish by day. No night image for Agena yet. Its underside LED is an assumption; other lamps' photos may show the real one. Moving edges keep slight steps on purpose.
   - **Defne guard before and after touching `kit/`:** on a fresh `/dev-render`, in this order, `window.shot` with `size [1000,800]`, `samples 4`, `quality .95`: gece, ceviz, k 2700, pos `[.34,.3,1.08]`, target `[0,.13,0]`, fov 30; gunduz, kayin, k 3000, off, pos `[-.5,.25,.7]`, target `[0,.12,0]`, fov 25; aksam, ceviz, k 3000, pos `[.2,.2,.45]`, target `[0,.1,0]`, fov 25. The aksam frame must not change at all; the other two vary by up to 15 levels on their own. Frames taken after another lamp in the same page differ too, so reload first.
4. **Right before launch, not now (Yunus's call):** blog posts, KVKK and cookie review, webhook, contact form test, SEO, real-phone tests, admin panel guide, removal of the sample prices and content. Yunus does the finish photos later, with no rush.
5. **Vercel:** Yunus was going to create the project on 2026-11-05; the result isn't known here. When a deployment exists, check that `/api/usd-rate` returns a rate and `/dev-render` returns 404.

## Where things stand

Commits on `main`, pushed to GitHub; Yunus is connecting Vercel. Yunus works on one branch. On 2026-11-05 `.env.local` was removed from the whole history, which changed every commit hash and needed a force push; any other clone must be cloned again. Latest:
- Latest commit: kit with optional parts, metal, Agena, still-view averaging (see `git log`)
- `44f9023` price switch and daily TCMB rate
- `47229d5` hero and Kelvin frames from the viewer, hero text stays still
- `0c6894e` restaurant scene polish
- `frekans-demo` on `master`: `be4997f` table for two and `rebake.py`, `8305156` lamp layers

**`.env.local` is git-ignored now.** Production values go in Vercel. In the local file only the Sanity values are real: `SANITY_WEBHOOK_SECRET`, the `SMTP_*` values and `CONTACT_FORM_TO` are still the template's, so the contact form can't send and the webhook secret is the public template value until they are replaced.

Yunus reviewed the inner pages, the home page section structure, the restaurant scene, the hero and Kelvin frames and the prices, and is happy with them. `tsc` and `eslint` on the changed files are clean at the last commit; `next build` was run before the first push. A contact form test is still to come.

## Direction Yunus set (keep to these)

- **The site speaks for the brand to its customers** (hotels, restaurants, cafés): general, concrete, plain. Not about one product, not like a demo, and headings never read like a user manual ("bir renk seçin…"). If an instruction is needed, it is a small note at most.
- **Premium, but it must sell products.** Luxury through restraint, yet visibly a product brand, not a generic corporate site.
- **Burgundy is for brand moments only:** header, footer, menus, the closing band. Content sits on paper (`--paper`, `--paper-2`); dark sections use warm near-black (`--paper-ink`).
- No eyebrow labels above headings. No `·` in UI strings. No icon-card grids. No numbers or statistics strip.
- **Defne is only the current showcase** because it was the demo's model. After everything is modelled, pick a better-looking product wherever it appears.
- No 3D section or "try in 3D" button on the home page.
- The hero fills the screen at any size, with no fixed pixel height.
- When he asks whether the work so far is done, judge only what has been built. Later phases in the plan are not defects.
- Do not change things he did not ask for. **The map stays as Google delivers it**, at its current frame size; he does not care about its cookies, so do not raise it.
- Hakkımızda is plain and does not mention Frekans.
- **The lamp sells the product: its quality is non-negotiable, on every product.** No effect may touch its pixels and no optimisation may lower its detail. Optimise the room instead, and say so if the product's rendering changes.
- **The camera's maximum distance stays at 2 m** (he likes seeing the room). Zoom-to-cursor was offered and declined for now.

## What was built

**Catalogue:**
- `Catalog.tsx` filters in the browser with History API URLs. Text tabs with a sliding underline, sticky bar, expanding search, 24 cards at a time with auto-load, Turkish-aware matching in `src/lib/search.ts`.
- Header search reads a static index from `/api/search-index`.
- Cards: 5:6 frame, shimmer, optional `nightImage` with hover and light toggle (Defne, Avior, Alderamin, Capella only for now; render one per product while modelling).

**Product page:** configurator in photo mode, 3D where a model exists. The quantity field can be cleared while typing.

**Prices:**
- **Switch:** `siteSettings.priceMode`: `tl`, `usd` or `hidden`. With `hidden`, a product without a price, or no rate at all, the card shows no price and the product page shows its quote line.
- **Rate:** `/api/usd-rate` reads TCMB's USD forex selling rate from the public `today.xml`, no key needed. `Cache-Control` gives 6 hours on the CDN, background refresh, and the last good rate if TCMB fails. The route also keeps the rate in memory for 6 hours, for development, which has no CDN. It is only called in `tl` mode.
- **Why in the browser:** `PriceProvider` (inside `<main>`, `(site)/layout.tsx`) fetches once per visit and `usePrice` converts, so a new rate never regenerates pages. The line keeps its place while waiting (`.wait`). TL prices are therefore not in the HTML.
- **Display:** TL is rounded to the nearest 10; the total multiplies the rounded unit price. Label "Başlangıç fiyatı"; no VAT note for now. Card: the lowest price entered, on its own line. Product page: the head line, plus unit price and live total in the `Seçiminiz` card above the button, and the total on the phone bar's button. The chosen tier's price is used; if only the other tier has one, that one.

**Inner pages:**
- **Header and menus:** `HeaderNav.tsx` (mega menu, active only for links with `subLinks` in Studio, none entered yet), `MobileMenu.tsx` under 900 px. `--hdr` is 76 px (64 mobile). `/referanslar` links are stripped in `(site)/layout.tsx` while the switch is off.
- **PageHero:** takes its colours from the surface it sits on.
- **Hakkımızda:** plain text (`aboutPage.body`) beside the first photo of `aboutPage.featuredProduct`.
- **İletişim:** phone, e-mail and address in one plain list, WhatsApp button, underline form with KVKK consent, map iframe from `siteSettings.contactInfo.mapIframe` (an address search, so it opens at city level; replace it with the client's own embed if there is one).
- **Referanslar:** `reference` documents, `referencesPage` singleton, `MediaLightbox`. No detail pages. A file video without a poster shows its first frame; Studio requires a poster for Vimeo. Switch `siteSettings.referencesEnabled` is **off**: the route 404s and is out of nav and sitemap.
- **Blog:** paper, rows and reading layout. With no posts the page says "Henüz yazı yok". Yunus and Claude will add 5–6 posts together before launch.
- **Legal:** `legalPage` documents at `/kvkk` and `/cerez-politikasi`, linked in the footer.
- **404:** `src/components/notfound/NotFoundScene.tsx`, outside the `(site)` layout.

**Home page, in order** (`src/app/(site)/page.tsx`, inside `.home-flow`, which scopes the tighter spacing):
1. **Hero** (`Hero.tsx`): full screen, pre-rendered frames, Kelvin and level controls stay.
2. **Category cards** (`CategoryCards.tsx`): one large and two small, height follows the screen, automatic model count and names. Editable in `homePage.categoryCards` (title, category, image).
3. **Lamp spotlight** (`LampSpotlight.tsx`, `.spot-*`): names, lit lamp, details side by side within one screen. `homePage.spotlightProducts`; only products with a `nightImage`. The line under the lamp falls back to the Malzeme spec or the description while `summary` is empty.
4. **Products** (`Collection.tsx`): 4 columns, sticky tab bar only within the section. `homePage.productTabs`: Mantar, Abajurlu, Cam ve Şeffaf, Metal, 8 products each.
5. **Materials** (`MaterialStrip.tsx`, `.ms-*`): swatches from `finish` documents, a click shows up to 4 products in that finish. Self-contained: to remove, delete the component, `homeMaterialsQuery`, its fetch and JSX in `page.tsx`, the CSS block, the `MaterialFinish` type and the `materialTitle` / `materialText` fields.
6. **Kelvin guide** (`KelvinGuide.tsx`): dark, slider over six frames.
7. **References band** (`ReferencesBand.tsx`): first reference's cover, only when the switch is on. It needs a landscape cover; the two older samples are portrait.
8. **Latest posts** (`HomeBlog.tsx`): last 3, hidden when there are none.
9. **Üç adımda teklif** (`CtaBand.tsx`): the only burgundy band, steps from `homePage.ctaSteps`.

Revalidation: the home query and materials use the `home:products` tag, sent on any product, finish, shade or category save.

**Restaurant scene** (kit lamps; `src/three/scene/room.ts`, `table.ts`, `materials.ts`, `passes.ts`, `Viewer.ts`):
- **Lamp layers:** the background tables' light isn't in the mode maps. `lm-lamp-down` (pools) and `lm-lamp-up` (shade glow, half-size map on every device) are baked in white, added in the shader and follow the switch, level and Kelvin. Stored as square roots.
- **Drawing order (`FocusedRoomPass`, desktop only):** the room and the background lamps and glasses are drawn alone and blurred, then the table and product over them with normal antialiasing. Measured against no blur along one row across the shade's edge: the lamp's pixels identical, no halo. A depth of field as a post-process over the whole frame left a double contour around everything; don't go back to it. New things on the hero table are drawn sharp automatically; new things in the room's blurred part go in `roomParts`.
- **Glass:** blended, not `transmission` (that pass has no transparent objects in it, so the curtains vanished behind a glass). Reflects the probe, not the bulb. Curtains draw first (`renderOrder`).
- **Table:** 1.1 × 0.9 m centred on the lamp, two diners facing each other at the ends, where the chairs are. Other table lamps use the same place settings on their own table. The water tumbler is gone.
- **Background lamps:** `buildLamp(spec, far)` builds sparse copies. The hero lamp is full detail. The scene went from 1.42 M to about 353 k triangles.
- **Extras:** the first view settles onto the product over 1.8 s (not with reduced motion, stops on interaction); vignette and a sub-step dither on kit lamps only, no grain; other modes' maps load 3 s after the room; device pixel ratio capped at 2 on desktop, 1.5 on phones; a wine glass at every background place (`room.json` `glasses`).

**Room pipeline** (in `frekans-demo`): `blender -b room-src/room.blend --python tools/room/rebake.py`, about 10 minutes and no window needed, then `python tools/room/encode.py`, which writes the maps into `lumenx/public/3d/room`. `room.blend` is deliberately never saved: the script moves the table and chairs and thins the plants each run. It is the scripts used this session gathered into one and hasn't itself been run. The demo keeps its own older maps and `room.glb` in `assets/room`.

## Sanity state

- **Placeholders Yunus will go over:**
  - Third category card is Aplik ve Lambaderler until Armatürler exists.
  - Card photos are temporary. The large card uses the uploaded hero render.
  - Night photos are 800×1000.
- **Sample prices to remove before launch:** 46 products (home tabs and the catalogue's first 24) have `priceUsd` 65 and `premiumPriceUsd` 75, and `siteSettings.priceMode` is `tl`, only to see the calculation. Real prices come from the client.
- **Check on the first Vercel deploy:** that `/api/usd-rate` reaches TCMB from Vercel's region (only tested from Turkey; TCMB took up to 9 s here).
- **Sample content to delete before launch:** `sample-reference-restoran`, `sample-reference-otel`, `sample-reference-kafe` (plus its uploaded `sample-*` images and `sample-reference.mp4`; keep the hero render while the category card uses it), `sample-post-sarjli-masa-lambasi-restoran`, `sample-category-rehber`.
- `info@lumenx.com` is a temporary address. It is also written into the KVKK and cookie texts, so a change must be made there too.
- The live cookie policy says there are no third-party cookies; leave it unless Yunus raises it.

## For Yunus or the client

- Add `reference`, `referencesPage` and `legalPage` to the webhook filter in the Sanity dashboard (README is already updated), and check that `aboutPage`, `contactPage` and the others are there.
- KVKK and cookie texts are templates and need a legal review.
- Confirm with the client:
  - Weight: Light Design lists "1 kg" on every product (shown as "Yaklaşık 1 kg").
  - Garson Çağrı Butonu looks standalone but inherits the table-lamp spec table.
  - Plastica: the name suggests plastic, the source says aluminium/sheet steel.
  - Premium stations: the text says "aynı anda dokuz lamba" on all sizes; capacity was taken from the name.
  - "Türkiye'de üretiliyor" in `siteSettings.footerText`.
  - Finish hex and RAL values are the demo's estimates, and the home materials section shows RAL codes too.

## Pitfalls

- **`next dev` can keep serving old CSS, even without a restart.** Turbopack's cache held a stale `components.css` while the HTML was new, so new class names had no rules and a `fill` image spread over the whole page. In the sixth session it stopped picking up edits while running, and the price block looked broken. Stop it and `rm -rf .next` before starting again. To check, fetch the stylesheet from the running server and look for the new class. The server may be Yunus's own: Claude's attempt to kill one it hadn't started was refused, so ask Yunus to restart it.
- **TCMB can take 3–9 seconds to answer,** and sometimes more: keep the route's timeout generous. Send plain requests; don't try to look like a browser.
- **CSS class names are global.** A new section's class can pick up rules left by an old component: check for the name in `components.css` first.
- **GROQ:** a filter after a projection returns `null` items. Use `products[defined(@->slug.current)]->{...}`, not `products[]->{...}[defined(slug.current)]`.
- **framer-motion 12:** `useTransform(scrollValue, [range], [values])` driving opacity or scale is handed to a native ScrollTimeline that ignores the `useScroll` target and offsets. Pass a function instead.
- **Glow elements that pass the viewport** widen the page on phones and the fixed header with it. Use `overflow-x: clip` on the section; `hidden` breaks sticky.
- **three.js `compileAsync`** throws if a material it waits for is disposed. `Viewer.compile()` does its own polling for that reason; keep it.
- **`preview_stop` can leave `next dev` running** on 3000. It then holds `.next/dev/lock`. Kill the process on the port.
- **An open tab can keep showing an old room map after a rebake**, combined with the new `room.json` scale: the view gets dark and old light seems to remain. Open a new tab before judging a bake.
- **The Browser pane must be on show for the viewer.** The page waits on `requestAnimationFrame`, which stops in a hidden pane, so the scene seems stuck on "3D sahne hazırlanıyor".
- **`WebGLRenderTarget` options:** pass no `depthTexture` rather than `undefined`: `undefined` crashes `clone()` in `EffectComposer`. Test the phone path (`coarse`) too; a mobile preset set before a reload does it.
- **Browser and visual checks are allowed in this project without asking** (2026-11-07). Screenshots Yunus sends of full pages can show lazy images as empty.
- **`/dev-render` frames hide aliasing.** They average many samples, so judge edges on the real product page, or take a `samples: 1` shot for what a moving view shows. MSAA resolves before exposure and the knee, so 2x resolution with 8x MSAA still showed the same steps on a metal edge. Metal and painted bodies are therefore limited to 1.2 × white before the resolve (`brightnessLimited`), which leaves slight steps while moving. Once the view is still, `Viewer.refine` averages 16 shifted frames (8 on phones) after tone mapping, then draws nothing more. The camera's glide is cut below 40 px/s (`GLIDE_END`), since it took most of the wait: a hard flick went from 1.7 s to 0.75 s until sharp.
- **Reflection panels on metal lamps** (`Viewer.reflectionCards`) exist only in the probe capture and stop just over the horizon. Higher, they turn flat tops white. Three's `anisotropy` was tried for spun plating and made the metal look like plastic, with radial streaks on the base; don't go back to it.

## Running it locally

```bash
rm -rf .next
npm run dev
```

Every Sanity fetch is cached until the webhook invalidates its tags, and the webhook is not set up yet. Without restarting, a signed local webhook clears a cache; change `_type` as needed (`productCategory` for products, `navigation` or `siteSettings` for the layout, `homePage`, `aboutPage`, `contactPage`):

```bash
node --no-warnings --env-file=.env.local -e "const{encodeSignatureHeader}=require('@sanity/webhook');(async()=>{const body=JSON.stringify({_type:'productCategory',operation:'update'});const sig=await encodeSignatureHeader(body,Date.now(),process.env.SANITY_WEBHOOK_SECRET);const r=await fetch('http://localhost:3000/api/revalidate',{method:'POST',headers:{'content-type':'application/json','sanity-webhook-signature':sig},body});console.log(r.status)})()"
```

Scripts (all `node --no-warnings --env-file=.env.local tools/<script>`): `scrape-lightdesign.mjs`, `import-lightdesign.mjs [--dry] [--overwrite]`, `link-models.mjs`, `seed-content.mjs`, `apply-copy.mjs [--dry]`. After `import-lightdesign.mjs --overwrite`, rerun `link-models.mjs` and `apply-copy.mjs`. `seed-about-contact.mjs` matches the schema but was not run; `aboutPage`, `contactPage` and `homePage` were patched directly.

## Smaller leftovers

- Missing finish photos (Yunus generates them with AI).
- Kelvin options on products follow the category default (single 2700 K).
- `.catalog .sec-head h1` in `components.css` is unused.
- Restaurant scene: the armature (luminaire) scene wasn't checked after the viewer changes, as no product page opens it. Tiny glints beside a glass's foot on the table at some angles, and a small bright fleck on a plant leaf by day seen from very close, were left alone.
- `frekans-demo/room-src/lm/pre-split/` (about 200 MB, gitignored) is an old bake backup; it can be deleted.

## 3D: notes for the architecture review

To go through when the modelling discussion starts, since the refactor target (metal kit lamps) depends on it.

1. **Viewer and scene builders are coupled.** Scene functions write into the viewer's public mutable fields. Cleaner: each family implements `build(ctx) → { lights, emitters, reflectors, probe, camera, applyState(s) }`, the viewer only orchestrates.
2. **Three lamp code paths.** Kit lamps are data-driven; Avior, Alderamin, Capella are hard-coded with older lighting. Keep as legacy until remodelled, or convert to kit specs.
3. **Done:** the kit takes optional parts and metal or painted bodies.
4. **One room, one family.** The restaurant room is tied to `family === "kit"`; it should be a property of the model or category.
5. **3D params keyed by finish slug in code** (`src/three/finishes.ts`). Renaming a slug in Studio silently falls back. Store params on the `finish` doc, or validate slugs at build time.
6. **State diffing** via `JSON.stringify(state)`; an explicit `visualKey` would be clearer if state grows.
7. **Unused:** luminaire family, `hero`/`card` scene variants.
8. **No render regression check.** A dev-only snapshot page like the demo's `tools/viewer-test.html` would make refactors checkable.

Decided 2026-11-07: no Viewer refactor unless it actually slows the work. (2) goes away as the old lamps are rebuilt from zero. Add a simple night render per product to the modelling routine (for the cards' light toggle and the home spotlight).

`three@0.169.0` stays pinned exactly (the kit patches shader chunks by string).
