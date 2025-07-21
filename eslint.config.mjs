import tsParser from '@typescript-eslint/parser';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettierConfig from 'eslint-config-prettier/flat';
import grafanaConfig from '@grafana/eslint-config/flat.js';
import eslintConfig from '@volkovlabs/eslint-config';

export default defineConfig(
  ...grafanaConfig,
  eslintConfig,
  prettierConfig,
  {
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ['tsconfig.json'],
        sourceType: 'module',
      },
    },
    rules: {
      '@typescript-eslint/no-empty-object-type': 'off',
    },
  },
  globalIgnores([
    'dist/*',
    'src/**/*.test.tsx',
    'src/**/*.test.ts',
    'src/__mocks__/**',
    'coverage/*',
    'test/*',
    'coverage/*',
    '.config/*',
    '.prettierrc.js',
    'jest*.js',
    'eslint.config.mjs',
    'playwright.config.ts',
  ])
);
