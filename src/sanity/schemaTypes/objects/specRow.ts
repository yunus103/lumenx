import { defineField, defineType } from "sanity";

export const specRowType = defineType({
  name: "specRow",
  title: "Özellik Satırı",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Özellik", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "value", title: "Değer", type: "string", validation: (Rule) => Rule.required() }),
  ],
  preview: { select: { title: "label", subtitle: "value" } },
});
