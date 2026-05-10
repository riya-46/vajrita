import type { TrackingSessionDto } from "@vajrita/shared";
import { apiRequest } from "./client";

export function getActiveTracking() {
  return apiRequest<TrackingSessionDto | null>("/api/tracking/active");
}

export function startTracking(input: {
  contactIds: string[];
  duration: "15m" | "1h" | "until_stopped";
  initialLocation: {
    latitude: number;
    longitude: number;
    accuracy?: number;
    speed?: number;
    heading?: number;
    timestamp: string;
  };
}) {
  return apiRequest<TrackingSessionDto>("/api/tracking/start", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function stopTracking(id: string) {
  return apiRequest<TrackingSessionDto>(`/api/tracking/${id}/stop`, {
    method: "POST",
  });
}
