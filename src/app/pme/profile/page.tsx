"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { SectionHeader } from "@/components/ui";
import { initials } from "@/lib/utils";

export default function PmeProfilePage() {
  const { user } = useAuth();
  const { dictionary: d } = useLanguage();
  const t = d.profile;

  if (!user) return null;

  return (
    <div className="space-y-6 animate-fade-in max-w-lg">
      <SectionHeader title={t.title} subtitle={t.subtitle} />
      <div className="card p-8 flex flex-col items-center gap-4 text-center">
        <div className="w-20 h-20 rounded-2xl bg-[#075E54]/10 flex items-center justify-center text-[#075E54] text-2xl font-black">
          {initials(user.name)}
        </div>
        <div>
          <p className="text-xl font-bold text-[var(--text)]">{user.name}</p>
          <p className="text-sm text-[var(--text-muted)]">{user.email}</p>
          <span className="inline-block mt-2 px-3 py-1 bg-[#25D366]/10 text-[#075E54] rounded-full text-xs font-bold">{t.roles[user.role]}</span>
        </div>
      </div>
      <div className="card p-6 space-y-4">
        {[
          { label: t.name, value: user.name },
          { label: t.email, value: user.email },
          { label: t.role, value: t.roles[user.role] },
        ].map(row => (
          <div key={row.label} className="flex items-center justify-between py-3 border-b border-[var(--border)] last:border-0">
            <span className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">{row.label}</span>
            <span className="text-sm font-semibold text-[var(--text)]">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
