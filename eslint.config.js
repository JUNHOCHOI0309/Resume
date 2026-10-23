import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'

export default tseslint.config(
  { ignores: ['dist/**', 'node_modules/**', 'tmp/**', '.serena/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  { files: ['scripts/*.mjs'], languageOptions: { globals: { console: 'readonly' } } },
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { 'react-hooks': reactHooks },
    rules: {
      'no-undef': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/no-empty-function': 'off',
    },
  },
)
