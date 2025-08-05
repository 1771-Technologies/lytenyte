import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { isNMonthsAgo } from "../is-n-months-ago.js";

describe("isNMonthAgo", () => {
  beforeEach(() => {
    vi.stubEnv("TZ", "UTC");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  test("should return the correct result", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-05"));

    expect(isNMonthsAgo(2, new Date("2024-12-01"))).toEqual(true);
    expect(isNMonthsAgo(2, new Date("2025-01-10"))).toEqual(true);
    expect(isNMonthsAgo(2, new Date("2025-02-10"))).toEqual(false);
    expect(isNMonthsAgo(2, new Date("2024-10-01"))).toEqual(false);
    expect(isNMonthsAgo(3, new Date("2024-09-01"))).toEqual(false);
    expect(isNMonthsAgo(3, new Date("2024-10-01"))).toEqual(true);

    vi.useRealTimers();
  });
});
