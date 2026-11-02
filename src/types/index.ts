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
  gaId?: string;
  gtmId?: string;
  googleSearchConsoleId?: string;
  defaultSeo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
  defaultOgImage?: SanityImage;
}

export interface NavItem {
  label: string;
  href: string;
  openInNewTab?: boolean;
  subLinks?: NavItem[];
}

export interface Navigation {
  headerLinks?: NavItem[];
  footerLinks?: NavItem[];
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
  finishes?: Finish[];
  variantPhotos?: VariantPhoto[];
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

export interface AboutPage extends BasePage {
  pageTitle: string;
  pageSubtitle?: string;
  body?: PortableTextBlock[];
  mainImage?: SanityImage;
}

export interface ContactPage extends BasePage {
  pageTitle: string;
  pageSubtitle?: string;
  showForm?: boolean;
  formTitle?: string;
  successMessage?: string;
  contactInfo?: SiteSettings["contactInfo"];
}

export interface InnerPageWithCta extends BasePage {
  pageTitle: string;
  pageSubtitle?: string;
  ctaLabel?: string;
  ctaLink?: string;
}

export type BlogPage = InnerPageWithCta;

export interface ProductsPage {
  pageTitle: string;
  pageSubtitle?: string;
  allLabel?: string;
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
  collectionTitle?: string;
  collectionText?: string;
  collectionLinkLabel?: string;
  featuredProducts?: ProductCardData[];
  kelvinTitle?: string;
  kelvinText?: string;
  projectsTitle?: string;
  projectsText?: string;
  stationsTitle?: string;
  stationsText?: string;
  ctaTitle?: string;
  ctaText?: string;
  ctaQuoteLabel?: string;
  ctaWhatsappLabel?: string;
  seo?: SeoSettings;
}

export interface BreadcrumbItem {
  label: string;
  href: string;
  active?: boolean;
}
