import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['verify-tmp/**/*.test.ts', 'verify-tmp/**/*.test.tsx'],
    environment: 'node',
    // Testing Library の自動クリーンアップを有効にするために globals を on にする
    globals: true,
  },
});
