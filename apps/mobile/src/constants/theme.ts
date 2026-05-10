export const theme = {
  colors: {
    background: "#090b0f",
    panel: "#141820",
    panelMuted: "#1b2029",
    accent: "#ef4444",
    accentMuted: "#7f1d1d",
    text: "#f8fafc",
    muted: "#94a3b8",
    border: "#28303d",
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
