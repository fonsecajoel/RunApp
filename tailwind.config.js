/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        display: ["Fraunces", "Georgia", "serif"],
      },
      colors: {
        lisboa: {
          night: "#0c0f14",
          slate: "#151a22",
          mist: "#8b9aab",
          tile: "#c45c3e",
          gold: "#d4a853",
          river: "#3d6b8a",
        },
      },
      boxShadow: {
        glow: "0 0 40px -8px rgba(212, 168, 83, 0.35)",
        card: "0 8px 32px rgba(0,0,0,0.45)",
      },
      animation: {
        shimmer: "shimmer 4s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
    },
  },
  plugins: [],
};
