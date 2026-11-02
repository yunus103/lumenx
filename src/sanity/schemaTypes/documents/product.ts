import { defineArrayMember, defineField, defineType } from "sanity";
import { turkishSlugify } from "../../lib/slugify";

export const KELVIN_OPTIONS = [
  { title: "2700 K · Sıcak beyaz", value: 2700 },
  { title: "3000 K · Yumuşak beyaz", value: 3000 },
  { title: "4000 K · Doğal beyaz", value: 4000 },
  { title: "6500 K · Gün ışığı", value: 6500 },
];

type RefList = { _ref: string }[] | undefined;

// Limits a variant photo's finish/shade picker to the ones chosen on the product itself.
const onlySelected = (field: "finishes" | "shades") => ({
  filter: ({ document }: { document: Record<string, unknown> }) => ({
    filter: "_id in $ids",
    params: { ids: ((document[field] as RefList) ?? []).map((r) => r._ref) },
  }),
});

export const productType = defineType({
  name: "product",
  title: "Ürün",
  type: "document",
  groups: [
    { name: "content", title: "İçerik", default: true },
    { name: "variants", title: "Seçenekler" },
    { name: "price", title: "Fiyat" },
    { name: "tech", title: "Teknik" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "name", title: "Ürün Adı", type: "string", group: "content", validation: (Rule) => Rule.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      options: { source: "name", slugify: turkishSlugify },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Kategori",
      type: "reference",
      to: [{ type: "productCategory" }],
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "summary", title: "Kısa Tanım", type: "string", group: "content", description: "Kartlarda ve başlık altında görünür. Örn: Şarjlı masa lambası · Ahşap gövde" }),
    defineField({ name: "description", title: "Açıklama", type: "array", group: "content", of: [defineArrayMember({ type: "block" })] }),
    defineField({
      name: "gallery",
      title: "Fotoğraflar",
      type: "array",
      group: "content",
      description: "İlk fotoğraf kapak olarak kullanılır.",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [defineField({ name: "alt", title: "Alt Metni", type: "string" })],
        }),
      ],
    }),

    defineField({ name: "finishes", title: "Gövde Renkleri", type: "array", group: "variants", of: [defineArrayMember({ type: "reference", to: [{ type: "finish" }] })] }),
    defineField({ name: "shades", title: "Abajur Renkleri", type: "array", group: "variants", of: [defineArrayMember({ type: "reference", to: [{ type: "shade" }] })] }),
    defineField({
      name: "variantPhotos",
      title: "Seçenek Fotoğrafları",
      type: "array",
      group: "variants",
      description: "Bir gövde rengi (ve varsa abajur) seçildiğinde gösterilecek fotoğraf. Eksik kombinasyonda en yakın fotoğraf gösterilir.",
      of: [
        defineArrayMember({
          type: "object",
          name: "variantPhoto",
          fields: [
            defineField({ name: "finish", title: "Gövde Rengi", type: "reference", to: [{ type: "finish" }], options: onlySelected("finishes"), validation: (Rule) => Rule.required() }),
            defineField({ name: "shade", title: "Abajur Rengi", type: "reference", to: [{ type: "shade" }], options: onlySelected("shades") }),
            defineField({
              name: "image",
              title: "Fotoğraf",
              type: "image",
              options: { hotspot: true },
              fields: [defineField({ name: "alt", title: "Alt Metni", type: "string" })],
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { finish: "finish.name", shade: "shade.name", media: "image" },
            prepare: ({ finish, shade, media }) => ({ title: [finish, shade].filter(Boolean).join(" · "), media }),
          },
        }),
      ],
    }),
    defineField({
      name: "kelvinOptions",
      title: "Işık Renkleri (Kelvin)",
      type: "array",
      group: "variants",
      of: [defineArrayMember({ type: "number" })],
      options: { list: KELVIN_OPTIONS },
      description: "Boş bırakılırsa kategorinin varsayılanı kullanılır.",
    }),
    defineField({
      name: "options",
      title: "Diğer Seçenekler",
      type: "array",
      group: "variants",
      description: "Ölçü, boy, malzeme gibi bilgi amaçlı seçenekler.",
      of: [
        defineArrayMember({
          type: "object",
          name: "productOption",
          fields: [
            defineField({ name: "name", title: "Seçenek Adı", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "values", title: "Değerler", type: "array", of: [defineArrayMember({ type: "string" })], options: { layout: "tags" } }),
          ],
          preview: { select: { title: "name", values: "values" }, prepare: ({ title, values }) => ({ title, subtitle: (values ?? []).join(", ") }) },
        }),
      ],
    }),

    defineField({
      name: "chargeOptions",
      title: "Ekonomik / Premium Şarj Seçeneği",
      type: "boolean",
      group: "price",
      description: "Açıksa ürün sayfasında batarya seçimi (Ekonomik 3 W / Premium 5 W) gösterilir.",
      initialValue: true,
    }),
    defineField({ name: "priceUsd", title: "Ekonomik Fiyat (USD)", type: "number", group: "price", description: "Tek fiyatlı ürünlerde sadece bunu doldurun.", validation: (Rule) => Rule.min(0) }),
    defineField({ name: "premiumPriceUsd", title: "Premium Fiyat (USD)", type: "number", group: "price", validation: (Rule) => Rule.min(0) }),

    defineField({
      name: "specs",
      title: "Teknik Özellikler",
      type: "array",
      group: "tech",
      of: [defineArrayMember({ type: "specRow" })],
      description: "Boş bırakılırsa kategorinin varsayılan tablosu gösterilir.",
    }),
    defineField({
      name: "datasheets",
      title: "Teknik Föyler",
      type: "array",
      group: "tech",
      of: [
        defineArrayMember({
          type: "object",
          name: "datasheet",
          fields: [
            defineField({ name: "title", title: "Başlık", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "url", title: "PDF Linki", type: "url", validation: (Rule) => Rule.required() }),
          ],
        }),
      ],
    }),
    defineField({ name: "modelKey", title: "3D Model Anahtarı", type: "string", group: "tech", description: "Geliştirici tarafından doldurulur. Boşsa ürün 3D görüntüleyicisiz gösterilir." }),
    defineField({
      name: "source",
      title: "Kaynak",
      type: "object",
      group: "tech",
      readOnly: true,
      description: "Import scriptinin eşleme bilgisi.",
      fields: [
        defineField({ name: "name", title: "Kaynak", type: "string" }),
        defineField({ name: "id", title: "Kaynak ID", type: "string" }),
        defineField({ name: "url", title: "Kaynak URL", type: "url" }),
      ],
    }),

    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
  preview: {
    select: { title: "name", category: "category.title", media: "gallery.0" },
    prepare: ({ title, category, media }) => ({ title, subtitle: category, media }),
  },
});
