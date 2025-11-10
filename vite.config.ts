import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
//   server: {
//     host: "0.0.0.0",
//     allowedHosts: ["855839c84ec5.ngrok-free.app"],
//     port: 3001,
//   },
});
``