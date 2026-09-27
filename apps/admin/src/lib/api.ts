const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
const KEY = "nitu5-admin-token";

export const getToken = (): string | null =>
  typeof window === "undefined" ? null : localStorage.getItem(KEY);

export const setToken = (t: string): void => localStorage.setItem(KEY, t);
export const clearToken = (): void => localStorage.removeItem(KEY);

export async function api<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opts.headers ?? {}),
    },
  });
  const body = (await res.json().catch(() => ({}))) as T & { message?: string };
  if (!res.ok) throw new Error((body as { message?: string }).message ?? `Failed (${res.status})`);
  return body as T;
}

export const naira = (kobo: number | null | undefined): string =>
  kobo == null ? "—" : `₦${(kobo / 100).toLocaleString("en-NG")}`;

export const pretty = (v: string | undefined | null): string => {
  if (!v) return "—";
  const tiers: Record<string, string> = {
    L0_NONE: "Unverified",
    L1_ACCOUNT: "Account ok",
    L2_IDENTITY: "ID ok",
    L3_DRIVER_VEHICLE: "Car ok",
    L4_FULLY_VERIFIED: "Fully verified",
  };
  if (tiers[v]) return tiers[v];
  return v
    .split("_")
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(" ");
};
