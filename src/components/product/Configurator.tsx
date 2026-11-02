"use client";

import { useEffect, useMemo, useState } from "react";
import { SanityImage } from "@/components/ui/SanityImage";
import { useQuote } from "@/components/quote/QuoteProvider";
import { WaIcon } from "@/components/quote/icons";
import { finishInfo, finishKind, photoFor, shortName, waLink } from "@/lib/catalog";
import { KINFO, nearestKelvin, rgbStr, swatchBg } from "@/lib/light";
import { formatPrice } from "@/lib/price";
import { finish3D, shade3D } from "@/three/finishes";
import { MODELS, MODE_LABELS, hasModel, type Mode } from "@/three/models";
import type { ViewerState } from "@/three/types";
import type { Product } from "@/types";
import { ProductViewer } from "./ProductViewer";

type Power = "ekonomik" | "premium";
const POWER: Record<Power, { label: string; detail: string }> = {
  ekonomik: { label: "Ekonomik · 3 W", detail: "1×18650, 1500 mAh" },
  premium: { label: "Premium · 5 W", detail: "2×18650, 1500–2200 mAh" },
};

const LEVELS = ["Düşük", "Orta", "Yüksek"];
const ICON_PWR = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
    <path d="M8 1.8v5.4" />
    <path d="M4.6 4a5 5 0 1 0 6.8 0" />
  </svg>
);

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

  // 3D viewer (products with a model): view, ambience and the lamp's switch and level
  const model = useMemo(() => (hasModel(p.modelKey) ? { key: p.modelKey, family: MODELS[p.modelKey] } : null), [p.modelKey]);
  const [view, setView] = useState<"3d" | "photo">(model ? "3d" : "photo");
  const [mode, setMode] = useState<Mode>("aksam");
  const [on, setOn] = useState(true);
  const [lvl, setLvl] = useState(2);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [touched, setTouched] = useState(false);

  const finish = finishes.find((f) => f._id === finishId);
  const shade = shades.find((s) => s._id === shadeId);

  const viewerState = useMemo<ViewerState>(
    () => ({
      finish: finish3D(finish ?? {}),
      shade: shade ? shade3D(shade) : null,
      k: k ?? 2700,
      on,
      lvl,
      power: p.chargeOptions ? power : "premium",
      mode,
    }),
    [finish, shade, k, on, lvl, power, mode, p.chargeOptions]
  );

  // the light colour of the power button's glow follows the chosen Kelvin, as in the demo
  useEffect(() => {
    if (k) document.documentElement.style.setProperty("--glow", rgbStr(k));
  }, [k]);
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
          ? model && !failed
            ? "Fotoğraftaki renk farklı olabilir. Seçtiğiniz renk 3D görünümde."
            : "Fotoğraftaki renk seçiminizden farklı olabilir."
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
        <div className={`viewer${view === "photo" ? " photo" : ""}${touched ? " touched" : ""}`}>
          {model && !failed && (
            <>
              <ProductViewer
                model={model}
                state={viewerState}
                onReady={() => setReady(true)}
                onInteract={() => setTouched(true)}
                onFail={() => {
                  setFailed(true);
                  setView("photo");
                }}
              />
              <div className={`v-load${ready ? " done" : ""}`}>
                <span>3D sahne hazırlanıyor</span>
              </div>
            </>
          )}
          <figure className="v-photo" hidden={view !== "photo"}>
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
          {model && (
            <div className="v-top">
              <div className="seg" role="group" aria-label="Görünüm">
                <button
                  type="button"
                  aria-pressed={view === "3d"}
                  disabled={failed}
                  title={failed ? "Tarayıcınız 3D önizlemeyi desteklemiyor" : undefined}
                  onClick={() => setView("3d")}
                >
                  3D
                </button>
                <button type="button" aria-pressed={view === "photo"} onClick={() => setView("photo")}>
                  Fotoğraf
                </button>
              </div>
              <div className="seg" role="group" aria-label="Ortam">
                {(Object.keys(MODE_LABELS) as Mode[]).map((m) => (
                  <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)}>
                    {MODE_LABELS[m]}
                  </button>
                ))}
              </div>
            </div>
          )}
          {view === "3d" && model ? (
            <div className="v-bot">
              <div className="power">
                <button className="pwr" type="button" aria-pressed={on} aria-label="Işık" onClick={() => setOn(!on)}>
                  <i>{ICON_PWR}</i>
                  <span aria-hidden="true">{on ? "Açık" : "Kapalı"}</span>
                </button>
                <div className="dim" role="group" aria-label="Işık seviyesi">
                  {LEVELS.map((n, i) => (
                    <button
                      key={n}
                      type="button"
                      aria-label={n}
                      title={n}
                      aria-pressed={on && i === lvl}
                      className={on && i <= lvl ? "lit" : undefined}
                      onClick={() => {
                        setLvl(i);
                        setOn(true);
                      }}
                    >
                      <b style={{ height: 5 + i * 5 }} />
                    </button>
                  ))}
                </div>
              </div>
              <span className="v-hint">Sürükleyerek çevirin, tekerlekle yakınlaştırın</span>
            </div>
          ) : (
            gallery.length > 1 && (
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
            )
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
                    <button
                      key={v}
                      type="button"
                      className="kopt"
                      aria-pressed={v === k}
                      onClick={() => {
                        setK(v);
                        setOn(true);
                      }}
                    >
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
