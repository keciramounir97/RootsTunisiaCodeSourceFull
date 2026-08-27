import { memo, ReactNode } from "react";
import { useSiteImages } from "../hooks/useSiteImages";

interface RootsPageShellProps {
  hero?: ReactNode;
  heroClassName?: string;
  children: ReactNode;
  className?: string;
}

function RootsPageShell({
  hero,
  heroClassName = "",
  children,
  className = "",
}: RootsPageShellProps) {
  const { heroImage } = useSiteImages();

  return (
    <div
      className={`roots-shell page-container w-full mx-auto relative ${className}`}
    >
      {hero ? (
        <section
          className={`heritage-hero text-center ${heroClassName}`}
          style={{
            backgroundImage: `linear-gradient(rgba(7, 24, 39, 0.75), rgba(15, 39, 66, 0.85)), url(${heroImage})`,
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
