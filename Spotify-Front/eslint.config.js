import js from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import reactHooks from 'eslint-plugin-react-hooks'
import react from 'eslint-plugin-react/configs/recommended.js'

export default [
	js.configs.recommended,
	{
		files: ['**/*.ts', '**/*.tsx'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
				ecmaFeatures: { jsx: true },
			},
		},
		plugins: {
			'@typescript-eslint': tseslint,
			react: react.plugins.react,
			'react-hooks': reactHooks,
		},
		rules: {
			'react/react-in-jsx-scope': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'react/display-name': 'off',
			'@typescript-eslint/no-unused-vars': 'warn',
			'import/order': 'off',
		},
		settings: {
			react: { version: 'detect' },
		},
	},
]
