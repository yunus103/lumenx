import { groq } from "next-sanity";

// ─── Shared Fragments ──────────────────────────────────────────────────────────

/**
 * Shared GROQ projection for SanityImage fields.
 * Includes LQIP blur preview, dimensions, alt text, hotspot, and crop.
 */
export const imageFields = /* groq */ `{
  asset->{ _id, url, metadata { lqip, dimensions } },
  alt,
  hotspot,
  crop
}`;

// Swapped in on interaction only, so no blur placeholder (keeps 100+ card listings light).
const lightImageFields = /* groq */ `{ asset->{ _id, url }, alt, hotspot, crop }`;

const finishFields = /* groq */ `{ _id, name, slug, hex, finishType, ral, ralName }`;

export const productCardFields = /* groq */ `{
  _id, name, slug, summary, priceUsd, premiumPriceUsd,
  "category": category->{ _id, title, slug },
  "cover": gallery[0] ${imageFields},
  "finishes": finishes[]->${finishFields},
  "variantPhotos": variantPhotos[]{ "finish": finish->{ _id }, "shade": shade->{ _id }, image ${lightImageFields} }
}`;

// ─── Layout ────────────────────────────────────────────────────────────────────
// Her sayfada bir kez çekilir — header, footer, global ayarlar
export const layoutQuery = groq`{
  "settings": *[_type == "siteSettings"][0] {
    siteName, siteTagline, legalName, footerText,
    logo ${imageFields},
    logoHeight,
    favicon { asset->{ _id, url } },
    contactInfo { phone, email, address, whatsappNumber, mapIframe },
    socialLinks[] { platform, url },
    gaId, gtmId, googleSearchConsoleId,
    defaultSeo { metaTitle, metaDescription },
    defaultOgImage ${imageFields}
  },
  "navigation": *[_type == "navigation"][0] {
    headerLinks[] { label, href, openInNewTab, subLinks[] { label, href, openInNewTab } },
    footerLinks[] { label, href, openInNewTab, subLinks[] { label, href, openInNewTab } }
  }
}`;

// ─── Sayfalar ──────────────────────────────────────────────────────────────────

export const homePageQuery = groq`*[_type == "homePage"][0] {
  heroTitle, heroText, heroPrimaryLabel, heroPrimaryLink, heroSecondaryLabel, heroSecondaryLink, heroCaption,
  collectionTitle, collectionText, collectionLinkLabel,
  "featuredProducts": featuredProducts[]->${productCardFields},
  kelvinTitle, kelvinText,
  projectsTitle, projectsText, stationsTitle, stationsText,
  ctaTitle, ctaText, ctaQuoteLabel, ctaWhatsappLabel,
  seo
}`;

export const aboutPageQuery = groq`*[_type == "aboutPage"][0] {
  heroTitle, heroSubtitle,
  heroImage ${imageFields},
  pageTitle, pageSubtitle, body,
  mainImage ${imageFields},
  seo
}`;

export const contactPageQuery = groq`*[_type == "contactPage"][0] {
  heroTitle, heroSubtitle,
  heroImage ${imageFields},
  pageTitle, pageSubtitle, showForm, formTitle, successMessage,
  "contactInfo": *[_type == "siteSettings"][0].contactInfo,
  seo
}`;

export const blogPageQuery = groq`*[_type == "blogPage"][0] {
  heroTitle, heroSubtitle,
  heroImage ${imageFields},
  pageTitle, pageSubtitle, ctaLabel, ctaLink, seo
}`;

// ─── Ürünler ───────────────────────────────────────────────────────────────────

export const productsPageQuery = groq`*[_type == "productsPage"][0] { pageTitle, pageSubtitle, allLabel, seo }`;

const productOrder = /* groq */ `order(category->order asc, name asc)`;

export const productListQuery = groq`*[_type == "product" && defined(slug.current)] | ${productOrder} ${productCardFields}`;

export const productFallbackQuery = groq`*[_type == "product" && defined(slug.current)] | ${productOrder} [0...9] ${productCardFields}`;

// A category page lists its own products and those of its direct children.
export const productsByCategoryQuery = groq`*[_type == "product" && defined(slug.current) && (category->slug.current == $slug || category->parent->slug.current == $slug)] | ${productOrder} ${productCardFields}`;

export const productCategoriesQuery = groq`*[_type == "productCategory" && defined(slug.current)] | order(order asc, title asc) {
  _id, title, slug, order,
  "parent": parent->{ _id, title, slug },
  "count": count(*[_type == "product" && (category._ref == ^._id || category->parent._ref == ^._id)])
}`;

export const categoryBySlugQuery = groq`*[_type == "productCategory" && slug.current == $slug][0] {
  _id, title, slug, description,
  "parent": parent->{ _id, title, slug },
  seo
}`;

export const productBySlugQuery = groq`*[_type == "product" && slug.current == $slug][0] {
  _id, _updatedAt, name, slug, summary, description, chargeOptions, priceUsd, premiumPriceUsd,
  kelvinOptions, modelKey, seo,
  "category": category->{ _id, title, slug, kelvinOptions, defaultSpecs[]{ label, value } },
  gallery[] ${imageFields},
  "finishes": finishes[]->${finishFields},
  "shades": shades[]->{ _id, name, slug, hex },
  "variantPhotos": variantPhotos[]{ "finish": finish->{ _id }, "shade": shade->{ _id }, image ${imageFields} },
  options[]{ name, values },
  specs[]{ label, value },
  datasheets[]{ title, url }
}`;

export const relatedProductsQuery = groq`*[_type == "product" && category._ref == $categoryId && _id != $id && defined(slug.current)] | order(name asc)[0...4] {
  _id, name, slug,
  "category": category->{ _id, title, slug },
  "cover": gallery[0] ${imageFields}
}`;

export const productSlugsQuery = groq`*[_type == "product" && defined(slug.current)] { "slug": slug.current }`;
export const categorySlugsQuery = groq`*[_type == "productCategory" && defined(slug.current)] { "slug": slug.current }`;

// ─── Blog ──────────────────────────────────────────────────────────────────────

export const blogListQuery = groq`*[_type == "blogPost"] | order(publishedAt desc) {
  title, slug, excerpt, publishedAt, category->{title, slug},
  mainImage ${imageFields}
}`;

export const blogFallbackQuery = groq`*[_type == "blogPost"] | order(publishedAt desc)[0...3] {
  title, slug, excerpt, publishedAt, category->{title, slug},
  mainImage ${imageFields}
}`;

export const blogPostBySlugQuery = groq`*[_type == "blogPost" && slug.current == $slug][0] {
  _id, _updatedAt, title, slug, publishedAt, excerpt, category->{_id, title, slug}, seoTags,
  mainImage ${imageFields},
  body[] {
    ...,
    _type == "image" => {
      asset->{ _id, url, metadata { lqip, dimensions } },
      alt, alignment, size, hotspot, crop
    }
  },
  seo
}`;

export const blogCategoriesQuery = groq`*[_type == "blogCategory"] | order(title asc) {
  _id, title, slug
}`;

export const blogListByCategorySlugQuery = groq`*[_type == "blogPost" && category->slug.current == $slug] | order(publishedAt desc) {
  title, slug, excerpt, publishedAt, category->{title, slug},
  mainImage ${imageFields}
}`;

export const blogRelatedPostsQuery = groq`*[_type == "blogPost" && category._ref == $categoryId && _id != $currentPostId] | order(publishedAt desc)[0...3] {
  title, slug, excerpt, publishedAt, category->{title, slug},
  mainImage ${imageFields}
}`;

// ─── Sitemap ───────────────────────────────────────────────────────────────────

export const allSlugsForSitemapQuery = groq`{
  "pages": {
    "home": *[_type == "homePage"][0] { _updatedAt, "noIndex": seo.noIndex },
    "about": *[_type == "aboutPage"][0] { _updatedAt, "noIndex": seo.noIndex },
    "contact": *[_type == "contactPage"][0] { _updatedAt, "noIndex": seo.noIndex },
    "blog": *[_type == "blogPage"][0] { _updatedAt, "noIndex": seo.noIndex },
    "products": *[_type == "productsPage"][0] { _updatedAt, "noIndex": seo.noIndex }
  },
  "blogPosts": *[_type == "blogPost" && defined(slug.current) && !(seo.noIndex == true)] { "slug": slug.current, _updatedAt },
  "products": *[_type == "product" && defined(slug.current) && !(seo.noIndex == true)] { "slug": slug.current, _updatedAt },
  "categories": *[_type == "productCategory" && defined(slug.current) && !(seo.noIndex == true)] { "slug": slug.current, _updatedAt }
}`;

// ─── Varsayılan SEO ────────────────────────────────────────────────────────────

export const defaultSeoQuery = groq`*[_type == "siteSettings"][0] {
  "title": defaultSeo.metaTitle,
  "description": defaultSeo.metaDescription,
  "ogImage": defaultOgImage,
  siteName,
  siteTagline,
  favicon { asset->{ _id, url } },
  googleSearchConsoleId
}`;

export const blogSlugsQuery = groq`*[_type == "blogPost" && defined(slug.current)] { "slug": slug.current }`;
