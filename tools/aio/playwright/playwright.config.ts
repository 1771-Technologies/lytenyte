import { defineConfig, devices } from "@playwright/test";
import { resolve } from "path";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: resolve(process.cwd(), "e2e"),
  testMatch: "**/*.@(e2e).?(c|m)[jt]s?(x)",
  /* The base directory, relative to the config file, for snapshot files created with toMatchSnapshot and toHaveScreenshot. */
  snapshotDir: "./__snapshots__",
  /* Maximum time one test can run for. */
  timeout: 10 * 1000,
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
    viewport: {
      width: 1600,
      height: 900,
    },
  },

  snapshotPathTemplate: `{testDir}/__snapshots__/{projectName}/{testFilePath}/{arg}{ext}`,

  webServer: {
    command: "aio play dev --host",
    url: "http://127.0.0.1:5173/",
    reuseExistingServer: !process.env.CI,
    stdout: "pipe",
    stderr: "pipe",
    cwd: process.cwd(),
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "Chrome",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "FireFox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "Safari",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "IPhone",
      use: { ...devices["iPhone 15"] },
    },
  ],
});
