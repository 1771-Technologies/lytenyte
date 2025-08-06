import { describe, test, expect } from "vitest";
import { count } from "../count";

describe("count", () => {
  test("should return 0 for an empty array", () => {
    expect(count([])).toBe(0);
  });

  test("should return count of non-null elements in array", () => {
    expect(count([1, 2, 3])).toBe(3);
  });

  test("should handle array with null values", () => {
    expect(count([1, null, 3])).toBe(2);
  });

  test("should handle array with undefined values", () => {
    expect(count([1, undefined, 3])).toBe(2);
  });

  test("should handle array with all null values", () => {
    expect(count([null, null, null])).toBe(0);
  });

  test("should handle array with all undefined values", () => {
    expect(count([undefined, undefined, undefined])).toBe(0);
  });

  test("should handle array with mixed null and undefined values", () => {
    expect(count([null, undefined, null])).toBe(0);
  });

  test("should handle array with various types", () => {
    expect(count([1, "string", true, {}, [], null])).toBe(5);
  });

  test("should handle single element array", () => {
    expect(count([1])).toBe(1);
  });

  test("should handle single null array", () => {
    expect(count([null])).toBe(0);
  });
});
