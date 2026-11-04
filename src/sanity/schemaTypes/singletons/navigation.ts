import { defineField, defineType } from "sanity";

// Description and image only show in the header's mega menu; plain label + href still works.
const subLinkFields = [
  defineField({ name: "label", title: "Etiket", type: "string", validation: (Rule) => Rule.required() }),
  defineField({ name: "href", title: "Link / Path", type: "string", description: "Örn: /urunler/sarjli-masa-lambasi" }),
  defineField({ name: "openInNewTab", title: "Yeni Sekmede Aç", type: "boolean", initialValue: false }),
  defineField({ name: "description", title: "Kısa Açıklama", type: "string", description: "İsteğe bağlı. Header açılır menüsünde etiketin altında görünür." }),
  defineField({
    name: "image",
    title: "Görsel",
    type: "image",
    options: { hotspot: true },
    description: "İsteğe bağlı. Header açılır menüsünde kart görseli olur (yatay, 4:3).",
    fields: [defineField({ name: "alt", title: "Alt Metni", type: "string" })],
  }),
];

const navItemFields = [
  defineField({ name: "label", title: "Etiket", type: "string", validation: (Rule) => Rule.required() }),
  defineField({
    name: "href",
    title: "Link / Path",
    type: "string",
    description: "İç sayfa için: /hakkimizda, /blog gibi. Dış link için: https://google.com",
    validation: (Rule) => Rule.required(),
  }),
  defineField({ name: "openInNewTab", title: "Yeni Sekmede Aç", type: "boolean", initialValue: false }),
  defineField({
    name: "description",
    title: "Açılır Menü Metni",
    type: "text",
    rows: 2,
    description: "İsteğe bağlı. Yalnızca header'da, alt linkleri olan menünün açılır panelinde görünür.",
  }),
  defineField({
    name: "subLinks",
    title: "Alt Linkler",
    type: "array",
    description: "Header'da alt link eklenen menü, tıklanınca veya üzerine gelince açılır panel olur.",
    of: [{ type: "object", fields: subLinkFields, preview: { select: { title: "label", subtitle: "href", media: "image" } } }],
  }),
];

export const navigationType = defineType({
  name: "navigation",
  title: "Navigasyon",
  type: "document",
  fields: [
    defineField({
      name: "headerLinks",
      title: "Header Menü Linkleri",
      type: "array",
      of: [{ type: "object", fields: navItemFields, preview: { select: { title: "label", subtitle: "href" } } }],
    }),
    defineField({
      name: "footerLinks",
      title: "Footer Menü Linkleri",
      type: "array",
      of: [{ type: "object", fields: navItemFields, preview: { select: { title: "label", subtitle: "href" } } }],
    }),
  ],
});
