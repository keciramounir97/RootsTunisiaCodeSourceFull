import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { useThemeStore } from "../../store/theme";
import { useTranslation } from "../../context/TranslationContext";

const LABELS: Record<string, string> = {
  admin: "Admin",
  users: "Users",
  books: "Books",
  trees: "Family Trees",
  gallery: "Gallery",
  settings: "Settings",
  activity: "Activity",
};

export default function Breadcrumb() {
  const { pathname } = useLocation();
  const { theme } = useThemeStore();
  const { t } = useTranslation();
  const isDark = theme === "dark";

  const parts = pathname.split("/").filter(Boolean);

  const segments = parts.map((p, i) => ({
    raw: p,
    label: t(p) || LABELS[p] || p.charAt(0).toUpperCase() + p.slice(1),
    to: "/" + parts.slice(0, i + 1).join("/"),
  }));

  const baseText = "!text-white";
  const accent = "!text-white/90 hover:!text-white";
  const muted = "!text-white/70";

  return (
    <nav className={`text-sm mb-4 ${baseText} drop-shadow-sm`}>
      <ol className="flex items-center gap-2 flex-wrap">
        {/* Home */}
        <li>
          <Link
            to="/"
            className={`inline-flex items-center gap-2 ${accent} font-medium hover:underline transition-colors`}
          >
            <Home className="w-4 h-4 text-white" />
            <span className="text-white">{t("home", "Home")}</span>
          </Link>
        </li>

        {/* Segments */}
        {segments.map((s, i) => (
          <li key={s.to} className="flex items-center gap-2">
            <ChevronRight className={`w-4 h-4 ${muted}`} />

            {i === segments.length - 1 ? (
              <span className="font-bold text-white">
                {String(s.label).replace(/-/g, " ")}
              </span>
            ) : (
              <Link
                to={s.to}
                className={`${accent} hover:underline capitalize text-white/90`}
              >
                {String(s.label).replace(/-/g, " ")}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

