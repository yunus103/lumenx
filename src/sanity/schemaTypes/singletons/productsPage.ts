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
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
});
