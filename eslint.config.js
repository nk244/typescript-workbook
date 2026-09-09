// ESLint の Flat Config（eslint.config.js）。第23章で読み解きます。
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';

export default tseslint.config(
  { ignores: ['node_modules', 'verify-tmp', 'dist', '**/*.js', '**/*.mjs'] },
  js.configs.recommended,
  // 型情報を使うルール（型を見ないと検出できないバグを拾える）
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // 学習用リポジトリなので、未実装スタブの都合で出るものは緩める
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      // Promise の扱い間違いは実務で本当に多いので、ここは厳しく
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      // 学習用の例では「await しない async 関数」や「never を含むユニオン」を
      // わざと書くので、この 2 つは無効化している
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-redundant-type-constituents': 'off',
    },
  },
  {
    // 演習ファイルは「未実装のスタブ」なので、空の型や any 由来の警告が出る。
    // 解き進めれば自然に消えるため、ここでは黙らせている
    files: ['src/**/exercise.ts', 'src/**/exercise.tsx', 'src/**/*.test.ts', 'src/**/*.test.tsx'],
    rules: {
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
    },
  },
  {
    files: ['**/*.tsx'],
    plugins: { 'react-hooks': reactHooks },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
);
