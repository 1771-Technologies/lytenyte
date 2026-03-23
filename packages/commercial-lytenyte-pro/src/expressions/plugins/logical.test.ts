import { describe, test, expect } from "vitest";
import { logicalPlugin } from "./logical.js";
import { tokenize } from "../lexer/tokenize/tokenize.js";
import type { ParserContext } from "../parser/parser-context";

function makeCtx(source: string): ParserContext {
  return { tokens: tokenize(source), pos: 0, source, depth: 0 };
}

describe("logicalPlugin", () => {
  test("Should have name 'logical'", () => {
    expect(logicalPlugin.name).toBe("logical");
  });

  test("infixPrecedence should return 20 for &&", () => {
    const ctx = makeCtx("&&");
    expect(logicalPlugin.infixPrecedence!(ctx)).toBe(20);
  });

  test("infixPrecedence should return 10 for ||", () => {
    const ctx = makeCtx("||");
    expect(logicalPlugin.infixPrecedence!(ctx)).toBe(10);
  });

  test("infixPrecedence should return 25 for ??", () => {
    const ctx = makeCtx("??");
    expect(logicalPlugin.infixPrecedence!(ctx)).toBe(25);
  });

  test("infixPrecedence should return undefined for non-logical operators", () => {
    const ctx = makeCtx("+");
    expect(logicalPlugin.infixPrecedence!(ctx)).toBeUndefined();
  });

  test("parseInfix should return null for non-logical tokens", () => {
    const ctx = makeCtx("+");
    const left = { type: "Identifier", name: "a", start: 0, end: 1 } as any;
    expect(logicalPlugin.parseInfix!(ctx, left, 0)).toBeNull();
  });

  test("parseInfix should return null when precedence is below minPrec", () => {
    const ctx = makeCtx("||");
    const left = { type: "Identifier", name: "a", start: 0, end: 1 } as any;
    expect(logicalPlugin.parseInfix!(ctx, left, 100)).toBeNull();
  });

  test("parseUnary should return null for non-! tokens", () => {
    const ctx = makeCtx("+");
    expect(logicalPlugin.parseUnary!(ctx, () => ({}) as any)).toBeNull();
  });

  test("optimize should return null for non-logical nodes", () => {
    const node = { type: "NumberLiteral", value: 1, start: 0, end: 1 } as any;
    expect(logicalPlugin.optimize!(node, (n) => n)).toBeNull();
  });

  test("optimize should fold boolean negation", () => {
    const node = {
      type: "UnaryExpression",
      operator: "!",
      operand: { type: "BooleanLiteral", value: true, start: 1, end: 5 },
      start: 0,
      end: 5,
    } as any;
    expect(logicalPlugin.optimize!(node, (n) => n)).toMatchObject({
      type: "BooleanLiteral",
      value: false,
    });
  });

  test("optimize should preserve ! of non-boolean", () => {
    const node = {
      type: "UnaryExpression",
      operator: "!",
      operand: { type: "Identifier", name: "x", start: 1, end: 2 },
      start: 0,
      end: 2,
    } as any;
    const result = logicalPlugin.optimize!(node, (n) => n) as any;
    expect(result.type).toBe("UnaryExpression");
    expect(result.operator).toBe("!");
  });

  test("optimize should recurse into logical binary expressions", () => {
    const node = {
      type: "BinaryExpression",
      operator: "&&",
      left: { type: "Identifier", name: "a", start: 0, end: 1 },
      right: { type: "Identifier", name: "b", start: 5, end: 6 },
      start: 0,
      end: 6,
    } as any;
    const result = logicalPlugin.optimize!(node, (n) => n) as any;
    expect(result.type).toBe("BinaryExpression");
    expect(result.operator).toBe("&&");
  });

  test("optimize should recurse into || binary expressions", () => {
    const node = {
      type: "BinaryExpression",
      operator: "||",
      left: { type: "Identifier", name: "a", start: 0, end: 1 },
      right: { type: "Identifier", name: "b", start: 5, end: 6 },
      start: 0,
      end: 6,
    } as any;
    const result = logicalPlugin.optimize!(node, (n) => n) as any;
    expect(result.type).toBe("BinaryExpression");
    expect(result.operator).toBe("||");
  });

  test("optimize should recurse into ?? binary expressions", () => {
    const node = {
      type: "BinaryExpression",
      operator: "??",
      left: { type: "Identifier", name: "a", start: 0, end: 1 },
      right: { type: "Identifier", name: "b", start: 5, end: 6 },
      start: 0,
      end: 6,
    } as any;
    const result = logicalPlugin.optimize!(node, (n) => n) as any;
    expect(result.type).toBe("BinaryExpression");
    expect(result.operator).toBe("??");
  });

  test("evaluate should return null for non-logical nodes", () => {
    const node = { type: "NumberLiteral", value: 1, start: 0, end: 1 } as any;
    expect(logicalPlugin.evaluate!(node, {}, () => {})).toBeNull();
  });

  test("evaluate should return null for non-logical BinaryExpression operators", () => {
    const node = {
      type: "BinaryExpression",
      operator: "+",
      left: { type: "NumberLiteral", value: 1, start: 0, end: 1 },
      right: { type: "NumberLiteral", value: 2, start: 4, end: 5 },
      start: 0,
      end: 5,
    } as any;
    expect(logicalPlugin.evaluate!(node, {}, () => {})).toBeNull();
  });
});
