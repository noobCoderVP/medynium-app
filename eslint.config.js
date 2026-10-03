// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  { ignores: ['dist/*', 'src/lib/api/schema.d.ts'] },
  {
    // Rules 1 and 11: components never call the API client; features expose a public index.ts only.
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: ['@/features/*/*'], message: 'Import a feature through its index.ts only.' },
          ],
        },
      ],
      'max-lines': ['error', { max: 200, skipBlankLines: true, skipComments: true }],
    },
  },
  {
    files: ['src/**/components/**/*.tsx', 'src/components/**/*.tsx', 'src/app/**/*.tsx'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: ['@/features/*/*'], message: 'Import a feature through its index.ts only.' },
            { group: ['@/lib/api/client', '@/lib/api/endpoints'], message: 'Components call hooks, never the API client.' },
          ],
        },
      ],
    },
  },
  {
    // Tests mock the API layer, so they may import it.
    files: ['**/*.test.{ts,tsx}'],
    rules: { 'no-restricted-imports': 'off', 'import/first': 'off', 'max-lines': 'off' },
  },
]);
