import { describe, expect, test } from "vitest";
import { isHexDigit } from "./is-hex-digit";

describe("isHexDigit", () => {
  test("Should return true when the character provided is a hex digit", () => {
    expect(isHexDigit("0")).toEqual(true);
    expect(isHexDigit("1")).toEqual(true);
    expect(isHexDigit("2")).toEqual(true);
    expect(isHexDigit("3")).toEqual(true);
    expect(isHexDigit("4")).toEqual(true);
    expect(isHexDigit("5")).toEqual(true);
    expect(isHexDigit("6")).toEqual(true);
    expect(isHexDigit("7")).toEqual(true);
    expect(isHexDigit("8")).toEqual(true);
    expect(isHexDigit("9")).toEqual(true);
    expect(isHexDigit("a")).toEqual(true);
    expect(isHexDigit("b")).toEqual(true);
    expect(isHexDigit("c")).toEqual(true);
    expect(isHexDigit("d")).toEqual(true);
    expect(isHexDigit("e")).toEqual(true);
    expect(isHexDigit("f")).toEqual(true);
    expect(isHexDigit("A")).toEqual(true);
    expect(isHexDigit("B")).toEqual(true);
    expect(isHexDigit("C")).toEqual(true);
    expect(isHexDigit("D")).toEqual(true);
    expect(isHexDigit("E")).toEqual(true);
    expect(isHexDigit("F")).toEqual(true);
  });

  test("Should return false when the character provided is not a hex digit", () => {
    expect(isHexDigit("l")).toEqual(false);
    expect(isHexDigit(".")).toEqual(false);
    expect(isHexDigit("+")).toEqual(false);
  });
});
