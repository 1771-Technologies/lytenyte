import { describe, expect, test } from "vitest";
import { isOctalDigit } from "./is-octal-digit";

describe("isOctalDigit", () => {
  test("Should return true when the character provided is an octal digit", () => {
    expect(isOctalDigit("0")).toEqual(true);
    expect(isOctalDigit("1")).toEqual(true);
    expect(isOctalDigit("2")).toEqual(true);
    expect(isOctalDigit("3")).toEqual(true);
    expect(isOctalDigit("4")).toEqual(true);
    expect(isOctalDigit("5")).toEqual(true);
    expect(isOctalDigit("6")).toEqual(true);
    expect(isOctalDigit("7")).toEqual(true);
  });

  test("Should return false when the character provided is not an octal digit", () => {
    expect(isOctalDigit("8")).toEqual(false);
    expect(isOctalDigit("a")).toEqual(false);
    expect(isOctalDigit("+")).toEqual(false);
  });
});
