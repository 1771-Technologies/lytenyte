import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { compareImages, existsFile } from "./vite.snappy";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    workspace: [
      {
        extends: `${__dirname}/vite.config.ts`,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/writing-tests/test-addon#storybooktest
          storybookTest({ configDir: `${import.meta.dirname}/.storybook` }),
        ],
        test: {
          name: "Storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: "playwright",
            instances: [{ browser: "chromium" }],
            commands: {
              existsFile,
              compareImages,
            },
          },
          setupFiles: [
            `${__dirname}/.storybook/vitest.setup.ts`,
            `${__dirname}/vite.setup-browser.ts`,
          ],
        },
      },

      {
        extends: `${__dirname}/vite.config.ts`,
        test: {
          name: "Browser",
          browser: {
            provider: "playwright",
            enabled: true,
            instances: [
              {
                browser: "chromium",
                headless: true,
              },
            ],
            commands: {
              existsFile,
              compareImages,
            },
          },
          setupFiles: [`${__dirname}/vite.setup-browsers.ts`],
          include: ["./packages/**/*.browser.?(c|m)[jt]s?(x)", "src/**/*.browser.?(c|m)[jt]s?(x)"],
          globals: true,
        },
      },
      {
        extends: `${__dirname}/vite.config.ts`,
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

        // These are vendored dependencies we've brought into the repo
        // to ensure we control all dependencies. There are tests for these
        // but we don't expect full coverage of them.
        "**/packages/focus-trap/**",
        "**/packages/focus/**",
        "**/packages/scroll-lock/**",
      ],
      include: [
        "**/packages/**/src/**/*.ts",
        "**/packages/**/src/**/*.tsx",
        "src/**/*.ts",
        "src/**/*.tsx",
      ],
      thresholds: {
        "100": true,
      },
    },
  },
});
