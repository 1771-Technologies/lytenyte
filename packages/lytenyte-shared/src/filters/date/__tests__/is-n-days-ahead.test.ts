import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { isNDaysAhead } from "../is-n-days-ahead.js";

describe("isNDaysAhead", () => {
  beforeEach(() => {
    vi.stubEnv("TZ", "UTC");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });
  test("should return the correct result", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-05"));

    expect(isNDaysAhead(3, new Date("2025-01-08"))).toEqual(true);
    expect(isNDaysAhead(2, new Date("2025-01-08"))).toEqual(false);
    expect(isNDaysAhead(10, new Date("2025-01-12"))).toEqual(true);

    vi.useRealTimers();
  });
});
