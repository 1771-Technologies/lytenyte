import { sum } from "../sum";

describe("sum", () => {
  test("should return 0 for an empty array", () => {
    expect(sum([])).toBe(0);
  });

  test("should sum array of numbers", () => {
    expect(sum([1, 2, 3])).toBe(6);
  });

  test("should handle array with null values", () => {
    expect(sum([1, null, 3])).toBe(4);
  });

  test("should handle array with all null values", () => {
    expect(sum([null, null, null])).toBe(0);
  });

  test("should handle single element array", () => {
    expect(sum([5])).toBe(5);
  });

  test("should handle single null array", () => {
    expect(sum([null])).toBe(0);
  });

  test("should handle array with negative numbers", () => {
    expect(sum([-1, -2, -3])).toBe(-6);
  });

  test("should handle array with mixed positive and negative numbers", () => {
    expect(sum([-1, 0, 1])).toBe(0);
  });

  test("should handle array with decimal numbers", () => {
    expect(sum([1.1, 1.2, 1.3])).toBe(3.6);
  });

  test("should handle sparse array with nulls between numbers", () => {
    expect(sum([1, null, 3, null, 2])).toBe(6);
  });

  test("should handle very large numbers", () => {
    expect(sum([Number.MAX_SAFE_INTEGER, 1, 2])).toBe(Number.MAX_SAFE_INTEGER + 3);
  });

  test("should handle very small numbers", () => {
    expect(sum([Number.MIN_SAFE_INTEGER, -1, -2])).toBe(Number.MIN_SAFE_INTEGER - 3);
  });
});
