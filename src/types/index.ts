import type { PortableTextBlock } from "@portabletext/react";

/**
 * Global TypeScript interfaces for Sanity documents and models.
 * Ensures strict typing, autocomplete, and zero warnings in IDE.
 */

export interface SanityImage {
  asset: {
    _ref?: string;
    _id?: string;
    url?: string;
    metadata?: {
      lqip?: string;
      dimensions?: {
        width: number;
        height: number;
        aspectRatio: number;
      };
    };
  };
  alt?: string;
  hotspot?: { x: number; y: number };
  crop?: { top: number; bottom: number; left: number; right: number };
}

export interface SanitySlug {
  current: string;
  _type?: "slug";
}

export interface BlogCategory {
  _id: string;
  title: string;
  slug: SanitySlug;
}

export interface BlogPost {
  _id?: string;
  _createdAt?: string;
  _updatedAt?: string;
  title: string;
  slug: SanitySlug;
  excerpt?: string;
  publishedAt?: string;
  category?: BlogCategory;
  mainImage?: SanityImage;
  body?: PortableTextBlock[];
  seoTags?: string[];
  seo?: SeoSettings;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface ContactInfo {
  phone?: string;
  email?: string;
  address?: string;
  whatsappNumber?: string;
  mapIframe?: string;
}

export interface SiteSettings {
  siteName: string;
  siteTagline?: string;
  legalName?: string;
  footerText?: string;
  logo?: SanityImage;
  logoHeight?: number;
  favicon?: { asset: { url: string } };
  contactInfo?: ContactInfo;
  socialLinks?: SocialLink[];
  searchLabel?: string;
  searchPlaceholder?: string;
  searchAllLabel?: string;
  searchEmptyText?: string;
  referencesEnabled?: boolean;
  gaId?: string;
  gtmId?: string;
  googleSearchConsoleId?: string;
  defaultSeo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
  defaultOgImage?: SanityImage;
}

export interface NavSubLink {
  label: string;
  href?: string;
  openInNewTab?: boolean;
  description?: string;
  image?: SanityImage;
}

export interface NavItem {
  label: string;
  href: string;
  openInNewTab?: boolean;
  /** Intro text of the header mega menu panel. */
  description?: string;
  subLinks?: NavSubLink[];
}

export interface Navigation {
  headerLinks?: NavItem[];
  footerLinks?: NavItem[];
  legalLinks?: LegalLink[];
}

export interface SpecRow {
  label: string;
  value: string;
}

export interface ProductCategory {
  _id: string;
  title: string;
  slug: SanitySlug;
  parent?: { _id: string; title: string; slug: SanitySlug };
  order?: number;
  description?: string;
  image?: SanityImage;
  kelvinOptions?: number[];
  defaultSpecs?: SpecRow[];
  seo?: SeoSettings;
}

export interface Finish {
  _id: string;
  name: string;
  slug: SanitySlug;
  hex?: string;
  finishType?: string;
  ral?: string;
  ralName?: string;
}

export interface Shade {
  _id: string;
  name: string;
  slug: SanitySlug;
  hex?: string;
}

export interface VariantPhoto {
  finish: { _id: string };
  shade?: { _id: string };
  image: SanityImage;
}

export interface ProductOption {
  name: string;
  values?: string[];
}

export interface Datasheet {
  title: string;
  url: string;
}

export interface CategoryRef {
  _id: string;
  title: string;
  slug: SanitySlug;
}

export interface CategoryListItem extends CategoryRef {
  order?: number;
  description?: string;
  parent?: CategoryRef;
  count: number;
}

export interface ProductCardData {
  _id: string;
  name: string;
  slug: SanitySlug;
  summary?: string;
  priceUsd?: number;
  premiumPriceUsd?: number;
  category: CategoryRef;
  cover?: SanityImage;
  finishes?: CardFinish[];
  variantPhotos?: VariantPhoto[];
  night?: SanityImage;
  kelvin?: number;
}

export type CardFinish = Pick<Finish, "_id" | "name" | "hex" | "finishType">;

export interface SearchItem {
  _id: string;
  name: string;
  slug: string;
  summary?: string;
  category?: string;
  cover?: SanityImage;
}

export interface RelatedProduct {
  _id: string;
  name: string;
  slug: SanitySlug;
  category: CategoryRef;
  cover?: SanityImage;
}

export interface Product {
  _id: string;
  _updatedAt?: string;
  name: string;
  slug: SanitySlug;
  category: Pick<ProductCategory, "_id" | "title" | "slug" | "kelvinOptions" | "defaultSpecs">;
  summary?: string;
  description?: PortableTextBlock[];
  gallery?: SanityImage[];
  finishes?: Finish[];
  shades?: Shade[];
  variantPhotos?: VariantPhoto[];
  kelvinOptions?: number[];
  options?: ProductOption[];
  chargeOptions?: boolean;
  priceUsd?: number;
  premiumPriceUsd?: number;
  specs?: SpecRow[];
  datasheets?: Datasheet[];
  modelKey?: string;
  seo?: SeoSettings;
}

export interface CtaLink {
  linkType: "internal" | "manual";
  manual?: string;
  internal?: {
    _type: string;
    slug?: string;
  };
}

export interface SeoSettings {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: SanityImage;
  canonicalUrl?: string;
  noIndex?: boolean;
}

export interface BasePage {
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: SanityImage;
  seo?: SeoSettings;
}

export interface AboutPage {
  heroTitle?: string;
  pageTitle: string;
  body?: PortableTextBlock[];
  /** Plain text of the first paragraph, the fallback meta description. */
  summary?: string;
  featuredProduct?: { name: string; image?: SanityImage };
  seo?: SeoSettings;
}

/** The contact form's labels and messages, all from the contactPage singleton. */
export interface ContactFormTexts {
  formTitle?: string;
  formText?: string;
  nameLabel?: string;
  emailFieldLabel?: string;
  phoneFieldLabel?: string;
  subjectLabel?: string;
  messageLabel?: string;
  messagePlaceholder?: string;
  optionalLabel?: string;
  consentLinkLabel?: string;
  consentHref?: string;
  consentText?: string;
  submitLabel?: string;
  sendingLabel?: string;
  successTitle?: string;
  successMessage?: string;
  resetLabel?: string;
  errorMessage?: string;
}

export interface ContactPage extends BasePage, ContactFormTexts {
  pageTitle: string;
  phoneLabel?: string;
  whatsappLinkLabel?: string;
  whatsappMessage?: string;
  emailLabel?: string;
  addressLabel?: string;
  directionsLabel?: string;
  mapTitle?: string;
  showForm?: boolean;
  contactInfo?: SiteSettings["contactInfo"];
}

export interface InnerPageWithCta extends BasePage {
  pageTitle: string;
  pageSubtitle?: string;
  ctaLabel?: string;
  ctaLink?: string;
}

export interface BlogPage extends InnerPageWithCta {
  allLabel?: string;
  emptyText?: string;
  backLabel?: string;
  relatedTitle?: string;
}

export interface LegalLink {
  linkLabel: string;
  slug: string;
}

export interface LegalPage {
  title: string;
  slug: SanitySlug;
  updatedAt?: string;
  updatedLabel?: string;
  body?: PortableTextBlock[];
  seo?: SeoSettings;
}

export interface NotFoundTexts {
  siteName?: string;
  notFoundTitle?: string;
  notFoundText?: string;
  notFoundHomeLabel?: string;
  notFoundCatalogLabel?: string;
}

export interface ProductsPage {
  pageTitle: string;
  pageSubtitle?: string;
  allLabel?: string;
  searchPlaceholder?: string;
  countLabel?: string;
  loadMoreLabel?: string;
  emptyText?: string;
  clearLabel?: string;
  seo?: SeoSettings;
}

export interface HomePage {
  heroTitle: string;
  heroText?: string;
  heroPrimaryLabel?: string;
  heroPrimaryLink?: string;
  heroSecondaryLabel?: string;
  heroSecondaryLink?: string;
  heroCaption?: string;
  categoryCards?: { _key: string; title: string; slug: string; image?: SanityImage }[];
  collectionTitle?: string;
  collectionText?: string;
  collectionLinkLabel?: string;
  featuredProducts?: ProductCardData[];
  kelvinTitle?: string;
  kelvinText?: string;
  referencesTitle?: string;
  referencesText?: string;
  referencesLinkLabel?: string;
  blogTitle?: string;
  blogLinkLabel?: string;
  ctaTitle?: string;
  ctaSteps?: { _key: string; title: string; text?: string }[];
  ctaNote?: string;
  ctaQuoteLabel?: string;
  ctaWhatsappLabel?: string;
  seo?: SeoSettings;
}

export interface BreadcrumbItem {
  label: string;
  href: string;
  active?: boolean;
}

export interface ReferencesPage {
  pageTitle: string;
  pageSubtitle?: string;
  productsLabel?: string;
  photoLabel?: string;
  videoLabel?: string;
  emptyText?: string;
  seo?: SeoSettings;
}

export type ReferenceMedia =
  | ({ _key: string; _type: "image"; caption?: string } & SanityImage)
  | { _key: string; _type: "referenceVideo"; caption?: string; url?: string; fileUrl?: string; mimeType?: string; poster?: SanityImage };

export interface Reference {
  _id: string;
  title: string;
  slug?: string;
  location?: string;
  year?: number;
  summary?: string;
  logo?: SanityImage;
  cover: SanityImage;
  products?: { _id: string; name: string; slug: SanitySlug; cover?: SanityImage }[];
  media?: ReferenceMedia[];
}
