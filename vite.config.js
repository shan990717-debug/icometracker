import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { fileURLToPath } from 'url'
import path from 'path'

// Standard way to replicate __dirname in modern ES Modules (Vite)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
  logLevel: 'error',
  plugins: [react()],
  base: '/',
  resolve: {
    alias: {
      // This tells Vite that "@/" maps directly to your local "src" directory
      '@': path.resolve(__dirname, './src'),
    },
  },
})
