import { describe, test, expect, afterEach, beforeEach, vi } from "vitest";
import { isWithinYearAndMonthRange } from "../is-within-year-and-month-range.js";
describe("isWithinYearAndMonthRange", () => {
  beforeEach(() => {
    vi.stubEnv("TZ", "UTC");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });
  test("should return true if the date is exactly within the range", () => {
    const startDate = new Date("2025-03-01");
    const endDate = new Date("2025-07-31");

    expect(isWithinYearAndMonthRange(new Date("2025-03-15"), startDate, endDate)).toBe(true); // Start of range
    expect(isWithinYearAndMonthRange(new Date("2025-07-15"), startDate, endDate)).toBe(true); // End of range
  });

  test("should return false if the date is outside the range", () => {
    const startDate = new Date("2025-03-01");
    const endDate = new Date("2025-07-31");

    expect(isWithinYearAndMonthRange(new Date("2025-02-15"), startDate, endDate)).toBe(false); // Before range
    expect(isWithinYearAndMonthRange(new Date("2025-08-01"), startDate, endDate)).toBe(false); // After range
  });

  test("should handle dates within the same year, different months", () => {
    const startDate = new Date("2025-01-01");
    const endDate = new Date("2025-12-31");

    expect(isWithinYearAndMonthRange(new Date("2025-06-01"), startDate, endDate)).toBe(true); // Middle of the year
  });

  test("should handle dates spanning multiple years", () => {
    const startDate = new Date("2024-11-01");
    const endDate = new Date("2025-02-28");

    expect(isWithinYearAndMonthRange(new Date("2024-12-15"), startDate, endDate)).toBe(true); // Within range
    expect(isWithinYearAndMonthRange(new Date("2025-01-15"), startDate, endDate)).toBe(true); // Within range
    expect(isWithinYearAndMonthRange(new Date("2025-03-01"), startDate, endDate)).toBe(false); // Outside range
  });

  test("should handle single-month ranges", () => {
    const startDate = new Date("2025-06-01");
    const endDate = new Date("2025-06-30");

    expect(isWithinYearAndMonthRange(new Date("2025-06-15"), startDate, endDate)).toBe(true); // Same month
    expect(isWithinYearAndMonthRange(new Date("2025-07-01"), startDate, endDate)).toBe(false); // Month after
  });
});
