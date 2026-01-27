import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  server: {
    allowedHosts: true,
    proxy: {
      "^/(auth|users|organizations|race)": {
        target: "https://back-mint-node.vercel.app",
        changeOrigin: true,
        secure: true
      },
    }
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
