import { Link } from "react-router-dom";
import { useThemeStore } from "../../store/theme";
import logoDark from "../../assets/new-logo-dark.png";
import logoWhite from "../../assets/new-logo-white.png";

export function Logo({ light = false }: { light?: boolean }) {
  const { theme } = useThemeStore();
  const isDark = theme === "dark" || light;

  return (
    <Link
      to="/"
      className="flex items-center gap-2 group transition-transform duration-200 hover:scale-[1.02]"
      aria-label="Roots Tunisia Home"
    >
      <img
        src={isDark ? logoWhite : logoDark}
        alt="Roots Tunisia"
        className="h-9 md:h-10 w-auto object-contain transition-opacity duration-200"
      />
    </Link>
  );
}

export default Logo;
