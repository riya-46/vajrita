import { create } from "zustand";

interface FakeCallState {
  scheduledAt?: number;
  callerName: string;
  callerPhone: string;
  ringtoneUrl?: string;
  setScenario: (payload: { callerName: string; callerPhone: string; ringtoneUrl?: string; scheduledAt?: number }) => void;
  clear: () => void;
}

export const useFakeCallStore = create<FakeCallState>((set) => ({
  callerName: "Emergency Contact",
  callerPhone: "+911234567890",
  ringtoneUrl: undefined,
  scheduledAt: undefined,
  setScenario: (payload) => set(payload),
  clear: () =>
    set({
      callerName: "Emergency Contact",
      callerPhone: "+911234567890",
      ringtoneUrl: undefined,
      scheduledAt: undefined,
    }),
}));
