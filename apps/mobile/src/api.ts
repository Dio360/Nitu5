import AsyncStorage from "@react-native-async-storage/async-storage";

/** Your PC on your WiFi — override with EXPO_PUBLIC_API_URL when starting. */
export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ?? "http://10.204.51.148:3000";

const TOKEN_KEY = "nitu5-access-token";

export async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function setToken(token: string): Promise<void> {
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function clearToken(): Promise<void> {
  await AsyncStorage.removeItem(TOKEN_KEY);
}

export async function api<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const token = await getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opts.headers ?? {}),
    },
  });
  const body = (await res.json().catch(() => ({}))) as T & { message?: string };
  if (!res.ok) {
    throw new Error(
      (body as { message?: string }).message ?? `Request failed (${res.status})`,
    );
  }
  return body as T;
}

export const naira = (kobo: number | null | undefined): string =>
  kobo == null ? "—" : `₦${(kobo / 100).toLocaleString("en-NG")}`;

export interface User {
  id: string;
  phone: string;
  firstName: string;
  lastName: string;
  role: string;
  verificationTier: string;
  rating: number | null;
  tripsCompleted: number;
}

export interface Trip {
  id: string;
  rideModel: string;
  tripType: string;
  originLabel: string;
  destinationLabel: string;
  departureAt: string;
  seatsTotal: number;
  seatsLeft: number;
  farePerSeatKobo: number | null;
  privateFareKobo: number | null;
  status: string;
  driver: {
    firstName: string;
    lastName: string;
    rating: number | null;
    verificationTier: string;
    driverType: string | null;
  };
}
