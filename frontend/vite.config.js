import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // During development, forward API calls to the backend so the frontend
    // code never needs to know the backend's port.
    proxy: {
      "/api": "http://localhost:5000",
    },
  },
});
