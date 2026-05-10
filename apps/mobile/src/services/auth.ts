import { getAuth, signInWithPhoneNumber } from "@react-native-firebase/auth";
import { apiRequest } from "../api/client";
import { useAuthStore } from "../store/auth.store";
import { clearSession, saveSession } from "./session";

let currentVerification: Awaited<ReturnType<typeof signInWithPhoneNumber>> | null = null;

export async function requestOtp(phone: string) {
  const auth = getAuth();
  const useTestingBypass =
    __DEV__ && process.env.EXPO_PUBLIC_FIREBASE_DISABLE_APP_VERIFICATION === "true";
  const testPhone = process.env.EXPO_PUBLIC_FIREBASE_TEST_PHONE;
  const testCode = process.env.EXPO_PUBLIC_FIREBASE_TEST_CODE;

  if (useTestingBypass) {
    auth.settings.appVerificationDisabledForTesting = true;
    if (testPhone && testCode) {
      await auth.settings.setAutoRetrievedSmsCodeForPhoneNumber(testPhone, testCode);
    }
  }

  currentVerification = await signInWithPhoneNumber(auth, phone);
  useAuthStore.getState().setOtpSent();
}

export async function resendOtp() {
  const { pendingPhone } = useAuthStore.getState();
  if (!pendingPhone) {
    throw new Error("Phone number missing");
  }

  await requestOtp(pendingPhone);
}

export async function completeOtpLogin(code: string) {
  if (!currentVerification) {
    throw new Error("Verification session expired. Please request a new OTP.");
  }

  const credential = await currentVerification.confirm(code);
  const firebaseToken = await credential.user.getIdToken(true);
  const { pendingName } = useAuthStore.getState();
  const payload = await apiRequest<{
    user: import("@vajrita/shared").AuthenticatedUser;
    tokens: import("@vajrita/shared").SessionTokens;
  }>(
    "/api/auth/exchange",
    {
      method: "POST",
      body: JSON.stringify({
        firebaseToken,
        name: pendingName || undefined,
      }),
    },
    false,
  );

  await saveSession(payload.tokens, payload.user);
}

export async function restoreSession() {
  try {
    const me = await apiRequest<import("@vajrita/shared").AuthenticatedUser>("/api/auth/me");
    useAuthStore.getState().setSession({
      accessToken: useAuthStore.getState().accessToken ?? "",
      user: me,
    });
  } catch {
    await clearSession();
  } finally {
    useAuthStore.getState().setBootstrapped(true);
  }
}

export async function logOut() {
  await clearSession();
}
