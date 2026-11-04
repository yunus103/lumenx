import { LegalPage, legalMetadata } from "@/components/legal/LegalPage";

const SLUG = "kvkk";

export const generateMetadata = () => legalMetadata(SLUG);

export default function KvkkPage() {
  return <LegalPage slug={SLUG} />;
}
