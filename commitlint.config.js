export default {
	extends: ["@commitlint/config-conventional"],
	rules: {
		"subject-max-length": [2, "always", 100],
		"subject-case": [2, "always", ["sentence-case", "start-case"]],
	},
};
