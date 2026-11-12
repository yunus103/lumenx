---
name: model-lamps
description: Model the next batch of LUMENX lamps as code-built kit specs, fitted to the product photos, linked in Sanity with night images, committed and pushed. Use when Yunus says /model-lamps, "sıradaki partiyi modelle", or names lamps to model. Args - lamp keys, or a count (default 6).
---

# Model a batch of kit lamps

You are the coordinator. Subagents do the modelling; you prepare, judge, link, commit and report. Yunus has approved the whole flow in advance: do not ask him anything during a batch, push at the end, then tell him what to check. Reply to him in Turkish; files, code and commits stay in English.

Files next to this one:
- `brief.md`: the modelling brief every modeller agent reads.
- `night.md`: the prompt template for the linking / night image agent.
- `queue.md`: the ordered list of lamps still to model, with notes. Its first unchecked rows are the next batch.

State lives in `docs/HANDOFF.md`, section "Modelled lamps" (the table of finished lamps and the open list). Read only that section and `queue.md`; do not read the whole HANDOFF.

## Arguments

- Nothing: the next 6 lamps in `queue.md`.
- A number (`/model-lamps 10`): that many from the queue. Run at most 6 modellers at once; more go in a second wave as slots free up.
- Keys (`/model-lamps bene nade`): exactly those.
- Yunus may add notes in words ("Mensa'yı iki renkli yap", "sadece metal olanlar"); follow them.

## Steps

### 1. Prepare (you, a few minutes)

- Check the dev server: `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/dev-render` must be 200; otherwise `preview_start` with name `dev` and wait. A redirect to `/login` means another project holds port 3000 (Yunus's own server: never stop it): start LUMENX on another port (a temporary `launch.json` entry with `npm run dev -- -p 3100`, reverted before the commit) and tell every agent the port.
- Look at each lamp's overlay first: frame lanterns and other non-turned lamps can't be kit lamps; move them to their own queue group and take the next lamps instead.
- For each lamp, in one Sanity query (client setup as in `tools/link-models.mjs`, run with `node --env-file=.env.local`): the Sanity slug, `finishes[]->slug.current`, `source.url` (the Light Design page; its slug can differ, e.g. `-1` or `-ekonomik`), `modelKey` (must be empty unless rebuilding).
- The profile: `tools/model/out/<lightdesign-slug>.json`. If missing, run `python tools/model/extract.py <lightdesign-slug> --height <cm>` with the height from `tools/data/datasheets.json`; the modeller can redo it.
- Register every key as `kit` in `src/three/models.ts` yourself (the modellers must not touch it; parallel edits collide).
- Note the start time.

### 2. Model (one Opus agent per lamp, in parallel, background)

Prompt each with exactly this, filling in the line:

```
Read the brief at <absolute path to .claude/skills/model-lamps/brief.md> and follow it.

Your lamp: key `<key>`, Sanity slug `<sanity-slug>` (Light Design slug / extracted profile: `<ld-slug>`). Sanity finishes: <list>. <queue note, if any>
```

Use `model: "opus"`, `run_in_background: true`. Don't read their transcripts; wait for the reports.

### 3. Judge each lamp as its report arrives

Read its sheet `tools/model/out/<key>-sheet.webp` (one image; this is the cheap review). Pass it when:
- the shape matches the photo part by part (hat, stem, collars, base, foot), and the 3/4 view has no rings, folds or steps;
- the fit is under about 0.5 mm mean, or the report explains a worse number by the photo's perspective and the renders confirm it by eye;
- the finish is one the product lists and the photo shows.

If one is doubtful, send it to a fresh Opus reviewer: "Independent review of kit lamp `<key>`: read `brief.md` (same folder) for tools and rules, then check `<concern>` against the photos, fix `src/three/kit/specs/<key>.ts` if it is wrong, rebuild the sheet, report." Most lamps pass without this.

### 4. Kit gaps

Modellers never change shared kit code; they approximate and report gaps. Decide:
- Add it to the kit now when a lamp looks clearly wrong without it, or the same gap shows up on two lamps (also check `queue.md` notes: if upcoming lamps need it, it pays off).
- Otherwise add it to the open list in HANDOFF.

To add one, run one Opus agent: "Add `<feature>` to the kit (`src/three/kit/`), opt-in per spec so no existing lamp changes. Run the Defne guard (below) before and after. Use it in `<key>`'s spec and rebuild its sheet. `npx tsc --noEmit`." Yunus allows kit changes without asking; an approved lamp's look must not change (the guard proves it).

**Defne guard:** on a freshly loaded `/dev-render`, in this order, `window.shot` with `size [1000,800]`, `samples 4`, `quality .95`: (1) `gece`, finish `ceviz`, `k 2700`, pos `[.34,.3,1.08]`, target `[0,.13,0]`, fov 30; (2) `gunduz`, `kayin`, `k 3000`, `on:false`, pos `[-.5,.25,.7]`, target `[0,.12,0]`, fov 25; (3) `aksam`, `ceviz`, `k 3000`, pos `[.2,.2,.45]`, target `[0,.1,0]`, fov 25. Frame 3 must be byte-identical before and after; 1 and 2 may differ by up to 15 levels on their own. Defne is the reference because it uses most of the kit (wood, shade, LED), not because it is perfect.

### 5. Link and night images (one Sonnet agent)

- Add the lamps to `LINKS` in `tools/link-models.mjs` (`{ slug: "<sanity-slug>", modelKey: "<key>", shades: [] }`) and run `node --env-file=.env.local tools/link-models.mjs`.
- Start one Sonnet agent with `night.md`, filling the table: key, `--slug`, finish, and **the exact flags the modeller used** (`--under`, `--cam-height`, `--photo`). Without them the sheet it rebuilds shows a false bad fit.

### 6. Record, commit, push

- HANDOFF "Modelled lamps": a row per lamp (key, Sanity slug, finish, notes: flags, doubts, gaps). Update the lamp count in "Next up". Add new open items (kit gaps); remove what was solved. Every client question (unmatched finish, photo vs datasheet size, unexplained datasheet value) also goes into the one "Client questions" list under "For Yunus or the client", in its group (colours, dimensions, general): Yunus asks them in one go.
- `queue.md`: tick the done rows (`[x]`), keep notes that still matter for later lamps.
- `npx tsc --noEmit`, then commit on `main` and push. Message: "Add <n> kit lamps: <Names>". End with the Co-Authored-By line.

### 7. Report to Yunus (Turkish, short)

- What is live: the lamps, the commit.
- **What he should check**, per lamp: only the points that need his eye (a guessed part, a finish that doesn't match any listed one, a doubtful dimension, a perspective-skewed score), with the product URL `localhost:3000/urun/<sanity-slug>`.
- Questions for the client, if any.
- Time and tokens: wall clock from step 1 to push; per agent from the task notifications (`duration_ms`, `subagent_tokens`).

## If the limit runs short

Finish the stage you are in, then commit what is complete: lamps with a fitted spec but not yet linked stay registered in `models.ts` (harmless: no product points to them) and stay unticked in `queue.md` with a note "spec done, not linked". The next run picks them up at step 3.

## Measured so far (2026-11-08)

Batch of 6: modellers 6–10 min and 120–147k tokens each in parallel; linking and night images one Sonnet agent, about 8 min and 100k; the whole batch about 30 min and 1M tokens.

Batch of 12 with extra care (2026-11-13, all photos, magnified crops): modellers 19–40 min and 235–330k tokens each; three kit agents (fixed zones, foot, opal profiles; brushing and antique brass; glass and finials) 21–36 min and 230–350k each; the whole night about 3 h and 5.5M tokens.
