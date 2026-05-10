export const APP_NAME = "VAJRITA";

export const DEFAULT_EMERGENCY_CONTACTS = [
  { name: "Police", phone: "112", relationship: "Emergency Service" },
  { name: "Ambulance", phone: "102", relationship: "Emergency Service" },
  { name: "Fire Brigade", phone: "101", relationship: "Emergency Service" },
] as const;

export const ALERT_CHANNELS = ["sms", "whatsapp", "call"] as const;
export const TRACKING_DURATIONS = ["15m", "1h", "until_stopped"] as const;
export const CONTACT_RELATIONSHIPS = [
  "Parent",
  "Sibling",
  "Friend",
  "Partner",
  "Guardian",
  "Coworker",
  "Other",
] as const;

export const OTP_LENGTH = 6;
export const ACCESS_TOKEN_TTL_MINUTES = 15;
export const REFRESH_TOKEN_TTL_DAYS = 30;
export const CONTACT_VERIFICATION_TTL_HOURS = 48;
export const TRACKING_PING_INTERVAL_SECONDS = 10;
