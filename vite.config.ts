import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { viteStaticCopy as copy } from 'vite-plugin-static-copy';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // copy({ targets: [
    //   { src: 'docs/**/*', dest: 'md' }
    // ], flatten: false })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '~': path.resolve(__dirname, './defs'),
      '%': path.resolve(__dirname, './docs'),
    },
  },
  // assetsInclude: ['./docs/**/*.md']
});
