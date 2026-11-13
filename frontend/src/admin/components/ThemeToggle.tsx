import { useThemeStore } from "../../store/theme";
import { Moon, Sun } from "lucide-react";
import { useTranslation } from "../../context/TranslationContext";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useThemeStore();
  const { t } = useTranslation();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className={`relative flex items-center justify-between gap-2 transition-all duration-200 outline-none group px-2 py-1 rounded-lg hover:bg-[#d9a441]/10 ${className}`}
      aria-label={t("theme_toggle_aria", "Changer de thème")}
      type="button"
      title={isDark ? t("theme_switch_light", "Passer au mode clair") : t("theme_switch_dark", "Passer au mode sombre")}
    >
      <div className="flex items-center gap-2">
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-400 shrink-0" />
        ) : (
          <Moon className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
        )}
        <span className="text-xs font-bold text-gray-900 dark:text-gray-100 group-hover:text-[#d9a441] transition-colors">
          {isDark ? t("theme_light_mode", "Mode Clair") : t("theme_dark_mode", "Mode Sombre")}
        </span>
      </div>
    </button>
  );
}
