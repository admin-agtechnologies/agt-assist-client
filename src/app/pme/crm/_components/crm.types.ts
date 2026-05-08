// src/app/pme/crm/_components/crm.types.ts
// Types & helpers locaux au module CRM.

import type { CrmContactCard, CrmContactDetail } from "@/types/api";

export type SortKey =
  | "-last_contact_at"
  | "nom"
  | "-nb_conversations"
  | "-created_at";

export const SORT_OPTIONS: { key: SortKey; labelKey: string }[] = [
  { key: "-last_contact_at", labelKey: "sortRecent" },
  { key: "nom", labelKey: "sortName" },
  { key: "-nb_conversations", labelKey: "sortConversations" },
  { key: "-created_at", labelKey: "sortCreated" },
];

// ── Helpers de formatage ─────────────────────────────────────────────────────

export function initialsOf(nameOrPhone: string): string {
  const v = (nameOrPhone || "").trim();
  if (!v) return "?";
  const parts = v.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  // Si c'est un téléphone (ou un nom court), on prend les 2 derniers chiffres
  const digits = v.replace(/\D/g, "");
  if (digits.length >= 2) return digits.slice(-2);
  return v.slice(0, 2).toUpperCase();
}

export function formatDateShort(iso: string | null, locale = "fr"): string {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

export function formatRelative(
  iso: string | null,
  labels: { today: string; yesterday: string; never: string },
  locale = "fr",
): string {
  if (!iso) return labels.never;
  try {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / 86_400_000);
    if (diffDays === 0) return labels.today;
    if (diffDays === 1) return labels.yesterday;
    if (diffDays < 7) return `${diffDays}j`;
    return d.toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", {
      day: "2-digit",
      month: "short",
    });
  } catch {
    return labels.never;
  }
}

// Couleur déterministe (chip avatar) à partir du nom — palette pastel.
const COLORS = [
  "#25D366",
  "#6C3CE1",
  "#F97316",
  "#0EA5E9",
  "#EC4899",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
];
export function colorOf(seed: string): string {
  if (!seed) return COLORS[0];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return COLORS[h % COLORS.length];
}

// Re-exports
export type { CrmContactCard, CrmContactDetail };
