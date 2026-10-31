import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		exclude: ["node_modules", "dist", "test-results", "tests/e2e/**"],
	},
});
