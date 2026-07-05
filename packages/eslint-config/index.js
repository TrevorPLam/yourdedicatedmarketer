import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';
import zodPlugin from 'eslint-plugin-zod-v4';

export default [
  js.configs.recommended,
  zodPlugin.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        // Type-aware linting disabled by default for performance
        // Enable per-package if needed by adding project: './tsconfig.json'
      },
      globals: {
        process: 'readonly',
        console: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'zod-v4': zodPlugin,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      'no-undef': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      // Note: Type-aware rules (no-floating-promises, no-misused-promises)
      // require parserOptions.project to be set. Enable per-package if needed.
      'zod-v4/prefer-safeParse': 'warn',
    },
  },
  {
    files: ['**/*.test.{js,jsx,ts,tsx}', '**/*.spec.{js,jsx,ts,tsx}'],
    rules: {
      'zod-v4/prefer-safeParse': 'off',
    },
  },
  {
    files: ['**/env.ts', '**/env.js'],
    rules: {
      'zod-v4/prefer-safeParse': 'off',
    },
  },
  prettier,
];
