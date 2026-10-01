import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import oxlint from 'vite-plugin-oxlint';
import { VitePWA } from 'vite-plugin-pwa';

const THEME_COLOR = '#111418';

export default defineConfig({
  plugins: [
    react(),
    oxlint(),
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
