import { describe, test, expect } from "vitest";
import { dateComparator, type DateComparatorOptions } from "../date-comparator";

describe("dateComparator", () => {
  const includeTimeTrue: DateComparatorOptions = { includeTime: true, nullsFirst: true };
  const includeTimeFalse: DateComparatorOptions = { includeTime: false, nullsFirst: true };

  test("should return 0 for two null values", () => {
    expect(dateComparator(null, null, includeTimeTrue)).toBe(0);
  });

  test("should return 1 when left is not null and right is null (nullsFirst: true)", () => {
    expect(dateComparator("2025-06-10", null, includeTimeTrue)).toBe(1);
  });

  test("should return -1 when left is null and right is not null (nullsFirst: true)", () => {
    expect(dateComparator(null, "2025-06-10", includeTimeTrue)).toBe(-1);
  });

  test("should return -1 when left is not null and right is null (nullsFirst: false)", () => {
    const options: DateComparatorOptions = { includeTime: true, nullsFirst: false };
    expect(dateComparator("2025-06-10", null, options)).toBe(-1);
  });

  test("should return 1 when left is null and right is not null (nullsFirst: false)", () => {
    const options: DateComparatorOptions = { includeTime: true, nullsFirst: false };
    expect(dateComparator(null, "2025-06-10", options)).toBe(1);
  });

  test("should compare dates without time included (includeTime: false)", () => {
    const left = "2025-06-10T10:00:00Z";
    const right = "2025-06-10T12:30:00Z";
    expect(dateComparator(left, right, includeTimeFalse)).toBe(0); // Dates only, time not included
  });

  test("should compare dates including time (includeTime: true)", () => {
    const left = "2025-06-10T10:00:00Z";
    const right = "2025-06-10T12:30:00Z";
    expect(dateComparator(left, right, includeTimeTrue)).toBeLessThan(0);
  });

  test("should handle different dates (includeTime: true)", () => {
    const left = "2025-06-09T23:59:59Z";
    const right = "2025-06-10T00:00:00Z";
    expect(dateComparator(left, right, includeTimeTrue)).toBeLessThan(0);
  });

  test("should handle different dates (includeTime: false)", () => {
    const left = "2025-06-09T23:59:59Z";
    const right = "2025-06-10T00:00:00Z";
    expect(dateComparator(left, right, includeTimeFalse)).toBeLessThan(0);
  });

  test("should handle equal timestamps when includeTime is true", () => {
    const timestamp = "2025-06-10T10:00:00Z";
    expect(dateComparator(timestamp, timestamp, includeTimeTrue)).toBe(0);
  });

  test("should handle invalid date strings gracefully (should return NaN difference)", () => {
    const left = "invalid-date";
    const right = "2025-06-10T10:00:00Z";
    expect(isNaN(dateComparator(left, right, includeTimeTrue))).toBe(true);
  });
});
