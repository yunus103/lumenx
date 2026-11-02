"use client";

import { useState } from "react";
import { SanityImage } from "@/components/ui/SanityImage";
import { useQuote } from "@/components/quote/QuoteProvider";
import { WaIcon } from "@/components/quote/icons";
import { finishInfo, finishKind, photoFor, shortName, waLink } from "@/lib/catalog";
import { KINFO, nearestKelvin, rgbStr, swatchBg } from "@/lib/light";
import { formatPrice } from "@/lib/price";
import type { Product } from "@/types";

type Power = "ekonomik" | "premium";
const POWER: Record<Power, { label: string; detail: string }> = {
  ekonomik: { label: "Ekonomik · 3 W", detail: "1×18650, 1500 mAh" },
  premium: { label: "Premium · 5 W", detail: "2×18650, 1500–2200 mAh" },
};

const kName = (k: number) => KINFO[k]?.[0] ?? KINFO[nearestKelvin(k)][0];
const kUse = (k: number) => KINFO[k]?.[1] ?? KINFO[nearestKelvin(k)][1];

function Qty({ id, value, onChange }: { id: string; value: number; onChange: (v: number) => void }) {
  const set = (v: number) => onChange(Math.max(1, Math.min(9999, v | 0)));
  return (
    <div className="qty">
      <button type="button" aria-label="Azalt" onClick={() => set(value - 1)}>
        −
      </button>
      <input id={id} type="number" inputMode="numeric" min={1} value={value} aria-label="Adet" onChange={(e) => set(parseInt(e.target.value, 10) || 1)} />
      <button type="button" aria-label="Artır" onClick={() => set(value + 1)}>
        +
      </button>
    </div>
  );
}

export function Configurator({ product: p }: { product: Product }) {
  const { add, whatsappNumber } = useQuote();
  const finishes = p.finishes ?? [];
  const shades = p.shades ?? [];
  const ks = p.kelvinOptions?.length ? p.kelvinOptions : (p.category?.kelvinOptions ?? []);
  const gallery = p.gallery ?? [];

  const [finishId, setFinishId] = useState(finishes[0]?._id);
  const [shadeId, setShadeId] = useState(shades[0]?._id);
  const [k, setK] = useState(ks[0]);
  const [power, setPower] = useState<Power>("premium");
  const [options, setOptions] = useState<Record<string, string>>(() =>
    Object.fromEntries((p.options ?? []).filter((o) => o.values?.length).map((o) => [o.name, o.values![0]]))
  );
  const [qty, setQty] = useState(10);
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const finish = finishes.find((f) => f._id === finishId);
  const shade = shades.find((s) => s._id === shadeId);
  const name = shortName(p.name, p.category?.title);
  const word = finish && finishKind(finish) === "wood" ? "gövde" : "kasa";

  const variant = photoFor(p.variantPhotos, gallery[0], finishId, shadeId);
  const shownImage = galleryIndex !== null ? gallery[galleryIndex] : variant.image;
  const caption =
    galleryIndex !== null
      ? `Fotoğraf ${galleryIndex + 1} / ${gallery.length}`
      : variant.exact && finish
        ? `Stüdyo fotoğrafı · ${finish.name}${shade ? `, ${shade.name.toLocaleLowerCase("tr")} abajur` : ""}`
        : finishes.length > 1
          ? "Fotoğraftaki renk seçiminizden farklı olabilir."
          : "Stüdyo fotoğrafı";

  const tierPrice = p.chargeOptions ? formatPrice(power === "premium" ? p.premiumPriceUsd : p.priceUsd) : null;
  const price = tierPrice ?? formatPrice(p.priceUsd, p.premiumPriceUsd);

  const detailParts = [
    finish && `${finish.name} ${word === "gövde" ? "ahşap gövde" : "kasa"}`,
    shade && `${shade.name} abajur`,
    k && `${k} K`,
    p.chargeOptions && (power === "premium" ? "Premium 5 W" : "Ekonomik 3 W"),
    ...Object.entries(options).map(([n, v]) => `${n}: ${v}`),
  ].filter(Boolean) as string[];
  const detail = detailParts.join(" · ");

  const summaryRows: [string, string][] = [
    ...(finish ? [[word === "gövde" ? "Gövde" : "Kasa", finish.name + (finish.ral ? ` (RAL ${finish.ral})` : "")] as [string, string]] : []),
    ...(shade ? [["Abajur", shade.name] as [string, string]] : []),
    ...(k ? [["Işık", `${k} K · ${kName(k)}`] as [string, string]] : []),
    ...(p.chargeOptions ? [["Batarya", power === "premium" ? "Premium 5 W" : "Ekonomik 3 W"] as [string, string]] : []),
    ...Object.entries(options),
    ["Adet", String(qty)],
  ];

  const askHref = waLink(whatsappNumber, `Merhaba, ${p.name} hakkında bilgi almak istiyorum.\n${detail ? `${detail}, ` : ""}${qty} adet`);

  const addToQuote = () =>
    add({
      slug: p.slug.current,
      name: p.name,
      detail,
      qty,
      image: shownImage?.asset._id ? { asset: { _id: shownImage.asset._id } } : undefined,
    });

  const info = finish && finishInfo(finish);
  const copyCode = async () => {
    if (!info) return;
    try {
      await navigator.clipboard.writeText(info.copy);
      setCopied("Kopyalandı");
    } catch {
      setCopied(info.copy);
    }
    setTimeout(() => setCopied(null), 1800);
  };

  return (
    <>
      <div className="pv-grid">
        <div className="viewer photo">
          <figure className="v-photo">
            {shownImage && (
              <SanityImage
                key={shownImage.asset._id}
                image={shownImage}
                alt={`${p.name} stüdyo fotoğrafı`}
                fill
                sizes="(max-width: 999px) 100vw, 60vw"
                objectFit="contain"
                quality={85}
                priority
              />
            )}
            <figcaption>{caption}</figcaption>
          </figure>
          {gallery.length > 1 && (
            <div className="v-bot">
              <div className="v-thumbs" role="group" aria-label="Fotoğraflar">
                {gallery.map((img, i) => (
                  <button
                    key={img.asset._id ?? i}
                    type="button"
                    aria-label={`Fotoğraf ${i + 1}`}
                    aria-pressed={galleryIndex === i}
                    onClick={() => setGalleryIndex(galleryIndex === i ? null : i)}
                  >
                    <SanityImage image={img} width={104} height={104} fit="max" objectFit="contain" className="h-full w-full object-contain" noBlur />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="cfg">
          <div className="cfg-head">
            <h1>{name}</h1>
            <span className="meta">{p.summary || p.category?.title}</span>
            <div className="price">
              {price ? (
                <>
                  {price}’den başlayan fiyatlar<span> · adet ve kaplamaya göre değişir</span>
                </>
              ) : (
                <span>Adet ve seçeneklere göre projeye özel fiyatlandırılır</span>
              )}
            </div>
          </div>

          {finish && info && (
            <div className="opt">
              <div className="opt-h">
                <h2>{word === "gövde" ? "Ahşap rengi" : "Kasa rengi"}</h2>
                <span>{finish.name}</span>
              </div>
              <div className="sw">
                {finishes.map((f) => (
                  <button
                    key={f._id}
                    type="button"
                    aria-label={f.name}
                    title={f.name}
                    aria-pressed={f._id === finishId}
                    style={{ background: swatchBg(f.hex ?? "#888888", finishKind(f) === "metal") }}
                    onClick={() => {
                      setFinishId(f._id);
                      setGalleryIndex(null);
                    }}
                  />
                ))}
              </div>
              <div className="code-card">
                <i style={{ background: swatchBg(finish.hex ?? "#888888", finishKind(finish) === "metal") }} />
                <div>
                  <b>{info.title}</b>
                  <p>{info.line}</p>
                  <small>{info.note}</small>
                </div>
                <button className="copy" type="button" onClick={copyCode}>
                  {copied ?? "Kodu kopyala"}
                </button>
              </div>
            </div>
          )}

          {shade && (
            <div className="opt">
              <div className="opt-h">
                <h2>Abajur</h2>
                <span>{shade.name}</span>
              </div>
              <div className="sw">
                {shades.map((s) => (
                  <button
                    key={s._id}
                    type="button"
                    aria-label={`${s.name} abajur`}
                    title={s.name}
                    aria-pressed={s._id === shadeId}
                    style={{ background: swatchBg(s.hex ?? "#cccccc", false) }}
                    onClick={() => {
                      setShadeId(s._id);
                      setGalleryIndex(null);
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {k && (
            <div className="opt">
              <div className="opt-h">
                <h2>Işık rengi</h2>
                <span>
                  {k} K · {kName(k)}
                </span>
              </div>
              <div className="kopts" style={{ "--n": ks.length } as React.CSSProperties}>
                {ks.length === 1 ? (
                  <div className="kopt is-info">
                    <span className="sw-k" style={{ background: `rgb(${rgbStr(k)})` }} />
                    <b>{k} K</b>
                    <span>{kName(k)}</span>
                  </div>
                ) : (
                  ks.map((v) => (
                    <button key={v} type="button" className="kopt" aria-pressed={v === k} onClick={() => setK(v)}>
                      <span className="sw-k" style={{ background: `rgb(${rgbStr(v)})` }} />
                      <b>{v} K</b>
                      <span>{kName(v)}</span>
                    </button>
                  ))
                )}
              </div>
              <p className="kdesc">Önerilen kullanım: {kUse(k)}.</p>
            </div>
          )}

          {p.chargeOptions && (
            <div className="opt">
              <div className="opt-h">
                <h2>Batarya</h2>
              </div>
              <div className="chips">
                {(Object.keys(POWER) as Power[]).map((key) => (
                  <button key={key} type="button" aria-pressed={power === key} onClick={() => setPower(key)}>
                    {POWER[key].label}
                    <small>{POWER[key].detail}</small>
                  </button>
                ))}
              </div>
            </div>
          )}

          {(p.options ?? [])
            .filter((o) => o.values?.length)
            .map((o) => (
              <div className="opt" key={o.name}>
                <div className="opt-h">
                  <h2>{o.name}</h2>
                </div>
                <div className="chips">
                  {o.values!.map((v) => (
                    <button key={v} type="button" aria-pressed={options[o.name] === v} onClick={() => setOptions((s) => ({ ...s, [o.name]: v }))}>
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            ))}

          <div className="opt actions-main">
            <div className="opt-h">
              <h2>Adet</h2>
            </div>
            <div className="actions">
              <Qty id="qty" value={qty} onChange={setQty} />
            </div>
          </div>

          <div className="summary">
            <h2>Seçiminiz</h2>
            <dl>
              {summaryRows.map(([a, b]) => (
                <div key={a} className="contents">
                  <dt>{a}</dt>
                  <dd>{b}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="actions actions-main">
            <button className="btn btn-amber" type="button" onClick={addToQuote}>
              Teklif listesine ekle
            </button>
            <a className="btn btn-line" href={askHref} target="_blank" rel="noopener">
              <WaIcon />
              WhatsApp&apos;tan sorun
            </a>
          </div>
        </div>
      </div>

      <div className="pbar">
        <Qty id="qty2" value={qty} onChange={setQty} />
        <button className="btn btn-amber" type="button" onClick={addToQuote}>
          <span className="pb-l">
            Teklif listesine ekle<small>{[finish?.name, shade?.name, k && `${k} K`].filter(Boolean).join(" · ")}</small>
          </span>
        </button>
        <a className="btn btn-line wa-mini" href={askHref} target="_blank" rel="noopener" aria-label="WhatsApp'tan sorun">
          <WaIcon />
        </a>
      </div>
    </>
  );
}
