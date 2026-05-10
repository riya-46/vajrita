import type { AuthenticatedUser } from "@vajrita/shared";
import { create } from "zustand";

type AuthStatus = "bootstrapping" | "signed_out" | "otp_sent" | "signed_in";

interface AuthState {
  status: AuthStatus;
  bootstrapped: boolean;
  onboardingSeen: boolean;
  pendingPhone: string;
  pendingName: string;
  accessToken: string | null;
  user: AuthenticatedUser | null;
  error: string | null;
  setOnboardingSeen: (value: boolean) => void;
  setPendingAuth: (phone: string, name: string) => void;
  setOtpSent: () => void;
  setSession: (payload: { accessToken: string; user: AuthenticatedUser }) => void;
  setBootstrapped: (value: boolean) => void;
  setError: (message: string | null) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  status: "bootstrapping",
  bootstrapped: false,
  onboardingSeen: false,
  pendingPhone: "",
  pendingName: "",
  accessToken: null,
  user: null,
  error: null,
  setOnboardingSeen: (value) => set({ onboardingSeen: value }),
  setPendingAuth: (phone, name) => set({ pendingPhone: phone, pendingName: name, error: null }),
  setOtpSent: () => set({ status: "otp_sent" }),
  setSession: ({ accessToken, user }) =>
    set({ status: "signed_in", bootstrapped: true, accessToken, user, error: null }),
  setBootstrapped: (value) =>
    set((state) => ({
      bootstrapped: value,
      status: state.accessToken ? "signed_in" : state.status === "otp_sent" ? "otp_sent" : "signed_out",
    })),
  setError: (message) => set({ error: message }),
  signOut: () =>
    set({
      status: "signed_out",
      accessToken: null,
      user: null,
      pendingPhone: "",
      pendingName: "",
      error: null,
      bootstrapped: true,
    }),
}));
