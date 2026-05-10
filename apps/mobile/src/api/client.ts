import Constants from "expo-constants";
import type { ApiResponse, AuthenticatedUser, SessionTokens } from "@vajrita/shared";
import { clearSession, loadStoredTokens, saveSession } from "../services/session";
import { useAuthStore } from "../store/auth.store";

const baseUrl = (
  process.env.EXPO_PUBLIC_API_URL ||
  Constants.expoConfig?.extra?.apiUrl ||
  "http://localhost:4000"
).replace(/\/$/, "");

let refreshPromise: Promise<string | null> | null = null;

class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

async function refreshAccessToken() {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const { refreshToken } = await loadStoredTokens();
    if (!refreshToken) {
      return null;
    }

    const response = await fetch(`${baseUrl}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      await clearSession();
      return null;
    }

    const payload = (await response.json()) as ApiResponse<{
      user: AuthenticatedUser;
      tokens: SessionTokens;
    }>;

    await saveSession(payload.data.tokens, payload.data.user);
    return payload.data.tokens.accessToken;
  })();

  const accessToken = await refreshPromise;
  refreshPromise = null;
  return accessToken;
}

export async function apiRequest<T>(path: string, init?: RequestInit, requiresAuth = true): Promise<T> {
  const store = useAuthStore.getState();
  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json");

  let accessToken = store.accessToken;
  if (requiresAuth && accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  let response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers,
  });

  if (response.status === 401 && requiresAuth) {
    accessToken = await refreshAccessToken();
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
      response = await fetch(`${baseUrl}${path}`, {
        ...init,
        headers,
      });
    }
  }

  const payload = (await response.json()) as { success: boolean; data?: T; error?: string; details?: unknown };
  if (!response.ok || !payload.success || payload.data === undefined) {
    throw new ApiError(payload.error || "Request failed", response.status, payload.details);
  }

  return payload.data;
}
