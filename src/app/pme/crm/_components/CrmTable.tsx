// src/app/pme/crm/_components/CrmTable.tsx
"use client";
import {
  Users,
  MessageCircle,
  Phone,
  ArrowRightLeft,
  CalendarDays,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge, EmptyState } from "@/components/ui";
import {
  type CrmContactCard,
  initialsOf,
  formatRelative,
  colorOf,
} from "./crm.types";

interface Props {
  contacts: CrmContactCard[];
  selectedId: string | null;
  onSelect: (c: CrmContactCard) => void;
}

export function CrmTable({ contacts, selectedId, onSelect }: Props) {
  const { dictionary: d, locale } = useLanguage();
  const t = d.crm;

  if (contacts.length === 0) {
    return (
      <div className="card">
        <EmptyState message={t.empty} icon={Users} />
      </div>
    );
  }

  const relLabels = {
    today: t.today,
    yesterday: t.yesterday,
    never: t.neverContacted,
  };

  return (
    <div className="card overflow-hidden">
      {/* ── Vue tableau (desktop) ──────────────────────────────────────────── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[var(--bg)] border-b border-[var(--border)]">
            <tr>
              <Th>{t.columnName}</Th>
              <Th>{t.columnContact}</Th>
              <Th align="center">{t.columnConversations}</Th>
              <Th align="center">{t.columnRdv}</Th>
              <Th>{t.columnLastContact}</Th>
              <Th>{t.columnBot}</Th>
              <Th>{t.columnSummary}</Th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((c) => {
              const isSelected = selectedId === c.id;
              const initials = initialsOf(c.nom || c.telephone);
              const avatarColor = colorOf(c.id);
              return (
                <tr
                  key={c.id}
                  onClick={() => onSelect(c)}
                  className={cn(
                    "border-b border-[var(--border)] last:border-0 cursor-pointer transition-colors",
                    isSelected
                      ? "bg-[var(--sidebar-active-bg)]"
                      : "hover:bg-[var(--bg)]",
                  )}
                >
                  {/* Nom + avatar */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                        style={{ backgroundColor: avatarColor }}
                      >
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[var(--text)] truncate">
                          {c.nom || c.telephone || "—"}
                        </p>
                        {c.has_handoff && (
                          <span className="inline-flex items-center gap-1 mt-0.5 text-[10px] text-red-600 dark:text-red-400 font-semibold">
                            <ArrowRightLeft className="w-3 h-3" />
                            {t.badgeHandoff}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-0.5 min-w-0">
                      {c.telephone && (
                        <span className="text-xs text-[var(--text)] truncate">
                          {c.telephone}
                        </span>
                      )}
                      {c.email && (
                        <span className="text-[11px] text-[var(--text-muted)] truncate">
                          {c.email}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Nb conversations */}
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm font-bold text-[var(--text)]">
                      {c.nb_conversations}
                    </span>
                  </td>

                  {/* Nb RDV */}
                  <td className="px-4 py-3 text-center">
                    {c.nb_rdv > 0 ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-xs font-bold">
                        <CalendarDays className="w-3 h-3" />
                        {c.nb_rdv}
                      </span>
                    ) : (
                      <span className="text-xs text-[var(--text-muted)]">
                        —
                      </span>
                    )}
                  </td>

                  {/* Dernier contact */}
                  <td className="px-4 py-3">
                    <span className="text-xs text-[var(--text)] whitespace-nowrap">
                      {formatRelative(c.last_contact_at, relLabels, locale)}
                    </span>
                  </td>

                  {/* Bot */}
                  <td className="px-4 py-3">
                    {c.last_bot_nom ? (
                      <Badge
                        variant={
                          c.last_bot_type === "vocal" ? "violet" : "green"
                        }
                        className="text-[10px]"
                      >
                        <span className="inline-flex items-center gap-1">
                          {c.last_bot_type === "vocal" ? (
                            <Phone className="w-3 h-3" />
                          ) : (
                            <MessageCircle className="w-3 h-3" />
                          )}
                          <span className="truncate max-w-[120px]">
                            {c.last_bot_nom}
                          </span>
                        </span>
                      </Badge>
                    ) : (
                      <span className="text-xs text-[var(--text-muted)]">
                        —
                      </span>
                    )}
                  </td>

                  {/* Résumé */}
                  <td className="px-4 py-3 max-w-[260px]">
                    <p className="text-xs text-[var(--text-muted)] line-clamp-2">
                      {c.last_resume || "—"}
                    </p>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Vue cartes (mobile) ────────────────────────────────────────────── */}
      <div className="md:hidden divide-y divide-[var(--border)]">
        {contacts.map((c) => {
          const isSelected = selectedId === c.id;
          const initials = initialsOf(c.nom || c.telephone);
          const avatarColor = colorOf(c.id);
          return (
            <button
              key={c.id}
              onClick={() => onSelect(c)}
              className={cn(
                "w-full flex items-start gap-3 p-4 text-left transition-colors",
                isSelected
                  ? "bg-[var(--sidebar-active-bg)]"
                  : "hover:bg-[var(--bg)]",
              )}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{ backgroundColor: avatarColor }}
              >
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <p className="text-sm font-semibold text-[var(--text)] truncate">
                    {c.nom || c.telephone || "—"}
                  </p>
                  <span className="text-[10px] text-[var(--text-muted)] flex-shrink-0">
                    {formatRelative(c.last_contact_at, relLabels, locale)}
                  </span>
                </div>
                {c.telephone && (
                  <p className="text-[11px] text-[var(--text-muted)] mb-1">
                    {c.telephone}
                  </p>
                )}
                <p className="text-xs text-[var(--text-muted)] line-clamp-2">
                  {c.last_resume || "—"}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 text-[10px] text-[var(--text-muted)]">
                    <MessageCircle className="w-3 h-3" />
                    {c.nb_conversations}
                  </span>
                  {c.nb_rdv > 0 && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                      <CalendarDays className="w-3 h-3" />
                      {c.nb_rdv}
                    </span>
                  )}
                  {c.has_handoff && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-red-600 dark:text-red-400 font-semibold">
                      <ArrowRightLeft className="w-3 h-3" />
                      {t.badgeHandoff}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Th({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "center" | "right";
}) {
  return (
    <th
      className={cn(
        "px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]",
        align === "center" && "text-center",
        align === "right" && "text-right",
        align === "left" && "text-left",
      )}
    >
      {children}
    </th>
  );
}
