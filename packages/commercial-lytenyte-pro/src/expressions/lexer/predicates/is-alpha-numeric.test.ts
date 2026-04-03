import { describe, expect, test } from "vitest";
import { isAlphaNumeric } from "./is-alpha-numeric.js";

describe("isAlphaNumeric", () => {
  test("Should return true when the character provided is a digit or alpha", () => {
    expect(isAlphaNumeric("0")).toEqual(true);
    expect(isAlphaNumeric("1")).toEqual(true);
    expect(isAlphaNumeric("2")).toEqual(true);
    expect(isAlphaNumeric("3")).toEqual(true);
    expect(isAlphaNumeric("4")).toEqual(true);
    expect(isAlphaNumeric("5")).toEqual(true);
    expect(isAlphaNumeric("6")).toEqual(true);
    expect(isAlphaNumeric("7")).toEqual(true);
    expect(isAlphaNumeric("8")).toEqual(true);
    expect(isAlphaNumeric("9")).toEqual(true);
    expect(isAlphaNumeric("a")).toEqual(true);
    expect(isAlphaNumeric("b")).toEqual(true);
  });

  test("Should return false when the character provided is not a digit or alpha", () => {
    expect(isAlphaNumeric(".")).toEqual(false);
    expect(isAlphaNumeric("+")).toEqual(false);
  });
});
