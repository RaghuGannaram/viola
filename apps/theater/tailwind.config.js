import path from "path";

/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: "class",
	content: [
		"./src/**/*.{html,js,svelte,ts}",
		// include Skeleton’s Svelte components so their classes aren’t purged:
		path.join("node_modules/@skeletonlabs/skeleton-svelte/dist", "**/*.{html,js,svelte,ts}"),
	],
	theme: {
		extend: {
			colors: {
				background: "#000000",
				accent: "#00FF00",
				"accent-dark": "#00CC00",
				"text-primary": "#FFFFFF",
				"text-secondary": "#AAAAAA",
			},
		},
	},
	plugins: [
		// adds Skeleton’s design tokens into Tailwind
		require("@skeletonlabs/skeleton/tailwind.cjs"),
	],
};
