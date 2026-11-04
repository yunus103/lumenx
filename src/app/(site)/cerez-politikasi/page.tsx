import { LegalPage, legalMetadata } from "@/components/legal/LegalPage";

const SLUG = "cerez-politikasi";

export const generateMetadata = () => legalMetadata(SLUG);

export default function CookiePolicyPage() {
  return <LegalPage slug={SLUG} />;
}
