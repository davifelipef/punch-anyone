import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "./",

  plugins: [
    VitePWA({
      registerType: "autoUpdate",

      manifest: {
        name: "Punch Anyone",
        short_name: "Punch Anyone",
        description:
          "Um jogo de socos usando fotos e detecção facial.",
        start_url: "./",
        display: "standalone",
        background_color: "#000000",
        theme_color: "#000000",
        orientation: "portrait",
        icons: [
          {
            src: "./icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "./icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },

      workbox: {
        globPatterns: [
          "**/*.{js,css,html,ico,png,svg,webp,tflite}",
        ],
      },
    }),
  ],
});