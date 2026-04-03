import { describe, test, expect } from "vitest";
import { getLineStart } from "./get-line-start.js";

describe("getLineStart", () => {
  test("Should return 0 for offset on the first line", () => {
    expect(getLineStart("hello world", 5)).toBe(0);
  });

  test("Should return the position after the newline for offset on the second line", () => {
    expect(getLineStart("hello\nworld", 8)).toBe(6);
  });

  test("Should return the correct start for the third line", () => {
    expect(getLineStart("aaa\nbbb\nccc", 10)).toBe(8);
  });

  test("Should return 0 for offset 0", () => {
    expect(getLineStart("hello", 0)).toBe(0);
  });

  test("Should return the position after newline when offset is at the newline boundary", () => {
    expect(getLineStart("hello\nworld", 6)).toBe(6);
  });

  test("Should clamp offset beyond source length", () => {
    expect(getLineStart("hello", 100)).toBe(0);
  });

  test("Should clamp negative offsets to 0", () => {
    expect(getLineStart("hello\nworld", -5)).toBe(0);
  });

  test("Should handle empty source", () => {
    expect(getLineStart("", 0)).toBe(0);
  });
});
