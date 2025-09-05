import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
	// Ignora dist a nivel global
	globalIgnores(['dist']),

	{
		files: ['**/*.{js,jsx}', 'vite.config.*', 'eslint.config.*', '*.cjs'],

		// Activamos reglas base, React, hooks y el preset de Vite para fast refresh
		extends: [
			js.configs.recommended,
			react.configs.recommended,
			reactHooks.configs['recommended-latest'],
			reactRefresh.configs.vite,
		],

		// Asegura que el plugin esté disponible (útil en flat config)
		plugins: {
			react,
		},

		// Soporte para JSX y globals de browser + node
		languageOptions: {
			ecmaVersion: 2024,
			globals: { ...globals.node, ...globals.browser },
			parserOptions: {
				ecmaVersion: 'latest',
				ecmaFeatures: { jsx: true },
				sourceType: 'module',
			},
		},

		// Detecta la versión de React para las reglas del plugin
		settings: {
			react: { version: 'detect' },
		},

		rules: {
			// Marca variables usadas dentro de JSX como "usadas" (evita el falso positivo con `motion`)
			'react/jsx-uses-vars': 'error',

			// Con React 17+ no hace falta importar React en cada archivo
			'react/react-in-jsx-scope': 'off',
			'react/jsx-uses-react': 'off',

			// Tu ajuste previo para ignorar constantes en MAYÚSCULAS
			'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
		},
	},
]);
