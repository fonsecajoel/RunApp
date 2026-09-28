/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      colors: {
        ink: {
          DEFAULT: "#111111",
          soft: "#1a1a1a",
          mute: "#6b7280",
        },
        accent: {
          DEFAULT: "#ff4d2e",
          soft: "#ff6b4f",
        },
        line: "rgba(255,255,255,0.1)",
      },
      borderRadius: {
        xl: "14px",
        "2xl": "18px",
      },
    },
  },
  plugins: [],
};
