"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { LOCALE_KEY } from "@/lib/constants";
import { fr } from "@/dictionaries/fr";
import { en } from "@/dictionaries/en";

export type Locale = "fr" | "en";
export type Dictionary = typeof fr;

interface LanguageContextType {
  locale: Locale;
  dictionary: Dictionary;
  setLocale: (l: Locale) => void;
}

const dicts: Record<Locale, Dictionary> = { fr, en };
const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("fr");

  useEffect(() => {
    const saved = localStorage.getItem(LOCALE_KEY) as Locale | null;
    if (saved === "fr" || saved === "en") setLocaleState(saved);
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem(LOCALE_KEY, l);
  };

  return (
    <LanguageContext.Provider value={{ locale, dictionary: dicts[locale], setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}
