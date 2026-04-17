"use client";
import { useState, useEffect, useCallback, useTransition } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/components/ui/Toast";
import { useDebounce } from "@/hooks/useDebounce";
import { botsRepository } from "@/repositories";
import { DEBOUNCE_DELAY } from "@/lib/constants";
import { formatDate, cn } from "@/lib/utils";
import { Badge, SectionHeader, EmptyState, ConfirmDeleteModal, Spinner } from "@/components/ui";
import { createPortal } from "react-dom";
import type { Bot, CreateBotPayload, BotStatus } from "@/types/api";

const STATUS_COLORS: Record<BotStatus, "green" | "amber" | "slate"> = { active: "green", paused: "amber", archived: "slate" };

export default function PmeBotsPage() {
  const { user } = useAuth();
  const { dictionary: d } = useLanguage();
  const t = d.bots;
  const toast = useToast();
  const [bots, setBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const dSearch = useDebounce(search, DEBOUNCE_DELAY);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchBots = useCallback(async (s = dSearch) => {
    if (!user?.tenant_id) return;
    startTransition(async () => {
      try {
        const res = await botsRepository.getList({ tenant_id: user.tenant_id!, search: s || undefined });
        setBots(res.results);
      } catch { toast.error(t.errorLoad); }
      finally { setLoading(false); }
    });
  }, [dSearch, user?.tenant_id, t.errorLoad, toast]);

  useEffect(() => { fetchBots(dSearch); }, [dSearch]);// eslint-disable-line

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try { await botsRepository.delete(deleteId); toast.success(t.deleteSuccess); setDeleteId(null); fetchBots(); }
    catch { toast.error(t.deleteError); }
    finally { setIsDeleting(false); }
  };

  const filteredBots = bots.filter(b => !search || b.name.toLowerCase().includes(search.toLowerCase()));

  if (loading) return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 bg-[var(--border)] rounded-xl w-40" />
      <div className="card">{[...Array(3)].map((_, i) => <div key={i} className="h-16 border-b border-[var(--border)] m-4 bg-[var(--bg)] rounded-xl" />)}</div>
    </div>
  );

  return (
    <>
      <div className="space-y-6 animate-fade-in">
        <SectionHeader title={t.title} subtitle={t.subtitle} action={
          <button onClick={() => { setEditingId(null); setModalOpen(true); }} className="btn-primary">
            {t.newBtn}
          </button>
        } />

        {/* Search */}
        <div className="card p-3">
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="input-base" placeholder={t.filters.searchPlaceholder} />
        </div>

        {/* Table */}
        <div className={cn("card overflow-hidden transition-opacity", isPending && "opacity-50 pointer-events-none")}>
          {filteredBots.length === 0 ? <EmptyState message={t.noData} icon="🤖" /> : (
            <>
              <div className="hidden md:grid grid-cols-5 px-6 py-3 bg-[var(--bg)] border-b border-[var(--border)] text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                <span className="col-span-2">{t.table.name}</span>
                <span>{t.table.whatsapp}</span>
                <span>{t.table.voice}</span>
                <span>{t.table.status}</span>
              </div>
              {filteredBots.map(bot => (
                <div key={bot.id} className="grid grid-cols-2 md:grid-cols-5 px-6 py-4 border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg)] transition-colors items-center gap-2">
                  <div className="col-span-2 md:col-span-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#25D366]/10 flex items-center justify-center text-[#25D366] text-lg flex-shrink-0">🤖</div>
                      <div>
                        <p className="text-sm font-semibold text-[var(--text)]">{bot.name}</p>
                        <p className="text-[10px] text-[var(--text-muted)]">{formatDate(bot.created_at)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-[var(--text-muted)] font-medium">
                    {bot.whatsapp_provider === "waha" ? t.providerWaha : t.providerMeta}
                  </div>
                  <div className="text-xs text-[var(--text-muted)] font-medium">
                    {bot.voice_ai_provider === "gemini" ? t.providerGemini : t.providerOpenAI}
                  </div>
                  <div className="flex items-center justify-between md:justify-start gap-3">
                    <Badge variant={STATUS_COLORS[bot.status]}>
                      {bot.status === "active" ? t.statusActive : bot.status === "paused" ? t.statusPaused : t.statusArchived}
                    </Badge>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingId(bot.id); setModalOpen(true); }}
                        className="p-1.5 rounded-lg hover:bg-[var(--bg)] text-[var(--text-muted)] transition-colors text-base">✏️</button>
                      <button onClick={() => setDeleteId(bot.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-400 transition-colors text-base">🗑️</button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      <BotModal isOpen={modalOpen} itemId={editingId} tenantId={user?.tenant_id ?? ""}
        onClose={() => setModalOpen(false)} onSave={() => fetchBots()} t={t} toast={toast} />

      <ConfirmDeleteModal isOpen={!!deleteId} isLoading={isDeleting}
        onClose={() => !isDeleting && setDeleteId(null)}
        onConfirm={handleDelete}
        message={t.confirmDelete} />
    </>
  );
}

// ── BotModal ─────────────────────────────────────────────────────────────────
function BotModal({ isOpen, itemId, tenantId, onClose, onSave, t, toast }: {
  isOpen: boolean; itemId: string | null; tenantId: string;
  onClose: () => void; onSave: () => void;
  t: ReturnType<typeof useLanguage>["dictionary"]["bots"];
  toast: ReturnType<typeof useToast>;
}) {
  const isEdit = !!itemId;
  const DEF: CreateBotPayload = { name: "", welcome_message: "", personality: "", languages: ["fr"], whatsapp_provider: "waha", voice_ai_provider: "gemini", is_active: true };
  const [form, setForm] = useState<CreateBotPayload>(DEF);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const tm = t.modal;
  const tf = tm.fields;

  useEffect(() => {
    if (!isOpen) return;
    if (itemId) { setLoading(true); botsRepository.getById(itemId).then(d => setForm({ name: d.name, welcome_message: d.welcome_message, personality: d.personality, languages: d.languages, whatsapp_provider: d.whatsapp_provider, voice_ai_provider: d.voice_ai_provider, is_active: d.is_active })).catch(() => toast.error("Erreur")).finally(() => setLoading(false)); }
    else setForm(DEF);
  }, [isOpen, itemId]); // eslint-disable-line

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      if (isEdit) await botsRepository.patch(itemId!, form);
      else await botsRepository.create({ ...form, tenant_id: tenantId } as CreateBotPayload & { tenant_id: string });
      toast.success(t.createSuccess); onSave(); onClose();
    } catch { toast.error("Erreur lors de la sauvegarde."); } finally { setSaving(false); }
  };

  if (!isOpen) return null;
  return createPortal(
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="absolute inset-0" onClick={!saving ? onClose : undefined} />
      <form onSubmit={handleSubmit} className="relative bg-[var(--bg-card)] rounded-3xl w-full max-w-xl shadow-2xl border border-[var(--border)] flex flex-col max-h-[90vh] animate-zoom-in">
        <div className="p-6 border-b border-[var(--border)] flex justify-between items-center">
          <h2 className="text-lg font-bold text-[var(--text)]">{isEdit ? tm.editTitle : tm.createTitle}</h2>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-full bg-[var(--bg)] hover:opacity-70 flex items-center justify-center text-[var(--text-muted)]">✕</button>
        </div>
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {loading ? <div className="flex justify-center py-8"><Spinner className="w-6 h-6 border-[#25D366] border-t-transparent" /></div> : <>
            <div><label className="label-base">{tf.name}</label><input required className="input-base" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            <div><label className="label-base">{tf.welcome}</label><textarea rows={3} className="input-base resize-none" value={form.welcome_message} onChange={e => setForm({ ...form, welcome_message: e.target.value })} /></div>
            <div><label className="label-base">{tf.personality}</label><input className="input-base" value={form.personality} onChange={e => setForm({ ...form, personality: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label-base">{tf.whatsappProvider}</label>
                <select className="input-base" value={form.whatsapp_provider} onChange={e => setForm({ ...form, whatsapp_provider: e.target.value as "waha" | "meta_api" })}>
                  <option value="waha">{t.providerWaha}</option><option value="meta_api">{t.providerMeta}</option>
                </select>
              </div>
              <div><label className="label-base">{tf.voiceProvider}</label>
                <select className="input-base" value={form.voice_ai_provider} onChange={e => setForm({ ...form, voice_ai_provider: e.target.value as "gemini" | "openai" })}>
                  <option value="gemini">{t.providerGemini}</option><option value="openai">{t.providerOpenAI}</option>
                </select>
              </div>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <div className={cn("w-11 h-6 rounded-full p-1 transition-colors", form.is_active ? "bg-[#25D366]" : "bg-[var(--border)]")}>
                <div className={cn("w-4 h-4 bg-white rounded-full shadow transition-transform", form.is_active ? "translate-x-5" : "translate-x-0")} />
              </div>
              <input type="checkbox" className="hidden" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} />
              <span className="text-sm font-medium text-[var(--text)]">{tf.isActive}</span>
            </label>
          </>}
        </div>
        <div className="p-5 border-t border-[var(--border)] flex justify-end gap-3">
          <button type="button" onClick={onClose} className="btn-ghost">{d_common.cancel}</button>
          <button type="submit" disabled={saving} className="btn-primary">{saving && <Spinner className="border-white/30 border-t-white" />}{isEdit ? tm.btnUpdate : tm.btnCreate}</button>
        </div>
      </form>
    </div>,
    document.body
  );
}

const d_common = { cancel: "Annuler" };
