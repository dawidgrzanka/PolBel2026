import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Standardowa konfiguracja Vite dla React
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // To pozwala na używanie skrótu "@" w importach, np. "@/components/Hero"
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // Opcjonalnie: możesz tu ustawić port, jeśli chcesz (np. 3000)
    port: 5173,
  }
})