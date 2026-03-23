import { describe, test, expect } from "vitest";
import { consumeDigits } from "./consume-digits";
import { isDigit } from "../predicates/is-digit";
import { isHexDigit } from "../predicates/is-hex-digit";
import { isBinaryDigit } from "../predicates/is-binary-digit";

describe("consumeDigits", () => {
  test("Should consume matching digits from the start position", () => {
    expect(consumeDigits("12345abc", 0, isDigit)).toBe(5);
  });

  test("Should return the start position when no digits match", () => {
    expect(consumeDigits("abc", 0, isDigit)).toBe(0);
  });

  test("Should consume from an offset position", () => {
    expect(consumeDigits("abc123def", 3, isDigit)).toBe(6);
  });

  test("Should consume until end of string", () => {
    expect(consumeDigits("999", 0, isDigit)).toBe(3);
  });

  test("Should skip underscore separators between digits", () => {
    expect(consumeDigits("1_000_000", 0, isDigit)).toBe(9);
  });

  test("Should consume hex digits with the hex predicate", () => {
    expect(consumeDigits("FF00ab", 0, isHexDigit)).toBe(6);
  });

  test("Should consume binary digits with the binary predicate", () => {
    expect(consumeDigits("1010xyz", 0, isBinaryDigit)).toBe(4);
  });

  test("Should handle underscore separators with hex digits", () => {
    expect(consumeDigits("FF_00", 0, isHexDigit)).toBe(5);
  });

  test("Should return start position for empty string", () => {
    expect(consumeDigits("", 0, isDigit)).toBe(0);
  });
});
