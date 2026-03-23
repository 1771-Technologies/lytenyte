import { describe, test, expect } from "vitest";
import { ternaryPlugin } from "./ternary.js";
import { tokenize } from "../lexer/tokenize/tokenize.js";
import type { ParserContext } from "../parser/parser-context";

function makeCtx(source: string): ParserContext {
  return { tokens: tokenize(source), pos: 0, source, depth: 0 };
}

describe("ternaryPlugin", () => {
  test("Should have name 'ternary'", () => {
    expect(ternaryPlugin.name).toBe("ternary");
  });

  test("infixPrecedence should return 1 for ?", () => {
    const ctx = makeCtx("?");
    expect(ternaryPlugin.infixPrecedence!(ctx)).toBe(1);
  });

  test("infixPrecedence should return undefined for non-? tokens", () => {
    const ctx = makeCtx("+");
    expect(ternaryPlugin.infixPrecedence!(ctx)).toBeUndefined();
  });

  test("parseInfix should return null for non-? tokens", () => {
    const ctx = makeCtx("+");
    const left = { type: "Identifier", name: "a", start: 0, end: 1 } as any;
    expect(ternaryPlugin.parseInfix!(ctx, left, 0)).toBeNull();
  });

  test("parseInfix should return null when ternary precedence < minPrec", () => {
    const ctx = makeCtx("? b : c");
    const left = { type: "Identifier", name: "a", start: 0, end: 1 } as any;
    expect(ternaryPlugin.parseInfix!(ctx, left, 100)).toBeNull();
  });

  test("optimize should return null for non-conditional nodes", () => {
    const node = { type: "NumberLiteral", value: 1, start: 0, end: 1 } as any;
    expect(ternaryPlugin.optimize!(node, (n) => n)).toBeNull();
  });

  test("evaluate should return null for non-conditional nodes", () => {
    const node = { type: "NumberLiteral", value: 1, start: 0, end: 1 } as any;
    expect(ternaryPlugin.evaluate!(node, {}, () => {})).toBeNull();
  });

  test("evaluate should evaluate truthy conditional", () => {
    const node = {
      type: "ConditionalExpression",
      test: { type: "BooleanLiteral", value: true, start: 0, end: 4 },
      consequent: { type: "NumberLiteral", value: 1, start: 7, end: 8 },
      alternate: { type: "NumberLiteral", value: 2, start: 11, end: 12 },
      start: 0,
      end: 12,
    } as any;
    const evalFn = (n: any) => n.value;
    expect(ternaryPlugin.evaluate!(node, {}, evalFn)).toEqual({ value: 1 });
  });

  test("evaluate should evaluate falsy conditional", () => {
    const node = {
      type: "ConditionalExpression",
      test: { type: "BooleanLiteral", value: false, start: 0, end: 5 },
      consequent: { type: "NumberLiteral", value: 1, start: 8, end: 9 },
      alternate: { type: "NumberLiteral", value: 2, start: 12, end: 13 },
      start: 0,
      end: 13,
    } as any;
    const evalFn = (n: any) => n.value;
    expect(ternaryPlugin.evaluate!(node, {}, evalFn)).toEqual({ value: 2 });
  });
});
