import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  base: '/leantrack/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['icons/*.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'LeanTrack — Fitness & Weight Tracker',
        short_name: 'LeanTrack',
        description: 'iPhone-first fitness tracking PWA for weight loss and strength training',
        start_url: '/leantrack/',
        scope: '/leantrack/',
        display: 'standalone',
        background_color: '#0B0D10',
        theme_color: '#0B0D10',
        icons: [
          { src: '/leantrack/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/leantrack/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/leantrack/icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/rest\/v1\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-api',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 },
              networkTimeoutSeconds: 5,
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    port: 5173,
  },
});
