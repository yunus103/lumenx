// Fills the About and Contact singletons and the missing contact details in site settings.
// Only sets fields that are still empty (setIfMissing), so Studio edits are never overwritten.
// Texts (and the About page's featured product) come from the schemas' initialValue.
// Usage: node --no-warnings --env-file=.env.local tools/seed-about-contact.mjs
import { createClient } from "@sanity/client";
import { aboutPageType } from "../src/sanity/schemaTypes/singletons/aboutPage.ts";
import { contactPageType } from "../src/sanity/schemaTypes/singletons/contactPage.ts";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: "2025-01-01",
  useCdn: false,
});

const initialValues = (type) =>
  Object.fromEntries(type.fields.filter((f) => f.initialValue !== undefined).map((f) => [f.name, f.initialValue]));

const address = "Bereketzade Mah. Okçumusa Cad. İpek Çıkmazı Sk. Alkan İş Hanı No:2, Beyoğlu, İstanbul";
const mapIframe = `<iframe src="https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed" width="600" height="450" style="border:0" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="LUMENX konumu"></iframe>`;

const tx = client
  .transaction()
  .createIfNotExists({ _id: "aboutPage", _type: "aboutPage" })
  .patch("aboutPage", (p) => p.setIfMissing(initialValues(aboutPageType)))
  .createIfNotExists({ _id: "contactPage", _type: "contactPage" })
  .patch("contactPage", (p) => p.setIfMissing(initialValues(contactPageType)))
  .patch("siteSettings", (p) => p.setIfMissing({ contactInfo: {} }).setIfMissing({ "contactInfo.email": "info@lumenx.com", "contactInfo.mapIframe": mapIframe }));

const res = await tx.commit();
console.log(`Committed ${res.results.length} mutations.`);
