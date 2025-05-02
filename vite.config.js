import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: './src',
  build: {
    outDir: '../build',
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'src/main.jsx'),
      output: {
        format: 'iife',  // <<<<<< THIS IS THE MOST IMPORTANT LINE
        entryFileNames: 'editor.js',
        globals: {
          '@wordpress/api-fetch': 'wp.apiFetch',
          '@wordpress/element': 'wp.element',
          '@wordpress/data': 'wp.data',
        },
      },
      external: [
        '@wordpress/api-fetch',
        '@wordpress/element',
        '@wordpress/data',
      ],
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
