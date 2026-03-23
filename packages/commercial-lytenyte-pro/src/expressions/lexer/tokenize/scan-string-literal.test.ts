import { describe, test, expect } from "vitest";
import { scanStringLiteral } from "./scan-string-literal";

describe("scanStringLiteral", () => {
  test("Should scan a double-quoted string literal as raw", () => {
    expect(scanStringLiteral('"hello"', 0)).toEqual({ raw: '"hello"', end: 7 });
  });

  test("Should scan a single-quoted string literal as raw", () => {
    expect(scanStringLiteral("'world'", 0)).toEqual({ raw: "'world'", end: 7 });
  });

  test("Should scan an empty double-quoted string literal", () => {
    expect(scanStringLiteral('""', 0)).toEqual({ raw: '""', end: 2 });
  });

  test("Should scan an empty single-quoted string literal", () => {
    expect(scanStringLiteral("''", 0)).toEqual({ raw: "''", end: 2 });
  });

  test("Should preserve escape sequences in raw output", () => {
    expect(scanStringLiteral('"hello\\nworld"', 0)).toEqual({
      raw: '"hello\\nworld"',
      end: 14,
    });
  });

  test("Should preserve escaped quotes in raw output", () => {
    expect(scanStringLiteral('"say \\"hi\\""', 0)).toEqual({
      raw: '"say \\"hi\\""',
      end: 12,
    });
  });

  test("Should preserve escaped backslashes in raw output", () => {
    expect(scanStringLiteral('"a\\\\b"', 0)).toEqual({ raw: '"a\\\\b"', end: 6 });
  });

  test("Should scan from an offset position", () => {
    expect(scanStringLiteral('  "hi"', 2)).toEqual({ raw: '"hi"', end: 6 });
  });

  test("Should stop at the closing quote and not consume beyond", () => {
    expect(scanStringLiteral('"abc" + x', 0)).toEqual({ raw: '"abc"', end: 5 });
  });

  test("Should handle string with braces in content", () => {
    expect(scanStringLiteral('"}"', 0)).toEqual({ raw: '"}"', end: 3 });
  });

  test("Should throw on unterminated double-quoted string", () => {
    expect(() => scanStringLiteral('"unclosed', 0)).toThrow("Unterminated string");
  });

  test("Should throw on unterminated single-quoted string", () => {
    expect(() => scanStringLiteral("'unclosed", 0)).toThrow("Unterminated string");
  });

  test("Should throw on unterminated string with escape at end", () => {
    expect(() => scanStringLiteral('"test\\', 0)).toThrow("Unterminated string");
  });
});
