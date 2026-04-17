"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { THEME_KEY } from "@/lib/constants";

type Theme = "light" | "dark";
interface ThemeContextType { theme: Theme; toggle: () => void; }
const ThemeContext = createContext<ThemeContextType>({ theme: "light", toggle: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  useEffect(() => {
    const saved = localStorage.getItem(THEME_KEY) as Theme | null;
    const t = saved || "light";
    setTheme(t);
    document.documentElement.classList.toggle("dark", t === "dark");
  }, []);
  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem(THEME_KEY, next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };
  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}

export function useTheme() { return useContext(ThemeContext); }
