import { defineField, defineType } from "sanity";

export const aboutPageType = defineType({
  name: "aboutPage",
  title: "Hakkımızda",
  type: "document",
  groups: [
    { name: "content", title: "Sayfa İçeriği" },
    { name: "seo", title: "SEO Ayarları" },
  ],
  fields: [
    defineField({ name: "heroTitle", title: "Başlık", type: "string", group: "content", description: "Sayfanın büyük başlığı. Boş bırakılırsa Sayfa Adı kullanılır.", initialValue: "Hakkımızda" }),
    defineField({ name: "pageTitle", title: "Sayfa Adı", type: "string", group: "content", description: "Tarayıcı sekmesi ve arama sonuçlarında görünen sayfa adı.", initialValue: "Hakkımızda", validation: (Rule) => Rule.required() }),
    defineField({
      name: "featuredProduct",
      title: "Görseldeki Ürün",
      type: "reference",
      to: [{ type: "product" }],
      group: "content",
      description: "Metnin yanında ürünün ilk fotoğrafı gösterilir.",
      initialValue: { _ref: "product-ld-224c5b4f-a52d-4069-9485-e7142cb02518" },
    }),
    defineField({
      name: "body",
      title: "Metin",
      type: "array",
      of: [{ type: "block" }],
      group: "content",
      description: "İlk paragraf, SEO açıklaması boşsa arama sonuçlarında kullanılır.",
      initialValue: [
        "LUMENX, aydınlatma alanında kaliteli, güvenilir ve yenilikçi ürünler sunmak amacıyla kurulmuş bir markadır. Otel, restoran, kafe ve seçkin mekânların ihtiyaçlarını doğru analiz ederek, şarjlı masa lambalarından armatür ve şarj istasyonlarına uzanan ürün yelpazemizle hizmet veriyoruz.",
        "Ürünlerimizi kalite, dayanıklılık ve performans kriterlerini esas alarak seçiyor, uzun ömürlü ve güvenli kullanım sağlamayı hedefliyoruz. Modele göre değişen gövde rengi ve abajur seçenekleriyle her mekâna uygun çözümler sunuyoruz.",
        "Sektördeki gelişmeleri yakından takip eden ve müşteri memnuniyetini ön planda tutan bir anlayışla çalışıyoruz. Amacımız yalnızca ürün satışı yapmak değil; doğru ürün, doğru çözüm ve sürdürülebilir hizmet anlayışıyla müşterilerimize uzun vadeli değer katmaktır.",
      ].map((text, i) => ({
        _type: "block",
        _key: `about-${i}`,
        style: "normal",
        markDefs: [],
        children: [{ _type: "span", _key: `about-${i}-text`, text, marks: [] }],
      })),
    }),
    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
});
