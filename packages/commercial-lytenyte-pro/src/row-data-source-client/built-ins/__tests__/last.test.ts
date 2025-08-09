import { describe, test, expect } from "vitest";
import { last } from "../last.js";

describe("last", () => {
  test("should return undefined for an empty array", () => {
    expect(last([])).toBeUndefined();
  });

  test("should return last element in array of numbers", () => {
    expect(last([1, 2, 3])).toBe(3);
  });

  test("should skip trailing null values and return last non-null element", () => {
    expect(last([1, 2, null])).toBe(2);
  });

  test("should skip trailing undefined values and return last non-null element", () => {
    expect(last([1, 2, undefined])).toBe(2);
  });

  test("should handle array with all null values", () => {
    expect(last([null, null, null])).toBeUndefined();
  });

  test("should handle array with all undefined values", () => {
    expect(last([undefined, undefined, undefined])).toBeUndefined();
  });

  test("should handle array with mixed null and undefined values", () => {
    expect(last([null, undefined, null])).toBeUndefined();
  });

  test("should handle array with various types", () => {
    expect(last(["string", true, {}, [], null])).toEqual([]);
  });

  test("should handle single element array", () => {
    expect(last([1])).toBe(1);
  });

  test("should handle single null array", () => {
    expect(last([null])).toBeUndefined();
  });

  test("should handle array with falsy values", () => {
    expect(last([null, undefined, 0, "", false, null])).toBe(false);
  });

  test("should find last non-null value among nulls", () => {
    expect(last([null, 1, null, 2, null])).toBe(2);
  });
});
