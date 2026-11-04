import { defineArrayMember, defineField, defineType } from "sanity";

export const homePageType = defineType({
  name: "homePage",
  title: "Ana Sayfa",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "categories", title: "Kategori Kartları" },
    { name: "collection", title: "Öne Çıkan Ürünler" },
    { name: "kelvin", title: "Işık Rengi Rehberi" },
    { name: "references", title: "Referanslar" },
    { name: "blog", title: "Blog" },
    { name: "cta", title: "Teklif Bandı" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "heroTitle", title: "Başlık", type: "string", group: "hero", validation: (Rule) => Rule.required(), initialValue: "Mekânınız için doğru ışık." }),
    defineField({
      name: "heroText",
      title: "Giriş Metni",
      type: "text",
      rows: 3,
      group: "hero",
      initialValue: "Otel, restoran ve kafeler için şarjlı masa lambaları ve aydınlatma ürünleri. Modeli ve rengi seçin, teklifinizi alın.",
    }),
    defineField({ name: "heroPrimaryLabel", title: "Ana Buton Metni", type: "string", group: "hero", initialValue: "Ürünleri inceleyin" }),
    defineField({ name: "heroPrimaryLink", title: "Ana Buton Linki", type: "string", group: "hero", initialValue: "/urunler" }),
    defineField({ name: "heroSecondaryLabel", title: "İkinci Buton Metni", type: "string", group: "hero", initialValue: "Işık rengi rehberi" }),
    defineField({ name: "heroSecondaryLink", title: "İkinci Buton Linki", type: "string", group: "hero", initialValue: "#isik" }),
    defineField({
      name: "heroCaption",
      title: "Görsel Açıklaması",
      type: "string",
      group: "hero",
      description: "Hero görselindeki ürünü anlatır; seçilen ışık bilgisi sonuna eklenir.",
      initialValue: "Avior, gold kasa, krem abajur",
    }),

    defineField({
      name: "categoryCards",
      title: "Kategori Kartları",
      type: "array",
      group: "categories",
      description: "Kart, seçilen kategorinin ürün sayfasını açar. En fazla 3 kart.",
      validation: (Rule) => Rule.max(3),
      of: [
        defineArrayMember({
          type: "object",
          name: "categoryCard",
          title: "Kart",
          fields: [
            defineField({ name: "title", title: "Başlık", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "category", title: "Kategori", type: "reference", to: [{ type: "productCategory" }], validation: (Rule) => Rule.required() }),
            defineField({
              name: "image",
              title: "Görsel",
              type: "image",
              options: { hotspot: true },
              description: "Dikey kırpılır (4:5). Başlık görselin altına biner.",
              fields: [defineField({ name: "alt", title: "Alt Metni", type: "string" })],
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: { select: { title: "title", media: "image" } },
        }),
      ],
      initialValue: [
        { _key: "masa", _type: "categoryCard", title: "Şarjlı Masa Lambaları", category: { _type: "reference", _ref: "productCategory-sarjli-masa-lambasi" } },
        { _key: "aplik", _type: "categoryCard", title: "Aplik ve Lambaderler", category: { _type: "reference", _ref: "productCategory-aplik-ve-lambader" } },
        { _key: "istasyon", _type: "categoryCard", title: "Şarj İstasyonları", category: { _type: "reference", _ref: "productCategory-sarj-istasyonlari" } },
      ],
    }),

    defineField({ name: "collectionTitle", title: "Başlık", type: "string", group: "collection", initialValue: "Öne çıkan ürünler" }),
    defineField({ name: "collectionText", title: "Açıklama", type: "text", rows: 2, group: "collection", initialValue: "Otel, restoran ve kafeler için seçtiğimiz modeller." }),
    defineField({
      name: "featuredProducts",
      title: "Öne Çıkan Ürünler",
      type: "array",
      group: "collection",
      description: "Boş bırakılırsa ilk 9 ürün gösterilir.",
      of: [{ type: "reference", to: [{ type: "product" }] }],
    }),
    defineField({ name: "collectionLinkLabel", title: "Tüm Ürünler Linki", type: "string", group: "collection", initialValue: "Tüm ürünleri görün" }),

    defineField({ name: "kelvinTitle", title: "Başlık", type: "string", group: "kelvin", initialValue: "Her mekâna doğru ışık rengi." }),
    defineField({
      name: "kelvinText",
      title: "Açıklama",
      type: "text",
      rows: 3,
      group: "kelvin",
      initialValue: "Işığın rengi mekânın havasını belirler. Sürgüyü kaydırarak aynı masanın farklı ışık renklerinde nasıl göründüğüne bakın.",
    }),

    defineField({ name: "referencesTitle", title: "Başlık", type: "string", group: "references", description: "Bölüm yalnızca Referanslar sayfası açıkken görünür; görsel ilk referansın kapağıdır.", initialValue: "Referanslarımız" }),
    defineField({ name: "referencesText", title: "Metin", type: "text", rows: 2, group: "references", initialValue: "Ürünlerimizin kullanıldığı otel, restoran ve kafeler." }),
    defineField({ name: "referencesLinkLabel", title: "Link Metni", type: "string", group: "references", initialValue: "Referansları görün" }),

    defineField({ name: "blogTitle", title: "Başlık", type: "string", group: "blog", description: "Bölüm yalnızca yayınlanmış yazı varsa görünür; son 3 yazı listelenir.", initialValue: "Son yazılar" }),
    defineField({ name: "blogLinkLabel", title: "Link Metni", type: "string", group: "blog", initialValue: "Tüm yazılar" }),

    defineField({ name: "ctaTitle", title: "Başlık", type: "string", group: "cta", initialValue: "Üç adımda teklif" }),
    defineField({
      name: "ctaSteps",
      title: "Adımlar",
      type: "array",
      group: "cta",
      of: [
        defineArrayMember({
          type: "object",
          name: "ctaStep",
          title: "Adım",
          fields: [
            defineField({ name: "title", title: "Başlık", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "text", title: "Metin", type: "string" }),
          ],
          preview: { select: { title: "title", subtitle: "text" } },
        }),
      ],
      initialValue: [
        { _key: "secin", _type: "ctaStep", title: "Ürünü seçin", text: "Modeli, rengi ve ışığı belirleyin." },
        { _key: "ekleyin", _type: "ctaStep", title: "Listeye ekleyin", text: "İhtiyacınız olan adedi yazıp teklif listesine ekleyin." },
        { _key: "gonderin", _type: "ctaStep", title: "Bize gönderin", text: "Liste tek bir WhatsApp mesajıyla bize ulaşır, fiyatı projenize göre hazırlayalım." },
      ],
    }),
    defineField({ name: "ctaNote", title: "Alt Not", type: "string", group: "cta", initialValue: "Masa lambaları ortalama 8 saatte şarj olur; elektronik aksamda 2 yıl garanti vardır." }),
    defineField({ name: "ctaQuoteLabel", title: "Teklif Listesi Butonu", type: "string", group: "cta", initialValue: "Teklif listesini aç" }),
    defineField({ name: "ctaWhatsappLabel", title: "WhatsApp Butonu", type: "string", group: "cta", initialValue: "WhatsApp'tan yazın" }),

    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
});
