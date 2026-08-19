import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@shared": path.resolve(__dirname, "../../packages/shared"),
      "@utils": path.resolve(__dirname, "../../packages/utils"),
      "@ui": path.resolve(__dirname, "../../packages/ui"),
      "@types": path.resolve(__dirname, "../../packages/types"),
      "@services": path.resolve(__dirname, "../../packages/services"),
      "@theme": path.resolve(__dirname, "../../packages/theme"),
    },
  },
})
