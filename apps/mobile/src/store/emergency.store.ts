import type { AlertChannel, EmergencySessionDto } from "@vajrita/shared";
import { create } from "zustand";

interface EmergencyState {
  activeSession: EmergencySessionDto | null;
  selectedChannels: AlertChannel[];
  setActiveSession: (session: EmergencySessionDto | null) => void;
  toggleChannel: (channel: AlertChannel) => void;
  resetChannels: () => void;
}

export const useEmergencyStore = create<EmergencyState>((set) => ({
  activeSession: null,
  selectedChannels: ["sms", "whatsapp"],
  setActiveSession: (activeSession) => set({ activeSession }),
  toggleChannel: (channel) =>
    set((state) => ({
      selectedChannels: state.selectedChannels.includes(channel)
        ? state.selectedChannels.filter((value) => value !== channel)
        : [...state.selectedChannels, channel],
    })),
  resetChannels: () => set({ selectedChannels: ["sms", "whatsapp"] }),
}));
