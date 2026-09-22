import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/integration/**/*.test.ts'],
    passWithNoTests: true,
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
      exclude: ['src/api/start.ts', 'tests/integration/**/*.test.ts'],
    },
  },
});
