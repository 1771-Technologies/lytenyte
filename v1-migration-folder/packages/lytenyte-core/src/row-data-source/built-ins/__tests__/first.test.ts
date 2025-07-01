import { describe, test, expect } from "vitest";
import { first } from "../first";

describe("first", () => {
  test("should return undefined for an empty array", () => {
    expect(first([])).toBeUndefined();
  });

  test("should return first element in array of numbers", () => {
    expect(first([1, 2, 3])).toBe(1);
  });

  test("should skip null values and return first non-null element", () => {
    expect(first([null, 2, 3])).toBe(2);
  });

  test("should skip undefined values and return first non-null element", () => {
    expect(first([undefined, 2, 3])).toBe(2);
  });

  test("should handle array with all null values", () => {
    expect(first([null, null, null])).toBeUndefined();
  });

  test("should handle array with all undefined values", () => {
    expect(first([undefined, undefined, undefined])).toBeUndefined();
  });

  test("should handle array with mixed null and undefined values", () => {
    expect(first([null, undefined, null])).toBeUndefined();
  });

  test("should handle array with various types", () => {
    expect(first([null, "string", true, {}, []])).toBe("string");
  });

  test("should handle single element array", () => {
    expect(first([1])).toBe(1);
  });

  test("should handle single null array", () => {
    expect(first([null])).toBeUndefined();
  });

  test("should handle array with falsy values", () => {
    expect(first([null, undefined, 0, "", false])).toBe(0);
  });
});
