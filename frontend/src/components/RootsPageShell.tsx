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

/**
 * Public page shell matching homepage width:
 * full-bleed page + framed hero at --content-max + body column at --content-max.
 * Do not apply .roots-shell / .page-container here — those double-cap the width.
 */
function RootsPageShell({
  hero,
  heroClassName = "",
  heroBackgroundUrl,
  children,
  className = "",
}: RootsPageShellProps) {
  const { heroImage } = useSiteImages();
  // Prefer CMS / library placements; never fall back to lifestyle stock.
  const SAFE_DEFAULT = DEFAULT_SITE_HERO;
  const candidate = String(heroBackgroundUrl || heroImage || SAFE_DEFAULT).trim();
  const resolved = resolveSiteImageUrl(candidate) || candidate;
  const backgroundUrl = isAllowedSiteImage(resolved) ? resolved : SAFE_DEFAULT;

  return (
    <div
      className={`bg-[var(--background)] text-[var(--foreground)] min-h-screen relative ${className}`}
    >
      {hero ? (
        <section className={`px-4 pt-4 sm:px-6 lg:px-8 ${heroClassName}`}>
          <div className="frame-gold relative mx-auto flex w-full max-w-[var(--content-max)] min-h-[340px] items-center justify-center overflow-hidden rounded-md border border-[var(--gold)]/45 sm:min-h-[420px]">
            <img
              src={backgroundUrl}
              alt=""
              width={1600}
              height={1000}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[var(--brand-teal)]/70" />
            <div className="roots-page-hero-content relative z-10 flex w-full flex-col items-center justify-center px-5 py-12 text-center text-white sm:px-10 sm:py-16">
              {hero}
            </div>
          </div>
        </section>
      ) : null}

      <div className="relative w-full px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <div className="relative z-10 mx-auto flex w-full max-w-[var(--content-max)] flex-col gap-6 sm:gap-8 lg:gap-10 xl:gap-12">
          {children}
        </div>
      </div>
    </div>
  );
}

export default memo(RootsPageShell);
