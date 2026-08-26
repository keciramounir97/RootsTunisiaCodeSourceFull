import { create } from "zustand";

const getInitialTheme = (): string => {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      return localStorage.getItem("theme") || "light";
    } catch {
      return "light";
    }
  }
  return "light";
};

const initialTheme = getInitialTheme();
if (typeof document !== "undefined" && document.documentElement) {
  document.documentElement.classList.remove("light", "dark");
  document.documentElement.classList.add(initialTheme);
}

interface ThemeState {
  theme: string;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: initialTheme,

  toggleTheme: () =>
    set((state) => {
      const next = state.theme === "light" ? "dark" : "light";
      localStorage.setItem("theme", next);

      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(next);

      return { theme: next };
    }),
}));
