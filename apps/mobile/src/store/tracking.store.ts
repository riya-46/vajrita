import type { TrackingSessionDto } from "@vajrita/shared";
import { create } from "zustand";

interface TrackingState {
  activeTracking: TrackingSessionDto | null;
  setActiveTracking: (session: TrackingSessionDto | null) => void;
}

export const useTrackingStore = create<TrackingState>((set) => ({
  activeTracking: null,
  setActiveTracking: (activeTracking) => set({ activeTracking }),
}));
