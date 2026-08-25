import { useThemeStore } from "../../store/theme";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className={`relative flex items-center justify-between gap-3 transition-all duration-200 outline-none group ${className}`}
      aria-label="toggle-theme"
      type="button"
      title={isDark ? "Switch to light" : "Switch to dark"}
    >
      <div className="flex items-center gap-2">
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-400 shrink-0" />
        ) : (
          <Moon className="w-4 h-4 text-yellow-200 shrink-0" />
        )}
        <span className="text-xs font-medium text-[#e8dfca] group-hover:text-white transition-colors">
          {isDark ? "Light Mode" : "Dark Mode"}
        </span>
      </div>
    </button>
  );
}

