import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/xiangqi/',
  test: {
    environment: 'node',
    include: ['src/engine/**/*.test.ts', 'src/ai/**/*.test.ts'],
  },
} as Parameters<typeof defineConfig>[0]);
