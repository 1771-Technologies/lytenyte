import { describe, expect, test } from "vitest";
import { isBinaryDigit } from "./is-binary-digit";

describe("isBinaryDigit", () => {
  test("Should return true when the character provided is a binary digit", () => {
    expect(isBinaryDigit("0")).toEqual(true);
    expect(isBinaryDigit("1")).toEqual(true);
  });

  test("Should return false when the character provided is not a binary digit", () => {
    expect(isBinaryDigit("2")).toEqual(false);
    expect(isBinaryDigit(".")).toEqual(false);
    expect(isBinaryDigit("+")).toEqual(false);
  });
});
