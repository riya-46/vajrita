import { z } from "zod";
import { ALERT_CHANNELS, TRACKING_DURATIONS } from "../constants";

export const phoneNumberSchema = z
  .string()
  .trim()
  .regex(/^\+?[1-9]\d{7,14}$/, "Enter a valid phone number");

export const authExchangeSchema = z.object({
  firebaseToken: z.string().min(10),
  name: z.string().trim().min(2).max(80).optional(),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(20),
});

export const contactCreateSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: phoneNumberSchema,
  relationship: z.string().trim().min(2).max(40),
});

export const contactUpdateSchema = contactCreateSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  "At least one field is required",
);

export const fakeCallConfigSchema = z.object({
  defaultDelaySeconds: z.number().int().min(5).max(120),
  defaultCallerName: z.string().trim().min(2).max(80),
  defaultCallerPhone: phoneNumberSchema,
  ringtoneUrl: z.string().url().optional(),
});

export const locationPointSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  accuracy: z.number().min(0).max(10000).optional(),
  speed: z.number().min(0).max(500).optional(),
  heading: z.number().min(0).max(360).optional(),
  timestamp: z.coerce.date(),
});

export const emergencyStartSchema = z.object({
  contactIds: z.array(z.string().min(1)).min(1),
  channels: z.array(z.enum(ALERT_CHANNELS)).min(1),
  initialLocation: locationPointSchema,
  trackingDuration: z.enum(TRACKING_DURATIONS).default("until_stopped"),
});

export const emergencyRetrySchema = z.object({
  attemptIds: z.array(z.string().min(1)).optional(),
});

export const trackingStartSchema = z.object({
  contactIds: z.array(z.string().min(1)).min(1),
  duration: z.enum(TRACKING_DURATIONS),
  initialLocation: locationPointSchema,
});

export const trackingPingSchema = z.object({
  location: locationPointSchema,
});
