import { defineField, defineType } from "sanity";
import { ColorInput } from "../../components/ColorInput";
import { turkishSlugify } from "../../lib/slugify";

export const shadeType = defineType({
  name: "shade",
  title: "Abajur Rengi",
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
    defineField({ name: "hex", title: "Swatch Rengi", type: "string", components: { input: ColorInput }, initialValue: "#d8d3b3" }),
    defineField({ name: "order", title: "Sıra", type: "number", initialValue: 0 }),
  ],
  orderings: [{ title: "Sıra", name: "order", by: [{ field: "order", direction: "asc" }] }],
});
