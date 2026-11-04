import { Metadata } from "next";
import { cachedFetch } from "@/sanity/lib/client";
import { contactPageQuery } from "@/sanity/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { waLink } from "@/lib/catalog";
import { ContactForm } from "@/components/forms/ContactForm";
import { PageHero } from "@/components/layout/PageHero";
import { WaIcon } from "@/components/quote/icons";
import { ContactPage as ContactPageType } from "@/types";

// contactInfo comes from siteSettings, so a settings change has to refresh this page too.
const getPage = () => cachedFetch<ContactPageType | null>(contactPageQuery, {}, { next: { tags: ["contact", "layout"] } });

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPage();
  return buildMetadata({
    title: data?.pageTitle,
    description: data?.heroSubtitle,
    canonicalPath: "/iletisim",
    pageSeo: data?.seo,
  });
}

export default async function ContactPage() {
  const data = await getPage();
  const c = data?.contactInfo;

  return (
    <div className="paper ct-page">
      <PageHero title={data?.heroTitle ?? data?.pageTitle ?? ""} subtitle={data?.heroSubtitle} backgroundImage={data?.heroImage} />

      <section className="wrap ct">
        <dl className="ct-info">
          {(c?.phone || c?.whatsappNumber) && (
            <div>
              <dt className="ct-label">{data?.phoneLabel}</dt>
              <dd>
                {c?.phone && (
                  <a className="ct-val num" href={`tel:${c.phone.replace(/[^\d+]/g, "")}`}>
                    {c.phone}
                  </a>
                )}
                {c?.whatsappNumber && (
                  <a className="btn btn-wa ct-wa" href={waLink(c.whatsappNumber, data?.whatsappMessage ?? "")} target="_blank" rel="noopener">
                    <WaIcon />
                    {data?.whatsappLinkLabel}
                  </a>
                )}
              </dd>
            </div>
          )}
          {c?.email && (
            <div>
              <dt className="ct-label">{data?.emailLabel}</dt>
              <dd>
                <a className="ct-val" href={`mailto:${c.email}`}>{c.email}</a>
              </dd>
            </div>
          )}
          {c?.address && (
            <div>
              <dt className="ct-label">{data?.addressLabel}</dt>
              <dd>
                <address>{c.address}</address>
                <a className="ct-link" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.address)}`} target="_blank" rel="noopener">
                  {data?.directionsLabel}
                </a>
              </dd>
            </div>
          )}
        </dl>

        {data?.showForm && <ContactForm texts={data} />}
      </section>

      {c?.mapIframe && (
        <div className="wrap ct-map-wrap">
          <div className="ct-map" role="region" aria-label={data?.mapTitle} dangerouslySetInnerHTML={{ __html: c.mapIframe }} />
        </div>
      )}
    </div>
  );
}
