import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // Automatically updates the app when you push new code
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'], // Add these to your public folder if you have them
      manifest: {
        name: 'Income Tracker',
        short_name: 'Tracker',
        description: 'Track your daily income, deductions, and goals seamlessly.',
        theme_color: '#ffffff', // Your app's primary background color
        background_color: '#ffffff',
        display: 'standalone', // This makes it look like a native app without browser tabs
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
