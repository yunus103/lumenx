import { defineField, defineType } from "sanity";
import { turkishSlugify } from "../../lib/slugify";

// KVKK and cookie policy texts. Each one has its own route in the app (/kvkk, /cerez-politikasi), so the slug
// has to match it; the footer lists every legal page by its link label.
export const legalPageType = defineType({
  name: "legalPage",
  title: "Yasal Metin",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Başlık", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", slugify: turkishSlugify },
      description: "Sayfanın adresi: kvkk veya cerez-politikasi. Değiştirilirse sayfa açılmaz.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "linkLabel",
      title: "Footer Link Metni",
      type: "string",
      description: "Footer'daki yasal linklerde görünen kısa ad.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "updatedAt", title: "Son Güncelleme Tarihi", type: "date", initialValue: () => new Date().toISOString().slice(0, 10) }),
    defineField({ name: "updatedLabel", title: "Güncelleme Etiketi", type: "string", initialValue: "Son güncelleme" }),
    defineField({
      name: "body",
      title: "Metin",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Başlık 2", value: "h2" },
            { title: "Başlık 3", value: "h3" },
          ],
          marks: {
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [{ name: "href", type: "string", title: "URL / Bağlantı Yolu" }],
              },
            ],
          },
        },
      ],
    }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  preview: { select: { title: "title", subtitle: "slug.current" } },
});
