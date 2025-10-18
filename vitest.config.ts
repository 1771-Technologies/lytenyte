import { defineConfig, type TestProjectConfiguration } from "vitest/config";
import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";

const chromeConfig: TestProjectConfiguration = {
  extends: `${__dirname}/vitest.config.ts`,
  test: {
    name: "chrome",
    include: [
      "./packages/**/*.test.?(c|m)[jt]s?(x)",
      "src/**/*.test.?(c|m)[jt]s?(x)",
      "./packages/**/*.pt.?(c|m)[jt]s?(x)",
      "src/**/*.pt.?(c|m)[jt]s?(x)",
    ],
    // Tests can take quite long in CI
    testTimeout: process.env.CI ? 120_000 : 4_000,

    setupFiles: `${__dirname}/test-setup.ts`,
    browser: {
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
};

const firefoxConfig = structuredClone(chromeConfig);
firefoxConfig.test!.name = "firefox";
firefoxConfig.test!.browser!.instances = [{ browser: "firefox" }];

const safariConfig = structuredClone(chromeConfig);
safariConfig.test!.name = "safari";
safariConfig.test!.browser!.instances = [{ browser: "webkit" }];

chromeConfig.test!.browser!.provider = playwright({ actionTimeout: 5000 });
firefoxConfig.test!.browser!.provider = playwright({ actionTimeout: 5000 });
safariConfig.test!.browser!.provider = playwright({ actionTimeout: 5000 });

export default defineConfig({
  plugins: [react()],
  test: {
    passWithNoTests: true,
    projects: [chromeConfig, firefoxConfig, safariConfig],
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
