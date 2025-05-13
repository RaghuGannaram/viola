// eslint.config.js  (ESM / Flat‑config)
import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import svelteParser from "svelte-eslint-parser";
import svelte from "eslint-plugin-svelte";
import nodePlugin from "eslint-plugin-node";
import promisePlugin from "eslint-plugin-promise";
import importPlugin from "eslint-plugin-import";
import prettier from "eslint-config-prettier";
import globals from "globals";

/* Paths ESLint should ignore everywhere */
const IGNORE = ["**/node_modules/**", "**/dist/**", "**/.svelte-kit/**"];

export default defineConfig([
	/* ---------------------------------------------------------- *
	 * 1. Base JavaScript rules (all files)                       *
	 * ---------------------------------------------------------- */
	{
		files: ["**/*.{js,cjs,mjs,jsx}"],
		ignores: IGNORE,
		plugins: { js },
		extends: ["js/recommended"],
		languageOptions: {
			globals: { ...globals.browser, ...globals.node },
		},
		rules: {
			"no-console": "warn",
		},
	},

	/* ---------------------------------------------------------- *
	 * 2. TypeScript support for *.ts/tsx                          *
	 * ---------------------------------------------------------- */
	{
		files: ["**/*.{ts,tsx}"],
		ignores: IGNORE,
		// tseslint.configs.recommended already sets parser+plugin+rules
		...tseslint.configs.recommended[0],
		// If you want stricter type‑aware rules, also spread strict:
		// ...tseslint.configs.strictTypeChecked,
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				projectService: true,
				project: ["./tsconfig.base.json"], // detects tsconfig at root; adjust if needed
				sourceType: "module",
			},
		},
		plugins: {
			...tseslint.configs.recommended.plugins,
			node: nodePlugin,
			promise: promisePlugin,
			import: importPlugin,
		},
		rules: {
			// node/promises rules only for server files can be scoped later
			"import/order": ["error", { alphabetize: { order: "asc", caseInsensitive: true } }],
			"promise/always-return": "warn",
		},
	},

	/* ---------------------------------------------------------- *
	 * 3. Svelte component files                                  *
	 * ---------------------------------------------------------- */
	{
		files: ["**/*.svelte"],
		ignores: IGNORE,
		languageOptions: {
			parser: svelteParser,
			parserOptions: {
				parser: tseslint.parser, // let <script lang="ts"> use TS parser
				sourceType: "module",
				extraFileExtensions: [".svelte"],
				ecmaVersion: "latest",
			},
			globals: { ...globals.browser },
		},
		plugins: { svelte },
		rules: {
			...svelte.configs.recommended.rules,
			// Example override:
			"svelte/no-reactive-functions": "off",
		},
	},

	/* ---------------------------------------------------------- *
	 * 4. Node (Express) specific overrides                       *
	 *    Only matches server folders (apps/express, api/** etc.) *
	 * ---------------------------------------------------------- */
	{
		files: ["apps/api/**", "apps/express/**"],
		ignores: IGNORE,
		plugins: { node: nodePlugin },
		languageOptions: {
			globals: { ...globals.node },
			sourceType: "module",
		},
		rules: {
			"node/no-unsupported-features/es-syntax": "off", // we transpile
			"node/no-missing-import": "off",
		},
	},

	/* ---------------------------------------------------------- *
	 * 5. Prettier compatibility – turn off conflicting rules     *
	 * ---------------------------------------------------------- */
	{
		plugins: {},
		rules: {
			...prettier.rules,
		},
	},
]);
