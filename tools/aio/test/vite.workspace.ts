import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  {
    test: {
      name: "Browser",
      browser: {
        provider: "playwright",
        enabled: true,
        headless: true,
        name: "chromium",
      },
      include: ["src/**/*.browser.?(c|m)[jt]s?(x)"],
      globals: true,
    },
  },
  {
    test: {
      name: "Server",
      environment: "happy-dom",
      globals: true,
    },
  },
]);
