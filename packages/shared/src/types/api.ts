import type { z } from "zod";
import type {
  contactCreateSchema,
  contactUpdateSchema,
  emergencyStartSchema,
  fakeCallConfigSchema,
  locationPointSchema,
  refreshTokenSchema,
  trackingStartSchema,
} from "../schemas";

export type AlertChannel = "sms" | "whatsapp" | "call";
export type TrackingDuration = "15m" | "1h" | "until_stopped";

export interface SessionTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthenticatedUser {
  id: string;
  name: string;
  phone: string;
  verified: boolean;
  trustedContactsCount: number;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
}

export interface TrustedContactDto {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  verified: boolean;
  isDefault: boolean;
  createdAt: string;
}

export interface FakeCallConfigDto {
  defaultDelaySeconds: number;
  defaultCallerName: string;
  defaultCallerPhone: string;
  ringtoneUrl?: string;
}

export interface EmergencyRecipientDto {
  contactId: string;
  name: string;
  phone: string;
  relationship: string;
}

export interface TrackingLocationDto {
  latitude: number;
  longitude: number;
  accuracy?: number;
  speed?: number;
  heading?: number;
  timestamp: string;
}

export interface TrackingSessionDto {
  id: string;
  shareToken: string;
  userId: string;
  active: boolean;
  duration: TrackingDuration;
  startedAt: string;
  endedAt?: string | null;
  expiresAt?: string | null;
  lastLocation?: TrackingLocationDto | null;
  shareUrl: string;
}

export interface EmergencySessionDto {
  id: string;
  active: boolean;
  recipients: EmergencyRecipientDto[];
  channels: AlertChannel[];
  startedAt: string;
  endedAt?: string | null;
  liveTrackingEnabled: boolean;
  trackingSession?: TrackingSessionDto | null;
  alertSummary: {
    sent: number;
    failed: number;
    pending: number;
  };
}

export type ContactCreateInput = z.infer<typeof contactCreateSchema>;
export type ContactUpdateInput = z.infer<typeof contactUpdateSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type LocationPointInput = z.infer<typeof locationPointSchema>;
export type EmergencyStartInput = z.infer<typeof emergencyStartSchema>;
export type TrackingStartInput = z.infer<typeof trackingStartSchema>;
export type FakeCallConfigInput = z.infer<typeof fakeCallConfigSchema>;
