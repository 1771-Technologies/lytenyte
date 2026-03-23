import { describe, test, expect } from "vitest";
import { offsetToPosition } from "./offset-to-position.js";

describe("offsetToPosition", () => {
  test("Should return line 1, column 1 for offset 0", () => {
    expect(offsetToPosition("hello", 0)).toEqual({ line: 1, column: 1, offset: 0 });
  });

  test("Should return correct column on the first line", () => {
    expect(offsetToPosition("hello", 4)).toEqual({ line: 1, column: 5, offset: 4 });
  });

  test("Should return line 2, column 1 for first char after newline", () => {
    expect(offsetToPosition("hello\nworld", 6)).toEqual({ line: 2, column: 1, offset: 6 });
  });

  test("Should return correct position on the second line", () => {
    expect(offsetToPosition("hello\nworld", 9)).toEqual({ line: 2, column: 4, offset: 9 });
  });

  test("Should handle multiple newlines", () => {
    expect(offsetToPosition("a\nb\nc", 4)).toEqual({ line: 3, column: 1, offset: 4 });
  });

  test("Should clamp negative offsets to 0", () => {
    expect(offsetToPosition("hello", -5)).toEqual({ line: 1, column: 1, offset: 0 });
  });

  test("Should clamp offsets beyond source length", () => {
    expect(offsetToPosition("hello", 100)).toEqual({ line: 1, column: 6, offset: 5 });
  });

  test("Should handle empty source", () => {
    expect(offsetToPosition("", 0)).toEqual({ line: 1, column: 1, offset: 0 });
  });

  test("Should handle offset at a newline character", () => {
    expect(offsetToPosition("hello\nworld", 5)).toEqual({ line: 1, column: 6, offset: 5 });
  });

  test("Should handle consecutive newlines", () => {
    expect(offsetToPosition("a\n\nc", 3)).toEqual({ line: 3, column: 1, offset: 3 });
  });
});
