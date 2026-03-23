import { describe, test, expect } from "vitest";
import { getLineEnd } from "./get-line-end.js";

describe("getLineEnd", () => {
  test("Should return source length for a single-line source", () => {
    expect(getLineEnd("hello world", 3)).toBe(11);
  });

  test("Should return the position of the newline for offset on the first line", () => {
    expect(getLineEnd("hello\nworld", 3)).toBe(5);
  });

  test("Should return source length for offset on the last line", () => {
    expect(getLineEnd("hello\nworld", 8)).toBe(11);
  });

  test("Should return the position of the next newline for the second line", () => {
    expect(getLineEnd("aaa\nbbb\nccc", 5)).toBe(7);
  });

  test("Should return offset position when offset is at a newline", () => {
    expect(getLineEnd("hello\nworld", 5)).toBe(5);
  });

  test("Should clamp offset beyond source length", () => {
    expect(getLineEnd("hello", 100)).toBe(5);
  });

  test("Should clamp negative offsets to 0", () => {
    expect(getLineEnd("hello\nworld", -5)).toBe(5);
  });

  test("Should handle empty source", () => {
    expect(getLineEnd("", 0)).toBe(0);
  });
});
