import Link from "next/link";
import { SanityImage } from "@/components/ui/SanityImage";
import type { HomePage, SanityImage as SanityImageType } from "@/types";

type ReferencesBandProps = Pick<HomePage, "referencesTitle" | "referencesText" | "referencesLinkLabel"> & { cover: SanityImageType };

export function ReferencesBand({ referencesTitle, referencesText, referencesLinkLabel, cover }: ReferencesBandProps) {
  return (
    <section aria-labelledby="hrH">
      <Link className="hr" href="/referanslar">
        <SanityImage image={cover} alt="" fill sizes="100vw" quality={80} />
        <div className="wrap hr-cap">
          <div>
            <h2 id="hrH">{referencesTitle}</h2>
            {referencesText && <p>{referencesText}</p>}
          </div>
          {referencesLinkLabel && <span className="btn btn-light">{referencesLinkLabel}</span>}
        </div>
      </Link>
    </section>
  );
}
