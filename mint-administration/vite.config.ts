import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'
import mkcert from 'vite-plugin-mkcert'
import path from "path"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  server: {
    allowedHosts: true
  },
  plugins: [
    react(),
    tailwindcss(),
    // basicSsl(),
    // mkcert(),
  ],
  resolve: {
    alias: {
      "@": path.resolve("./src"),
    },
  },
  clearScreen: false
})
