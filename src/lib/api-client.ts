import { ENV } from "./env";
import { TOKEN_KEY, REFRESH_KEY } from "./constants";

// ── Token storage ────────────────────────────────────────────────────────────
export const tokenStorage = {
  getAccess: (): string | null =>
    typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null,
  getRefresh: (): string | null =>
    typeof window !== "undefined" ? localStorage.getItem(REFRESH_KEY) : null,
  set: (access: string, refresh: string) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(TOKEN_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);
    document.cookie = `agt_auth=${access}; path=/; max-age=86400; SameSite=Lax`;
  },
  clear: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    document.cookie = "agt_auth=; path=/; max-age=0";
  },
};

// ── Fetch helper ──────────────────────────────────────────────────────────────
async function request<T>(
  path: string,
  options: RequestInit & { params?: Record<string, string> } = {}
): Promise<T> {
  const { params, ...fetchOptions } = options;
  const url = new URL(`${ENV.API_URL}${path}`);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const token = tokenStorage.getAccess();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url.toString(), { ...fetchOptions, headers });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Erreur réseau" }));
    throw new Error(err?.detail ?? `Erreur ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  get:    <T>(path: string, opts?: { params?: Record<string, string> }) =>
    request<T>(path, { method: "GET", ...opts }),
  post:   <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  put:    <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  patch:  <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(path: string) =>
    request<T>(path, { method: "DELETE" }),
};
