import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      exclude: [
        "**/types.ts",
        "**/*.bench.ts",
        "**/index.ts",
        "**/__tests__/**",
        "**/scripts/**",
        "**/*.stories.*",
      ],
      include: ["src/**/*.ts", "src/**/*.tsx"],
    },
  },
});
