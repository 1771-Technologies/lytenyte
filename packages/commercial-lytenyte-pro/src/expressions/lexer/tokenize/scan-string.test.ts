import { describe, test, expect } from "vitest";
import { scanString } from "./scan-string.js";

describe("scanString", () => {
  test("Should scan a double-quoted string", () => {
    expect(scanString('"hello"', 0)).toEqual({ value: "hello", end: 7 });
  });

  test("Should scan a single-quoted string", () => {
    expect(scanString("'world'", 0)).toEqual({ value: "world", end: 7 });
  });

  test("Should scan an empty double-quoted string", () => {
    expect(scanString('""', 0)).toEqual({ value: "", end: 2 });
  });

  test("Should scan an empty single-quoted string", () => {
    expect(scanString("''", 0)).toEqual({ value: "", end: 2 });
  });

  test("Should scan from an offset position", () => {
    expect(scanString('  "hi"', 2)).toEqual({ value: "hi", end: 6 });
  });

  test("Should stop at the closing quote", () => {
    expect(scanString('"abc" + x', 0)).toEqual({ value: "abc", end: 5 });
  });

  test("Should handle newline escape \\n", () => {
    expect(scanString('"line1\\nline2"', 0)).toEqual({ value: "line1\nline2", end: 14 });
  });

  test("Should handle tab escape \\t", () => {
    expect(scanString('"col1\\tcol2"', 0)).toEqual({ value: "col1\tcol2", end: 12 });
  });

  test("Should handle carriage return escape \\r", () => {
    expect(scanString('"a\\rb"', 0)).toEqual({ value: "a\rb", end: 6 });
  });

  test("Should handle backslash escape \\\\", () => {
    expect(scanString('"a\\\\b"', 0)).toEqual({ value: "a\\b", end: 6 });
  });

  test("Should handle null escape \\0", () => {
    expect(scanString('"a\\0b"', 0)).toEqual({ value: "a\0b", end: 6 });
  });

  test("Should handle hex escape \\xNN", () => {
    expect(scanString('"\\x41"', 0)).toEqual({ value: "A", end: 6 });
  });

  test("Should handle unicode escape \\uNNNN", () => {
    expect(scanString('"\\u0041"', 0)).toEqual({ value: "A", end: 8 });
  });

  test("Should handle unicode escape \\u{XXXX}", () => {
    expect(scanString('"\\u{0041}"', 0)).toEqual({ value: "A", end: 10 });
  });

  test("Should handle unicode escape \\u{} with large code point", () => {
    expect(scanString('"\\u{1F600}"', 0)).toEqual({ value: "\u{1F600}", end: 11 });
  });

  test("Should handle maximum valid code point \\u{10FFFF}", () => {
    const result = scanString('"\\u{10FFFF}"', 0);
    expect(result.value).toBe(String.fromCodePoint(0x10ffff));
  });

  test("Should handle escaped quote inside double-quoted string", () => {
    expect(scanString('"say \\"hi\\""', 0)).toEqual({ value: 'say "hi"', end: 12 });
  });

  test("Should handle escaped quote inside single-quoted string", () => {
    expect(scanString("'it\\'s'", 0)).toEqual({ value: "it's", end: 7 });
  });

  test("Should pass through unrecognized escape sequences", () => {
    expect(scanString('"\\q"', 0)).toEqual({ value: "q", end: 4 });
  });

  test("Should handle multiple escapes in one string", () => {
    expect(scanString('"\\n\\t\\r"', 0)).toEqual({ value: "\n\t\r", end: 8 });
  });

  test("Should throw on unterminated double-quoted string", () => {
    expect(() => scanString('"unclosed', 0)).toThrow("Unterminated string");
  });

  test("Should throw on unterminated single-quoted string", () => {
    expect(() => scanString("'unclosed", 0)).toThrow("Unterminated string");
  });

  test("Should throw on truncated \\x escape", () => {
    expect(() => scanString('"\\x4"', 0)).toThrow("Invalid \\x escape");
  });

  test("Should throw on non-hex \\x escape", () => {
    expect(() => scanString('"\\xGG"', 0)).toThrow("Invalid \\x escape");
  });

  test("Should throw on truncated \\u escape without braces", () => {
    expect(() => scanString('"\\u00"', 0)).toThrow("Invalid \\u escape");
  });

  test("Should throw on \\u{} with missing closing brace", () => {
    expect(() => scanString('"\\u{1F600"', 0)).toThrow("missing closing brace");
  });

  test("Should throw on \\u{} with empty code point", () => {
    expect(() => scanString('"\\u{}"', 0)).toThrow("empty code point");
  });

  test("Should throw on non-hex digits in \\u{}", () => {
    expect(() => scanString('"\\u{zz}"', 0)).toThrow("non-hex digit");
  });

  test("Should throw on code point out of range in \\u{}", () => {
    expect(() => scanString('"\\u{110000}"', 0)).toThrow("out of range");
  });
});
