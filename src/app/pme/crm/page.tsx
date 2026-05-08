// src/app/pme/crm/page.tsx
"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Users, ChevronLeft, ChevronRight } from "lucide-react";
import { PageLoader } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { crmRepository, botsRepository } from "@/repositories";
import type { Bot, CrmContactCard, PaginatedResponse } from "@/types/api";
import { cn } from "@/lib/utils";

import { CrmFilters } from "./_components/CrmFilters";
import { CrmTable } from "./_components/CrmTable";
import { CrmDetailPanel } from "./_components/CrmDetailPanel";
import type { SortKey } from "./_components/crm.types";

const PAGE_SIZE = 25;
const DEBOUNCE_MS = 300;

export default function CrmPage() {
  const { dictionary: d } = useLanguage();
  const t = d.crm;

  // ── Données ───────────────────────────────────────────────────────────────
  const [contacts, setContacts] = useState<CrmContactCard[]>([]);
  const [count, setCount] = useState(0);
  const [bots, setBots] = useState<Bot[]>([]);

  // ── État UI ───────────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState<CrmContactCard | null>(null);

  // ── Filtres ───────────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedBotId, setSelectedBotId] = useState<string | "">("");
  const [hasRdv, setHasRdv] = useState(false);
  const [hasHandoff, setHasHandoff] = useState(false);
  const [ordering, setOrdering] = useState<SortKey>("-last_contact_at");
  const [page, setPage] = useState(1);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [search]);

  // Reset page quand un filtre change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, selectedBotId, hasRdv, hasHandoff, ordering]);

  // ── Chargement bots (1 seule fois) ────────────────────────────────────────
  useEffect(() => {
    botsRepository
      .getList()
      .then((res) => setBots(res.results ?? []))
      .catch(() => setBots([]));
  }, []);

  // ── Chargement contacts ───────────────────────────────────────────────────
  const fetchContacts = useCallback(async () => {
    const isFirst = contacts.length === 0;
    if (isFirst) setLoading(true);
    else setRefreshing(true);

    try {
      const res: PaginatedResponse<CrmContactCard> =
        await crmRepository.getList({
          search: debouncedSearch || undefined,
          bot: selectedBotId || undefined,
          has_rdv: hasRdv || undefined,
          has_handoff: hasHandoff || undefined,
          ordering,
          page,
          page_size: PAGE_SIZE,
        });
      setContacts(res.results ?? []);
      setCount(res.count ?? 0);
    } catch {
      setContacts([]);
      setCount(0);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, selectedBotId, hasRdv, hasHandoff, ordering, page]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  // ── Pagination ────────────────────────────────────────────────────────────
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(count / PAGE_SIZE)),
    [count],
  );

  const handleRefresh = () => {
    fetchContacts();
  };

  // Si le contact sélectionné disparaît du résultat (changement de filtre),
  // on garde le panneau ouvert tant que l'utilisateur ne ferme pas.
  // (Le panneau lit l'API par id, indépendant de la liste.)

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "rgba(108, 60, 225, 0.12)" }}
          >
            <Users className="w-5 h-5" style={{ color: "#6C3CE1" }} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[var(--text)]">
              {t.title}
            </h1>
            <p className="text-sm text-[var(--text-muted)]">{t.subtitle}</p>
          </div>
        </div>
      </div>

      {/* ── Filtres ──────────────────────────────────────────────────────── */}
      <CrmFilters
        search={search}
        onSearchChange={setSearch}
        bots={bots}
        selectedBotId={selectedBotId}
        onBotChange={setSelectedBotId}
        hasRdv={hasRdv}
        onHasRdvChange={setHasRdv}
        hasHandoff={hasHandoff}
        onHasHandoffChange={setHasHandoff}
        ordering={ordering}
        onOrderingChange={setOrdering}
        onRefresh={handleRefresh}
        loading={refreshing}
      />

      {/* ── Layout liste + panneau ───────────────────────────────────────── */}
      <div
        className={cn(
          "grid gap-5 transition-all",
          selected ? "grid-cols-1 lg:grid-cols-[1fr_420px]" : "grid-cols-1",
        )}
      >
        {/* Liste */}
        <div className="space-y-4 min-w-0">
          <CrmTable
            contacts={contacts}
            selectedId={selected?.id ?? null}
            onSelect={(c) => setSelected(c)}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs text-[var(--text-muted)]">
                {t.page} {page} {t.of} {totalPages} ({count})
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="p-2 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] disabled:opacity-30 hover:bg-[var(--bg)] transition-colors"
                  aria-label="prev"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="p-2 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] disabled:opacity-30 hover:bg-[var(--bg)] transition-colors"
                  aria-label="next"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Panneau détail (desktop : à côté ; mobile : overlay via fixed) */}
        {selected && (
          <div className="hidden lg:block">
            <div className="sticky top-5">
              <CrmDetailPanel
                key={selected.id}
                contact={selected}
                onClose={() => setSelected(null)}
              />
            </div>
          </div>
        )}

        {/* Mobile : panneau overlay */}
        {selected && (
          <div className="lg:hidden">
            <CrmDetailPanel
              key={selected.id}
              contact={selected}
              onClose={() => setSelected(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
