import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const THEME_COLOR = '#30404D';

export default defineConfig({
  build: {
    // TODO: remove with Blueprint 6 — Blueprint 3's CSS has selectors lightningcss rejects
    cssMinify: false
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Astro Calendar',
        short_name: 'Astro Calendar',
        start_url: '.',
        display: 'standalone',
        theme_color: THEME_COLOR,
        background_color: THEME_COLOR,
        icons: [36, 48, 72, 96, 144, 192].map(size => ({
          src: `/icons/android-icon-${size}x${size}.png`,
          sizes: `${size}x${size}`,
          type: 'image/png'
        }))
      }
    })
  ]
});
