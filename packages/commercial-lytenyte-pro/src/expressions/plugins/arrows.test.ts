import { describe, test, expect } from "vitest";
import { arrowsPlugin } from "./arrows.js";
import { tokenize } from "../lexer/tokenize/tokenize.js";
import type { ParserContext } from "../parser/parser-context";
import { standardPlugins } from "./standard.js";

function makeCtx(source: string, plugins = standardPlugins): ParserContext {
  return { tokens: tokenize(source, plugins), pos: 0, source, depth: 0, plugins };
}

describe("arrowsPlugin", () => {
  test("Should have name 'arrows'", () => {
    expect(arrowsPlugin.name).toBe("arrows");
  });

  test("parsePrefix should return null for non-arrow tokens", () => {
    const ctx = makeCtx("42");
    expect(arrowsPlugin.parsePrefix!(ctx)).toBeNull();
  });

  test("parsePrefix should return null for identifier without =>", () => {
    const ctx = makeCtx("x + 1");
    expect(arrowsPlugin.parsePrefix!(ctx)).toBeNull();
  });

  test("parsePrefix should return null for ( without arrow params", () => {
    const ctx = makeCtx("(1 + 2)");
    expect(arrowsPlugin.parsePrefix!(ctx)).toBeNull();
  });

  test("parsePrefix should parse single-param arrow", () => {
    const ctx = makeCtx("x => x");
    const node = arrowsPlugin.parsePrefix!(ctx) as any;
    expect(node).toMatchObject({
      type: "ArrowFunctionExpression",
      params: ["x"],
      body: { type: "Identifier", name: "x" },
    });
  });

  test("parsePrefix should parse multi-param arrow", () => {
    const ctx = makeCtx("(a, b) => a");
    const node = arrowsPlugin.parsePrefix!(ctx) as any;
    expect(node).toMatchObject({
      type: "ArrowFunctionExpression",
      params: ["a", "b"],
    });
  });

  test("optimize should return null for non-arrow nodes", () => {
    const node = { type: "NumberLiteral", value: 1, start: 0, end: 1 } as any;
    expect(arrowsPlugin.optimize!(node, (n) => n)).toBeNull();
  });

  test("optimize should recurse into arrow body", () => {
    const node = {
      type: "ArrowFunctionExpression",
      params: ["x"],
      body: { type: "Identifier", name: "x", start: 5, end: 6 },
      start: 0,
      end: 6,
    } as any;
    const result = arrowsPlugin.optimize!(node, (n) => n) as any;
    expect(result.type).toBe("ArrowFunctionExpression");
  });

  test("evaluate should return null for non-arrow nodes", () => {
    const node = { type: "NumberLiteral", value: 1, start: 0, end: 1 } as any;
    expect(arrowsPlugin.evaluate!(node, {}, () => {})).toBeNull();
  });

  test("evaluate should create a callable function", () => {
    const node = {
      type: "ArrowFunctionExpression",
      params: ["x"],
      body: { type: "Identifier", name: "x", start: 5, end: 6 },
      start: 0,
      end: 6,
    } as any;
    const evalFn = (n: any, ctx: any) => {
      if (n.type === "Identifier") return ctx[n.name];
      return n.value;
    };
    const result = arrowsPlugin.evaluate!(node, {}, evalFn) as any;
    expect(result.value(42)).toBe(42);
  });
});
