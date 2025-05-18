import { min } from "../min";

describe("min", () => {
  test("should return 0 for an empty array", () => {
    expect(min([])).toBe(0);
  });

  test("should find minimum in array of numbers", () => {
    expect(min([1, 2, 3])).toBe(1);
  });

  test("should handle array with null values", () => {
    expect(min([1, null, 3])).toBe(1);
  });

  test("should handle array with undefined values", () => {
    expect(min([1, undefined, 3])).toBe(1);
  });

  test("should handle array with all null values", () => {
    expect(min([null, null, null])).toBe(0);
  });

  test("should handle array with all undefined values", () => {
    expect(min([undefined, undefined, undefined])).toBe(0);
  });

  test("should handle array with mixed null and undefined values", () => {
    expect(min([null, undefined, null])).toBe(0);
  });

  test("should handle single element array", () => {
    expect(min([5])).toBe(5);
  });

  test("should handle single null array", () => {
    expect(min([null])).toBe(0);
  });

  test("should handle array with negative numbers", () => {
    expect(min([-1, -2, -3])).toBe(-3);
  });

  test("should handle array with first element null", () => {
    expect(min([null, 1, 2])).toBe(1);
  });

  test("should handle array with first element as min", () => {
    expect(min([1, 2, 3])).toBe(1);
  });

  test("should handle array with decimals", () => {
    expect(min([1.3, 1.2, 1.1])).toBe(1.1);
  });

  test("should handle sparse array with nulls between numbers", () => {
    expect(min([3, null, 1, null, 2])).toBe(1);
  });

  test("should handle array starting with valid number but rest null", () => {
    expect(min([1, null, null])).toBe(1);
  });
});
