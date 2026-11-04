const RATE_URL = "https://www.tcmb.gov.tr/kurlar/today.xml";
const FRESH_SECONDS = 21600;

// One small cached address instead of the rate inside every page, so a new rate never regenerates the pages. The CDN
// answers visitors and refreshes in the background every 6 hours; when TCMB fails, it keeps serving the last good rate.
const CACHED = `public, max-age=0, s-maxage=${FRESH_SECONDS}, stale-while-revalidate=86400, stale-if-error=2592000`;

// TCMB can take over 9 seconds to answer. Where no CDN stands in front (development), this spares each load the wait.
let last: { rate: number; at: number } | null = null;

export async function GET() {
  try {
    if (!last || Date.now() - last.at > FRESH_SECONDS * 1000) {
      const res = await fetch(RATE_URL, { cache: "no-store", signal: AbortSignal.timeout(25000) });
      if (!res.ok) throw new Error(`TCMB ${res.status}`);
      const rate = Number((await res.text()).match(/Kod="USD"[\s\S]*?<ForexSelling>([\d.]+)</)?.[1]);
      if (!(rate > 0)) throw new Error("TCMB: no USD rate");
      last = { rate, at: Date.now() };
    }
    return Response.json({ rate: last.rate }, { headers: { "Cache-Control": CACHED } });
  } catch (err) {
    console.error("usd-rate", err);
    return Response.json({ rate: null }, { status: 502, headers: { "Cache-Control": "no-store" } });
  }
}
