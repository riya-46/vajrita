export const theme = {
  colors: {
    background: "#f7f9fe",
    panel: "#ffffff",
    panelMuted: "#edf2ff",
    accent: "#2f55e7",
    accentMuted: "#e8edff",
    text: "#202b45",
    muted: "#6d7a96",
    border: "#dbe3f1",
    success: "#22c55e",
    warning: "#f59e0b",
  },
  emergencyDurations: [
    { label: "15 mins", value: "15m" },
    { label: "1 hour", value: "1h" },
    { label: "Until stopped", value: "until_stopped" },
  ] as const,
};

export const DEFAULT_RINGTONE_URL =
  "https://actions.google.com/sounds/v1/alarms/phone_alerts_and_rings.ogg";

export const surfaceShadow = {
  shadowColor: "#8ea1cc",
  shadowOpacity: 0.14,
  shadowRadius: 18,
  shadowOffset: { width: 0, height: 10 },
  elevation: 4,
} as const;
