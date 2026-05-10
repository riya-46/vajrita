import * as SecureStore from "expo-secure-store";

export const storageKeys = {
  accessToken: "vajrita.accessToken",
  refreshToken: "vajrita.refreshToken",
  onboardingSeen: "vajrita.onboardingSeen",
  pendingPhone: "vajrita.pendingPhone",
  pendingName: "vajrita.pendingName",
  activeTrackingId: "vajrita.activeTrackingId",
} as const;

export async function setSecureValue(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

export async function getSecureValue(key: string) {
  return SecureStore.getItemAsync(key);
}

export async function deleteSecureValue(key: string) {
  await SecureStore.deleteItemAsync(key);
}
