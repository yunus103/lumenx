import { cachedFetch } from "@/sanity/lib/client";
import { searchIndexQuery } from "@/sanity/lib/queries";
import type { SearchItem } from "@/types";

// Built once and served from the CDN like the static pages; the product webhook tags rebuild it.
export const dynamic = "force-static";

export async function GET() {
  const items = await cachedFetch<SearchItem[]>(searchIndexQuery, {}, { next: { tags: ["product:list", "product:all"] } });
  return Response.json(items ?? []);
}
