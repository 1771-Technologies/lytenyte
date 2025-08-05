import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { isNWeeksAhead } from "../is-n-weeks-ahead.js";

describe("isNWeeksAhead", () => {
  beforeEach(() => {
    vi.stubEnv("TZ", "UTC");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });
  test.only("should return the correct result", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-05"));

    expect(isNWeeksAhead(2, new Date("2024-12-30"))).toEqual(true);
    expect(isNWeeksAhead(2, new Date("2024-12-29"))).toEqual(false);
    expect(isNWeeksAhead(2, new Date("2025-01-17"))).toEqual(true);
    expect(isNWeeksAhead(2, new Date("2025-01-22"))).toEqual(false);
    expect(isNWeeksAhead(3, new Date("2025-01-22"))).toEqual(true);

    vi.useRealTimers();
  });
});
