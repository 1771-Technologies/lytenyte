import { describe, expect, test, vi } from "vitest";
import { isNWeeksAgo } from "../is-n-weeks-ago.js";

describe("isNWeeksBehind", () => {
  test("should return the correct result", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-05"));

    expect(isNWeeksAgo(2, new Date("2024-12-30"))).toEqual(true);
    expect(isNWeeksAgo(2, new Date("2024-12-29"))).toEqual(true);
    expect(isNWeeksAgo(2, new Date("2025-01-17"))).toEqual(false);
    expect(isNWeeksAgo(2, new Date("2025-01-22"))).toEqual(false);
    expect(isNWeeksAgo(3, new Date("2024-12-22"))).toEqual(true);

    vi.useRealTimers();
  });
});
