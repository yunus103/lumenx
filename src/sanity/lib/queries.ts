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

// Cards render every product on /urunler, so they skip the blur placeholder (base64 barely gzips; the card
// shimmers instead) and the finish fields only the configurator needs.
export const productCardFields = /* groq */ `{
  _id, name, slug, summary, priceUsd, premiumPriceUsd,
  "category": category->{ _id, title, slug },
  "cover": gallery[0] ${lightImageFields},
  "finishes": finishes[]->{ _id, name, hex, finishType },
  "night": nightImage ${lightImageFields},
  "kelvin": coalesce(kelvinOptions[0], category->kelvinOptions[0]),
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
    searchLabel, searchPlaceholder, searchAllLabel, searchEmptyText,
    referencesEnabled,
    gaId, gtmId, googleSearchConsoleId,
    defaultSeo { metaTitle, metaDescription },
    defaultOgImage ${imageFields}
  },
  "navigation": *[_type == "navigation"][0] {
    headerLinks[] { label, href, openInNewTab, description, subLinks[] { label, href, openInNewTab, description, image ${lightImageFields} } },
    footerLinks[] { label, href, openInNewTab, subLinks[] { label, href, openInNewTab } },
    "legalLinks": *[_type == "legalPage" && defined(slug.current)] | order(_createdAt asc, title asc) { linkLabel, "slug": slug.current }
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
  heroTitle, pageTitle, body, "summary": pt::text(body[0]),
  featuredProduct->{ name, "image": gallery[0] ${imageFields} },
  seo
}`;

export const contactPageQuery = groq`*[_type == "contactPage"][0] {
  heroTitle, heroSubtitle,
  heroImage ${imageFields},
  pageTitle, phoneLabel, whatsappLinkLabel, whatsappMessage, emailLabel, addressLabel, directionsLabel, mapTitle,
  showForm, formTitle, formText, nameLabel, emailFieldLabel, phoneFieldLabel, subjectLabel, messageLabel, messagePlaceholder,
  optionalLabel, consentLinkLabel, consentHref, consentText, submitLabel, sendingLabel, successTitle, successMessage, resetLabel, errorMessage,
  "contactInfo": *[_type == "siteSettings"][0].contactInfo,
  seo
}`;

export const blogPageQuery = groq`*[_type == "blogPage"][0] {
  heroTitle, heroSubtitle,
  heroImage ${imageFields},
  pageTitle, pageSubtitle, ctaLabel, ctaLink, allLabel, emptyText, backLabel, relatedTitle, seo
}`;

export const legalPageBySlugQuery = groq`*[_type == "legalPage" && slug.current == $slug][0] {
  title, slug, updatedAt, updatedLabel, body, seo
}`;

export const notFoundQuery = groq`*[_type == "siteSettings"][0] {
  siteName, notFoundTitle, notFoundText, notFoundHomeLabel, notFoundCatalogLabel
}`;

// ─── Ürünler ───────────────────────────────────────────────────────────────────

export const productsPageQuery = groq`*[_type == "productsPage"][0] {
  pageTitle, pageSubtitle, allLabel, searchPlaceholder, countLabel, loadMoreLabel, emptyText, clearLabel, seo
}`;

const productOrder = /* groq */ `order(category->order asc, name asc)`;

export const productListQuery = groq`*[_type == "product" && defined(slug.current)] | ${productOrder} ${productCardFields}`;

export const productFallbackQuery = groq`*[_type == "product" && defined(slug.current)] | ${productOrder} [0...9] ${productCardFields}`;

export const productCategoriesQuery = groq`*[_type == "productCategory" && defined(slug.current)] | order(order asc, title asc) {
  _id, title, slug, order, description,
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
    "products": *[_type == "productsPage"][0] { _updatedAt, "noIndex": seo.noIndex },
    "references": *[_type == "referencesPage"][0] { _updatedAt, "noIndex": seo.noIndex }
  },
  "referencesEnabled": *[_type == "siteSettings"][0].referencesEnabled,
  "blogPosts": *[_type == "blogPost" && defined(slug.current) && !(seo.noIndex == true)] { "slug": slug.current, _updatedAt },
  "products": *[_type == "product" && defined(slug.current) && !(seo.noIndex == true)] { "slug": slug.current, _updatedAt },
  "categories": *[_type == "productCategory" && defined(slug.current) && !(seo.noIndex == true)] { "slug": slug.current, _updatedAt },
  "legalPages": *[_type == "legalPage" && defined(slug.current) && !(seo.noIndex == true)] { "slug": slug.current, _updatedAt }
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

// Header search index: fetched by the browser on first open, so it carries only what a result row shows.
export const searchIndexQuery = groq`*[_type == "product" && defined(slug.current)] | ${productOrder} {
  _id, name, "slug": slug.current, summary,
  "category": category->title,
  "cover": gallery[0] ${lightImageFields}
}`;

// ─── Referanslar ───────────────────────────────────────────────────────────────

export const referencesPageQuery = groq`*[_type == "referencesPage"][0] {
  pageTitle, pageSubtitle, productsLabel, photoLabel, videoLabel, emptyText, seo
}`;

// Only covers carry the blur placeholder; gallery items are thumbnails until the viewer opens them.
export const referenceListQuery = groq`*[_type == "reference" && defined(cover.asset)] | order(order asc, _createdAt desc) {
  _id, title, "slug": slug.current, location, year, summary,
  logo ${lightImageFields},
  cover ${imageFields},
  // filter before dereferencing: a filter after the projection turns every item into null
  "products": products[defined(@->slug.current)]->{ _id, name, slug, "cover": gallery[0] ${lightImageFields} },
  media[]{
    _key, _type, caption,
    _type == "image" => ${lightImageFields},
    _type == "referenceVideo" => { url, "fileUrl": file.asset->url, "mimeType": file.asset->mimeType, poster ${lightImageFields} }
  }
}`;
