import { describe, test, expect } from "vitest";
import { scanOperator } from "./scan-operator";

describe("scanOperator", () => {
  test("Should scan the spread operator ...", () => {
    expect(scanOperator("...", 0)).toEqual({ type: "Spread", value: "...", end: 3 });
  });

  test("Should scan the dot punctuation", () => {
    expect(scanOperator(".", 0)).toEqual({ type: "Punctuation", value: ".", end: 1 });
  });

  test("Should scan the pipe operator |>", () => {
    expect(scanOperator("|>", 0)).toEqual({ type: "Pipe", value: "|>", end: 2 });
  });

  test("Should scan the logical OR operator ||", () => {
    expect(scanOperator("||", 0)).toEqual({ type: "Operator", value: "||", end: 2 });
  });

  test("Should scan the logical AND operator &&", () => {
    expect(scanOperator("&&", 0)).toEqual({ type: "Operator", value: "&&", end: 2 });
  });

  test("Should scan the equality operator ==", () => {
    expect(scanOperator("==", 0)).toEqual({ type: "Operator", value: "==", end: 2 });
  });

  test("Should scan the inequality operator !=", () => {
    expect(scanOperator("!=", 0)).toEqual({ type: "Operator", value: "!=", end: 2 });
  });

  test("Should scan the logical NOT operator !", () => {
    expect(scanOperator("!", 0)).toEqual({ type: "Operator", value: "!", end: 1 });
  });

  test("Should scan the less-than operator <", () => {
    expect(scanOperator("<", 0)).toEqual({ type: "Operator", value: "<", end: 1 });
  });

  test("Should scan the less-than-or-equal operator <=", () => {
    expect(scanOperator("<=", 0)).toEqual({ type: "Operator", value: "<=", end: 2 });
  });

  test("Should scan the greater-than operator >", () => {
    expect(scanOperator(">", 0)).toEqual({ type: "Operator", value: ">", end: 1 });
  });

  test("Should scan the greater-than-or-equal operator >=", () => {
    expect(scanOperator(">=", 0)).toEqual({ type: "Operator", value: ">=", end: 2 });
  });

  test("Should scan the exponentiation operator **", () => {
    expect(scanOperator("**", 0)).toEqual({ type: "Operator", value: "**", end: 2 });
  });

  test("Should scan the optional chaining operator ?.", () => {
    expect(scanOperator("?.", 0)).toEqual({ type: "OptionalChain", value: "?.", end: 2 });
  });

  test("Should scan the nullish coalescing operator ??", () => {
    expect(scanOperator("??", 0)).toEqual({ type: "NullishCoalescing", value: "??", end: 2 });
  });

  test("Should scan the ternary ? as punctuation", () => {
    expect(scanOperator("?", 0)).toEqual({ type: "Punctuation", value: "?", end: 1 });
  });

  test("Should scan the + operator", () => {
    expect(scanOperator("+", 0)).toEqual({ type: "Operator", value: "+", end: 1 });
  });

  test("Should scan the - operator", () => {
    expect(scanOperator("-", 0)).toEqual({ type: "Operator", value: "-", end: 1 });
  });

  test("Should scan the * operator", () => {
    expect(scanOperator("*", 0)).toEqual({ type: "Operator", value: "*", end: 1 });
  });

  test("Should scan the / operator", () => {
    expect(scanOperator("/", 0)).toEqual({ type: "Operator", value: "/", end: 1 });
  });

  test("Should scan the % operator", () => {
    expect(scanOperator("%", 0)).toEqual({ type: "Operator", value: "%", end: 1 });
  });

  test("Should scan open parenthesis", () => {
    expect(scanOperator("(", 0)).toEqual({ type: "Punctuation", value: "(", end: 1 });
  });

  test("Should scan close parenthesis", () => {
    expect(scanOperator(")", 0)).toEqual({ type: "Punctuation", value: ")", end: 1 });
  });

  test("Should scan open bracket", () => {
    expect(scanOperator("[", 0)).toEqual({ type: "Punctuation", value: "[", end: 1 });
  });

  test("Should scan close bracket", () => {
    expect(scanOperator("]", 0)).toEqual({ type: "Punctuation", value: "]", end: 1 });
  });

  test("Should scan open brace", () => {
    expect(scanOperator("{", 0)).toEqual({ type: "Punctuation", value: "{", end: 1 });
  });

  test("Should scan close brace", () => {
    expect(scanOperator("}", 0)).toEqual({ type: "Punctuation", value: "}", end: 1 });
  });

  test("Should scan comma", () => {
    expect(scanOperator(",", 0)).toEqual({ type: "Punctuation", value: ",", end: 1 });
  });

  test("Should scan colon", () => {
    expect(scanOperator(":", 0)).toEqual({ type: "Punctuation", value: ":", end: 1 });
  });

  test("Should scan from an offset position", () => {
    expect(scanOperator("  +", 2)).toEqual({ type: "Operator", value: "+", end: 3 });
  });

  test("Should throw on unexpected character", () => {
    expect(() => scanOperator("@", 0)).toThrow("Unexpected character");
  });

  test("Should throw on # character", () => {
    expect(() => scanOperator("#", 0)).toThrow("Unexpected character");
  });

  test("Should not consume beyond the operator", () => {
    expect(scanOperator("<=5", 0)).toEqual({ type: "Operator", value: "<=", end: 2 });
  });

  test("Should distinguish ! from != based on lookahead", () => {
    expect(scanOperator("!x", 0)).toEqual({ type: "Operator", value: "!", end: 1 });
  });

  test("Should distinguish * from ** based on lookahead", () => {
    expect(scanOperator("*x", 0)).toEqual({ type: "Operator", value: "*", end: 1 });
  });

  test("Should distinguish .. from ... (only two dots is a dot)", () => {
    expect(scanOperator("..", 0)).toEqual({ type: "Punctuation", value: ".", end: 1 });
  });
});
