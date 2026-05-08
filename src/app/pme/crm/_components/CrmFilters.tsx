// src/app/pme/crm/_components/CrmFilters.tsx
"use client";
import { Search, RefreshCw, ArrowUpDown, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Bot } from "@/types/api";
import { SORT_OPTIONS, type SortKey } from "./crm.types";

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  bots: Bot[];
  selectedBotId: string | "";
  onBotChange: (botId: string | "") => void;
  hasRdv: boolean;
  onHasRdvChange: (v: boolean) => void;
  hasHandoff: boolean;
  onHasHandoffChange: (v: boolean) => void;
  ordering: SortKey;
  onOrderingChange: (v: SortKey) => void;
  onRefresh: () => void;
  loading?: boolean;
}

export function CrmFilters({
  search,
  onSearchChange,
  bots,
  selectedBotId,
  onBotChange,
  hasRdv,
  onHasRdvChange,
  hasHandoff,
  onHasHandoffChange,
  ordering,
  onOrderingChange,
  onRefresh,
  loading,
}: Props) {
  const { dictionary: d } = useLanguage();
  const t = d.crm;

  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement | null>(null);

  // Fermer le menu sort au clic extérieur
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className="card p-4 flex flex-col gap-3">
      {/* Ligne 1 : recherche + tri + refresh */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40 focus:border-[var(--accent)] transition-all"
          />
        </div>

        {/* Sort */}
        <div className="relative" ref={sortRef}>
          <button
            type="button"
            onClick={() => setSortOpen((v) => !v)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-sm font-semibold text-[var(--text)] hover:bg-[var(--bg-card)] transition-colors whitespace-nowrap"
          >
            <ArrowUpDown className="w-4 h-4" />
            {t.sortLabel}
          </button>
          {sortOpen && (
            <div className="absolute right-0 mt-2 w-56 z-10 card p-1.5 shadow-lg">
              {SORT_OPTIONS.map((opt) => {
                const active = ordering === opt.key;
                const label = (t as unknown as Record<string, string>)[
                  opt.labelKey
                ];
                return (
                  <button
                    key={opt.key}
                    onClick={() => {
                      onOrderingChange(opt.key);
                      setSortOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-colors",
                      active
                        ? "bg-[var(--sidebar-active-bg)] text-[var(--sidebar-active-text)] font-semibold"
                        : "text-[var(--text)] hover:bg-[var(--bg)]",
                    )}
                  >
                    {active && <Check className="w-3.5 h-3.5" />}
                    <span className={active ? "" : "ml-[1.375rem]"}>
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-sm font-semibold text-[var(--text)] hover:bg-[var(--bg-card)] transition-colors disabled:opacity-50"
          title={t.refreshBtn}
        >
          <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
        </button>
      </div>

      {/* Ligne 2 : filtres pills */}
      <div className="flex flex-wrap gap-2 items-center">
        {/* Tous les bots */}
        <select
          value={selectedBotId}
          onChange={(e) => onBotChange(e.target.value)}
          className="px-3 py-2 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-xs font-semibold text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40 cursor-pointer"
        >
          <option value="">{t.filterAllBots}</option>
          {bots.map((b) => (
            <option key={b.id} value={b.id}>
              {b.nom}
            </option>
          ))}
        </select>

        <FilterPill
          active={hasRdv}
          onClick={() => onHasRdvChange(!hasRdv)}
          label={t.filterHasRdv}
        />
        <FilterPill
          active={hasHandoff}
          onClick={() => onHasHandoffChange(!hasHandoff)}
          label={t.filterHasHandoff}
        />
      </div>
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-3 py-2 rounded-xl text-xs font-semibold transition-all border",
        active
          ? "bg-[var(--accent)] text-white border-[var(--accent)]"
          : "bg-[var(--bg)] text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--text)] hover:border-[var(--text-muted)]",
      )}
    >
      {label}
    </button>
  );
}
