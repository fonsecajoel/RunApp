import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,svg,wav,webmanifest}"],
      },
      manifest: {
        name: "Stride Lisboa",
        short_name: "Stride",
        description: "Rotas de corrida com história por GPS em Lisboa",
        theme_color: "#0c0f14",
        background_color: "#0c0f14",
        display: "standalone",
        orientation: "portrait",
      },
    }),
  ],
});
