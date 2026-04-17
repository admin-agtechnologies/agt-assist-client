"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { statsRepository, conversationsRepository } from "@/repositories";
import { formatDateTime } from "@/lib/utils";
import { Badge, PageLoader, EmptyState } from "@/components/ui";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { TenantStats, Conversation } from "@/types/api";

const weekData = [
  { day: "Lun", messages: 38, calls: 3 }, { day: "Mar", messages: 52, calls: 5 },
  { day: "Mer", messages: 45, calls: 2 }, { day: "Jeu", messages: 61, calls: 7 },
  { day: "Ven", messages: 48, calls: 4 }, { day: "Sam", messages: 32, calls: 2 },
  { day: "Dim", messages: 36, calls: 3 },
];

export default function PmeDashboardPage() {
  const { user } = useAuth();
  const { dictionary: d } = useLanguage();
  const t = d.dashboard.pme;
  const [stats, setStats] = useState<TenantStats | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.tenant_id) { setLoading(false); return; }
    Promise.all([
      statsRepository.getByTenant(user.tenant_id),
      conversationsRepository.getList(user.tenant_id),
    ]).then(([s, c]) => {
      setStats(s);
      setConversations(c.results.slice(0, 5));
    }).finally(() => setLoading(false));
  }, [user?.tenant_id]);

  if (loading) return <PageLoader />;

  const statCards = stats ? [
    { label: t.messagesToday, value: stats.messages_today, week: stats.messages_week, icon: "💬", color: "text-[#25D366]" },
    { label: t.callsToday, value: stats.calls_today, week: stats.calls_week, icon: "📞", color: "text-[#6C3CE1]" },
    { label: t.appointmentsToday, value: stats.appointments_today, week: stats.appointments_week, icon: "📅", color: "text-amber-500" },
    { label: t.activeConversations, value: stats.active_conversations, week: null, icon: "🔴", color: "text-red-500" },
  ] : [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">{t.title}</h1>
        <p className="text-sm text-[var(--text-muted)] mt-0.5">
          {t.welcome}, <span className="font-semibold text-[var(--text)]">{user?.name}</span> 👋
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(card => (
          <div key={card.label} className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{card.icon}</span>
              <span className={`text-3xl font-black ${card.color}`}>{card.value}</span>
            </div>
            <p className="text-xs font-semibold text-[var(--text-muted)]">{card.label}</p>
            {card.week !== null && (
              <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{t.thisWeek} : <span className="font-bold">{card.week}</span></p>
            )}
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="card p-6">
        <h2 className="text-sm font-bold text-[var(--text)] mb-4">{t.thisWeek}</h2>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={weekData}>
            <defs>
              <linearGradient id="gMessages" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#25D366" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#25D366" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gCalls" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6C3CE1" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#6C3CE1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
            <Area type="monotone" dataKey="messages" stroke="#25D366" strokeWidth={2} fill="url(#gMessages)" name="Messages" />
            <Area type="monotone" dataKey="calls" stroke="#6C3CE1" strokeWidth={2} fill="url(#gCalls)" name="Appels" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Recent conversations */}
      <div className="card">
        <div className="px-6 py-4 border-b border-[var(--border)]">
          <h2 className="text-sm font-bold text-[var(--text)]">{t.recentConversations}</h2>
        </div>
        {conversations.length === 0 ? (
          <EmptyState message={t.noConversations} icon="💬" />
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {conversations.map(conv => (
              <div key={conv.id} className="px-6 py-4 flex items-center gap-4 hover:bg-[var(--bg)] transition-colors">
                <div className="w-9 h-9 rounded-full bg-[#25D366]/10 flex items-center justify-center text-[#25D366] text-lg flex-shrink-0">
                  {conv.channel === "whatsapp" ? "💬" : "📞"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--text)] truncate">{conv.client_name || conv.client_identifier}</p>
                  <p className="text-xs text-[var(--text-muted)] truncate">{conv.last_message}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <Badge variant={conv.channel === "whatsapp" ? "green" : "violet"}>
                    {conv.channel === "whatsapp" ? t.channel_whatsapp : t.channel_voice}
                  </Badge>
                  <p className="text-[10px] text-[var(--text-muted)] mt-1">{formatDateTime(conv.last_message_at)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
