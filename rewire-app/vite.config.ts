/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite 設定
// - base 使用相對路徑 './'：搭配 HashRouter，網站放在 GitHub Pages 任何子路徑（例如 /mindy-os/rewire/）都能正確載入靜態資源。
// - outDir 輸出到上一層的 rewire/：讓「從分支部署」的 GitHub Pages 也能直接提供 https://<帳號>.github.io/mindy-os/rewire/。
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: '../rewire',
    emptyOutDir: true,
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        // 將圖表函式庫獨立切塊，首頁載入更輕量
        manualChunks: {
          recharts: ['recharts'],
          react: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
