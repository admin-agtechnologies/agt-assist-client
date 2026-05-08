// src/app/pme/crm/_components/CrmDetailPanel.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import {
  X,
  Phone,
  Mail,
  CalendarDays,
  MessageSquare,
  ArrowRightLeft,
  Bot as BotIcon,
  Loader2,
  Hash,
  Sparkles,
} from "lucide-react";
import { Badge, Spinner } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { crmRepository } from "@/repositories";
import type { CrmContactCard, CrmContactDetail } from "@/types/api";
import {
  initialsOf,
  formatDateShort,
  formatRelative,
  colorOf,
} from "./crm.types";

interface Props {
  contact: CrmContactCard;
  onClose: () => void;
}

export function CrmDetailPanel({ contact, onClose }: Props) {
  const { dictionary: d, locale } = useLanguage();
  const t = d.crm;

  const [detail, setDetail] = useState<CrmContactDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Évite l'écrasement par une promesse obsolète (changement de contact rapide)
  const tokenRef = useRef(0);

  useEffect(() => {
    const myToken = ++tokenRef.current;
    setLoading(true);
    setError(null);
    setDetail(null);

    crmRepository
      .getById(contact.id)
      .then((res) => {
        if (tokenRef.current !== myToken) return;
        setDetail(res);
        setLoading(false);
      })
      .catch(() => {
        if (tokenRef.current !== myToken) return;
        setError(t.errorLoad);
        setLoading(false);
      });
  }, [contact.id, t.errorLoad]);

  // Fermer avec Echap
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const initials = initialsOf(contact.nom || contact.telephone);
  const avatarColor = colorOf(contact.id);
  const relLabels = {
    today: t.today,
    yesterday: t.yesterday,
    never: t.neverContacted,
  };

  return (
    <>
      {/* Backdrop mobile */}
      <div
        className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Panneau latéral */}
      <aside className="fixed lg:relative inset-y-0 right-0 w-full max-w-md lg:max-w-none lg:w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-none lg:rounded-2xl z-50 lg:z-auto flex flex-col shadow-xl lg:shadow-none animate-slide-in-right">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between">
          <h2 className="text-sm font-bold text-[var(--text)]">
            {t.detailHeading}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[var(--bg)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
            aria-label={t.closeBtn}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contenu scrollable */}
        <div className="flex-1 overflow-y-auto">
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Spinner className="border-[var(--border)] border-t-[var(--accent)]" />
            </div>
          )}

          {error && (
            <div className="p-5">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {!loading && !error && detail && (
            <div className="p-5 space-y-5">
              {/* ── Identité ────────────────────────────────────────────── */}
              <div className="flex items-start gap-3">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-black text-white flex-shrink-0"
                  style={{ backgroundColor: avatarColor }}
                >
                  {initials}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-bold text-[var(--text)] truncate">
                    {detail.nom || detail.telephone || "—"}
                  </h3>
                  <div className="mt-1 space-y-1">
                    {detail.telephone && (
                      <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                        <Phone className="w-3 h-3" />
                        <span className="truncate">{detail.telephone}</span>
                      </div>
                    )}
                    {detail.email && (
                      <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                        <Mail className="w-3 h-3" />
                        <span className="truncate">{detail.email}</span>
                      </div>
                    )}
                  </div>
                  <p className="mt-2 text-[10px] text-[var(--text-muted)]">
                    {t.clientSince}{" "}
                    <span className="font-semibold text-[var(--text)]">
                      {formatDateShort(detail.created_at, locale)}
                    </span>
                  </p>
                </div>
              </div>

              {/* ── Stats rapides ──────────────────────────────────────── */}
              <div className="grid grid-cols-4 gap-2">
                <StatCell
                  icon={MessageSquare}
                  value={detail.nb_conversations}
                  label={t.detailStatsConversations}
                  color="#25D366"
                />
                <StatCell
                  icon={CalendarDays}
                  value={detail.nb_rdv}
                  label={t.detailStatsRdv}
                  color="#F59E0B"
                />
                <StatCell
                  icon={Mail}
                  value={detail.nb_emails}
                  label={t.detailStatsEmails}
                  color="#0EA5E9"
                />
                <StatCell
                  icon={ArrowRightLeft}
                  value={detail.nb_transferts}
                  label={t.detailStatsHandoffs}
                  color="#EF4444"
                />
              </div>

              {/* ── Bots utilisés ──────────────────────────────────────── */}
              {detail.bots.length > 0 && (
                <Section
                  icon={BotIcon}
                  title={t.detailBots}
                  iconColor="#6C3CE1"
                >
                  <div className="flex flex-wrap gap-2">
                    {detail.bots.map((b) => (
                      <Badge
                        key={b.id}
                        variant={b.bot_type === "vocal" ? "violet" : "green"}
                        className="text-[11px]"
                      >
                        {b.nom}
                      </Badge>
                    ))}
                  </div>
                </Section>
              )}

              {/* ── Dernière fiche ─────────────────────────────────────── */}
              <Section
                icon={Sparkles}
                title={t.detailLastSummary}
                iconColor="#075E54"
              >
                {detail.last_resume ? (
                  <p className="text-xs leading-relaxed text-[var(--text)] bg-[var(--bg)] rounded-xl p-3 border border-[var(--border)]">
                    {detail.last_resume}
                  </p>
                ) : (
                  <p className="text-xs italic text-[var(--text-muted)]">
                    {t.detailNoSummary}
                  </p>
                )}

                {detail.last_points_cles.length > 0 && (
                  <div className="mt-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2">
                      {t.detailKeyPoints}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {detail.last_points_cles.map((kp, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] text-[11px] font-semibold"
                        >
                          <Hash className="w-3 h-3" />
                          {kp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </Section>

              {/* ── Historique conversations ──────────────────────────── */}
              <Section
                icon={MessageSquare}
                title={`${t.detailHistory} (${detail.conversations.length})`}
                iconColor="#0EA5E9"
              >
                {detail.conversations.length === 0 ? (
                  <p className="text-xs italic text-[var(--text-muted)]">
                    {t.detailNoConversations}
                  </p>
                ) : (
                  <div className="space-y-2">
                    {detail.conversations.map((conv) => (
                      <div
                        key={conv.id}
                        className="bg-[var(--bg)] border border-[var(--border)] rounded-xl p-3 hover:border-[var(--accent)]/40 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2 min-w-0">
                            <Badge
                              variant={
                                conv.bot_type === "vocal" ? "violet" : "green"
                              }
                              className="text-[10px] flex-shrink-0"
                            >
                              {conv.bot_type === "vocal"
                                ? t.badgeVoice
                                : t.badgeWhatsapp}
                            </Badge>
                            <span className="text-xs font-semibold text-[var(--text)] truncate">
                              {conv.bot_nom}
                            </span>
                          </div>
                          <span className="text-[10px] text-[var(--text-muted)] flex-shrink-0">
                            {formatRelative(
                              conv.dernier_message_at || conv.created_at,
                              relLabels,
                              locale,
                            )}
                          </span>
                        </div>

                        {conv.rapport_resume && (
                          <p className="text-[11px] text-[var(--text-muted)] line-clamp-2 mb-2">
                            {conv.rapport_resume}
                          </p>
                        )}

                        <div className="flex items-center gap-3 text-[10px] text-[var(--text-muted)]">
                          <span className="inline-flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            {conv.nb_messages}
                          </span>
                          {conv.rapport_rdv > 0 && (
                            <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
                              <CalendarDays className="w-3 h-3" />
                              {conv.rapport_rdv}
                            </span>
                          )}
                          {conv.human_handoff && (
                            <span className="inline-flex items-center gap-1 text-red-600 dark:text-red-400 font-semibold">
                              <ArrowRightLeft className="w-3 h-3" />
                              {t.badgeHandoff}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Section>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

// ─── Sous-composants ──────────────────────────────────────────────────────────

function StatCell({
  icon: Icon,
  value,
  label,
  color,
}: {
  icon: typeof Loader2;
  value: number;
  label: string;
  color: string;
}) {
  return (
    <div className="bg-[var(--bg)] rounded-xl p-2.5 border border-[var(--border)]">
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center mb-1.5"
        style={{ backgroundColor: `${color}18` }}
      >
        <Icon className="w-3.5 h-3.5" style={{ color }} />
      </div>
      <p className="text-base font-black text-[var(--text)] leading-tight">
        {value}
      </p>
      <p className="text-[9px] text-[var(--text-muted)] uppercase tracking-wide leading-tight font-semibold">
        {label}
      </p>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  children,
  iconColor,
}: {
  icon: typeof Loader2;
  title: string;
  children: React.ReactNode;
  iconColor: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2.5">
        <div
          className="w-6 h-6 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${iconColor}18` }}
        >
          <Icon className="w-3.5 h-3.5" style={{ color: iconColor }} />
        </div>
        <h4 className="text-xs font-bold text-[var(--text)]">{title}</h4>
      </div>
      {children}
    </div>
  );
}
