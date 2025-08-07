import { describe, expect, test, vi } from "vitest";
import { isNDaysAgo } from "../is-n-days-ago.js";

describe("isNDaysAgo", () => {
  test("should return the correct result", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-05"));

    expect(isNDaysAgo(3, new Date("2025-01-02"))).toEqual(true);
    expect(isNDaysAgo(2, new Date("2025-01-02"))).toEqual(false);
    expect(isNDaysAgo(10, new Date("2025-01-02"))).toEqual(true);

    vi.useRealTimers();
  });
});
