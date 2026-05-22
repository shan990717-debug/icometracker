import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  logLevel: 'error', 
  plugins: [
    react(),
  ],
  // Explicitly tell Vite to serve assets from the root path
  base: '/', 
})
