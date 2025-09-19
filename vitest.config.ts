import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser/providers/playwright";

export default defineConfig({
  plugins: [react()],
  test: {
    passWithNoTests: true,
    projects: [
      {
        extends: `${__dirname}/vitest.config.ts`,
        test: {
          name: "Browser",
          include: ["./packages/**/*.pt.?(c|m)[jt]s?(x)", "src/**/*.pt.?(c|m)[jt]s?(x)"],
          exclude: ["./packages/**/*.test.?(c|m)[jt]s?(x)", "src/**/*.test.?(c|m)[jt]s?(x)"],
          testTimeout: 30_000,
          browser: {
            provider: playwright({
              actionTimeout: 5_000,
            }),
            enabled: true,
            ui: false,
            headless: true,
            instances: [{ browser: "chromium" }, { browser: "firefox" }, { browser: "webkit" }],
            viewport: {
              height: 1280,
              width: 1960,
            },
          },
        },
      },
      {
        extends: `${__dirname}/vitest.config.ts`,
        test: {
          name: "Node",
          globals: true,
          environment: "jsdom",
          include: ["./packages/**/*.test.?(c|m)[jt]s?(x)", "src/**/*.test.?(c|m)[jt]s?(x)"],
        },
      },
    ],
    coverage: {
      provider: "v8",
      reporter: ["html", "json-summary", "text"],
      exclude: [
        "**/+types*.ts",
        "**/+constants*.ts",
        "**/+globals*.ts",
        "**/*.spec.ts",
        "**/*.spec.tsx",
        "**/*.test.ts",
        "**/*.test.tsx",
        "**/types.ts",
        "**/*.bench.ts",
        "**/index.ts",
        "**/__tests__/**",
        "**/scripts/**",
        "**/*.stories.*",
        "**/*.d.ts",

        // generates types and docs only
        "./packages/commercial-lytenyte-type-gen",

        // These are vendored dependencies we've brought into the repo
        // to ensure we control all dependencies. There are tests for these
        // but we don't expect full coverage of them.
        "**/fork-*/**",
      ],
      include: [
        "**/packages/**/src/**/*.ts",
        "**/packages/**/src/**/*.tsx",
        "src/**/*.ts",
        "src/**/*.tsx",
      ],
    },
  },
});
