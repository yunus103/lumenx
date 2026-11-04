import { getLayoutData } from "@/lib/seo";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { QuoteProvider } from "@/components/quote/QuoteProvider";
import type { Navigation, NavItem } from "@/types";

const isReferencesLink = (href?: string) => href?.split(/[?#]/)[0].replace(/\/$/, "") === "/referanslar";

// With the references switch off, no menu may point at the 404 it returns.
function withoutReferences(navigation?: Navigation): Navigation | undefined {
  if (!navigation) return navigation;
  const strip = (links?: NavItem[]) =>
    links
      ?.filter((l) => !isReferencesLink(l.href))
      .map((l) => (l.subLinks ? { ...l, subLinks: l.subLinks.filter((s) => !isReferencesLink(s.href)) } : l));
  return { ...navigation, headerLinks: strip(navigation.headerLinks), footerLinks: strip(navigation.footerLinks) };
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const data = await getLayoutData();
  const s = data?.settings;
  const navigation = s?.referencesEnabled ? data?.navigation : withoutReferences(data?.navigation);
  // Only the search texts go to the client header, not the whole settings document.
  const search = { searchLabel: s?.searchLabel, searchPlaceholder: s?.searchPlaceholder, searchAllLabel: s?.searchAllLabel, searchEmptyText: s?.searchEmptyText };
  const c = s?.contactInfo;
  const contact = { phone: c?.phone, whatsappNumber: c?.whatsappNumber, email: c?.email };

  return (
    <QuoteProvider whatsappNumber={data?.settings?.contactInfo?.whatsappNumber}>
      <Header siteName={data?.settings?.siteName} links={navigation?.headerLinks} search={search} contact={contact} />
      <main id="main" data-inert-when-modal>
        {children}
      </main>
      <Footer settings={data?.settings} navigation={navigation} />
    </QuoteProvider>
  );
}
