import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./__tests__/setup/setup.ts'],
    include: ['__tests__/**/*.test.ts', '__tests__/**/*.test.tsx'],
    exclude: ['node_modules', '.next'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['lib/**/*.ts', 'app/api/**/*.ts', 'contexts/**/*.tsx'],
      exclude: [
        'node_modules/**',
        'app/generated/**',
        '**/*.d.ts',
        '**/*.test.ts',
        '**/*.test.tsx'
      ],
      // Per-file thresholds for tested files
      // Global thresholds removed - will add as more tests are written
    },
    testTimeout: 10000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})
