import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const webEnv = loadEnv(mode, __dirname, "");
  const apiEnv = loadEnv(mode, resolve(__dirname, "../api"), "");

  const googleMapsApiKey =
    webEnv.VITE_GOOGLE_MAPS_API_KEY ??
    webEnv.GOOGLE_MAPS_API_KEY ??
    apiEnv.GOOGLE_MAPS_API_KEY ??
    apiEnv.GOOGLE_PLACES_API_KEY ??
    process.env.VITE_GOOGLE_MAPS_API_KEY ??
    process.env.GOOGLE_MAPS_API_KEY ??
    process.env.GOOGLE_PLACES_API_KEY ??
    "";

  return {
    plugins: [react()],
    define: {
      __GOOGLE_MAPS_API_KEY__: JSON.stringify(googleMapsApiKey),
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
    server: {
      port: 5173,
      proxy: {
        "/api": {
          target: "http://localhost:3000",
          changeOrigin: true,
        },
      },
    },
  };
});
