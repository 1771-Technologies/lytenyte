import { describe, expect, test, vi } from "vitest";
import { runWithBackoff } from "../run-with-backoff.js";

describe("runWithBackoffTest", () => {
  test("should run correctly", async () => {
    let count = 0;

    const fn = vi.fn(() => {
      if (count === 2) return true;
      count++;
      return false;
    });

    runWithBackoff(fn, [4, 4]);

    await vi.waitFor(() => expect(fn).toHaveBeenCalledTimes(3), { timeout: 2000 });
  });
});
