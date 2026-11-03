import { defineField, defineType } from "sanity";

export const productsPageType = defineType({
  name: "productsPage",
  title: "Ürünler Sayfası",
  type: "document",
  fields: [
    defineField({ name: "pageTitle", title: "Başlık", type: "string", validation: (Rule) => Rule.required(), initialValue: "Ürünler" }),
    defineField({
      name: "pageSubtitle",
      title: "Giriş Metni",
      type: "text",
      rows: 3,
      initialValue: "Şarjlı masa lambaları, garson çağırma lambaları, aplikler ve şarj istasyonları. Renk noktalarıyla kasa renklerini görün; ürüne dokunarak seçenekleri açın.",
    }),
    defineField({ name: "allLabel", title: "Tümü Filtresi Metni", type: "string", initialValue: "Tümü" }),
    defineField({ name: "searchPlaceholder", title: "Arama Kutusu Metni", type: "string", initialValue: "Bu listede ara" }),
    defineField({ name: "countLabel", title: "Ürün Sayısı Etiketi", type: "string", description: "Sayının yanında görünür: \"24 ürün\".", initialValue: "ürün" }),
    defineField({ name: "loadMoreLabel", title: "Daha Fazla Butonu", type: "string", initialValue: "Daha fazla göster" }),
    defineField({ name: "emptyText", title: "Sonuç Yok Metni", type: "string", initialValue: "Aramanızla eşleşen ürün bulunamadı." }),
    defineField({ name: "clearLabel", title: "Aramayı Temizle Butonu", type: "string", initialValue: "Aramayı temizle" }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
});
