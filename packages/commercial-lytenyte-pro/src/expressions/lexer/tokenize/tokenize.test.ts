import { describe, test, expect } from "vitest";
import { tokenize } from "./tokenize.js";

describe("tokenize", () => {
  test("Should tokenize numbers", () => {
    const tokens = tokenize("42");
    expect(tokens[0]).toMatchObject({ type: "Number", value: "42" });
  });

  test("Should tokenize decimals", () => {
    const tokens = tokenize("3.14");
    expect(tokens[0]).toMatchObject({ type: "Number", value: "3.14" });
  });

  test("Should tokenize strings with double quotes", () => {
    const tokens = tokenize('"hello"');
    expect(tokens[0]).toMatchObject({ type: "String", value: "hello" });
  });

  test("Should tokenize strings with single quotes", () => {
    const tokens = tokenize("'world'");
    expect(tokens[0]).toMatchObject({ type: "String", value: "world" });
  });

  test("Should tokenize booleans", () => {
    const tokens = tokenize("true false");
    expect(tokens[0]).toMatchObject({ type: "Boolean", value: "true" });
    expect(tokens[1]).toMatchObject({ type: "Boolean", value: "false" });
  });

  test("Should tokenize null and undefined", () => {
    const tokens = tokenize("null undefined");
    expect(tokens[0]).toMatchObject({ type: "Null", value: "null" });
    expect(tokens[1]).toMatchObject({ type: "Undefined", value: "undefined" });
  });

  test("Should tokenize identifiers", () => {
    const tokens = tokenize("foo bar_baz");
    expect(tokens[0]).toMatchObject({ type: "Identifier", value: "foo" });
    expect(tokens[1]).toMatchObject({ type: "Identifier", value: "bar_baz" });
  });

  test("Should tokenize arithmetic operators", () => {
    const tokens = tokenize("+ - * / % **");
    expect(tokens.filter((t) => t.type === "Operator").map((t) => t.value)).toEqual([
      "+",
      "-",
      "*",
      "/",
      "%",
      "**",
    ]);
  });

  test("Should tokenize comparison operators", () => {
    const tokens = tokenize("== != < > <= >=");
    expect(tokens.filter((t) => t.type === "Operator").map((t) => t.value)).toEqual([
      "==",
      "!=",
      "<",
      ">",
      "<=",
      ">=",
    ]);
  });

  test("Should tokenize logical operators", () => {
    const tokens = tokenize("&& || !");
    expect(tokens.filter((t) => t.type === "Operator").map((t) => t.value)).toEqual(["&&", "||", "!"]);
  });

  test("Should tokenize pipe operator |>", () => {
    const tokens = tokenize("x |> upper");
    expect(tokens[1]).toMatchObject({ type: "Pipe", value: "|>" });
  });

  test("Should tokenize optional chaining ?.", () => {
    const tokens = tokenize("a?.b");
    expect(tokens[1]).toMatchObject({ type: "OptionalChain", value: "?." });
  });

  test("Should tokenize nullish coalescing ??", () => {
    const tokens = tokenize("a ?? b");
    expect(tokens[1]).toMatchObject({ type: "NullishCoalescing", value: "??" });
  });

  test("Should tokenize spread operator", () => {
    const tokens = tokenize("...arr");
    expect(tokens[0]).toMatchObject({ type: "Spread", value: "..." });
  });

  test("Should tokenize punctuation", () => {
    const tokens = tokenize("( ) [ ] { } , : .");
    expect(tokens.filter((t) => t.type === "Punctuation").map((t) => t.value)).toEqual([
      "(",
      ")",
      "[",
      "]",
      "{",
      "}",
      ",",
      ":",
      ".",
    ]);
  });

  test("Should tokenize a complex expression", () => {
    const tokens = tokenize("user.age >= 18 && user.verified");
    const types = tokens.filter((t) => t.type !== "EOF").map((t) => t.type);
    expect(types).toEqual([
      "Identifier",
      "Punctuation",
      "Identifier",
      "Operator",
      "Number",
      "Operator",
      "Identifier",
      "Punctuation",
      "Identifier",
    ]);
  });

  test("Should tokenize template literals", () => {
    const tokens = tokenize("`Hello ${name}`");
    expect(tokens[0]).toMatchObject({ type: "TemplateLiteral" });
  });

  test("Should handle } inside strings in template interpolations", () => {
    const tokens = tokenize('`${obj["}"]}`');
    expect(tokens[0]).toMatchObject({ type: "TemplateLiteral" });
    expect(tokens[0].value).toContain('obj["}"]');
  });

  test("Should handle single-quoted strings with } in template interpolations", () => {
    const tokens = tokenize("`${obj['}']}`");
    expect(tokens[0]).toMatchObject({ type: "TemplateLiteral" });
  });

  test("Should handle escaped quotes in strings inside template interpolations", () => {
    const tokens = tokenize('`${obj["\\"}"]}`');
    expect(tokens[0]).toMatchObject({ type: "TemplateLiteral" });
  });

  test("Should track positions correctly", () => {
    const tokens = tokenize("a + b");
    expect(tokens[0]).toMatchObject({ start: 0, end: 1 });
    expect(tokens[1]).toMatchObject({ start: 2, end: 3 });
    expect(tokens[2]).toMatchObject({ start: 4, end: 5 });
  });

  test("Should end with EOF token", () => {
    const tokens = tokenize("42");
    expect(tokens[tokens.length - 1].type).toBe("EOF");
  });

  test("Should throw ExpressionError on invalid characters", () => {
    expect(() => tokenize("foo @ bar")).toThrow("Unexpected character");
  });

  test("Should tokenize ternary operator", () => {
    const tokens = tokenize("a ? b : c");
    expect(tokens[1]).toMatchObject({ type: "Punctuation", value: "?" });
    expect(tokens[3]).toMatchObject({ type: "Punctuation", value: ":" });
  });

  test("Should tokenize in and not keywords", () => {
    const tokens = tokenize('"a" in arr');
    expect(tokens[1]).toMatchObject({ type: "Operator", value: "in" });
  });

  test("Should tokenize hex numbers", () => {
    expect(tokenize("0xFF")[0]).toMatchObject({ type: "Number", value: "0xFF" });
    expect(tokenize("0x1A2B")[0]).toMatchObject({ type: "Number", value: "0x1A2B" });
  });

  test("Should tokenize binary numbers", () => {
    expect(tokenize("0b1010")[0]).toMatchObject({ type: "Number", value: "0b1010" });
  });

  test("Should tokenize octal numbers", () => {
    expect(tokenize("0o77")[0]).toMatchObject({ type: "Number", value: "0o77" });
  });

  test("Should tokenize scientific notation", () => {
    expect(tokenize("1e5")[0]).toMatchObject({ type: "Number", value: "1e5" });
    expect(tokenize("1.5e-3")[0]).toMatchObject({ type: "Number", value: "1.5e-3" });
    expect(tokenize("2E+10")[0]).toMatchObject({ type: "Number", value: "2E+10" });
  });

  test("Should tokenize numeric separators", () => {
    expect(tokenize("1_000_000")[0]).toMatchObject({ type: "Number", value: "1_000_000" });
    expect(tokenize("0xFF_FF")[0]).toMatchObject({ type: "Number", value: "0xFF_FF" });
  });

  test("Should throw on unterminated string", () => {
    expect(() => tokenize('"unclosed')).toThrow("Unterminated string");
  });

  test("Should throw on unterminated single-quoted string", () => {
    expect(() => tokenize("'unclosed")).toThrow("Unterminated string");
  });

  test("Should throw on unterminated template literal", () => {
    expect(() => tokenize("`unclosed")).toThrow("Unterminated template literal");
  });

  test("Should throw on unterminated template with interpolation", () => {
    expect(() => tokenize("`hello ${name")).toThrow("Unterminated template literal");
  });

  test("Should handle unicode escapes \\u{XXXX}", () => {
    expect(tokenize('"\\u{0041}"')[0]).toMatchObject({ type: "String", value: "A" });
    expect(tokenize('"\\u{1F600}"')[0]).toMatchObject({ type: "String", value: "\u{1F600}" });
  });

  test("Should handle unicode escapes \\uXXXX", () => {
    expect(tokenize('"\\u0041"')[0]).toMatchObject({ type: "String", value: "A" });
  });

  test("Should handle hex escapes \\xNN", () => {
    expect(tokenize('"\\x41"')[0]).toMatchObject({ type: "String", value: "A" });
  });

  test("Should handle null escape \\0", () => {
    expect(tokenize('"\\0"')[0]).toMatchObject({ type: "String", value: "\0" });
  });

  test("Should throw on truncated \\x escape", () => {
    expect(() => tokenize('"\\x4"')).toThrow("Invalid \\x escape");
  });

  test("Should throw on non-hex \\x escape", () => {
    expect(() => tokenize('"\\xGG"')).toThrow("Invalid \\x escape");
  });

  test("Should throw on \\u{} with missing closing brace", () => {
    expect(() => tokenize('"\\u{1F600"')).toThrow("missing closing brace");
  });

  test("Should throw on \\u{} with empty code point", () => {
    expect(() => tokenize('"\\u{}"')).toThrow("empty code point");
  });

  test("Should throw on truncated \\u escape without braces", () => {
    expect(() => tokenize('"\\u00"')).toThrow("Invalid \\u escape");
  });

  test("Should throw on non-hex digits in \\u{}", () => {
    expect(() => tokenize('"\\u{zz}"')).toThrow("non-hex digit");
  });

  test("Should throw on code point out of range in \\u{}", () => {
    expect(() => tokenize('"\\u{110000}"')).toThrow("out of range");
  });

  test("Should throw ExpressionError not RangeError for invalid \\u{} content", () => {
    expect(() => tokenize('"\\u{GGGG}"')).toThrow("non-hex digit");
  });

  test("Should accept maximum valid code point \\u{10FFFF}", () => {
    expect(tokenize('"\\u{10FFFF}"')[0]).toMatchObject({ type: "String" });
  });

  test("Should skip whitespace between tokens", () => {
    const tokens = tokenize("  a   +   b  ");
    const nonEof = tokens.filter((t) => t.type !== "EOF");
    expect(nonEof).toHaveLength(3);
  });

  test("Should produce an EOF for empty input", () => {
    const tokens = tokenize("");
    expect(tokens).toHaveLength(1);
    expect(tokens[0].type).toBe("EOF");
  });

  test("Should skip plugin without scan hook", () => {
    const plugin = { name: "no-scan" };
    const tokens = tokenize("42", [plugin]);
    expect(tokens[0]).toMatchObject({ type: "Number", value: "42" });
  });

  test("Should skip plugin scan that returns null", () => {
    const plugin = { name: "null-scan", scan: () => null };
    const tokens = tokenize("42", [plugin]);
    expect(tokens[0]).toMatchObject({ type: "Number", value: "42" });
  });

  test("Should use plugin scan that returns a token", () => {
    const plugin = {
      name: "custom",
      scan: (source: string, pos: number) => {
        if (source[pos] === "#") return { type: "Hash", value: "#", end: pos + 1 };
        return null;
      },
    };
    const tokens = tokenize("# 42", [plugin]);
    expect(tokens[0]).toMatchObject({ type: "Hash", value: "#" });
    expect(tokens[1]).toMatchObject({ type: "Number", value: "42" });
  });
});
