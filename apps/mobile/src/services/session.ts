import { getAuth } from "@react-native-firebase/auth";
import type { AuthenticatedUser, SessionTokens } from "@vajrita/shared";
import {
  deleteSecureValue,
  getSecureValue,
  setSecureValue,
  storageKeys,
} from "./secure-storage";
import { useAuthStore } from "../store/auth.store";

export async function saveSession(tokens: SessionTokens, user: AuthenticatedUser) {
  await Promise.all([
    setSecureValue(storageKeys.accessToken, tokens.accessToken),
    setSecureValue(storageKeys.refreshToken, tokens.refreshToken),
  ]);

  useAuthStore.getState().setSession({ accessToken: tokens.accessToken, user });
}

export async function loadStoredTokens() {
  const [accessToken, refreshToken] = await Promise.all([
    getSecureValue(storageKeys.accessToken),
    getSecureValue(storageKeys.refreshToken),
  ]);

  return { accessToken, refreshToken };
}

export async function clearSession() {
  await Promise.all([
    deleteSecureValue(storageKeys.accessToken),
    deleteSecureValue(storageKeys.refreshToken),
    deleteSecureValue(storageKeys.activeTrackingId),
  ]);
  await getAuth().signOut().catch(() => undefined);
  useAuthStore.getState().signOut();
}
