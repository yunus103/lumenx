# HANDOFF: LUMENX site (updated 2026-11-13, ninth session)

Read `docs/PROJECT.md` first (client, scope, decisions, plan). This file is the state of the work and what comes next.

## Next up

1. **Hero and Kelvin scenes: done for now, closed.** Defne frames from the real viewer (`/dev-render`, development only: `window.shot({...})` in the console; 32 samples, WebP quality .93). Revisit the product, angle or design once all products are modelled. Hero: `pos [-1.3,.22,-.45]`, `target [.05,.16,-.14]`, fov 24, `aksam`; phone: `pos [-1.42,.26,-.5]`, `target [0,.2,0]`, fov 30. Kelvin: `pos [.34,.3,1.08]`, `target [0,.13,0]`, fov 30, `gece`. Frames the code expects: hero `hero-{d,m}-{off,2700,3000,4000}.webp` (d 2400×1350, m 1080×1350), Kelvin `kelvin-{2700,3000,3500,4000,5000,6500}.webp` (1800×1180). The hero caption in Sanity names the pictured product. `og.jpg` still shows the old Avior render. Kelvin options on products stay as they are (Yunus's call).
2. **USD rate and price switch: done** (see "Prices" below).
3. **Now: modelling.** Strategy in `docs/PROJECT.md` ("Modelling strategy"): code-built kit, not Blender GLBs.
   - **How:** run `/model-lamps` (project skill, `.claude/skills/model-lamps/`): it takes the next batch (default 6) from its `queue.md`, models each lamp with its own agent, links them with night images, pushes, and tells Yunus what to check. The procedure, tools, brief and lessons live there; this file keeps the state.
   - **Numbers (2026-11-13):** 104 products uploaded of about 250, deadline roughly the end of 2026. 53 lamps are in the kit (table below), 43 in the queue (3 of them lanterns, which need their own parts), then the ~150 new products when the list arrives.
   - **Permissions Yunus gave:** browser and visual tests, opening the datasheets, tool dependencies, subagents at Claude's discretion. For modelling batches: no questions, push at the end, kit changes allowed as long as the Defne guard proves approved lamps unchanged. Work on `main`.
   - **To fix along the way:** white paint looks a little pink in the evening (now on Orben, Verona, Suma, Bene: worth a look); background copies in chrome look whitish by day; Agena's underside LED is an assumption. Moving edges keep slight steps on purpose.
4. **Right before launch, not now (Yunus's call):** blog posts, KVKK and cookie review, webhook, contact form test, SEO, real-phone tests, admin panel guide, removal of the sample prices and content. Yunus does the finish photos later, with no rush.
5. **Vercel:** Yunus was going to create the project on 2026-11-05; the result isn't known here. When a deployment exists, check that `/api/usd-rate` returns a rate and `/dev-render` returns 404.

## Modelled lamps

Kit lamps are reviewed, linked in Sanity (`tools/link-models.mjs`) and have a night card image unless noted. "Finish" is the one the photo shows, used for the review and the night image. Update this table with every batch.

| Key | Sanity slug | Finish | Notes |
| --- | --- | --- | --- |
| defne | defne-sarjli-masa-lambasi | ceviz | wood, keten shade; the guard lamp |
| agena | agena-sarjli-masa-lambasi | bronz | approved by Yunus |
| mimosa | mimosa-sarjli-masa-lambasi | bronz | stem glow (`hat.led.wash`) |
| olena | olena-sarjli-masa-lambasi | beyaz | |
| sirius | sirius-sarjli-masa-lambasi | bronz | stem glow; Sirius garson needs its own spec |
| vita | vita-sarjli-masa-lambasi | gold | |
| nigora | nigora-sarjli-masa-lambasi | eskitme | |
| baro | baro-sarjli-masa-lambasi | eskitme | white opal band under the hat via `hat.opal` (2026-11-08) |
| capella | capella-sarjli-masa-lambasi | bronz | rebuilt from zero |
| diya | diya-sarjli-masa-lambasi | gold | brushed hat missing (kit) |
| fuga | fuga-sarjli-masa-lambasi | siyah | |
| gemini | gemini-sarjli-masa-lambasi | eskitme | patina streaks missing (kit) |
| meissa | meissa-sarjli-masa-lambasi | eskitme | photo tilted, fit judged by eye |
| mensa | mensa-sarjli-masa-lambasi | eskitme | photo is two-tone (brass stem, glossy taupe body), kit gap |
| mila | mila-sarjli-masa-lambasi | bronz | fitted on the `mila-rozze-bronze` photo (`--photo a9fa5739`) |
| pandora | pandora-sarjli-masa-lambasi | eskitme | photo is warm brown satin paint, no matching finish listed |
| rena | rena-sarjli-masa-lambasi | siyah | photo pitched down; `--cam-height 44`, score 1.4 mm is perspective |
| sani | sani-sarjli-masa-lambasi | satine-nikel | `--under` |
| tole | tole-sarjli-masa-lambasi | gold | height 24.75 cm from photo proportions (datasheet 126 mm is wrong) |
| aldebaran | aldebaran-sarjli-masa-lambasi | gold | hat Ø222 from photo vs datasheet 215 (client) |
| aro | aro-sarjli-masa-lambasi | gold | hat Ø120 from photo vs datasheet 115 (client) |
| casares | casares-sarjli-masa-lambasi | krom | Premium body, fitted on `--photo f2c581d5`; knurled grip via `body.knurl` (kit, measured pitch 1.67 mm, 30°) |
| esna | esna-sarjli-masa-lambasi | siyah | one photo only; the other six finishes unchecked |
| evora | evora-sarjli-masa-lambasi | beyaz | `--under`; hat Ø127 photo vs 130 datasheet (client); chrome finial renders in body finish (kit); `evora-krom` photo looks like satin nickel |
| geminga | geminga-sarjli-masa-lambasi | bronz | `--slug geminga-sarjli-masa-lambasi-1 --under` (upload by Sanity slug) |
| heli | heli-sarjli-masa-lambasi | rose | `--under`; hat Ø131 and drawing ratio vs datasheet 120×280 (client) |
| hint | hint-sarjli-masa-lambasi | siyah | photo is the Uzun variant, height 230 mm derived (datasheet 175 is Kısa; client); photo dark olive, between siyah and eskitme |
| konra | konra-sarjli-masa-lambasi | beyaz | hat Ø111 from photo vs 130 datasheet (client); Mermer option not renderable (kit) |
| ezop | ezop-sarjli-masa-lambasi | rose | `--cam-height 40`; octagonal drum (`body.facets`), real corners probably softer; hat reviewed and fixed |
| karo | karo-sarjli-masa-lambasi | gold | `--cam-height 39.5`; opal drum (`shade.opal`); hat Ø186 photo vs 170 datasheet (client); upper hat cone up to ~7 mm narrower than the photo, judged by eye |
| melma | melma-sarjli-masa-lambasi | rose | octagonal hat (`hat.facets`); rubber foot is a cylinder, the photo's tapers (kit) |
| merle | merle-sarjli-masa-lambasi | siyah | `--cam-height 31.5`; white slot as `hat.opal` band, light exit guessed (no night photo); hat Ø183 photo vs 175 datasheet (client) |
| mira | mira-sarjli-masa-lambasi | bronz | photo is glossy red-brown paint, no listed finish matches (client); hat Ø113.5 photo vs 120 datasheet (client) |
| mirach | mirach-sarjli-masa-lambasi | gold | `--under`; photo brass darker/more mirror-like than gold; hat reads slightly bell-shaped vs the photo's hemisphere; datasheet "50mm" unexplained (client) |
| mona | mona-sarjli-masa-lambasi | eskitme | photo is dark warm brown-grey satin paint, nearest listed is eskitme (client, like Pandora) |
| mula | mula-sarjli-masa-lambasi | bronz | re-extracted `--y0 24 --split 8.6` to include the foot; hat Ø111 photo vs 120 datasheet |
| neptun | neptun-sarjli-masa-lambasi | gold | base Ø91 photo vs 100 datasheet (client) |
| orben | orben-sarjli-masa-lambasi | beyaz | one photo only; white hat reads pinkish in the evening (known white-paint issue) |
| oxford | oxford-sarjli-masa-lambasi | beyaz | `--photo a4adac08 --cam-height 15`; white photo looks retouched (straight hat edge vs elliptic foot), mean 0.74 mm judged by eye; Mermer variant looks like another body (client), not renderable (marble kit gap) |
| polaris | polaris-sarjli-masa-lambasi | siyah | `--under`; photo is dark bottle-green satin, no listed finish matches (client); hat is a cone, not a dome |
| rigel | rigel-sarjli-masa-lambasi | gold | `--photo 9f2b781a` (gold photo; default is `gumus`); hat is a cone, not a dome |
| suma | suma-sarjli-masa-lambasi | beyaz | `--cam-height 18.5`; re-extracted `--y0 18`; the studio photo's base sits 2.5 mm off the hat's axis, so the score (0.58 mm) overstates the error; rounded foot (`foot.round`) |
| toledo | toledo-sarjli-masa-lambasi | siyah | `--photo 4a6d08a1 --cam-height 21.5`; a tall bell, not a dome on a cylinder; five finish photos are ~3.5% squatter (resized?); the `toledo-siyah` photo is the grey (`gri`, no 3D value yet) |
| torino | torino-sarjli-masa-lambasi | gold | one photo; dome on a cone over a drum; brushed (`brush 0.5`); hat Ø125.5 vs datasheet 135 (client) |
| vela | vela-sarjli-masa-lambasi | eskitme | one photo; brushed antique brass via `antique` (eskitme stays paint elsewhere); hat Ø132 vs 120 (client) |
| verona | verona-sarjli-masa-lambasi | beyaz | `--cam-height 13.7`; fit photo is a sage-green render (no such finish); chrome and white touch key (button `ring`/`centre`); its lifestyle photos are Flos Bellhop; hat Ø141 vs 120 (client) |
| zamora | zamora-sarjli-masa-lambasi | satine-nikel | `--slug zamora-sarjli-masa-lambasi-1 --photo c3233e52 --cam-height 23.5` (upload by Sanity slug); chrome ball finial (`hat.fixed krom`); LED under the hat guessed, no night photo; kirmizi, fistik-yesil, gokyuzu-mavisi, krem fall back to swatch paint |
| bene | bene-sarjli-masa-lambasi | gold | `--cam-height 10`; glossy white dome as `hat.fixed beyaz rough 0.06`; the sheet's 3.1 mm is white-on-white (0.11 mm against the datasheet cover); only a gold photo, so the white dome on other finishes is unconfirmed (client) |
| nade | nade-sarjli-masa-lambasi | siyah | `--cam-height 32`; smooth opal bowl (`hat.opal` profile), the queue's "steps" were JPEG blocks; the sheet's 1.0 mm is white-on-white (0.16 mm on the datasheet's grey copy) |
| bella | bella-sarjli-masa-lambasi | siyah | `--cam-height 47.5`; re-extracted `--height 39 --y0 36`; max 4.5 mm is an extractor notch; the white hat interior in the night photo isn't renderable (kit gap) |
| carina | carina-sarjli-masa-lambasi | gold | opal bell (`shade.profile`), finial follows the finish (`topButton.finish body`, `shape`); alabaster veining missing (texture gap, like Konra); bell Ø~107 (gold photos) vs ~100 (others, datasheet) (client) |
| furud | furud-sarjli-masa-lambasi | rose | `--cam-height 48`; re-extracted `--height 34`; clear glass tube (`glass`) with an opal candle (`opal`); night look guessed (no night photo); the score band at 7.5–12.5 cm is the tool missing the faint glass edge |
| kuma | kuma-sarjli-masa-lambasi | rose | `--cam-height 28.5`; re-extracted `--height 30 --image c1766ff2 --y0 46`; brushed; the radial highlight on the lid's top isn't renderable; hat Ø115 vs 130 (client) |

Kit features added on demand: `body.knurl` (knurled grip, Casares), `body.facets`/`hat.facets` (N-sided parts, Melma, Ezop), `shade.opal` and `hat.opal` (opal diffuser, Karo, Baro). `extract.py` trims compression halo from silhouettes (scores of lamps fitted before shift up to ~2%). Added 2026-11-13, all opt-in, the Defne guard passed each time: `body.fixed`/`hat.fixed` (zones in a fixed finish, optional `rough`; Zamora and Evora finials, Bene's dome), button `ring`/`centre` (Verona), `foot.rBottom`/`round` (Suma, Melma, Bella), `shade.profile` and `hat.opal.profile` (opal parts of any shape; Carina, Nade), top-level `opal` and `glass` (Furud), `topButton.finish`/`shape` (Carina), `body.brush`/`hat.brush` (Torino, Diya, Kuma, Bene) and `antique` (brushed antique brass for one finish; Vela, Gemini). How to use them is in the model-lamps brief. Open kit gaps: the table below. Tiny grooves need every point marked as a corner, since `profileRuns` spaces points by run length.

**Yunus's feedback, to fix later (2026-11-09):**
- **Geminga base top:** in the photo the drum's top is a plain dome that rounds over into the wall and the neck, no visible crease. Ours reads as a flat-topped drum with a concave, outward-flaring neck on it, and a fold line where they meet (visible in the 3/4 and day renders). The silhouette fit is fine (0.19 mm), so it's the 3D reading: soften the shoulder and the neck join into one convex dome.
- **Konra texture:** the white body and hat show none of the product's texture. The real one is white with thin black hand-drawn marble veins over hat and body (Yunus's photo, 2026-11-09). Same gap as "marble body" below; needs a vein texture, not plain paint.

**Product-specific details not yet in the kit** (kept as a list so they can become kit features if more lamps need them; rule: add to the kit when a lamp looks clearly wrong without it or it shows up on two lamps):

| Missing | Lamp | What it shows now |
| --- | --- | --- |
| Marble / alabaster veining | Konra, Oxford, Carina | plain paint or plain opal; now on three lamps, the next texture job (with Yunus's Konra feedback) |
| Two-tone stem | Mensa | one colour; `body.fixed` can do it once the client confirms the brass stem |
| White hat interior | Bella | the hat's inside is one finish; the night photo shows it cream |
| Radial highlight on spun flat discs | Kuma | the lid top reads plain (needs anisotropy, which was ruled out) |
| Ribbed clear glass | Dulcet, Mariner, Regulus Cam (upcoming) | `glass` is smooth |

Still on the first-generation `lamp` family, to rebuild: avior, alderamin. Luminaires (`kare`, `altigen`) are separate.

## Modelling decisions

- **Finishes are calibrated against the product photos** (`src/three/finishes.ts`): `bronz` `#966B55` polished copper-bronze metal; `gold` `#DFD898` pale lemon brass (Agena, Sirius, Evora, Pollux photos are warmer); `eskitme` `#8C8973`, metal 0.45, a satin olive taupe, which must stay at metal 0.5 or below or `build.ts` lights it as metal and it shines gold at night. Sanity swatch hexes are unchanged.
- **The datasheets' colour block is a template** (the same 8 colours in all 155 sheets, even Alderamin), so it says nothing about a product's real finishes; Sanity's lists come from the shop.
- **Kit:** `hat.led.wash` (opt-in) lights the body under the hat at night (Mimosa, Sirius). A powder-coat texture was tried and reverted: invisible at a scale that doesn't shimmer, hammered-looking above it.
- **Revalidate locally** with a signed body: see `.claude/skills/model-lamps/night.md`.
- **Open, next:**
  1. **Kit gaps, add when a lamp needs them:** the table under "Modelled lamps"; powder grit.
  2. **Finish questions for the client:** Pandora's warm brown paint and Mensa's glossy taupe aren't any listed finish; the datasheet's Bronz swatch is dark brown while the bronz photos show copper-bronze metal.
  3. **Sirius garson** has a different shape (a call-button cap, a deeper dome, a convex collar) and needs its own spec. Its top would need `topButton` on hat lamps.
  4. **`gri` has no 3D value** (Toledo, Bilham): it falls back to its swatch `#8B8C88` as paint; the Toledo grey photo is warmer. Calibrate it when a grey lamp is reviewed.

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
- **Client questions** (the one list; Yunus asks them in one go. Every modelling batch adds its questions here; remove a line once answered):
  - General:
    - Weight: Light Design lists "1 kg" on every product (shown as "Yaklaşık 1 kg").
    - Garson Çağrı Butonu looks standalone but inherits the table-lamp spec table.
    - Plastica: the name suggests plastic, the source says aluminium/sheet steel.
    - Premium stations: the text says "aynı anda dokuz lamba" on all sizes; capacity was taken from the name.
    - "Türkiye'de üretiliyor" in `siteSettings.footerText`.
    - Finish hex and RAL values are the demo's estimates, and the home materials section shows RAL codes too.
    - Datasheets: most give "100mm Alt" for the base, which rarely matches the photo (Mona ~96, Mirach ~94, Mula 85, Neptun 91, Bene ~78, Vela 110, Furud ~121). Is it a template value? Real base diameters per product?
    - Photos: Verona's four lifestyle photos on Light Design are the Flos Bellhop (another brand's product). Several photo file names don't match their colour (Toledo, Carina; Kuma's eskitme variant is the rose photo).
    - Lanterns: Azha, Bilham and Enif are frame lanterns with a candle; they need their own parts and stay in photo mode for now.
  - Colours (photo shows a colour no listed finish matches, or a doubtful one; the model uses the nearest):
    - Mira: glossy red-brown paint (modelled bronz).
    - Mona: dark warm brown-grey satin paint (modelled eskitme).
    - Pandora: warm brown satin paint (modelled eskitme).
    - Hint: dark olive, between siyah and eskitme (modelled siyah).
    - Mirach: darker, more mirror-like brass than our gold; is it gold?
    - Melma: is the only photo rose or bronz? The datasheet's bronze render is much darker.
    - Evora: the `evora-krom` photo looks like satin nickel; which is it?
    - Polaris: dark bottle-green satin paint (modelled siyah).
    - Rigel: the `gumus` photo looks like satin nickel; is gümüş = satine-nikel?
    - Oxford: the Mermer photo has a thicker hat and a wider neck than the white one; is it the same body?
    - Mensa: photo is two-tone (brass stem, glossy taupe body); is that a standard option?
    - Verona: the main photo is sage green; is there a green finish? (modelled beyaz, which the other photos show)
    - Vela: the photo is brushed antique brass; is that this lamp's "eskitme"? (modelled so)
    - Bene: does the dome stay white on every finish, and is it painted metal or opal (an opal dome would glow at night)?
    - Nade: do the other finishes keep the white bowl?
    - Evora: the chrome finial is modelled on every finish, but the gold photo shows a gold one.
    - Zamora: the krem photo has a thinner stem; is it the same model?
    - Toledo: the chrome photo shows a different stem fitting at the base (a nut and a cone) from the other six.
  - Dimensions (photo vs datasheet; the models follow the photos):
    - Hat diameters: Aldebaran Ø222 vs 215, Aro Ø120 vs 115, Evora Ø127 vs 130, Heli Ø131 vs 120, Karo Ø186 vs 170, Konra Ø111 vs 130, Merle Ø183 vs 175, Mira Ø113.5 vs 120, Mula Ø111 vs 120, Verona Ø141 vs 120, Zamora Ø138 vs 130, Torino Ø125.5 vs 135, Vela Ø132 vs 120, Kuma Ø115 vs 130, Bene Ø106 vs 115, Bella Ø215 vs 200 (top Ø130 vs 120).
    - Torino: is the 160 mm height with or without the knob? Is the black base a separate rubber foot?
    - Carina: bell Ø~107 (gold photos) or ~100 (chrome, rose, satin photos and datasheet)? The datasheet shows an older version.
    - Furud: datasheet Ø40 tube and Ø110 base vs ~35 and ~121 in the photos and drawing.
    - Bella: LED housing under the hat Ø116 in the night photo vs ~60 in the drawing.
    - Hint: the photo is the Uzun variant; its height (modelled 230 mm) is unknown, the datasheet is the Kısa (175 mm).
    - Tole: datasheet height 126 mm; photo proportions give 247.5 mm.
    - Mirach and Polaris: what is the datasheet's "50mm"? Matches nothing on either lamp.
    - Heli: drawing ratio disagrees with the datasheet's 120×280.

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
