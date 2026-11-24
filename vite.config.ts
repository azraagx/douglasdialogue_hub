import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative base so the build can be hosted in any folder of a static web server.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: { outDir: 'dist', assetsDir: 'assets', sourcemap: false },
});
