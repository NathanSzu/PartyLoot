import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    optimizeDeps: {
      include: ['quill', 'react-quilljs']
    },
    build: {
      commonjsOptions: {
        transformMixedEsModules: true,
      },
      outDir: 'build',
    },
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,json,vue,txt,woff2}']
        },
        includeAssets: ['PWAIcons/*.png', 'PWAIcons/*.svg', 'APPIcons/**/*.png'],
        manifest: {
          name: 'Party Loot',
          short_name: 'PartyLoot',
          description: 'A party loot tracker to keep your games organized!',
          theme_color: '#000000',
          background_color: '#ffffff',
          display: 'standalone',
          icons: [
            {
              src: 'PWAIcons/PL_32.png',
              sizes: '32x32',
              type: 'image/png'
            },
            {
              src: 'PWAIcons/PL_180.png',
              sizes: '180x180',
              type: 'image/png'
            },
            {
              src: 'PWAIcons/PL_Icon.svg',
              sizes: 'any',
              type: 'image/svg+xml'
            }
          ]
        }
      })
    ],
  };
});