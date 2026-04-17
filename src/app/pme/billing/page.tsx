"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { subscriptionsRepository, walletsRepository, plansRepository } from "@/repositories";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge, PageLoader, SectionHeader } from "@/components/ui";
import type { Subscription, Wallet, Plan } from "@/types/api";

export default function PmeBillingPage() {
  const { user } = useAuth();
  const { dictionary: d } = useLanguage();
  const t = d.billing;
  const [sub, setSub] = useState<Subscription | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.tenant_id) return;
    Promise.all([
      subscriptionsRepository.getByTenant(user.tenant_id),
      walletsRepository.getByTenant(user.tenant_id),
      plansRepository.getList(),
    ]).then(([s, w, p]) => { setSub(s); setWallet(w); setPlans(p as Plan[]); }).finally(() => setLoading(false));
  }, [user?.tenant_id]);

  if (loading) return <PageLoader />;

  const msgPct = sub ? Math.round((sub.messages_used / sub.messages_limit) * 100) : 0;
  const callPct = sub ? Math.round((sub.calls_used / sub.calls_limit) * 100) : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader title={t.title} subtitle={t.subtitle} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subscription card */}
        <div className="lg:col-span-2 card p-6 space-y-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] mb-1">{t.currentPlan}</p>
              <p className="text-3xl font-black text-[var(--text)]">{sub?.plan_name ?? "—"}</p>
              {sub && <p className="text-sm text-[var(--text-muted)] mt-1">{t.renewsOn} {formatDate(sub.current_period_end)}</p>}
            </div>
            {sub && <Badge variant={sub.status === "active" ? "green" : sub.status === "suspended" ? "red" : "slate"}>
              {t[("status" + sub.status.charAt(0).toUpperCase() + sub.status.slice(1)) as keyof typeof t] ?? sub.status}
            </Badge>}
          </div>

          {/* Usage */}
          {sub && <>
            <div className="space-y-3">
              <UsageBar label={t.messagesUsage} used={sub.messages_used} total={sub.messages_limit} pct={msgPct} color="#25D366" />
              <UsageBar label={t.callsUsage} used={sub.calls_used} total={sub.calls_limit} pct={callPct} color="#6C3CE1" />
            </div>
          </>}

          <button className="btn-primary w-full justify-center">{t.changePlan}</button>
        </div>

        {/* Wallet */}
        <div className="card p-6 flex flex-col gap-4">
          <p className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">{t.walletBalance}</p>
          <p className="text-4xl font-black text-[#075E54]">{wallet ? formatCurrency(wallet.balance) : "—"}</p>
          <button className="btn-primary w-full justify-center mt-auto">💳 {t.topUp}</button>
        </div>
      </div>

      {/* Plans */}
      <div>
        <h2 className="text-sm font-bold text-[var(--text)] mb-4">{t.availablePlans}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(Array.isArray(plans) ? plans : []).map(plan => {
            const isCurrent = sub?.plan_slug === plan.slug;
            return (
              <div key={plan.id} className={`card p-6 flex flex-col gap-4 transition-all ${isCurrent ? "ring-2 ring-[#25D366]" : "hover:shadow-md"}`}>
                {isCurrent && <span className="text-[10px] font-black uppercase tracking-widest text-[#25D366]">✓ Plan actuel</span>}
                <div>
                  <p className="text-xl font-black text-[var(--text)]">{plan.name}</p>
                  <p className="text-3xl font-black text-[#075E54] mt-1">{formatCurrency(plan.price)}<span className="text-sm font-normal text-[var(--text-muted)]">{t.monthly}</span></p>
                </div>
                <ul className="space-y-1.5 flex-1">
                  {plan.features.map(f => <li key={f} className="text-xs text-[var(--text-muted)] flex gap-2"><span className="text-[#25D366]">✓</span>{f}</li>)}
                </ul>
                <button disabled={isCurrent} className={`btn-primary w-full justify-center ${isCurrent ? "opacity-50 cursor-not-allowed" : ""}`}>
                  {isCurrent ? "Plan actuel" : t.changePlan}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function UsageBar({ label, used, total, pct, color }: { label: string; used: number; total: number; pct: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs text-[var(--text-muted)] mb-1">
        <span className="font-semibold">{label}</span>
        <span>{used.toLocaleString()} / {total.toLocaleString()}</span>
      </div>
      <div className="h-2 bg-[var(--bg)] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
      <p className="text-[10px] text-[var(--text-muted)] mt-0.5 text-right">{pct}%</p>
    </div>
  );
}
