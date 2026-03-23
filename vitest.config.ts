import { defineConfig, type TestProjectConfiguration } from "vitest/config";
import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";

function makeProjectConfiguration(
  name: string,
  browser: "firefox" | "webkit" | "chromium",
): TestProjectConfiguration {
  return {
    extends: `${import.meta.dirname}/vitest.config.ts`,
    plugins: [react()],
    test: {
      name: name,
      include: ["./packages/**/*.test.?(c|m)[jt]s?(x)", "src/**/*.test.?(c|m)[jt]s?(x)"],
      includeSource: ["src/**/*.play.tsx"],

      // Tests can take quite long in CI
      testTimeout: process.env.CI ? 120_000 : 60_000,

      setupFiles: `${import.meta.dirname}/test-setup.ts`,
      browser: {
        screenshotFailures: false,
        provider: playwright({ actionTimeout: 5000 }),

        expect: {
          toMatchScreenshot: {
            comparatorName: "pixelmatch",
            resolveScreenshotPath: ({ arg, browserName, ext, testFileName, testFileDirectory, platform }) => {
              return `${testFileDirectory}/__screenshots__/${testFileName}/${browserName}_${platform}/${arg}${ext}`;
            },
            comparatorOptions: {
              threshold: 0.2,
              allowedMismatchedPixelRatio: 0.12, // Generous mismatch - as the grid is text heavy.
            },
          },
        },
        enabled: true,
        ui: false,
        headless: true,
        instances: [{ browser: browser }],
        viewport: {
          height: 1280,
          width: 1960,
        },
      },
    },
  };
}

const chromeConfig = makeProjectConfiguration("chrome", "chromium");
const firefoxConfig = makeProjectConfiguration("firefox", "firefox");
const safariConfig = makeProjectConfiguration("safari", "webkit");

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
        "**/__screenshots__",
        "**/*.play.*",
        "types.*",
        "**/__play__",

        // generates types and docs only
        "./packages/commercial-lytenyte-type-gen",

        // These are vendored dependencies we've brought into the repo
        // to ensure we control all dependencies. There are tests for these
        // but we don't expect full coverage of them.
        "**/fork-*/**",
      ],
      include: ["**/packages/**/src/**/*.ts", "**/packages/**/src/**/*.tsx", "src/**/*.ts", "src/**/*.tsx"],
    },
  },
});
