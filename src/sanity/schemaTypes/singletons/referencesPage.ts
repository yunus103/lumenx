import { defineField, defineType } from "sanity";

export const referencesPageType = defineType({
  name: "referencesPage",
  title: "Referanslar Sayfası",
  type: "document",
  description: "Sayfanın yayında olması için Site Ayarları > \"Referanslar sayfası açık\" seçeneğini işaretleyin.",
  fields: [
    defineField({ name: "pageTitle", title: "Başlık", type: "string", validation: (Rule) => Rule.required(), initialValue: "Referanslar" }),
    defineField({
      name: "pageSubtitle",
      title: "Giriş Metni",
      type: "text",
      rows: 3,
      initialValue: "Otel, restoran ve kafelerde LUMENX. Her projede hangi lambanın kullanıldığını görün.",
    }),
    defineField({ name: "productsLabel", title: "Kullanılan Ürünler Başlığı", type: "string", initialValue: "Kullanılan ürünler" }),
    defineField({ name: "photoLabel", title: "Fotoğraf Sayısı Etiketi", type: "string", description: "Sayının yanında görünür: \"8 fotoğraf\".", initialValue: "fotoğraf" }),
    defineField({ name: "videoLabel", title: "Video Sayısı Etiketi", type: "string", description: "Sayının yanında görünür: \"2 video\".", initialValue: "video" }),
    defineField({ name: "emptyText", title: "Referans Yok Metni", type: "string", initialValue: "Referanslarımız çok yakında burada." }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
});
