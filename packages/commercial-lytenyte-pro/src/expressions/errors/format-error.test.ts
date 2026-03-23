import { describe, test, expect } from "vitest";
import { formatError } from "./format-error.js";

describe("formatError", () => {
  test("Should include the error message", () => {
    const result = formatError("Unexpected token", { source: "a + @", start: 4, end: 5 });
    expect(result).toContain("Unexpected token");
  });

  test("Should include the source line in the output", () => {
    const result = formatError("Unexpected token", { source: "a + @", start: 4, end: 5 });
    expect(result).toContain("a + @");
  });

  test("Should include caret markers under the error position", () => {
    const result = formatError("Unexpected token", { source: "a + @", start: 4, end: 5 });
    expect(result).toContain("^");
  });

  test("Should include line and column info", () => {
    const result = formatError("Unexpected token", { source: "a + @", start: 4, end: 5 });
    expect(result).toContain("line 1, column 5");
  });

  test("Should include offset range", () => {
    const result = formatError("Unexpected token", { source: "a + @", start: 4, end: 5 });
    expect(result).toContain("offset 4-5");
  });

  test("Should include a suggestion when provided", () => {
    const result = formatError("Unknown transform", { source: "x |> uper", start: 5, end: 9 }, "upper");
    expect(result).toContain('Did you mean "upper"?');
  });

  test("Should not include suggestion text when none is provided", () => {
    const result = formatError("Error", { source: "abc", start: 0, end: 1 });
    expect(result).not.toContain("Did you mean");
  });

  test("Should handle multiline source with error on the second line", () => {
    const result = formatError("Error", { source: "line1\nline2", start: 8, end: 9 });
    expect(result).toContain("line 2");
    expect(result).toContain("line2");
  });

  test("Should clamp start offset to source bounds", () => {
    const result = formatError("Error", { source: "abc", start: -5, end: 1 });
    expect(result).toContain("line 1, column 1");
  });

  test("Should clamp end offset to source bounds", () => {
    const result = formatError("Error", { source: "abc", start: 0, end: 100 });
    expect(result).toContain("offset 0-3");
  });

  test("Should produce at least one caret even when start equals end", () => {
    const result = formatError("Error", { source: "abc", start: 1, end: 1 });
    expect(result).toContain("^");
  });

  test("Should show correct gutter with line number", () => {
    const result = formatError("Error", { source: "hello", start: 0, end: 5 });
    expect(result).toContain("1 | hello");
  });

  test("Should produce multiple carets for multi-character spans", () => {
    const result = formatError("Error", { source: "abcdef", start: 1, end: 4 });
    expect(result).toContain("^^^");
  });
});
