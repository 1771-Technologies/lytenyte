import { describe, test, expect } from "vitest";
import { evalConstant } from "./eval-constant.js";

describe("evalConstant", () => {
  test("Should evaluate numeric addition", () => {
    expect(evalConstant("+", 1, 2)).toBe(3);
  });

  test("Should evaluate numeric subtraction", () => {
    expect(evalConstant("-", 5, 3)).toBe(2);
  });

  test("Should evaluate numeric multiplication", () => {
    expect(evalConstant("*", 4, 3)).toBe(12);
  });

  test("Should evaluate numeric division", () => {
    expect(evalConstant("/", 10, 2)).toBe(5);
  });

  test("Should evaluate numeric modulus", () => {
    expect(evalConstant("%", 7, 3)).toBe(1);
  });

  test("Should evaluate numeric exponentiation", () => {
    expect(evalConstant("**", 2, 3)).toBe(8);
  });

  test("Should return undefined for non-numeric operations", () => {
    expect(evalConstant("+", "a", "b")).toBe(undefined);
    expect(evalConstant("&&", true, false)).toBe(undefined);
    expect(evalConstant("==", 1, 1)).toBe(undefined);
    expect(evalConstant("in", 1, 2)).toBe(undefined);
  });
});
