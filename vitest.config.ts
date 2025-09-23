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
          name: "chrome",
          include: ["./packages/**/*.test.?(c|m)[jt]s?(x)", "src/**/*.test.?(c|m)[jt]s?(x)"],
          testTimeout: 60_000,

          setupFiles: `${__dirname}/test-setup.ts`,
          browser: {
            provider: playwright({
              actionTimeout: 5_000,
            }),
            screenshotFailures: false,

            expect: {
              toMatchScreenshot: {
                comparatorName: "pixelmatch",
                comparatorOptions: {
                  threshold: 0.2,
                  allowedMismatchedPixelRatio: 0.12, // Generous mismatch - as the grid is text heavy.
                },
              },
            },
            enabled: true,
            ui: false,
            headless: true,
            instances: [{ browser: "chromium" }],
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
          name: "firefox and safari",
          include: ["./packages/**/*.test.?(c|m)[jt]s?(x)", "src/**/*.test.?(c|m)[jt]s?(x)"],
          testTimeout: 60_000,

          setupFiles: `${__dirname}/test-setup.ts`,
          browser: {
            provider: playwright({
              actionTimeout: 5_000,
            }),
            screenshotFailures: false,

            expect: {
              toMatchScreenshot: {
                comparatorName: "pixelmatch",
                comparatorOptions: {
                  threshold: 0.2,
                  allowedMismatchedPixelRatio: 0.12, // Generous mismatch - as the grid is text heavy.
                },
              },
            },
            enabled: true,
            ui: false,
            headless: true,
            instances: [{ browser: "firefox" }, { browser: "webkit" }],
            viewport: {
              height: 1280,
              width: 1960,
            },
          },
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
