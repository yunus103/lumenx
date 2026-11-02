import Image from "next/image";
import Link from "next/link";
import type { Navigation, SiteSettings } from "@/types";

interface FooterProps {
  settings?: SiteSettings;
  navigation?: Navigation;
}

export function Footer({ settings, navigation }: FooterProps) {
  const contact = settings?.contactInfo;
  const tel = contact?.phone?.replace(/[^\d+]/g, "");

  return (
    <footer className="foot" id="iletisim" data-inert-when-modal>
      <div className="wrap">
        <div className="foot-top">
          <div className="foot-brand">
            <Image src="/brand/lumenx-light.svg" alt={settings?.siteName ?? "LUMENX"} width={190} height={61} unoptimized />
            {settings?.footerText && <p>{settings.footerText}</p>}
          </div>
          <dl>
            {contact?.phone && (
              <div>
                <dt>Telefon ve WhatsApp</dt>
                <dd>
                  <a href={`tel:${tel}`}>{contact.phone}</a>
                </dd>
              </div>
            )}
            {contact?.email && (
              <div>
                <dt>E-posta</dt>
                <dd>
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>
                </dd>
              </div>
            )}
            {contact?.address && (
              <div>
                <dt>Adres</dt>
                <dd>{contact.address}</dd>
              </div>
            )}
          </dl>
          <nav aria-label="Alt menü" className="foot-nav">
            {navigation?.footerLinks?.map((l) => (
              <Link key={l.href} href={l.href} target={l.openInNewTab ? "_blank" : undefined} rel={l.openInNewTab ? "noopener" : undefined}>
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="foot-bot">
          <span>
            © {new Date().getFullYear()} {settings?.legalName}
          </span>
          <span>Tasarım ve geliştirme: YayTech Studio</span>
        </div>
      </div>
    </footer>
  );
}
