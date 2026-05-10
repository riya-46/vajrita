import type { EmergencySessionDto } from "@vajrita/shared";
import { apiRequest } from "./client";

export function getActiveSos() {
  return apiRequest<EmergencySessionDto | null>("/api/sos/active");
}

export function startSos(input: {
  contactIds: string[];
  channels: ("sms" | "whatsapp" | "call")[];
  initialLocation: {
    latitude: number;
    longitude: number;
    accuracy?: number;
    speed?: number;
    heading?: number;
    timestamp: string;
  };
  trackingDuration: "15m" | "1h" | "until_stopped";
}) {
  return apiRequest<EmergencySessionDto>("/api/sos/start", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function endSos(id: string) {
  return apiRequest<EmergencySessionDto>(`/api/sos/${id}/end`, {
    method: "POST",
  });
}
