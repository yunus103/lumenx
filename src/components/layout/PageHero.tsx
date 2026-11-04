import { SanityImage } from "@/components/ui/SanityImage";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SanityImage as SanityImageType, BreadcrumbItem } from "@/types";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: SanityImageType;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
}

// The catalogue head (`.cat-head`) for every inner page: huge expanded title left, intro on its baseline right.
// The image is no longer a background behind the text; when set, it runs as a wide frame under the head.
export function PageHero({ title, subtitle, backgroundImage, breadcrumbs, className = "" }: PageHeroProps) {
  return (
    <header className={`ph ${className}`}>
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} className="wrap ph-crumbs" />}
      <div className="wrap cat-head">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {backgroundImage?.asset && (
        <div className="wrap">
          <div className="ph-media">
            <SanityImage image={backgroundImage} fill sizes="(max-width: 1280px) 100vw, 1184px" quality={85} priority />
          </div>
        </div>
      )}
    </header>
  );
}
