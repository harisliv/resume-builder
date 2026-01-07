import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setupTests.ts']
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './')
    }
  }
});
