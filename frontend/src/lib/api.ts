const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const DJANGO_ADMIN_URL = `${API_BASE}/admin/`;
export const ADMIN_USERS_URL = `${DJANGO_ADMIN_URL}accounts/user/`;

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options;

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const res = await fetch(`${API_BASE}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
}

// ---- Role helpers ----
export type Role =
  | "dev_admin"
  | "super_admin"
  | "billing_admin"
  | "stock_admin"
  | "shop_owner"
  | "shop_staff";

export interface SessionUser {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: Role;
  status?: number;
  [key: string]: unknown;
}

export function getStoredUser(): SessionUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getRoleHome(role?: Role | null): string {
  switch (role) {
    case "dev_admin":
      return DJANGO_ADMIN_URL;
    case "super_admin":
      return "/admin/super";
    case "billing_admin":
      return "/admin/billing";
    case "stock_admin":
      return "/admin/stock";
    default:
      return "/dashboard";
  }
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) => request<T>(path, { method: "POST", body }),
  patch: <T>(path: string, body: unknown) => request<T>(path, { method: "PATCH", body }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),

  login: async (username: string, password: string) =>
    request<{ access: string; refresh: string; user: SessionUser }>("/api/auth/auth/login/", {
      method: "POST",
      body: { username, password },
    }),

  // ---- Role-based admin endpoints ----
  listUsers: <T = { results?: unknown[]; count?: number }>() => request<T>("/api/auth/users/"),
  createAdmin: <T>(body: unknown) => request<T>("/api/auth/users/create_admin/", { method: "POST", body }),
  generatePassword: () => request<{ password: string }>("/api/auth/users/auto_password/", { method: "POST" }),

  // Billing
  listInvoices: <T = { results?: unknown[]; count?: number }>(shopId?: string) =>
    request<T>(`/api/invoices/${shopId ? `?shop_id=${shopId}` : ""}`),

  // Operations
  listStacks: <T = { results?: unknown[]; count?: number }>(params = "") => request<T>(`/api/stacks/${params}`),
  createStack: <T>(body: unknown) => request<T>("/api/stacks/", { method: "POST", body }),
  confirmStack: <T>(id: string, body: unknown) =>
    request<T>(`/api/stacks/${id}/confirm/`, { method: "POST", body }),
  listDeliveries: <T = { results?: unknown[]; count?: number }>(params = "") =>
    request<T>(`/api/deliveries/${params}`),
  createDelivery: <T>(body: unknown) => request<T>("/api/deliveries/", { method: "POST", body }),
  updateDelivery: <T>(id: string, body: unknown) =>
    request<T>(`/api/deliveries/${id}/`, { method: "PATCH", body }),
  listAttendances: <T = { results?: unknown[]; count?: number }>(params = "") =>
    request<T>(`/api/attendances/${params}`),
  createAttendance: <T>(body: unknown) => request<T>("/api/attendances/", { method: "POST", body }),
  listEmployees: <T = { results?: unknown[]; count?: number }>() => request<T>("/api/employees/"),
  createEmployee: <T>(body: unknown) => request<T>("/api/employees/", { method: "POST", body }),
};
