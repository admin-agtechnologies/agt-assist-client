import { api } from "@/lib/api-client";
import type {
  Tenant, CreateTenantPayload, TenantFilters,
  Bot, CreateBotPayload, BotFilters,
  Service, CreateServicePayload, ServiceFilters,
  Appointment, CreateAppointmentPayload, AppointmentFilters,
  Subscription, Wallet, Plan,
  TenantStats, AdminStats,
  Conversation, FAQ, CreateFAQPayload,
  ProviderConfig,
  User, AuthResponse, LoginPayload,
  PaginatedResponse,
} from "@/types/api";

// Helper
const p = (f?: object): Record<string, string> =>
  Object.fromEntries(
    Object.entries(f ?? {})
      .filter(([, v]) => v !== undefined && v !== "" && v !== null)
      .map(([k, v]) => [k, String(v)])
  );

// ── Auth ─────────────────────────────────────────────────────────────────────
export const authRepository = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    // JSON-Server mock: filtre par email, simule token JWT
    const users = await api.get<User[]>("/api/v1/users", { params: { email: payload.email } });
    if (!users || users.length === 0) throw new Error("Email ou mot de passe incorrect");
    const user = users[0];
    const fakeToken = btoa(JSON.stringify({ id: user.id, role: user.role, exp: Date.now() + 86400000 }));
    return { access: fakeToken, refresh: fakeToken + "_refresh", user };
  },
  me: (id: string): Promise<User> => api.get(`/api/v1/users/${id}`),
};

// ── Tenants ──────────────────────────────────────────────────────────────────
export const tenantsRepository = {
  getList: (f?: TenantFilters): Promise<PaginatedResponse<Tenant>> =>
    api.get("/api/v1/tenants", { params: p(f) }).then((data: unknown) => {
      const arr = Array.isArray(data) ? data : (data as PaginatedResponse<Tenant>).results ? (data as PaginatedResponse<Tenant>) : { results: data as Tenant[], count: (data as Tenant[]).length, next: null, previous: null };
      return Array.isArray(arr) ? { results: arr, count: arr.length, next: null, previous: null } : arr;
    }),
  getById: (id: string): Promise<Tenant> => api.get(`/api/v1/tenants/${id}`),
  create: (payload: CreateTenantPayload): Promise<Tenant> => api.post("/api/v1/tenants", payload),
  patch: (id: string, payload: Partial<CreateTenantPayload>): Promise<Tenant> => api.patch(`/api/v1/tenants/${id}`, payload),
  delete: (id: string): Promise<void> => api.delete(`/api/v1/tenants/${id}`),
};

// ── Bots ──────────────────────────────────────────────────────────────────────
export const botsRepository = {
  getList: (f?: BotFilters): Promise<PaginatedResponse<Bot>> =>
    api.get("/api/v1/bots", { params: p(f) }).then((data: unknown) =>
      Array.isArray(data) ? { results: data as Bot[], count: (data as Bot[]).length, next: null, previous: null } : data as PaginatedResponse<Bot>
    ),
  getById: (id: string): Promise<Bot> => api.get(`/api/v1/bots/${id}`),
  create: (payload: CreateBotPayload): Promise<Bot> => api.post("/api/v1/bots", payload),
  patch: (id: string, payload: Partial<CreateBotPayload>): Promise<Bot> => api.patch(`/api/v1/bots/${id}`, payload),
  delete: (id: string): Promise<void> => api.delete(`/api/v1/bots/${id}`),
};

// ── Services ──────────────────────────────────────────────────────────────────
export const servicesRepository = {
  getList: (f?: ServiceFilters): Promise<PaginatedResponse<Service>> =>
    api.get("/api/v1/services", { params: p(f) }).then((data: unknown) =>
      Array.isArray(data) ? { results: data as Service[], count: (data as Service[]).length, next: null, previous: null } : data as PaginatedResponse<Service>
    ),
  getById: (id: string): Promise<Service> => api.get(`/api/v1/services/${id}`),
  create: (payload: CreateServicePayload): Promise<Service> => api.post("/api/v1/services", payload),
  patch: (id: string, payload: Partial<CreateServicePayload>): Promise<Service> => api.patch(`/api/v1/services/${id}`, payload),
  delete: (id: string): Promise<void> => api.delete(`/api/v1/services/${id}`),
};

// ── Appointments ──────────────────────────────────────────────────────────────
export const appointmentsRepository = {
  getList: (f?: AppointmentFilters): Promise<PaginatedResponse<Appointment>> =>
    api.get("/api/v1/appointments", { params: p(f) }).then((data: unknown) =>
      Array.isArray(data) ? { results: data as Appointment[], count: (data as Appointment[]).length, next: null, previous: null } : data as PaginatedResponse<Appointment>
    ),
  getById: (id: string): Promise<Appointment> => api.get(`/api/v1/appointments/${id}`),
  create: (payload: CreateAppointmentPayload): Promise<Appointment> => api.post("/api/v1/appointments", payload),
  patch: (id: string, payload: Partial<CreateAppointmentPayload>): Promise<Appointment> => api.patch(`/api/v1/appointments/${id}`, payload),
  delete: (id: string): Promise<void> => api.delete(`/api/v1/appointments/${id}`),
};

// ── Subscriptions ─────────────────────────────────────────────────────────────
export const subscriptionsRepository = {
  getList: (): Promise<PaginatedResponse<Subscription>> =>
    api.get("/api/v1/subscriptions").then((data: unknown) =>
      Array.isArray(data) ? { results: data as Subscription[], count: (data as Subscription[]).length, next: null, previous: null } : data as PaginatedResponse<Subscription>
    ),
  getByTenant: (tenantId: string): Promise<Subscription | null> =>
    api.get("/api/v1/subscriptions", { params: { tenant_id: tenantId } })
      .then((data: unknown) => (Array.isArray(data) && data.length > 0 ? data[0] as Subscription : null)),
  getById: (id: string): Promise<Subscription> => api.get(`/api/v1/subscriptions/${id}`),
  patch: (id: string, payload: Partial<Subscription>): Promise<Subscription> => api.patch(`/api/v1/subscriptions/${id}`, payload),
};

// ── Wallets ───────────────────────────────────────────────────────────────────
export const walletsRepository = {
  getByTenant: (tenantId: string): Promise<Wallet | null> =>
    api.get("/api/v1/wallets", { params: { tenant_id: tenantId } })
      .then((data: unknown) => (Array.isArray(data) && data.length > 0 ? data[0] as Wallet : null)),
  getById: (id: string): Promise<Wallet> => api.get(`/api/v1/wallets/${id}`),
};

// ── Plans ─────────────────────────────────────────────────────────────────────
export const plansRepository = {
  getList: (): Promise<Plan[]> => api.get<Plan[]>("/api/v1/plans"),
};

// ── Stats ─────────────────────────────────────────────────────────────────────
export const statsRepository = {
  getByTenant: (tenantId: string): Promise<TenantStats | null> =>
    api.get("/api/v1/stats", { params: { tenant_id: tenantId } })
      .then((data: unknown) => (Array.isArray(data) && data.length > 0 ? data[0] as TenantStats : null)),
  getAdmin: (): Promise<AdminStats> => api.get("/api/v1/admin-stats"),
};

// ── Conversations ─────────────────────────────────────────────────────────────
export const conversationsRepository = {
  getList: (tenantId?: string): Promise<PaginatedResponse<Conversation>> =>
    api.get("/api/v1/conversations", { params: tenantId ? { tenant_id: tenantId } : {} }).then((data: unknown) =>
      Array.isArray(data) ? { results: data as Conversation[], count: (data as Conversation[]).length, next: null, previous: null } : data as PaginatedResponse<Conversation>
    ),
};

// ── FAQ ───────────────────────────────────────────────────────────────────────
export const faqRepository = {
  getList: (tenantId?: string): Promise<PaginatedResponse<FAQ>> =>
    api.get("/api/v1/faq", { params: tenantId ? { tenant_id: tenantId } : {} }).then((data: unknown) =>
      Array.isArray(data) ? { results: data as FAQ[], count: (data as FAQ[]).length, next: null, previous: null } : data as PaginatedResponse<FAQ>
    ),
  create: (payload: CreateFAQPayload & { tenant_id: string }): Promise<FAQ> => api.post("/api/v1/faq", payload),
  patch: (id: string, payload: Partial<CreateFAQPayload>): Promise<FAQ> => api.patch(`/api/v1/faq/${id}`, payload),
  delete: (id: string): Promise<void> => api.delete(`/api/v1/faq/${id}`),
};
