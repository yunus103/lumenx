import { defineField, defineType } from "sanity";

export const homePageType = defineType({
  name: "homePage",
  title: "Ana Sayfa",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "collection", title: "Koleksiyon" },
    { name: "kelvin", title: "Işık Rengi Rehberi" },
    { name: "projects", title: "Projeler" },
    { name: "cta", title: "Teklif Bandı" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "heroTitle", title: "Başlık", type: "string", group: "hero", validation: (Rule) => Rule.required(), initialValue: "Işığı, masanıza koymadan önce görün." }),
    defineField({
      name: "heroText",
      title: "Giriş Metni",
      type: "text",
      rows: 3,
      group: "hero",
      initialValue: "LUMENX şarjlı masa lambaları ve LED armatürler. Kasayı RAL koduyla, ışığı Kelvin değeriyle seçin; masanızda nasıl yanacağını burada deneyin.",
    }),
    defineField({ name: "heroPrimaryLabel", title: "Ana Buton Metni", type: "string", group: "hero", initialValue: "Koleksiyonu keşfedin" }),
    defineField({ name: "heroPrimaryLink", title: "Ana Buton Linki", type: "string", group: "hero", initialValue: "/urunler" }),
    defineField({ name: "heroSecondaryLabel", title: "İkinci Buton Metni", type: "string", group: "hero", initialValue: "Işık rengi rehberi" }),
    defineField({ name: "heroSecondaryLink", title: "İkinci Buton Linki", type: "string", group: "hero", initialValue: "#isik" }),
    defineField({
      name: "heroCaption",
      title: "Görsel Açıklaması",
      type: "string",
      group: "hero",
      description: "Hero görselindeki ürünü anlatır; seçilen ışık bilgisi sonuna eklenir.",
      initialValue: "Avior · Gold kasa, krem abajur",
    }),

    defineField({ name: "collectionTitle", title: "Başlık", type: "string", group: "collection", initialValue: "Koleksiyon" }),
    defineField({ name: "collectionText", title: "Açıklama", type: "text", rows: 2, group: "collection", initialValue: "Renk noktalarıyla kasa renklerini görün; ürüne dokunarak seçenekleri açın." }),
    defineField({
      name: "featuredProducts",
      title: "Öne Çıkan Ürünler",
      type: "array",
      group: "collection",
      description: "Boş bırakılırsa ilk 9 ürün gösterilir.",
      of: [{ type: "reference", to: [{ type: "product" }] }],
    }),
    defineField({ name: "collectionLinkLabel", title: "Tüm Ürünler Linki", type: "string", group: "collection", initialValue: "Tüm ürünleri görün" }),

    defineField({ name: "kelvinTitle", title: "Başlık", type: "string", group: "kelvin", initialValue: "Aynı masa, farklı ışık." }),
    defineField({
      name: "kelvinText",
      title: "Açıklama",
      type: "text",
      rows: 3,
      group: "kelvin",
      initialValue: "Kelvin değeri ışığın rengini belirler. Sürgüyü kaydırın: aynı masa, aynı Altıgen armatür, yalnızca ışık rengi değişir.",
    }),

    defineField({ name: "projectsTitle", title: "Başlık", type: "string", group: "projects", initialValue: "Otel, restoran ve kafe projeleri" }),
    defineField({
      name: "projectsText",
      title: "Metin",
      type: "text",
      rows: 6,
      group: "projects",
      description: "Paragrafları boş satırla ayırın.",
      initialValue:
        "Şarjlı masa lambaları kablo çekmeden her masaya ışık götürür; kapanıştan sonra şarj istasyonunda toplanır. Armatürlerde ölçü, profil yüksekliği ve RAL rengi projenize göre üretilir.\n\nMasa lambaları ortalama 8 saatte şarj olur, dokunarak üç kademede kısılır; elektronik aksamda 2 yıl garanti vardır.",
    }),
    defineField({ name: "stationsTitle", title: "Şarj İstasyonu Başlığı", type: "string", group: "projects", initialValue: "Şarj istasyonu" }),
    defineField({ name: "stationsText", title: "Şarj İstasyonu Metni", type: "string", group: "projects", initialValue: "Tek lambalık kasetten 36'lı istasyona kadar." }),

    defineField({ name: "ctaTitle", title: "Başlık", type: "string", group: "cta", initialValue: "Seçtiklerinizi gönderin, fiyatı projenize göre hazırlayalım." }),
    defineField({
      name: "ctaText",
      title: "Metin",
      type: "text",
      rows: 3,
      group: "cta",
      initialValue: "Ürünleri kasa rengi, ışık rengi ve adediyle teklif listesine ekleyin; liste tek bir WhatsApp mesajı olarak bize ulaşır.",
    }),
    defineField({ name: "ctaQuoteLabel", title: "Teklif Listesi Butonu", type: "string", group: "cta", initialValue: "Teklif listesini aç" }),
    defineField({ name: "ctaWhatsappLabel", title: "WhatsApp Butonu", type: "string", group: "cta", initialValue: "WhatsApp'tan yazın" }),

    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
});
