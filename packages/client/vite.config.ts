import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
      },
    },
  },
  resolve: {
    alias: [
      {
        find: '~constants',
        replacement: path.resolve(__dirname, 'src/constants.ts'),
      },
      {
        find: '~app',
        replacement: path.resolve(__dirname, 'src/App.tsx'),
      },
      {
        find: '~assets',
        replacement: path.resolve(__dirname, 'src/assets'),
      },
      {
        find: '~components',
        replacement: path.resolve(__dirname, 'src/components'),
      },
      {
        find: '~hooks',
        replacement: path.resolve(__dirname, 'src/hooks'),
      },
      {
        find: '~lib',
        replacement: path.resolve(__dirname, 'src/lib'),
      },
      {
        find: '~pages',
        replacement: path.resolve(__dirname, 'src/pages'),
      },
      {
        find: '~styles',
        replacement: path.resolve(__dirname, 'src/styles'),
      },
      {
        find: '~store',
        replacement: path.resolve(__dirname, 'src/store'),
      },
    ],
  },
});
