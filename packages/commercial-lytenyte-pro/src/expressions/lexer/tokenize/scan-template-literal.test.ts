import { describe, test, expect } from "vitest";
import { scanTemplateLiteral } from "./scan-template-literal.js";

describe("scanTemplateLiteral", () => {
  test("Should scan a simple template literal with no interpolation", () => {
    expect(scanTemplateLiteral("`hello`", 0)).toEqual({ raw: "`hello`", end: 7 });
  });

  test("Should scan an empty template literal", () => {
    expect(scanTemplateLiteral("``", 0)).toEqual({ raw: "``", end: 2 });
  });

  test("Should scan a template literal with an interpolation", () => {
    expect(scanTemplateLiteral("`hello ${name}`", 0)).toEqual({
      raw: "`hello ${name}`",
      end: 15,
    });
  });

  test("Should scan a template literal with multiple interpolations", () => {
    expect(scanTemplateLiteral("`${a} and ${b}`", 0)).toEqual({
      raw: "`${a} and ${b}`",
      end: 15,
    });
  });

  test("Should handle nested curly braces inside interpolation", () => {
    const input = "`${fn({x: 1})}`";
    const result = scanTemplateLiteral(input, 0);
    expect(result.raw).toBe("`${fn({x: 1})}`");
    expect(result.end).toBe(input.length);
  });

  test("Should handle double-quoted strings with } inside interpolation", () => {
    const result = scanTemplateLiteral('`${obj["}"]}`', 0);
    expect(result.raw).toContain('obj["}"]');
    expect(result.end).toBe(13);
  });

  test("Should handle single-quoted strings with } inside interpolation", () => {
    const result = scanTemplateLiteral("`${obj['}']}`", 0);
    expect(result.raw).toContain("obj['}']");
    expect(result.end).toBe(13);
  });

  test("Should handle escaped characters in template body", () => {
    expect(scanTemplateLiteral("`hello\\nworld`", 0)).toEqual({
      raw: "`hello\\nworld`",
      end: 14,
    });
  });

  test("Should handle escaped backtick in template body", () => {
    expect(scanTemplateLiteral("`hello\\`world`", 0)).toEqual({
      raw: "`hello\\`world`",
      end: 14,
    });
  });

  test("Should scan from an offset position", () => {
    expect(scanTemplateLiteral("  `hi`", 2)).toEqual({ raw: "`hi`", end: 6 });
  });

  test("Should stop at the closing backtick and not consume beyond", () => {
    expect(scanTemplateLiteral("`abc` + x", 0)).toEqual({ raw: "`abc`", end: 5 });
  });

  test("Should handle nested template literals inside interpolation", () => {
    const result = scanTemplateLiteral("`outer ${`inner`}`", 0);
    expect(result.raw).toBe("`outer ${`inner`}`");
    expect(result.end).toBe(18);
  });

  test("Should handle interpolation with escaped quotes in strings", () => {
    const result = scanTemplateLiteral('`${obj["\\"}"]}`', 0);
    expect(result.end).toBe(15);
  });

  test("Should handle template with only interpolation", () => {
    expect(scanTemplateLiteral("`${x}`", 0)).toEqual({ raw: "`${x}`", end: 6 });
  });

  test("Should handle text after interpolation", () => {
    expect(scanTemplateLiteral("`${x} done`", 0)).toEqual({
      raw: "`${x} done`",
      end: 11,
    });
  });

  test("Should throw on unterminated template literal", () => {
    expect(() => scanTemplateLiteral("`unclosed", 0)).toThrow("Unterminated template literal");
  });

  test("Should throw on unterminated template with interpolation", () => {
    expect(() => scanTemplateLiteral("`hello ${name}", 0)).toThrow("Unterminated template literal");
  });
});
