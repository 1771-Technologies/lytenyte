import { describe, test, expect } from "vitest";
import type { SortNumberComparatorOptions } from "../../+types.js";
import { numberComparator } from "../number-comparator.js";

describe("numberComparator", () => {
  const defaultOptions: SortNumberComparatorOptions = {
    nullsFirst: true,
    absoluteValue: false,
  };

  test("should return 0 for two null values", () => {
    expect(numberComparator(null, null, defaultOptions)).toBe(0);
  });

  test("should return 1 when left is not null and right is null (nullsFirst: true)", () => {
    expect(numberComparator(5, null, defaultOptions)).toBe(1);
  });

  test("should return -1 when left is null and right is not null (nullsFirst: true)", () => {
    expect(numberComparator(null, 10, defaultOptions)).toBe(-1);
  });

  test("should return -1 when left is not null and right is null (nullsFirst: false)", () => {
    const options = { ...defaultOptions, nullsFirst: false };
    expect(numberComparator(5, null, options)).toBe(-1);
  });

  test("should return 1 when left is null and right is not null (nullsFirst: false)", () => {
    const options = { ...defaultOptions, nullsFirst: false };
    expect(numberComparator(null, 10, options)).toBe(1);
  });

  test("should compare numbers regularly when absoluteValue is false", () => {
    expect(numberComparator(5, 10, defaultOptions)).toBeLessThan(0); // 5 - 10 = -5
    expect(numberComparator(10, 5, defaultOptions)).toBeGreaterThan(0); // 10 - 5 = 5
    expect(numberComparator(7, 7, defaultOptions)).toBe(0); // 7 - 7 = 0
  });

  test("should compare numbers by absolute value when absoluteValue is true", () => {
    const options = { ...defaultOptions, absoluteValue: true };
    expect(numberComparator(-5, 10, options)).toBeLessThan(0); // abs(-5) - abs(10) = -5
    expect(numberComparator(-10, 5, options)).toBeGreaterThan(0); // abs(-10) - abs(5) = 5
    expect(numberComparator(-7, 7, options)).toBe(0); // abs(-7) - abs(7) = 0
  });

  test("should compare numbers correctly when edge values are passed", () => {
    expect(numberComparator(-Infinity, Infinity, defaultOptions)).toBeLessThan(0);
    expect(numberComparator(Infinity, -Infinity, defaultOptions)).toBeGreaterThan(0);
    expect(numberComparator(Infinity, Infinity, defaultOptions)).toBe(0);
  });

  test("should return -1 when left is a number and right is NaN", () => {
    expect(numberComparator(5, NaN, defaultOptions)).toBe(-1);
  });

  test("should return 1 when left is NaN and right is a number", () => {
    expect(numberComparator(NaN, 5, defaultOptions)).toBe(1);
  });

  test("should handle NaN when both inputs are NaN", () => {
    expect(numberComparator(NaN, NaN, defaultOptions)).toBe(0); // Technically, both are "null-like" in behavior.
  });

  test("should correctly handle positive and negative zero comparisons", () => {
    expect(numberComparator(-0, +0, defaultOptions)).toEqual(0);
    expect(numberComparator(+0, -0, defaultOptions)).toEqual(0);
  });

  test("should compare numbers by absolute value when one is zero", () => {
    const options = { ...defaultOptions, absoluteValue: true };
    expect(numberComparator(0, -10, options)).toBeLessThan(0);
    expect(numberComparator(-10, 0, options)).toBeGreaterThan(0);
  });

  test("should correctly compare zero and null values", () => {
    expect(numberComparator(0, null, defaultOptions)).toBe(1); // 0 is greater than null in default mode
    expect(numberComparator(null, 0, defaultOptions)).toBe(-1); // null is less than 0
  });

  test("should correctly handle non-numbers", () => {
    expect(numberComparator("a2" as any, 11, defaultOptions)).toBe(1);
    expect(numberComparator(11, "a2" as any, defaultOptions)).toBe(-1);
  });
});
