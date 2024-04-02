import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  //   base: '/Eisvana-Census-Renew/',
  plugins: [vue()],
  build: {
    target: 'ESNext',
    rollupOptions: {
      input: ['index.html', 'form.html', 'renew.html', 'table.html'],
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
