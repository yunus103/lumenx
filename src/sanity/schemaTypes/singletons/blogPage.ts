import { defineField, defineType } from "sanity";

export const blogPageType = defineType({
  name: "blogPage",
  title: "Blog Sayfası",
  type: "document",
  groups: [
    { name: "hero", title: "Page Hero Bölümü" },
    { name: "content", title: "Sayfa İçeriği" },
    { name: "seo", title: "SEO Ayarları" },
  ],
  fields: [
    // Page Hero Group
    defineField({ name: "heroTitle", title: "Hero Başlık", type: "string", group: "hero", description: "Sayfa üst kısmında duracak ana başlık. Boş bırakılırsa Sayfa Başlığı kullanılır." }),
    defineField({ name: "heroSubtitle", title: "Hero Alt Başlık / Kısa Açıklama", type: "text", rows: 2, group: "hero", description: "Sayfa üst kısmında duracak kısa açıklama yazısı." }),
    defineField({
      name: "heroImage",
      title: "Hero Arka Plan Görseli",
      type: "image",
      group: "hero",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt Metni", type: "string" })],
      description: "Hero arka plan resmi. Yüklenmezse şık bir degrade renk arka planı kullanılır."
    }),
    // Content Group
    defineField({ name: "pageTitle", title: "Sayfa Başlığı", type: "string", group: "content", validation: (Rule) => Rule.required(), initialValue: "Blog" }),
    defineField({
      name: "pageSubtitle",
      title: "Alt Başlık / Kısa Yazı",
      type: "text",
      rows: 3,
      group: "content",
      initialValue: "Mekân aydınlatması, şarjlı lambalar ve ışık rengi üzerine kısa rehberler.",
    }),
    defineField({ name: "allLabel", title: "Filtre: Tümü Metni", type: "string", group: "content", initialValue: "Tümü" }),
    defineField({ name: "emptyText", title: "Boş Liste Metni", type: "string", group: "content", initialValue: "Henüz yazı yok." }),
    defineField({ name: "backLabel", title: "Yazı Sayfası: Geri Linki", type: "string", group: "content", initialValue: "Tüm yazılar" }),
    defineField({ name: "relatedTitle", title: "Yazı Sayfası: İlgili Yazılar Başlığı", type: "string", group: "content", initialValue: "İlgili yazılar" }),
    defineField({ name: "ctaLabel", title: "CTA Buton Metni", type: "string", group: "content", description: "Boş bırakılırsa CTA butonu gizlenir" }),
    defineField({ name: "ctaLink", title: "CTA Buton Linki", type: "string", group: "content" }),
    // SEO Group
    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
});
