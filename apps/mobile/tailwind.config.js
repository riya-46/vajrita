/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#f7f9fe",
        panel: "#ffffff",
        panelMuted: "#edf2ff",
        accent: "#2f55e7",
        accentMuted: "#e8edff",
        text: "#202b45",
        muted: "#6d7a96",
        border: "#dbe3f1",
      },
      fontSize: {
        emergency: ["48px", { lineHeight: "52px", fontWeight: "800" }],
      },
    },
  },
  plugins: [],
};
