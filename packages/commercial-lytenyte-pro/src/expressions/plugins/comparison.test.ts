import { describe, test, expect } from "vitest";
import { comparisonPlugin } from "./comparison.js";
import { tokenize } from "../lexer/tokenize/tokenize.js";
import type { ParserContext } from "../parser/parser-context";

function makeCtx(source: string): ParserContext {
  return { tokens: tokenize(source), pos: 0, source, depth: 0 };
}

describe("comparisonPlugin", () => {
  test("Should have name 'comparison'", () => {
    expect(comparisonPlugin.name).toBe("comparison");
  });

  test("infixPrecedence should return 30 for ==", () => {
    const ctx = makeCtx("==");
    expect(comparisonPlugin.infixPrecedence!(ctx)).toBe(30);
  });

  test("infixPrecedence should return 30 for !=", () => {
    const ctx = makeCtx("!=");
    expect(comparisonPlugin.infixPrecedence!(ctx)).toBe(30);
  });

  test("infixPrecedence should return 40 for <", () => {
    const ctx = makeCtx("<");
    expect(comparisonPlugin.infixPrecedence!(ctx)).toBe(40);
  });

  test("infixPrecedence should return 40 for >", () => {
    const ctx = makeCtx(">");
    expect(comparisonPlugin.infixPrecedence!(ctx)).toBe(40);
  });

  test("infixPrecedence should return 40 for <=", () => {
    const ctx = makeCtx("<=");
    expect(comparisonPlugin.infixPrecedence!(ctx)).toBe(40);
  });

  test("infixPrecedence should return 40 for >=", () => {
    const ctx = makeCtx(">=");
    expect(comparisonPlugin.infixPrecedence!(ctx)).toBe(40);
  });

  test("infixPrecedence should return undefined for non-comparison operators", () => {
    const ctx = makeCtx("+");
    expect(comparisonPlugin.infixPrecedence!(ctx)).toBeUndefined();
  });

  test("evaluate should return null for non-BinaryExpression", () => {
    const node = { type: "NumberLiteral", value: 1, start: 0, end: 1 } as any;
    expect(comparisonPlugin.evaluate!(node, {}, () => {})).toBeNull();
  });

  test("evaluate should return null for non-comparison operators", () => {
    const node = {
      type: "BinaryExpression",
      operator: "+",
      left: { type: "NumberLiteral", value: 1, start: 0, end: 1 },
      right: { type: "NumberLiteral", value: 2, start: 4, end: 5 },
      start: 0,
      end: 5,
    } as any;
    expect(comparisonPlugin.evaluate!(node, {}, () => {})).toBeNull();
  });

  test("evaluate should handle == with strict equality", () => {
    const node = {
      type: "BinaryExpression",
      operator: "==",
      left: { type: "NumberLiteral", value: 1, start: 0, end: 1 },
      right: { type: "NumberLiteral", value: 1, start: 5, end: 6 },
      start: 0,
      end: 6,
    } as any;
    const evalFn = (n: any) => n.value;
    expect(comparisonPlugin.evaluate!(node, {}, evalFn)).toEqual({ value: true });
  });

  test("evaluate should handle !=", () => {
    const node = {
      type: "BinaryExpression",
      operator: "!=",
      left: { type: "NumberLiteral", value: 1, start: 0, end: 1 },
      right: { type: "NumberLiteral", value: 2, start: 5, end: 6 },
      start: 0,
      end: 6,
    } as any;
    const evalFn = (n: any) => n.value;
    expect(comparisonPlugin.evaluate!(node, {}, evalFn)).toEqual({ value: true });
  });

  test("evaluate should handle < <= > >=", () => {
    const evalFn = (n: any) => n.value;
    const make = (op: string, l: number, r: number) =>
      ({
        type: "BinaryExpression",
        operator: op,
        left: { type: "NumberLiteral", value: l, start: 0, end: 1 },
        right: { type: "NumberLiteral", value: r, start: 4, end: 5 },
        start: 0,
        end: 5,
      }) as any;

    expect(comparisonPlugin.evaluate!(make("<", 1, 2), {}, evalFn)).toEqual({ value: true });
    expect(comparisonPlugin.evaluate!(make(">", 2, 1), {}, evalFn)).toEqual({ value: true });
    expect(comparisonPlugin.evaluate!(make("<=", 2, 2), {}, evalFn)).toEqual({ value: true });
    expect(comparisonPlugin.evaluate!(make(">=", 3, 2), {}, evalFn)).toEqual({ value: true });
  });
});
