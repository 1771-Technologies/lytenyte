import { afterAll, beforeAll, beforeEach, vi } from "vitest";

beforeEach(() => {
  vi.resetAllMocks();
  document.body.innerHTML = "";
});

// Suppress stupid act warnings. https://github.com/vitest-community/vitest-browser-react/issues/37
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    const message = String(args[0] ?? "");
    if (message.includes("not wrapped in act")) return;
    originalError(...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
