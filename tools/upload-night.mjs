// Uploads a night render as a product's nightImage (alt left empty: the card gives it none).
// Usage: node --no-warnings --env-file=.env.local tools/upload-night.mjs <product-slug> <file.webp>
import { createReadStream } from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";

const [slug, file] = process.argv.slice(2);
if (!slug || !file) throw new Error("usage: upload-night.mjs <product-slug> <file>");

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: "2025-01-01",
  useCdn: false,
});

const id = await client.fetch(`*[_type == "product" && slug.current == $slug][0]._id`, { slug });
if (!id) throw new Error(`no product with slug ${slug}`);
const asset = await client.assets.upload("image", createReadStream(file), { filename: path.basename(file) });
await client.patch(id).set({ nightImage: { _type: "image", asset: { _type: "reference", _ref: asset._id } } }).commit();
console.log(`${slug}: nightImage = ${asset.url}`);
