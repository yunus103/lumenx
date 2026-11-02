import { getLayoutData } from "@/lib/seo";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { QuoteProvider } from "@/components/quote/QuoteProvider";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const data = await getLayoutData();

  return (
    <QuoteProvider whatsappNumber={data?.settings?.contactInfo?.whatsappNumber}>
      <Header siteName={data?.settings?.siteName} links={data?.navigation?.headerLinks} />
      <main id="main" data-inert-when-modal>
        {children}
      </main>
      <Footer settings={data?.settings} navigation={data?.navigation} />
    </QuoteProvider>
  );
}
