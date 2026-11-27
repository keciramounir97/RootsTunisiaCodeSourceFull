import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from "react";
import { useThemeStore } from "../store/theme";

export type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

const STORAGE_KEY = "theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "dark" || saved === "light") return saved;
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // ignore
    }
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);

    // Keep zustand store synchronized
    const storeState = useThemeStore.getState();
    if (storeState.theme !== theme) {
      useThemeStore.setState({ theme });
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === "light" ? "dark" : "light"));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
      setTheme,
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextType {
  const store = useThemeStore();
  const context = useContext(ThemeContext);
  if (context) {
    return context;
  }
  return {
    theme: (store.theme === "dark" ? "dark" : "light") as Theme,
    toggleTheme: store.toggleTheme,
    setTheme: store.setTheme,
  };
}
