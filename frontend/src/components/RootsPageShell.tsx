import { memo, ReactNode } from "react";
import { useSiteImages, resolveSiteImageUrl } from "../hooks/useSiteImages";
import { DEFAULT_SITE_HERO } from "../config/siteImageLibrary";

interface RootsPageShellProps {
  hero?: ReactNode;
  heroClassName?: string;
  /** Optional override for the hero background (e.g. Public Content Manager). */
  heroBackgroundUrl?: string;
  children: ReactNode;
  className?: string;
}

const isAllowedSiteImage = (url: string) =>
  Boolean(url) &&
  (/\/heritage\//.test(url) ||
    /\/uploads\//.test(url) ||
    /\/assets\//.test(url) ||
    /^https?:\/\//i.test(url));

function RootsPageShell({
  hero,
  heroClassName = "",
  heroBackgroundUrl,
  children,
  className = "",
}: RootsPageShellProps) {
  const { heroImage } = useSiteImages();
  const SAFE_DEFAULT = DEFAULT_SITE_HERO;
  const candidate = String(heroBackgroundUrl || heroImage || SAFE_DEFAULT).trim();
  const resolved = resolveSiteImageUrl(candidate) || candidate;
  const backgroundUrl = isAllowedSiteImage(resolved) ? resolved : SAFE_DEFAULT;

  return (
    <div
      className={`roots-shell page-container w-full mx-auto relative bg-background text-foreground transition-colors duration-300 ${className}`}
    >
      {hero ? (
        <section
          className={`heritage-hero text-center py-16 px-4 border-b border-gold/40 shadow-lg relative ${heroClassName}`}
          style={{
            backgroundImage: `linear-gradient(rgba(26, 15, 10, 0.80), rgba(42, 31, 21, 0.90)), url(${backgroundUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {hero}
        </section>
      ) : null}
      <div className="relative">
        <div className="relative z-10 space-y-6 sm:space-y-8 lg:space-y-10 xl:space-y-12">
          {children}
        </div>
      </div>
    </div>
  );
}

export default memo(RootsPageShell);
