import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const base = process.env.GITHUB_ACTIONS ? "/RunApp/" : "/";

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,svg,wav,webmanifest}"],
      },
      manifest: {
        name: "RunApp Lisboa",
        short_name: "RunApp",
        description: "Correr em Lisboa com episódios por GPS",
        theme_color: "#111111",
        background_color: "#111111",
        display: "standalone",
        orientation: "portrait",
      },
    }),
  ],
});
