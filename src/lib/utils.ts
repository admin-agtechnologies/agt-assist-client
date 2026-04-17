import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "XAF"): string {
  return new Intl.NumberFormat("fr-CM", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
}

export function formatDate(iso: string, locale = "fr-FR"): string {
  return new Intl.DateTimeFormat(locale, { day: "2-digit", month: "short", year: "numeric" }).format(new Date(iso));
}

export function formatDateTime(iso: string, locale = "fr-FR"): string {
  return new Intl.DateTimeFormat(locale, { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
}

export function truncate(str: string, n = 60): string {
  return str.length > n ? str.slice(0, n) + "…" : str;
}

export function initials(name: string): string {
  return name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
}
