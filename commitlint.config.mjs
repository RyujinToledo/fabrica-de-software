export default {
	extends: ["@commitlint/config-conventional"],
	rules: {
		"type-enum": [
			2,
			"always",
			[
				"feat",
				"fix",
				"docs",
				"build",
				"refactor",
				"test",
				"chore",
				"perf",
				"ci",
			],
		],
		"subject-case": [0],
		"header-max-length": [2, "always", 100],
	},
};
