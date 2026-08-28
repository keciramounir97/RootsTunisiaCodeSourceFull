import { useThemeStore } from "../../store/theme";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className={`relative flex items-center justify-between gap-2 transition-all duration-200 outline-none group px-2 py-1 rounded-lg hover:bg-[#d9a441]/10 ${className}`}
      aria-label="toggle-theme"
      type="button"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div className="flex items-center gap-2">
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-400 shrink-0" />
        ) : (
          <Moon className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
        )}
        <span className="text-xs font-bold text-gray-900 dark:text-gray-100 group-hover:text-[#d9a441] transition-colors">
          {isDark ? "Light Mode" : "Dark Mode"}
        </span>
      </div>
    </button>
  );
}
