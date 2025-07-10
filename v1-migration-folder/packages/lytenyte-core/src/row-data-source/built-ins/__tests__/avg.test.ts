import { describe, expect, test } from "vitest";
import { avg } from "../avg";

describe("avg", () => {
  test("should return 0 for an empty array", () => {
    expect(avg([])).toBe(0);
  });

  test("should calculate average for array of numbers", () => {
    expect(avg([1, 2, 3])).toBe(2);
  });

  test("should handle array with null values", () => {
    expect(avg([1, null, 3])).toBe(4 / 3);
  });

  test("should handle array with all null values", () => {
    expect(avg([null, null, null])).toBe(0);
  });

  test("should handle single value array", () => {
    expect(avg([5])).toBe(5);
  });

  test("should handle array with negative numbers", () => {
    expect(avg([-1, -2, -3])).toBe(-2);
  });

  test("should handle array with mixed positive and negative numbers", () => {
    expect(avg([-1, 0, 1])).toBe(0);
  });

  test("should handle array with decimal numbers", () => {
    expect(avg([1.5, 2.5, 3.5])).toBe(2.5);
  });
});
