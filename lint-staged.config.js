// lint-staged.config.js  (root)
export default {
	// 1. Format everything Prettier can handle
	"*.{js,ts,svelte,md,css,json,yaml}": ["pnpm prettier --write"],

	// 2. Then run ESLint (fixable rules only) on JS/TS/Svelte files
	"*.{js,ts,svelte}": ["pnpm eslint --fix"],

	// 3. Re‑add files to Git after they were fixed
	// (lint‑staged does this automatically)
};
