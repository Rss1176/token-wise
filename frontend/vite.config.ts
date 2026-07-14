import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Config lives in frontend/ but npm scripts run from the repo root,
  // so pin the app root to this directory.
  root: fileURLToPath(new URL('.', import.meta.url)),
  plugins: [react()],
  server: {
    // fail loudly if 5173 is taken instead of silently moving to another port
    port: 5173,
    strictPort: true,
    proxy: {
      // The local stand-in for the Vercel functions (backend/src/dev-server.ts)
      '/api': 'http://localhost:3001',
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
