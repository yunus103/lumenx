import { defineArrayMember, defineField, defineType } from "sanity";
import { turkishSlugify } from "../../lib/slugify";
import { KELVIN_OPTIONS } from "./product";

// Categories form a tree through `parent`, so a mega menu can be built later without a schema change.
// URLs stay flat (/urunler/[slug]) whatever the depth.
export const productCategoryType = defineType({
  name: "productCategory",
  title: "Ürün Kategorisi",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Kategori Adı", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", slugify: turkishSlugify },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "parent",
      title: "Üst Kategori",
      type: "reference",
      to: [{ type: "productCategory" }],
      description: "Boş bırakılırsa ana kategori olur.",
      options: { filter: ({ document }) => ({ filter: "_id != $id", params: { id: document._id.replace(/^drafts\./, "") } }) },
    }),
    defineField({ name: "order", title: "Sıra", type: "number", initialValue: 0, description: "Küçük sayı önce gösterilir." }),
    defineField({ name: "description", title: "Kısa Açıklama", type: "text", rows: 3 }),
    defineField({
      name: "image",
      title: "Kapak Görseli",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt Metni", type: "string" })],
    }),
    defineField({
      name: "kelvinOptions",
      title: "Varsayılan Işık Renkleri (Kelvin)",
      type: "array",
      of: [defineArrayMember({ type: "number" })],
      options: { list: KELVIN_OPTIONS },
      description: "Kendi Kelvin seçeneği girilmemiş ürünler bunu kullanır.",
      initialValue: [2700],
    }),
    defineField({
      name: "defaultSpecs",
      title: "Varsayılan Teknik Özellikler",
      type: "array",
      of: [defineArrayMember({ type: "specRow" })],
      description: "Kendi teknik özellik tablosu olmayan ürünlerde gösterilir.",
    }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  orderings: [{ title: "Sıra", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "title", parent: "parent.title", media: "image" },
    prepare: ({ title, parent, media }) => ({ title, subtitle: parent ? `${parent} ›` : undefined, media }),
  },
});
