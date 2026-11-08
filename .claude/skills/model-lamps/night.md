# Night images agent (Sonnet) — prompt template

Fill the table and send this as the prompt (`model: "sonnet"`, background).

---

You are working in the LUMENX repository (Next.js + Sanity, three.js kit lamps). Approved in advance; do not ask questions, do not edit source files, do not commit or push. Report in English, short.

Render and upload the night card image (`nightImage` in Sanity) for these kit lamps, which are already linked in Sanity. Read the top of `tools/model/review.py` and `tools/upload-night.mjs` first.

| key | --slug (Sanity slug) | finish | flags |
|---|---|---|---|
| <key> | <sanity-slug> | <finish> | <exact flags the modeller used, or empty> |

Per lamp:
1. Run `python tools/model/review.py <key> shots --slug <slug> --finish <f> <flags>`. It prints `window.shot(...)` calls.
2. Open your own built-in browser tab (`mcp__Claude_Browser__tabs_create`) and navigate it to http://localhost:3000/dev-render.
   - Reload fresh before each lamp and wait until `window.shot` is defined.
   - Run the calls with `mcp__Claude_Browser__javascript_tool`, awaiting each.
3. Run `python tools/model/review.py <key> sheet --slug <slug> --finish <f> <flags> --upload`.
   - Use exactly the same flags as in step 1.
   - If the upload can't find the product, run `node --env-file=.env.local tools/upload-night.mjs <sanity-slug> public/renders/_test/night-<key>.webp`.
4. Check `public/renders/_test/night-<key>.webp` with the Read tool. It should be a sensible lit lamp, not blank, black or cropped.

Then revalidate the site from the project dir, putting the Sanity slugs in `slugs`:
```
node --env-file=.env.local --input-type=module -e '
import { encodeSignatureHeader } from "@sanity/webhook";
const slugs = [/* "<sanity-slug>", ... */];
const payloads = [{ _type: "productCategory", operation: "update" }, ...slugs.map(slug => ({ _type: "product", operation: "update", slug, affectsList: true }))];
for (const p of payloads) {
  const body = JSON.stringify(p);
  const sig = await encodeSignatureHeader(body, Date.now(), process.env.SANITY_WEBHOOK_SECRET);
  const r = await fetch("http://localhost:3000/api/revalidate", { method: "POST", headers: { "content-type": "application/json", "sanity-webhook-signature": sig }, body });
  console.log(p.slug ?? p._type, r.status);
}'
```

Finally, check one product page:
- Open http://localhost:3000/urun/<one sanity-slug> in your tab and front it with `mcp__Claude_Browser__tabs_select`. Background tabs don't paint.
- Wait about 6 s, then confirm `document.querySelectorAll('canvas').length >= 1` and that there are no console errors.

Close your tab.

Report:
- Per lamp: whether the upload succeeded, and the fit numbers the sheet printed.
- The revalidate statuses.
- The result of the page check.
