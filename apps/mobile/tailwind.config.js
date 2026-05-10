/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#090b0f",
        panel: "#141820",
        panelMuted: "#1b2029",
        accent: "#ef4444",
        accentMuted: "#7f1d1d",
        text: "#f8fafc",
        muted: "#94a3b8",
        border: "#28303d",
      },
      fontSize: {
        emergency: ["48px", { lineHeight: "52px", fontWeight: "800" }],
      },
    },
  },
  plugins: [],
};
