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
  { slug: "mimosa-sarjli-masa-lambasi", modelKey: "mimosa", shades: [] },
  { slug: "olena-sarjli-masa-lambasi", modelKey: "olena", shades: [] },
  { slug: "sirius-sarjli-masa-lambasi", modelKey: "sirius", shades: [] },
  { slug: "vita-sarjli-masa-lambasi", modelKey: "vita", shades: [] },
  { slug: "nigora-sarjli-masa-lambasi", modelKey: "nigora", shades: [] },
  { slug: "baro-sarjli-masa-lambasi", modelKey: "baro", shades: [] },
  { slug: "diya-sarjli-masa-lambasi", modelKey: "diya", shades: [] },
  { slug: "fuga-sarjli-masa-lambasi", modelKey: "fuga", shades: [] },
  { slug: "gemini-sarjli-masa-lambasi", modelKey: "gemini", shades: [] },
  { slug: "meissa-sarjli-masa-lambasi", modelKey: "meissa", shades: [] },
  { slug: "mensa-sarjli-masa-lambasi", modelKey: "mensa", shades: [] },
  { slug: "mila-sarjli-masa-lambasi", modelKey: "mila", shades: [] },
  { slug: "pandora-sarjli-masa-lambasi", modelKey: "pandora", shades: [] },
  { slug: "rena-sarjli-masa-lambasi", modelKey: "rena", shades: [] },
  { slug: "sani-sarjli-masa-lambasi", modelKey: "sani", shades: [] },
  { slug: "tole-sarjli-masa-lambasi", modelKey: "tole", shades: [] },
  { slug: "aldebaran-sarjli-masa-lambasi", modelKey: "aldebaran", shades: [] },
  { slug: "aro-sarjli-masa-lambasi", modelKey: "aro", shades: [] },
  { slug: "casares-sarjli-masa-lambasi", modelKey: "casares", shades: [] },
  { slug: "esna-sarjli-masa-lambasi", modelKey: "esna", shades: [] },
  { slug: "evora-sarjli-masa-lambasi", modelKey: "evora", shades: [] },
  { slug: "geminga-sarjli-masa-lambasi", modelKey: "geminga", shades: [] },
  { slug: "heli-sarjli-masa-lambasi", modelKey: "heli", shades: [] },
  { slug: "hint-sarjli-masa-lambasi", modelKey: "hint", shades: [] },
  { slug: "konra-sarjli-masa-lambasi", modelKey: "konra", shades: [] },
  { slug: "ezop-sarjli-masa-lambasi", modelKey: "ezop", shades: [] },
  { slug: "karo-sarjli-masa-lambasi", modelKey: "karo", shades: [] },
  { slug: "melma-sarjli-masa-lambasi", modelKey: "melma", shades: [] },
  { slug: "merle-sarjli-masa-lambasi", modelKey: "merle", shades: [] },
  { slug: "mira-sarjli-masa-lambasi", modelKey: "mira", shades: [] },
  { slug: "mirach-sarjli-masa-lambasi", modelKey: "mirach", shades: [] },
  { slug: "mona-sarjli-masa-lambasi", modelKey: "mona", shades: [] },
  { slug: "mula-sarjli-masa-lambasi", modelKey: "mula", shades: [] },
  { slug: "neptun-sarjli-masa-lambasi", modelKey: "neptun", shades: [] },
  { slug: "orben-sarjli-masa-lambasi", modelKey: "orben", shades: [] },
  { slug: "oxford-sarjli-masa-lambasi", modelKey: "oxford", shades: [] },
  { slug: "polaris-sarjli-masa-lambasi", modelKey: "polaris", shades: [] },
  { slug: "rigel-sarjli-masa-lambasi", modelKey: "rigel", shades: [] },
  { slug: "suma-sarjli-masa-lambasi", modelKey: "suma", shades: [] },
  { slug: "toledo-sarjli-masa-lambasi", modelKey: "toledo", shades: [] },
  { slug: "torino-sarjli-masa-lambasi", modelKey: "torino", shades: [] },
  { slug: "vela-sarjli-masa-lambasi", modelKey: "vela", shades: [] },
  { slug: "verona-sarjli-masa-lambasi", modelKey: "verona", shades: [] },
  { slug: "zamora-sarjli-masa-lambasi", modelKey: "zamora", shades: [] },
  { slug: "bene-sarjli-masa-lambasi", modelKey: "bene", shades: [] },
  { slug: "nade-sarjli-masa-lambasi", modelKey: "nade", shades: [] },
  { slug: "bella-sarjli-masa-lambasi", modelKey: "bella", shades: [] },
  { slug: "carina-sarjli-masa-lambasi", modelKey: "carina", shades: [] },
  { slug: "furud-sarjli-masa-lambasi", modelKey: "furud", shades: [] },
  { slug: "kuma-sarjli-masa-lambasi", modelKey: "kuma", shades: [] },
  { slug: "lofen-sarjli-masa-lambasi", modelKey: "lofen", shades: [] },
  { slug: "minkar-sarjli-masa-lambasi", modelKey: "minkar", shades: [] },
  { slug: "navi-sarjli-masa-lambasi", modelKey: "navi", shades: [] },
  { slug: "nerio-sarjli-masa-lambasi", modelKey: "nerio", shades: [] },
  { slug: "plastica-sarjli-masa-lambasi", modelKey: "plastica", shades: [] },
  { slug: "sirius-garson-cagirma-masa-lambasi", modelKey: "sirius-garson", shades: [] },
  { slug: "capella-garson-cagirma-masa-lambasi", modelKey: "capella-garson", shades: [] },
  { slug: "alpheca-garson-cagirma-masa-lambasi", modelKey: "alpheca", shades: [] },
  { slug: "caph-garson-cagirma-masa-lambasi", modelKey: "caph", shades: [] },
  { slug: "menkent-garson-cagirma-masa-lambasi", modelKey: "menkent", shades: [] },
  { slug: "pollux-garson-cagirma-masa-lambasi", modelKey: "pollux", shades: [] },
  { slug: "wolf-garson-cagirma-masa-lambasi", modelKey: "wolf", shades: [] },
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
