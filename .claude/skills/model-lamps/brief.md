# Kit lamp modelling brief

Project: the repository root (Next.js 16 + Sanity v5, three.js 0.169 "kit" lamps built from turned profiles). Yunus approved this work in advance. Do not ask questions, do not commit or push. Report in English.

## Read first (only these)
- `src/three/kit/specs/index.ts`: the KitSpec types. Profiles are `[r, y, corner?]` in cm.
- Two finished specs as examples: `src/three/kit/specs/agena.ts` and `src/three/kit/specs/vita.ts`. If `docs/HANDOFF.md` "Modelled lamps" lists a lamp shaped like yours, read its spec too.

## Your job: one lamp, from photos to a fitted spec

### 1. Know the product
The model is only as good as what you know about it. Lamp quality is non-negotiable.
- **Photos.** Every one: the Sanity gallery and variant photos (query `*[_type=="product" && slug.current==$slug]`, client setup as in `tools/upload-night.mjs`, run with `node --env-file=.env.local`) and the Light Design photos `tools/model/review.py` finds (`find_product`). Look at every angle, the night photos and close-ups. Find every step, groove, seam, collar, the switch or button, the foot ring and the LED disc under the hat.
- **Dimensions, most to least reliable:**
  1. The datasheet height (`tools/data/datasheets.json` → `products[<ld-slug>]`).
  2. The photo proportions.
  3. Figures on the Light Design product page (the product's `source.url`, e.g. "Üst Kafa 100mm, Alt 80mm").
  4. The drawing on the datasheet PDF. Use it when the text is missing or doubtful; its text often carries template values (Ø120/Ø100, a "100mm Alt" on every sheet, height and width swapped). Never download it: Cloudflare blocks scripted downloads. Read it in the browser pane: open the PDF URL (`products[<ld-slug>][].url`) in your own tab on arstar.com.tr. In that tab, `import("https://cdn.jsdelivr.net/npm/pdfjs-dist@4.0.379/build/pdf.min.mjs")`, set `GlobalWorkerOptions.workerSrc` to the matching `pdf.worker.min.mjs`. `fetch` the PDF (same origin) and `getDocument({data})`. Render page 2 to a canvas the size of the page, put it in the document, then take a screenshot and read the drawing's dimension lines.
  5. Similar products and their specs, for parts no source shows.
- **Never invent detail that contradicts a photo.** When a part is hidden (usually the hat's underside), copy the closest finished lamp and say so.
- **The extracted profile:** `tools/model/out/<ld-slug>.json` and `-overlay.png`. Re-run `python tools/model/extract.py <ld-slug> --height <cm> [--image id] [--split y] [--y0 px]` if the overlay looks wrong.

### 2. Write `src/three/kit/specs/<key>.ts`
- The coordinator has already registered it in `src/three/models.ts`.
- Do not edit `models.ts`, `tools/link-models.mjs`, shared kit code (`src/three/kit/*.ts`) or `src/three/finishes.ts`.
- If the lamp needs something the kit can't do, approximate it sensibly and report it as a kit gap.

### 3. Fit it
- Run `python tools/model/review.py <key> shots --slug <sanity-slug> --finish <f> [--under] [--cam-height cm] [--photo id]`. It prints `window.shot(...)` calls.
- Open your OWN tab: `mcp__Claude_Browser__tabs_create`, then navigate to `http://localhost:3000/dev-render`.
- Before every run, reload fresh and wait until `window.shot` exists. Then run the calls with `mcp__Claude_Browser__javascript_tool`, awaiting each.
- Run `python tools/model/review.py <key> sheet` with the same arguments. It writes `tools/model/out/<key>-sheet.webp` with the profile difference in mm.
- Other agents work in other tabs at the same time. Never touch, reload or close their tabs.
- If the tab sits in the background, `requestAnimationFrame` stops. `window.shot` still works, but a product page won't mount its 3D until the tab is fronted.

### 4. Iterate
Keep going until the sheet and magnified crops of render vs photo match on all of these:
- **Shape:** proportions; every step, groove and collar; hat, LED, button, foot.
- **Surfaces:** no faint rings or folded splines, no stair-stepping.
- **Material:** it reads like the photo.
- **Night glow:** plausible against the night photo.

Lessons so far:
- **Even point spacing.** Long straight runs need evenly spaced profile points, or the spline folds into faint rings. The same goes for curved flares: uneven points give scalloped reflections.
- **Seams.** Look for seam grooves on drums and a black rubber foot ring.
- **Proportions.** Most specs use the photo proportions with the datasheet height.
- **Camera flags.**
  - `--under`: the photo sees the underside of the hat. Without it the fit can choose a mirror camera above the lamp.
  - `--cam-height`: the fitted camera is clearly wrong, for example the photo shows top faces and was shot from above.
  - `--photo`: fit against a specific photo.
- **Base and hat at once.** A level camera can't match both on a photo pitched down. Judge the hat by eye and say so.

### 5. Finish
- Run `npx tsc --noEmit`.
- Delete any temporary scripts.
- Close your tab.

## Rules
- **Finish.** Render in a finish the Sanity product lists AND the photo shows. Labels on photo files can be wrong; trust the colour. Calibrated values:
  - `bronz`: polished copper-bronze metal.
  - `gold`: pale lemon brass.
  - `eskitme`: satin olive taupe paint; also the "taupe" painted photos.
  - Also: `satine-nikel`, `krom`, `rose`, `siyah`, `beyaz`.
  - If no listed finish matches the photo, use the closest and say so; it becomes a question for the client.
- **`hat.led.wash`.** It lights the stem/body under the hat at night and is opt-in. Turn it on only if the night photos show it.
- **Opt-in parts (see `specs/index.ts`).** `body.knurl` knurled grip (Casares); `body.facets` / `hat.facets` N-sided parts (Melma, Ezop): count sides from face-width ratios and check edges are straight, polished round drums show reflection bands too; `shade.opal` / `hat.opal` smooth white opal diffuser (Karo, Baro), not the fabric shade.
  - `body.fixed` / `hat.fixed: [{ from, to, finish }]`: profile runs between two corner heights (cm, like `knurl`) keep one finish whatever the buyer picks: a chrome finial (Zamora, Evora), a white dome on a metal body. Use only when the photos of several finishes show that part unchanged.
  - Button `ring` / `centre`: `{ type: "button", …, ring: "krom", centre: { finish: "beyaz", r: 0.6 } }` (Verona); brass when left out.
  - `body.foot.rBottom` / `round`: a tapered and/or rounded rubber foot (Suma, Melma).
  - `shade.profile` (with `opal: true`): an opal shade turned from any profile, e.g. a bell; `y`/`h`/`rBottom`/`rTop` still set the light and the opening. `hat.opal: { profile, transmission }`: an opal part with its own profile under the hat, e.g. a bowl (Nade); put `light.y` inside it and keep `led.rOut` inside its top radius. Top-level `opal: { profile, transmission }`: an opal part with no hat or shade (Furud's candle).
  - `glass: { profile, thickness }` (top level): clear glass turned from its outer profile, wall `thickness` cm; open ends get a round rim (Furud's tube). A cone shade is a sloped profile.
  - `fixed[].rough`: roughness override for a zone, e.g. a glossy white dome `rough: 0.06` (Bene).
  - `topButton.finish`: `"body"` follows the selected finish, a slug fixes it, brass when left out. `topButton.shape`: the finial outline in units of r and h (Carina).
  - `body.brush` / `hat.brush` (0–1): fine brushing round the axis on brushed metal finishes (0.5 = Torino's satin brass). Top-level `antique: { finish, hex, rough, metal, patina }`: that finish renders as brushed antique brass with patina (Vela, Gemini on `eskitme`).
- **Scope.** Do not upload night images and do not link the product; the coordinator does that for the whole batch.
- **Files.** Do not create files outside your spec and `tools/model/out/`. Scratch scripts go in a temp subfolder named after your key: the scratchpad is shared, and generic names (`gen.py`, `cmp.py`) have been overwritten by other agents.
- **White on white.** The extractor can't see white parts on a white shop photo (Bene, Nade). Look for a grey-background copy, e.g. the datasheet cover rendered with pdf.js, and score against it.

## Report (short, English)
- Finish used and why. Key dimensions and their sources.
- **The exact `review.py` arguments you used** (the night image agent must repeat them).
- Fit: mean / 95% / max in mm, and what the max is.
- Anything guessed or unmatched, kit gaps, doubts about photos or data, questions for the client.
- Wall-clock minutes.
