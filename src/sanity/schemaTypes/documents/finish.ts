import { defineField, defineType } from "sanity";
import { ColorInput } from "../../components/ColorInput";
import { turkishSlugify } from "../../lib/slugify";

// Shared across products so "Gold" is the same swatch, RAL and filter value everywhere.
// The slug is also the key the 3D kit uses to pick its material.
export const finishType = defineType({
  name: "finish",
  title: "Gövde Rengi",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Ad", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "slug",
      title: "Anahtar",
      type: "slug",
      options: { source: "name", slugify: turkishSlugify },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "hex", title: "Swatch Rengi", type: "string", components: { input: ColorInput }, initialValue: "#d8be7e" }),
    defineField({ name: "finishType", title: "Kaplama Tipi", type: "string", description: "Örn: Metalik kaplama, Toz boya, Masif ahşap", initialValue: "Toz boya" }),
    defineField({ name: "ral", title: "RAL Kodu", type: "string", description: "En yakın RAL referansı. Metalik kaplamalarda boş kalabilir." }),
    defineField({ name: "ralName", title: "RAL Adı", type: "string" }),
    defineField({ name: "order", title: "Sıra", type: "number", initialValue: 0 }),
  ],
  orderings: [{ title: "Sıra", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "name", ral: "ral", type: "finishType" },
    prepare: ({ title, ral, type }) => ({ title, subtitle: [type, ral && `RAL ${ral}`].filter(Boolean).join(" · ") }),
  },
});
