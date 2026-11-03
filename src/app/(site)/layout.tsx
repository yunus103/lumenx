import { getLayoutData } from "@/lib/seo";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { QuoteProvider } from "@/components/quote/QuoteProvider";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const data = await getLayoutData();
  const s = data?.settings;
  // Only the search texts go to the client header, not the whole settings document.
  const search = { searchLabel: s?.searchLabel, searchPlaceholder: s?.searchPlaceholder, searchAllLabel: s?.searchAllLabel, searchEmptyText: s?.searchEmptyText };

  return (
    <QuoteProvider whatsappNumber={data?.settings?.contactInfo?.whatsappNumber}>
      <Header siteName={data?.settings?.siteName} links={data?.navigation?.headerLinks} search={search} />
      <main id="main" data-inert-when-modal>
        {children}
      </main>
      <Footer settings={data?.settings} navigation={data?.navigation} />
    </QuoteProvider>
  );
}
