import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/api/**/*.integration.test.ts'],
    server: {
      deps: {
        external: ['node:sqlite', /node:sqlite/],
      },
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      reportsDirectory: 'coverage/integration',
      include: ['src/api/**/*.ts', 'src/domain/**/*.ts'],
      exclude: ['src/api/start.ts', 'src/**/*.test.ts'],
    },
  },
});
