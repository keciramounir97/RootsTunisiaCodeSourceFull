import { Link } from "react-router-dom";
import { useThemeStore } from "../../store/theme";
import logoLight from "../../assets/roots-tunisia-logo-light.png";
import logoDark from "../../assets/roots-tunisia-logo-dark.png";

type LogoProps = {
  /** Force the white-text (dark-mode) lockup — e.g. on dark overlays. */
  light?: boolean;
  className?: string;
};

/**
 * Official Roots Tunisia wordmark + mosaic emblem.
 * Switches light/dark artwork with the site theme so it blends on both backgrounds.
 */
export function Logo({ light = false, className = "" }: LogoProps) {
  const { theme } = useThemeStore();
  const useDarkArtwork = light || theme === "dark";
  const src = useDarkArtwork ? logoDark : logoLight;

  return (
    <Link
      to="/"
      className={`inline-flex items-center shrink-0 transition-opacity duration-200 hover:opacity-90 ${className}`}
      aria-label="Roots Tunisia"
    >
      <img
        src={src}
        alt="Roots Tunisia"
        className="block h-8 w-auto max-w-[min(52vw,11.5rem)] object-contain object-left sm:h-9 sm:max-w-[13rem] md:h-10 md:max-w-[14.5rem]"
        width={290}
        height={148}
        decoding="async"
      />
    </Link>
  );
}

export default Logo;
