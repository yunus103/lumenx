import { cachedFetch } from "@/sanity/lib/client";
import { notFoundQuery } from "@/sanity/lib/queries";
import { NotFoundScene } from "@/components/notfound/NotFoundScene";
import type { NotFoundTexts } from "@/types";

// The root not-found renders inside the root layout only (no header, footer or quote list, for unmatched URLs
// and notFound() alike), so the scene carries its own logo link.
export default async function NotFound() {
  const texts = await cachedFetch<NotFoundTexts | null>(notFoundQuery, {}, { next: { tags: ["layout"] } });
  return <NotFoundScene texts={texts} />;
}
