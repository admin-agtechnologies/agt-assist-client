"use client";
import { useState, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/components/ui/ThemeProvider";
import { cn, initials } from "@/lib/utils";

const navItems = (t: ReturnType<typeof useLanguage>["dictionary"]) => [
  { href: "/pme/dashboard", icon: "📊", label: t.nav.dashboard },
  { href: "/pme/bots", icon: "🤖", label: t.nav.bots },
  { href: "/pme/services", icon: "🛎️", label: t.nav.services },
  { href: "/pme/appointments", icon: "📅", label: t.nav.appointments },
  { href: "/pme/billing", icon: "💳", label: t.nav.billing },
  { href: "/pme/profile", icon: "👤", label: t.nav.profile },
];

export default function PmeLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const { dictionary: d, locale, setLocale } = useLanguage();
  const { theme, toggle } = useTheme();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const items = navItems(d);

  const Sidebar = ({ mobile = false }) => (
    <aside className={cn(
      "flex flex-col h-full bg-[var(--bg-sidebar)] border-r border-[var(--border)]",
      mobile ? "w-64" : "w-64 hidden lg:flex"
    )}>
      {/* Logo */}
      <div className="p-6 border-b border-[var(--border)]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#075E54] flex items-center justify-center text-white font-black text-sm">A</div>
          <div>
            <p className="font-bold text-sm text-[var(--text)]">AGT Platform</p>
            <p className="text-[10px] text-[var(--text-muted)] font-medium">Espace PME</p>
          </div>
        </div>
        {user && (
          <div className="mt-4 flex items-center gap-2.5 bg-[var(--bg)] rounded-xl p-3">
            <div className="w-8 h-8 rounded-full bg-[#075E54]/10 flex items-center justify-center text-[#075E54] text-xs font-bold">
              {initials(user.name)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[var(--text)] truncate">{user.name}</p>
              <p className="text-[10px] text-[var(--text-muted)] truncate">{user.email}</p>
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {items.map(item => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                active
                  ? "bg-[var(--sidebar-active-bg)] text-[var(--sidebar-active-text)] font-semibold"
                  : "text-[var(--text-sidebar)] hover:bg-[var(--bg)] hover:text-[var(--text)]"
              )}>
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[var(--border)] space-y-1">
        <button onClick={toggle}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-[var(--text-sidebar)] hover:bg-[var(--bg)] transition-colors">
          <span>{theme === "dark" ? "☀️" : "🌙"}</span>
          {theme === "dark" ? "Mode clair" : "Mode sombre"}
        </button>
        <button onClick={() => setLocale(locale === "fr" ? "en" : "fr")}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-[var(--text-sidebar)] hover:bg-[var(--bg)] transition-colors">
          <span>🌐</span>{locale === "fr" ? "English" : "Français"}
        </button>
        <button onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
          <span>🚪</span>{d.common.logout}
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg)]">
      <Sidebar />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-10"><Sidebar mobile /></div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-[var(--border)] bg-[var(--bg-card)]">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-xl hover:bg-[var(--bg)] transition-colors">
            <span className="text-xl">☰</span>
          </button>
          <span className="font-bold text-[var(--text)]">AGT Platform</span>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
