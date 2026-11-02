// Creates the singleton documents (site settings, navigation, home, products page) if they don't exist yet.
// Texts come from the schemas' initialValue, so defaults stay in one place; contact data and menus are LUMENX's.
// Usage: node --env-file=.env.local tools/seed-content.mjs
import { createClient } from "@sanity/client";
import { homePageType } from "../src/sanity/schemaTypes/singletons/homePage.ts";
import { productsPageType } from "../src/sanity/schemaTypes/singletons/productsPage.ts";
import { siteSettingsType } from "../src/sanity/schemaTypes/singletons/siteSettings.ts";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: "2025-01-01",
  useCdn: false,
});

const initialValues = (type) =>
  Object.fromEntries(type.fields.filter((f) => f.initialValue !== undefined).map((f) => [f.name, f.initialValue]));

const link = (label, href, i) => ({ _key: `l${i}`, label, href, openInNewTab: false });

const docs = [
  {
    _id: "siteSettings",
    _type: "siteSettings",
    ...initialValues(siteSettingsType),
    siteName: "LUMENX",
    siteTagline: "Şarjlı masa lambaları ve LED armatürler",
    defaultSeo: {
      metaTitle: "LUMENX · Şarjlı masa lambaları ve LED armatürler",
      metaDescription:
        "LUMENX şarjlı masa lambaları. Kasa rengini RAL koduyla, ışık rengini Kelvin değeriyle seçin; otel, restoran ve kafeler için teklif alın.",
    },
    contactInfo: {
      phone: "0552 700 02 34",
      whatsappNumber: "+905527000234",
      address: "Bereketzade Mah. Okçumusa Cad. İpek Çıkmazı Sk. Alkan İş Hanı No:2 Kat:4 İç Kapı No:25, Beyoğlu / İstanbul",
    },
  },
  {
    _id: "navigation",
    _type: "navigation",
    headerLinks: [
      ["Ürünler", "/urunler"],
      ["Işık rengi", "/#isik"],
      ["Hakkımızda", "/hakkimizda"],
      ["İletişim", "/iletisim"],
    ].map(([l, h], i) => link(l, h, i)),
    footerLinks: [
      ["Ürünler", "/urunler"],
      ["Işık rengi rehberi", "/#isik"],
      ["Blog", "/blog"],
      ["İletişim", "/iletisim"],
    ].map(([l, h], i) => link(l, h, i)),
  },
  { _id: "homePage", _type: "homePage", ...initialValues(homePageType) },
  { _id: "productsPage", _type: "productsPage", ...initialValues(productsPageType) },
];

const tx = client.transaction();
for (const doc of docs) tx.createIfNotExists(doc);
await tx.commit({ visibility: "async" });
console.log(`seeded (created if missing): ${docs.map((d) => d._id).join(", ")}`);
