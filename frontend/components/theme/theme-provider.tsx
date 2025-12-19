"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  isReady: boolean;
  toggleEnabled: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const STORAGE_KEY = "property-theme";

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  isReady: false,
  toggleEnabled: false,
  setTheme: () => {},
  toggleTheme: () => {},
});

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
  root.style.colorScheme = theme;
}

function getStoredTheme(): Theme | null {
  if (typeof window === "undefined") {
    return null;
  }
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "light" || stored === "dark" ? stored : null;
}

interface ThemeProviderProps {
  children: ReactNode;
  toggleEnabled?: boolean;
}

export function ThemeProvider({ children, toggleEnabled = false }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initial = getStoredTheme() ?? "dark";
    applyTheme(initial);
    setThemeState(initial);
    setIsReady(true);
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    applyTheme(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, next);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light");
  }, [setTheme, theme]);

  const contextValue = useMemo<ThemeContextValue>(
    () => ({
      theme,
      isReady,
      toggleEnabled,
      setTheme,
      toggleTheme: toggleEnabled ? toggleTheme : () => {},
    }),
    [theme, isReady, toggleEnabled, setTheme, toggleTheme],
  );

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
