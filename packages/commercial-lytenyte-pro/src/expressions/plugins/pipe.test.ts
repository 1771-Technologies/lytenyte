import { describe, test, expect } from "vitest";
import { pipePlugin } from "./pipe.js";
import { tokenize } from "../lexer/tokenize/tokenize.js";
import type { ParserContext } from "../parser/parser-context";

function makeCtx(source: string): ParserContext {
  return { tokens: tokenize(source), pos: 0, source, depth: 0 };
}

describe("pipePlugin", () => {
  test("Should have name 'pipe'", () => {
    expect(pipePlugin.name).toBe("pipe");
  });

  test("infixPrecedence should return 5 for |>", () => {
    const ctx = makeCtx("|>");
    expect(pipePlugin.infixPrecedence!(ctx)).toBe(5);
  });

  test("infixPrecedence should return undefined for non-pipe tokens", () => {
    const ctx = makeCtx("+");
    expect(pipePlugin.infixPrecedence!(ctx)).toBeUndefined();
  });

  test("parseInfix should return null for non-pipe tokens", () => {
    const ctx = makeCtx("+");
    const left = { type: "Identifier", name: "x", start: 0, end: 1 } as any;
    expect(pipePlugin.parseInfix!(ctx, left, 0)).toBeNull();
  });

  test("parseInfix should return null when pipe precedence < minPrec", () => {
    const ctx = makeCtx("|> fn");
    const left = { type: "Identifier", name: "x", start: 0, end: 1 } as any;
    expect(pipePlugin.parseInfix!(ctx, left, 100)).toBeNull();
  });

  test("optimize should return null for non-pipe nodes", () => {
    const node = { type: "NumberLiteral", value: 1, start: 0, end: 1 } as any;
    expect(pipePlugin.optimize!(node, (n) => n)).toBeNull();
  });

  test("optimize should recurse into PipeExpression children", () => {
    const node = {
      type: "PipeExpression",
      input: { type: "Identifier", name: "x", start: 0, end: 1 },
      transform: { type: "Identifier", name: "fn", start: 5, end: 7 },
      start: 0,
      end: 7,
    } as any;
    const result = pipePlugin.optimize!(node, (n) => n) as any;
    expect(result.type).toBe("PipeExpression");
  });

  test("evaluate should return null for non-pipe nodes", () => {
    const node = { type: "NumberLiteral", value: 1, start: 0, end: 1 } as any;
    expect(pipePlugin.evaluate!(node, {}, () => {})).toBeNull();
  });

  test("evaluate should call function with input for simple transform", () => {
    const node = {
      type: "PipeExpression",
      input: { type: "NumberLiteral", value: 5, start: 0, end: 1 },
      transform: { type: "Identifier", name: "double", start: 5, end: 11 },
      start: 0,
      end: 11,
    } as any;
    const evalFn = (n: any) => {
      if (n.type === "NumberLiteral") return n.value;
      if (n.type === "Identifier") return (x: number) => x * 2;
    };
    expect(pipePlugin.evaluate!(node, {}, evalFn)).toEqual({ value: 10 });
  });

  test("evaluate should append input as last arg for CallExpression transform", () => {
    const node = {
      type: "PipeExpression",
      input: { type: "NumberLiteral", value: 10, start: 0, end: 2 },
      transform: {
        type: "CallExpression",
        callee: { type: "Identifier", name: "add", start: 6, end: 9 },
        args: [{ type: "NumberLiteral", value: 5, start: 10, end: 11 }],
        start: 6,
        end: 12,
      },
      start: 0,
      end: 12,
    } as any;
    const evalFn = (n: any) => {
      if (n.type === "NumberLiteral") return n.value;
      if (n.type === "Identifier") return (a: number, b: number) => a + b;
    };
    expect(pipePlugin.evaluate!(node, {}, evalFn)).toEqual({ value: 15 });
  });
});
