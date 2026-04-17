"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Spinner } from "@/components/ui";

export default function LoginPage() {
  const { login } = useAuth();
  const { dictionary: d } = useLanguage();
  const t = d.auth;
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      try {
        await login({ email, password });
        router.push("/pme/dashboard");
      } catch {
        setError(t.loginError);
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#075E54] mb-4">
            <span className="text-2xl">🤖</span>
          </div>
          <h1 className="text-2xl font-black text-[var(--text)]">AGT Platform</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">{t.loginSubtitle}</p>
        </div>

        <div className="card p-8 rounded-3xl">
          <h2 className="text-xl font-bold text-[var(--text)] mb-6">{t.loginTitle}</h2>
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-base">{t.email}</label>
              <input
                type="email" required autoFocus
                className="input-base"
                value={email} onChange={e => setEmail(e.target.value)}
                placeholder="vous@example.com"
              />
            </div>
            <div>
              <label className="label-base">{t.password}</label>
              <input
                type="password" required
                className="input-base"
                value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit" disabled={isPending}
              className="btn-primary w-full justify-center mt-2"
            >
              {isPending ? <><Spinner className="border-white/30 border-t-white" />{t.loggingIn}</> : t.loginBtn}
            </button>
          </form>
          <p className="text-xs text-[var(--text-muted)] mt-4 text-center">{t.pmeHint}</p>
        </div>
      </div>
    </div>
  );
}
