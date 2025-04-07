import { max } from "../max";

describe("max", () => {
  test("should return 0 for an empty array", () => {
    expect(max([])).toBe(0);
  });

  test("should find maximum in array of numbers", () => {
    expect(max([1, 2, 3])).toBe(3);
  });

  test("should handle array with null values", () => {
    expect(max([1, null, 3])).toBe(3);
  });

  test("should handle array with undefined values", () => {
    expect(max([1, undefined, 3])).toBe(3);
  });

  test("should handle array with all null values", () => {
    expect(max([null, null, null])).toBe(0);
  });

  test("should handle array with all undefined values", () => {
    expect(max([undefined, undefined, undefined])).toBe(0);
  });

  test("should handle array with mixed null and undefined values", () => {
    expect(max([null, undefined, null])).toBe(0);
  });

  test("should handle single element array", () => {
    expect(max([5])).toBe(5);
  });

  test("should handle single null array", () => {
    expect(max([null])).toBe(0);
  });

  test("should handle array with negative numbers", () => {
    expect(max([-3, -2, -1])).toBe(-1);
  });

  test("should handle array with first element null", () => {
    expect(max([null, 1, 2])).toBe(2);
  });

  test("should handle array with first element as max", () => {
    expect(max([5, 1, 2])).toBe(5);
  });

  test("should handle array with decimals", () => {
    expect(max([1.1, 1.2, 1.3])).toBe(1.3);
  });

  test("should handle sparse array with nulls between numbers", () => {
    expect(max([1, null, 3, null, 2])).toBe(3);
  });

  test("should handle array starting with valid number but rest null", () => {
    expect(max([1, null, null])).toBe(1);
  });
});
