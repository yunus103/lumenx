import { defineArrayMember, defineField, defineType } from "sanity";
import { turkishSlugify } from "../../lib/slugify";

// No detail page: every reference is a section on /referanslar, the slug is its anchor (/referanslar#slug).
export const referenceType = defineType({
  name: "reference",
  title: "Referans",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Müşteri / Mekan Adı", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", slugify: turkishSlugify },
      description: "Sayfa içi bağlantı için kullanılır: /referanslar#slug",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "order", title: "Sıra", type: "number", initialValue: 0, description: "Küçük sayı önce gösterilir." }),
    defineField({ name: "location", title: "Şehir / Konum", type: "string", initialValue: "İstanbul" }),
    defineField({ name: "year", title: "Yıl", type: "number", validation: (Rule) => Rule.integer().min(1990).max(2100) }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      description: "İsteğe bağlı. Şeffaf PNG veya SVG, açık renkli (koyu zemin üzerinde görünür).",
      fields: [defineField({ name: "alt", title: "Alt Metni", type: "string" })],
    }),
    defineField({
      name: "summary",
      title: "Yapılan İş",
      type: "text",
      rows: 4,
      description: "Kısa anlatım: mekan, kullanılan ışık, öne çıkan detay. Boş satır yeni paragraf başlatır.",
    }),
    defineField({
      name: "products",
      title: "Kullanılan Ürünler",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "product" }] })],
      validation: (Rule) => Rule.unique(),
    }),
    defineField({
      name: "cover",
      title: "Kapak Görseli",
      type: "image",
      options: { hotspot: true },
      description: "Galerinin ilk karesi. Yatay, en az 1600px genişlik önerilir.",
      fields: [defineField({ name: "alt", title: "Alt Metni", type: "string" })],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "media",
      title: "Fotoğraflar ve Videolar",
      type: "array",
      description: "Sürükleyerek sıralayın. Birden fazla fotoğrafı aynı anda bırakabilirsiniz.",
      of: [
        defineArrayMember({
          type: "image",
          title: "Fotoğraf",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Alt Metni", type: "string" }),
            defineField({ name: "caption", title: "Açıklama", type: "string" }),
          ],
        }),
        defineArrayMember({
          name: "referenceVideo",
          title: "Video",
          type: "object",
          fields: [
            defineField({
              name: "file",
              title: "Video Dosyası",
              type: "file",
              options: { accept: "video/mp4,video/webm" },
              description: "MP4 veya WebM. Büyük dosyalar yerine YouTube / Vimeo bağlantısı tercih edilebilir.",
            }),
            defineField({
              name: "url",
              title: "YouTube / Vimeo Bağlantısı",
              type: "url",
              validation: (Rule) => Rule.uri({ scheme: ["https"] }),
            }),
            defineField({
              name: "poster",
              title: "Kapak Karesi",
              type: "image",
              options: { hotspot: true },
              description: "Vimeo bağlantısı için gerekli. Diğerlerinde isteğe bağlı: boşsa YouTube kapağı veya videonun ilk karesi kullanılır.",
            }),
            defineField({ name: "caption", title: "Açıklama", type: "string" }),
          ],
          validation: (Rule) =>
            Rule.custom((value: { file?: unknown; url?: string; poster?: unknown } | undefined) => {
              if (!value?.file && !value?.url) return "Bir video dosyası yükleyin veya bağlantı girin.";
              // Vimeo gives no thumbnail without an API call, so the tile would stay empty
              if (!value.file && value.url?.includes("vimeo.com") && !value.poster) return "Vimeo videosu için kapak karesi ekleyin.";
              return true;
            }),
          preview: {
            select: { caption: "caption", url: "url", media: "poster" },
            prepare: ({ caption, url, media }) => ({ title: caption || url || "Video", subtitle: "Video", media }),
          },
        }),
      ],
    }),
  ],
  orderings: [{ title: "Sıra", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "title", location: "location", year: "year", media: "cover" },
    prepare: ({ title, location, year, media }) => ({ title, subtitle: [location, year].filter(Boolean).join(", "), media }),
  },
});
