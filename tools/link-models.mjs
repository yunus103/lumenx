// Links the products that have a 3D model (src/three/models.ts) to it, with the shades the demo modelled.
// Rerunnable: shades are created if missing, products are patched by slug.
// Usage: node --env-file=.env.local tools/link-models.mjs
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: "2025-01-01",
  useCdn: false,
});

const SHADES = [
  { slug: "krem", name: "Krem", hex: "#D8D3B3" },
  { slug: "kirmizi", name: "Kırmızı", hex: "#B0111F" },
  { slug: "keten", name: "Keten", hex: "#E6DCC6" },
];

// slug → model and shades. Light Design lists Alderamin's Krem/Kırmızı as body colours; they are its shades.
const LINKS = [
  { slug: "defne-sarjli-masa-lambasi", modelKey: "defne", shades: ["keten"] },
  { slug: "avior-sarjli-masa-lambasi", modelKey: "avior", shades: ["krem", "kirmizi"] },
  { slug: "alderamin-sarjli-masa-lambasi", modelKey: "alderamin", shades: ["krem", "kirmizi"], dropFinishes: ["finish-krem", "finish-kirmizi"] },
  { slug: "capella-sarjli-masa-lambasi", modelKey: "capella", shades: [] },
  { slug: "agena-sarjli-masa-lambasi", modelKey: "agena", shades: [] },
];

const tx = client.transaction();
SHADES.forEach((s, i) =>
  tx.createIfNotExists({ _id: `shade-${s.slug}`, _type: "shade", name: s.name, slug: { _type: "slug", current: s.slug }, hex: s.hex, order: i })
);

const products = await client.fetch(`*[_type == "product" && slug.current in $slugs]{ _id, "slug": slug.current, finishes }`, {
  slugs: LINKS.map((l) => l.slug),
});
for (const l of LINKS) {
  const p = products.find((x) => x.slug === l.slug);
  if (!p) {
    console.warn(`missing product: ${l.slug}`);
    continue;
  }
  const set = {
    modelKey: l.modelKey,
    shades: l.shades.map((s) => ({ _type: "reference", _ref: `shade-${s}`, _key: s })),
  };
  if (l.dropFinishes) set.finishes = (p.finishes ?? []).filter((f) => !l.dropFinishes.includes(f._ref));
  tx.patch(p._id, (patch) => patch.set(set));
}
await tx.commit({ visibility: "async" });
console.log(`linked: ${LINKS.map((l) => l.modelKey).join(", ")}`);
