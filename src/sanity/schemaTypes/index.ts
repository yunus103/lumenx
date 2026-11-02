import { seoType } from "./objects/seo";
import { socialLinkType } from "./objects/socialLink";
import { customHtmlType } from "./objects/customHtml";
import { specRowType } from "./objects/specRow";
import { siteSettingsType } from "./singletons/siteSettings";
import { navigationType } from "./singletons/navigation";
import { homePageType } from "./singletons/homePage";
import { aboutPageType } from "./singletons/aboutPage";
import { contactPageType } from "./singletons/contactPage";
import { blogPageType } from "./singletons/blogPage";
import { blogPostType } from "./documents/blogPost";
import { blogCategoryType } from "./documents/blogCategory";
import { productType } from "./documents/product";
import { productCategoryType } from "./documents/productCategory";
import { finishType } from "./documents/finish";
import { shadeType } from "./documents/shade";

export const schemaTypes = [
  // Objects
  seoType,
  socialLinkType,
  customHtmlType,
  specRowType,
  // Singletons
  siteSettingsType,
  navigationType,
  homePageType,
  aboutPageType,
  contactPageType,
  blogPageType,
  // Collections
  blogPostType,
  blogCategoryType,
  productType,
  productCategoryType,
  finishType,
  shadeType,
];

