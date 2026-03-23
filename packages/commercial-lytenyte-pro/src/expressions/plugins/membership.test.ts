import { describe, test, expect } from "vitest";
import { membershipPlugin } from "./membership.js";
import { tokenize } from "../lexer/tokenize/tokenize.js";
import type { ParserContext } from "../parser/parser-context";
import { standardPlugins } from "./standard.js";

function makeCtx(source: string, plugins = standardPlugins): ParserContext {
  return { tokens: tokenize(source, plugins), pos: 0, source, depth: 0, plugins };
}

describe("membershipPlugin", () => {
  test("Should have name 'membership'", () => {
    expect(membershipPlugin.name).toBe("membership");
  });

  test("infixPrecedence should return 40 for 'in'", () => {
    const ctx = makeCtx("in x");
    expect(membershipPlugin.infixPrecedence!(ctx)).toBe(40);
  });

  test("infixPrecedence should return 40 for 'not in'", () => {
    const ctx = makeCtx("not in x");
    expect(membershipPlugin.infixPrecedence!(ctx)).toBe(40);
  });

  test("infixPrecedence should return undefined for 'not' without 'in' following", () => {
    // "not" followed by a non-"in" token
    const ctx = makeCtx("not x");
    expect(membershipPlugin.infixPrecedence!(ctx)).toBeUndefined();
  });

  test("infixPrecedence should return undefined for non-membership tokens", () => {
    const ctx = makeCtx("+");
    expect(membershipPlugin.infixPrecedence!(ctx)).toBeUndefined();
  });

  test("parseInfix should return null for non-membership tokens", () => {
    const ctx = makeCtx("+");
    const left = { type: "Identifier", name: "a", start: 0, end: 1 } as any;
    expect(membershipPlugin.parseInfix!(ctx, left, 0)).toBeNull();
  });

  test("parseInfix should return null for 'in' when precedence < minPrec", () => {
    const ctx = makeCtx("in x");
    const left = { type: "Identifier", name: "a", start: 0, end: 1 } as any;
    expect(membershipPlugin.parseInfix!(ctx, left, 100)).toBeNull();
  });

  test("parseInfix should return null for 'not in' when precedence < minPrec", () => {
    const ctx = makeCtx("not in x");
    const left = { type: "Identifier", name: "a", start: 0, end: 1 } as any;
    expect(membershipPlugin.parseInfix!(ctx, left, 100)).toBeNull();
  });

  test("parseInfix should return null for 'not' without 'in'", () => {
    const ctx = makeCtx("not x");
    const left = { type: "Identifier", name: "a", start: 0, end: 1 } as any;
    expect(membershipPlugin.parseInfix!(ctx, left, 0)).toBeNull();
  });

  test("evaluate should return null for non-BinaryExpression nodes", () => {
    const node = { type: "NumberLiteral", value: 1, start: 0, end: 1 } as any;
    expect(membershipPlugin.evaluate!(node, {}, () => {})).toBeNull();
  });

  test("evaluate should return null for non-membership operators", () => {
    const node = {
      type: "BinaryExpression",
      operator: "+",
      left: { type: "NumberLiteral", value: 1, start: 0, end: 1 },
      right: { type: "NumberLiteral", value: 2, start: 4, end: 5 },
      start: 0,
      end: 5,
    } as any;
    expect(membershipPlugin.evaluate!(node, {}, () => {})).toBeNull();
  });

  test("evaluate should handle 'in' operator", () => {
    const node = {
      type: "BinaryExpression",
      operator: "in",
      left: { type: "StringLiteral", value: "a", start: 0, end: 3 },
      right: { type: "Identifier", name: "obj", start: 7, end: 10 },
      start: 0,
      end: 10,
    } as any;
    const evalFn = (n: any) => {
      if (n.type === "StringLiteral") return n.value;
      if (n.type === "Identifier") return { a: 1 };
    };
    expect(membershipPlugin.evaluate!(node, {}, evalFn)).toEqual({ value: true });
  });

  test("evaluate should handle 'not in' operator", () => {
    const node = {
      type: "BinaryExpression",
      operator: "not in",
      left: { type: "StringLiteral", value: "b", start: 0, end: 3 },
      right: { type: "Identifier", name: "obj", start: 11, end: 14 },
      start: 0,
      end: 14,
    } as any;
    const evalFn = (n: any) => {
      if (n.type === "StringLiteral") return n.value;
      if (n.type === "Identifier") return { a: 1 };
    };
    expect(membershipPlugin.evaluate!(node, {}, evalFn)).toEqual({ value: true });
  });
});
