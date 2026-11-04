export interface VideoEmbed {
  src: string;
  /** Provider thumbnail when the editor added no poster (YouTube only; Vimeo needs an API call). */
  thumb?: string;
}

// The privacy-friendly hosts (no cookies until play) and no autoplay: the viewer never starts sound on its own.
export function videoEmbed(url: string): VideoEmbed | null {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return null;
  }
  const host = u.hostname.replace(/^(www|m)\./, "");

  let yt: string | null = null;
  if (host === "youtu.be") yt = u.pathname.slice(1);
  else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    yt = u.searchParams.get("v") ?? u.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1] ?? null;
  }
  if (yt && /^[\w-]{6,}$/.test(yt)) {
    return { src: `https://www.youtube-nocookie.com/embed/${yt}?rel=0&playsinline=1&modestbranding=1`, thumb: `https://i.ytimg.com/vi/${yt}/hqdefault.jpg` };
  }

  const vimeo = host === "vimeo.com" || host === "player.vimeo.com" ? u.pathname.match(/(\d{6,})/)?.[1] : undefined;
  if (vimeo) return { src: `https://player.vimeo.com/video/${vimeo}?dnt=1&title=0&byline=0&portrait=0` };

  return null;
}
