import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    // node:sqlite is a native Node builtin — don't let Vite try to transform/bundle it.
    server: {
      deps: {
        external: ['node:sqlite', /node:sqlite/],
      },
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/domain/**', 'src/api/**'],
    },
  },
});
