import { describe, test, expect } from "vitest";
import { isExcelError } from "./is-excel-error.js";

describe("isExcelError", () => {
  test.each(["#NULL!", "#DIV/0!", "#VALUE!", "#REF!", "#NAME?", "#NUM!", "#N/A", "#GETTING_DATA"])(
    "Should return true for %s",
    (error) => {
      expect(isExcelError(error)).toBe(true);
    },
  );

  test("Should return false for a regular string", () => {
    expect(isExcelError("hello")).toBe(false);
  });

  test("Should return false for an empty string", () => {
    expect(isExcelError("")).toBe(false);
  });

  test("Should be case-sensitive", () => {
    expect(isExcelError("#ref!")).toBe(false);
    expect(isExcelError("#n/a")).toBe(false);
  });
});
