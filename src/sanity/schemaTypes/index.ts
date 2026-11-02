import { seoType } from "./objects/seo";
import { socialLinkType } from "./objects/socialLink";
import { customHtmlType } from "./objects/customHtml";
import { siteSettingsType } from "./singletons/siteSettings";
import { navigationType } from "./singletons/navigation";
import { homePageType } from "./singletons/homePage";
import { aboutPageType } from "./singletons/aboutPage";
import { contactPageType } from "./singletons/contactPage";
import { blogPageType } from "./singletons/blogPage";
import { blogPostType } from "./documents/blogPost";
import { blogCategoryType } from "./documents/blogCategory";

export const schemaTypes = [
  // Objects
  seoType,
  socialLinkType,
  customHtmlType,
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
];

