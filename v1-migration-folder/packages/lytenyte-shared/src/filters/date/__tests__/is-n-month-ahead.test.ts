import { describe, expect, test, vi } from "vitest";
import { isNMonthsAhead } from "../is-n-months-ahead.js";

describe("isNMonthAgo", () => {
  test("should return the correct result", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-05"));

    expect(isNMonthsAhead(2, new Date("2025-01-01"))).toEqual(true);
    expect(isNMonthsAhead(2, new Date("2025-02-10"))).toEqual(true);
    expect(isNMonthsAhead(2, new Date("2025-03-10"))).toEqual(true);
    expect(isNMonthsAhead(2, new Date("2024-10-01"))).toEqual(false);
    expect(isNMonthsAhead(3, new Date("2024-09-01"))).toEqual(false);
    expect(isNMonthsAhead(3, new Date("2025-05-01"))).toEqual(false);

    vi.useRealTimers();
  });
});
