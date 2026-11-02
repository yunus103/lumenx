import type { Finish, SanityImage, VariantPhoto } from "@/types";

// Product names repeat their category ("Defne Şarjlı Masa Lambası" in "Şarjlı Masa Lambası"); cards and the
// configurator heading show the model name the way the demo did, with the category as the meta line.
export function shortName(name: string, categoryTitle?: string) {
  if (!categoryTitle) return name;
  const n = name.toLocaleLowerCase("tr-TR");
  const c = categoryTitle.toLocaleLowerCase("tr-TR");
  return n.endsWith(" " + c) ? name.slice(0, name.length - c.length).trim() : name;
}

export type FinishKind = "wood" | "metal" | "paint";

export function finishKind(f: Pick<Finish, "finishType">): FinishKind {
  const t = (f.finishType ?? "").toLocaleLowerCase("tr-TR");
  if (t.includes("ahşap")) return "wood";
  if (t.includes("kaplama")) return "metal";
  return "paint";
}

// Wood bodies are a "gövde", painted/plated metal ones a "kasa".
export const finishWord = (finishes?: Finish[]) => (finishes?.[0] && finishKind(finishes[0]) === "wood" ? "gövde" : "kasa");

export interface FinishInfo {
  title: string;
  line: string;
  note: string;
  copy: string;
}

export function finishInfo(f: Finish): FinishInfo {
  const kind = finishKind(f);
  if (kind === "wood")
    return {
      title: `${f.name} ahşap`,
      line: f.finishType ?? "Masif ahşap",
      note: "Ahşap doğal bir malzemedir; damar ve ton her üründe biraz farklıdır.",
      copy: `${f.name} ahşap`,
    };
  // Plated metals are not RAL colours: show the nearest reference without pretending to a hex value.
  if (kind === "metal")
    return {
      title: f.name,
      line: f.ral ? `${f.finishType} · en yakın referans RAL ${f.ral} ${f.ralName ?? ""}`.trim() : `${f.finishType} · RAL karşılığı yok`,
      note: "Kaplama tonu ekranda tam yansımaz; numune kartelayla doğrulanır.",
      copy: f.ral ? `${f.name} (en yakın RAL ${f.ral})` : `${f.name} kaplama`,
    };
  return {
    title: f.ral ? `RAL ${f.ral}` : f.name,
    line: [f.ral ? f.ralName ?? f.name : null, f.finishType].filter(Boolean).join(" · "),
    note: "Ekran rengi yaklaşık değerdir; üretim fiziksel kartelaya göre yapılır.",
    copy: f.ral ? `RAL ${f.ral}` : f.name,
  };
}

// The demo's photoFor: exact finish+shade photo, else one of the same finish, else the cover.
export function photoFor(
  variantPhotos: VariantPhoto[] | undefined,
  cover: SanityImage | undefined,
  finishId?: string,
  shadeId?: string
): { image?: SanityImage; exact: boolean } {
  const photos = variantPhotos ?? [];
  const exact = photos.find((p) => p.finish?._id === finishId && (p.shade?._id ?? undefined) === shadeId);
  if (exact) return { image: exact.image, exact: true };
  const sameFinish = photos.find((p) => p.finish?._id === finishId);
  if (sameFinish) return { image: sameFinish.image, exact: !shadeId };
  return { image: cover, exact: false };
}

export const waLink = (number: string | undefined, text: string) =>
  `https://wa.me/${(number ?? "").replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
