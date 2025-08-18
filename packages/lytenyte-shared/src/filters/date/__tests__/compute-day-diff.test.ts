import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { computeDayDiff } from "../compute-day-diff.js";

describe("computeDayDiff", () => {
  beforeEach(() => {
    vi.stubEnv("TZ", "UTC");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });
  test("should return the correct result", () => {
    expect(computeDayDiff(new Date("2025-01-01"), new Date("2024-01-01"))).toEqual(-366);
    expect(computeDayDiff(new Date("2025-01-01"), new Date("2026-01-01"))).toEqual(365);
    expect(computeDayDiff(new Date("2025-01-01"), new Date("2025-01-05"))).toEqual(4);
    expect(computeDayDiff(new Date("2025-01-10"), new Date("2025-01-05"))).toEqual(-5);
  });
});
