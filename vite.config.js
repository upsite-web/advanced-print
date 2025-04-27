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
      input: {
        editor: path.resolve(__dirname, 'src/editor.jsx'),
      },
      output: {
        entryFileNames: 'editor.js',
        globals: {
          '@wordpress/api-fetch': 'wp.apiFetch', // ✅ Tell Vite it's a WordPress global
        },
      },
      external: [
        '@wordpress/api-fetch', // ✅ Don't bundle this
      ],
    },
  },
});
