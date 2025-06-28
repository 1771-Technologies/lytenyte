import { describe, expect, test } from "vitest";
import { computeDayDiff } from "../compute-day-diff.js";

describe("computeDayDiff", () => {
  test("should return the correct result", () => {
    expect(computeDayDiff(new Date("2025-01-01"), new Date("2024-01-01"))).toEqual(-366);
    expect(computeDayDiff(new Date("2025-01-01"), new Date("2026-01-01"))).toEqual(365);
    expect(computeDayDiff(new Date("2025-01-01"), new Date("2025-01-05"))).toEqual(4);
    expect(computeDayDiff(new Date("2025-01-10"), new Date("2025-01-05"))).toEqual(-5);
  });
});
