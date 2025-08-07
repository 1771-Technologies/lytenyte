import { describe, test, expect } from "vitest";
import { stringComparator } from "../string-comparator.js";

// Helper function to create a collator
function createCollator(locale: string, caseInsensitive: boolean) {
  return new Intl.Collator(locale, { sensitivity: caseInsensitive ? "base" : "variant" });
}

// Default options for tests
const defaultOptions = {
  caseInsensitive: false,
  trimWhitespace: false,
  ignorePunctuation: false,
  nullsFirst: true,
  locale: "en",
  collator: createCollator("en", false),
};

describe("stringComparator", () => {
  test("should return 0 for two null values", () => {
    expect(stringComparator(null, null, defaultOptions)).toBe(0);
  });

  test("should return 1 when left is not null and right is null (nullsFirst: true)", () => {
    expect(stringComparator("apple", null, defaultOptions)).toBe(1);
  });

  test("should return -1 when left is null and right is not null (nullsFirst: true)", () => {
    expect(stringComparator(null, "banana", defaultOptions)).toBe(-1);
  });

  test("should return -1 when left is not null and right is null (nullsFirst: false)", () => {
    const options = { ...defaultOptions, nullsFirst: false };
    expect(stringComparator("apple", null, options)).toBe(-1);
  });

  test("should return 1 when left is null and right is not null (nullsFirst: false)", () => {
    const options = { ...defaultOptions, nullsFirst: false };
    expect(stringComparator(null, "banana", options)).toBe(1);
  });

  test("should properly compare strings without modifications", () => {
    expect(stringComparator("apple", "banana", defaultOptions)).toBeLessThan(0);
    expect(stringComparator("banana", "apple", defaultOptions)).toBeGreaterThan(0);
    expect(stringComparator("apple", "apple", defaultOptions)).toBe(0);
  });

  test("should handle case-insensitive comparison", () => {
    const options = {
      ...defaultOptions,
      caseInsensitive: true,
      collator: createCollator("en", true),
    };
    expect(stringComparator("apple", "Apple", options)).toBe(0);
    expect(stringComparator("banana", "BANANA", options)).toBe(0);
    expect(stringComparator("apple", "banana", options)).toBeLessThan(0);
  });

  test("should trim whitespace when trimWhitespace is true", () => {
    const options = { ...defaultOptions, trimWhitespace: true };
    expect(stringComparator("  apple  ", "apple", options)).toBe(0);
    expect(stringComparator("  banana ", " apple", options)).toBeGreaterThan(0);
  });

  test("should ignore punctuation when ignorePunctuation is true", () => {
    const options = { ...defaultOptions, ignorePunctuation: true };
    expect(stringComparator("hello, world!", "hello world", options)).toBe(0);
    expect(stringComparator("apple!", "apple", options)).toBe(0);
    expect(stringComparator("banana.", "apple,", options)).toBeGreaterThan(0);
  });

  test("should combine case-insensitive, trimWhitespace, and ignorePunctuation options", () => {
    const options = {
      ...defaultOptions,
      caseInsensitive: true,
      trimWhitespace: true,
      ignorePunctuation: true,
      collator: createCollator("en", true),
    };
    expect(stringComparator("  HELLO, world!  ", "hello world", options)).toBe(0);
    expect(stringComparator(" goodbye, world.", "Goodbye world", options)).toBe(0);
  });

  test("should handle locale-aware string comparison (e.g., 'ä' vs. 'z' in Swedish)", () => {
    const options = {
      ...defaultOptions,
      locale: "sv",
      collator: createCollator("sv", false),
    };
    expect(stringComparator("ä", "z", options)).toBeGreaterThan(0); // "ä" comes after "z" in Swedish
    expect(stringComparator("z", "ä", options)).toBeLessThan(0);
  });

  test("should handle German locale (e.g., 'ß' vs. 'ss')", () => {
    const options = {
      ...defaultOptions,
      locale: "de",
      collator: createCollator("de", true),
      caseInsensitive: true,
    };
    expect(stringComparator("ß", "ss", options)).toBe(0); // "ß" treated as "ss" in German locale (case-insensitive)
    expect(stringComparator("straße", "strasse", options)).toBe(0);
  });

  test("should distinguish 'ß' and 'ss' when caseInsensitive is false", () => {
    const options = {
      ...defaultOptions,
      locale: "de",
      collator: createCollator("de", false),
      caseInsensitive: false,
    };
    expect(stringComparator("ß", "ss", options)).not.toBe(0); // "ß" and "ss" are distinct in German locale (case-sensitive)
  });

  test("should handle strings with and without nulls", () => {
    expect(stringComparator("apple", null, defaultOptions)).toBe(1);
    expect(stringComparator(null, "banana", defaultOptions)).toBe(-1);
    expect(stringComparator(null, null, defaultOptions)).toBe(0);
  });

  test("should handle empty strings correctly", () => {
    expect(stringComparator("", "", defaultOptions)).toBe(0);
    expect(stringComparator("", "apple", defaultOptions)).toBeLessThan(0);
    expect(stringComparator("banana", "", defaultOptions)).toBeGreaterThan(0);
  });

  test("should handle strings with different casing, punctuation, and whitespace", () => {
    const options = {
      ...defaultOptions,
      caseInsensitive: true,
      trimWhitespace: true,
      ignorePunctuation: true,
      collator: createCollator("en", true),
    };
    expect(stringComparator("  Hello, World!  ", "hello world", options)).toBe(0);
    expect(stringComparator(" Goodbye, World. ", "goodbye world", options)).toBe(0);
  });
});
