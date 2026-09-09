import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    // 解答例はテスト対象から外す（自分で解いてから読むこと）
    exclude: ['**/node_modules/**', 'solutions/**'],
    environment: 'node',
    // Testing Library の自動クリーンアップを有効にするために globals を on にする
    globals: true,
  },
});
