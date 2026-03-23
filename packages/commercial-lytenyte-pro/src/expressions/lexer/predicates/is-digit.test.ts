import { describe, expect, test } from "vitest";
import { isDigit } from "./is-digit";

describe("isDigit", () => {
  test("Should return true when the character provided is a digit", () => {
    expect(isDigit("0")).toEqual(true);
    expect(isDigit("1")).toEqual(true);
    expect(isDigit("2")).toEqual(true);
    expect(isDigit("3")).toEqual(true);
    expect(isDigit("4")).toEqual(true);
    expect(isDigit("5")).toEqual(true);
    expect(isDigit("6")).toEqual(true);
    expect(isDigit("7")).toEqual(true);
    expect(isDigit("8")).toEqual(true);
    expect(isDigit("9")).toEqual(true);
  });

  test("Should return false when the character provided is not a digit", () => {
    expect(isDigit("a")).toEqual(false);
    expect(isDigit("b")).toEqual(false);
    expect(isDigit("+")).toEqual(false);
  });
});
