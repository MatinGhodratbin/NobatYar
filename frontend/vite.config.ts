import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    // درخواست‌های /api داخل شبکه‌ی داکر مستقیم به سرویس nginx فوروارد می‌شن
    // تا در مرورگر با CORS درگیر نشیم.
    proxy: {
      '/api': {
        target: 'http://nginx',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});