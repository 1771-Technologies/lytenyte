import { describe, expect, test } from "vitest";
import { isAlpha } from "./is-alpha.js";

describe("isAlpha", () => {
  test("Should return true when the character provided is a letter", () => {
    expect(isAlpha("a")).toEqual(true);
    expect(isAlpha("b")).toEqual(true);
    expect(isAlpha("c")).toEqual(true);
    expect(isAlpha("_")).toEqual(true);
    expect(isAlpha("$")).toEqual(true);
  });

  test("Should return false when the character provided is not a letter", () => {
    expect(isAlpha("1")).toEqual(false);
    expect(isAlpha(".")).toEqual(false);
    expect(isAlpha("+")).toEqual(false);
  });
});
