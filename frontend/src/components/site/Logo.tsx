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
export type LogoSize = "sm" | "md" | "lg";

const LOGO_SIZE_CLASSES: Record<LogoSize, string> = {
  sm: "h-[clamp(26px,2vw+18px,34px)] max-w-[min(100%,120px)]",
  md: "h-[clamp(28px,2.5vw+20px,42px)] max-w-[min(100%,140px)] sm:max-w-[165px]",
  lg: "h-[clamp(34px,3vw+22px,50px)] max-w-[min(100%,160px)] sm:max-w-[190px]",
};

export function Logo({
  light = false,
  size = "md",
  className = "",
}: LogoProps & { size?: LogoSize }) {
  const { theme } = useThemeStore();
  const useDarkArtwork = light || theme === "dark";
  const src = useDarkArtwork ? logoDark : logoLight;

  return (
    <Link
      to="/"
      className={`inline-flex items-center shrink-0 max-w-full transition-opacity duration-200 hover:opacity-90 ${className}`}
      aria-label="Roots Tunisia"
    >
      <img
        src={src}
        alt="Roots Tunisia"
        className={`block ${LOGO_SIZE_CLASSES[size]} w-auto object-contain object-left rtl:object-right shrink-0 transition-[height,max-width] duration-200`}
        width={290}
        height={148}
        decoding="async"
      />
    </Link>
  );
}

export default Logo;
