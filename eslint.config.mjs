import tsParser from '@typescript-eslint/parser';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettierConfig from 'eslint-config-prettier/flat';
import storybookPlugin from 'eslint-plugin-storybook';

import eslintConfig from '@volkovlabs/eslint-config';

export default defineConfig(
  eslintConfig,
  prettierConfig,
  storybookPlugin.configs['flat/recommended'],
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
  globalIgnores(['dist/*', 'src/**/*.test.tsx', 'src/**/*.test.ts', 'src/__mocks__/**'])
);
