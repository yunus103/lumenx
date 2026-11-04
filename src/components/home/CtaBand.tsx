import { OpenQuoteButton } from "@/components/quote/QuoteProvider";
import { WaIcon } from "@/components/quote/icons";
import { waLink } from "@/lib/catalog";
import type { HomePage } from "@/types";

type CtaBandProps = Pick<HomePage, "ctaTitle" | "ctaSteps" | "ctaNote" | "ctaQuoteLabel" | "ctaWhatsappLabel"> & { whatsappNumber?: string };

export function CtaBand({ ctaTitle, ctaSteps, ctaNote, ctaQuoteLabel, ctaWhatsappLabel, whatsappNumber }: CtaBandProps) {
  return (
    <section className="cta-band" aria-labelledby="cH">
      <div className="wrap cta-in">
        <div className="cta-head">
          <h2 id="cH">{ctaTitle}</h2>
          <div className="cta-row">
            {ctaQuoteLabel && <OpenQuoteButton className="btn btn-light">{ctaQuoteLabel}</OpenQuoteButton>}
            {ctaWhatsappLabel && whatsappNumber && (
              <a className="btn btn-wa" href={waLink(whatsappNumber, "Merhaba, ürünleriniz hakkında bilgi almak istiyorum.")} target="_blank" rel="noopener">
                <WaIcon />
                {ctaWhatsappLabel}
              </a>
            )}
          </div>
          {ctaNote && <p className="cta-note">{ctaNote}</p>}
        </div>
        {!!ctaSteps?.length && (
          <ol className="cta-steps">
            {ctaSteps.map((s) => (
              <li key={s._key}>
                <h3>{s.title}</h3>
                {s.text && <p>{s.text}</p>}
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
