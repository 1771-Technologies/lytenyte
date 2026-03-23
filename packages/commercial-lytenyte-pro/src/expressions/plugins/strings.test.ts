import { describe, test, expect } from "vitest";
import { stringsPlugin } from "./strings.js";
import { tokenize } from "../lexer/tokenize/tokenize.js";
import type { ParserContext } from "../parser/parser-context";
import { standardPlugins } from "./standard.js";

function makeCtx(source: string, plugins = standardPlugins): ParserContext {
  return { tokens: tokenize(source, plugins), pos: 0, source, depth: 0, plugins };
}

describe("stringsPlugin", () => {
  test("Should have name 'strings'", () => {
    expect(stringsPlugin.name).toBe("strings");
  });

  test("parsePrefix should return null for non-string tokens", () => {
    const ctx = makeCtx("42");
    expect(stringsPlugin.parsePrefix!(ctx)).toBeNull();
  });

  test("parsePrefix should parse a string literal", () => {
    const ctx = makeCtx('"hello"');
    const node = stringsPlugin.parsePrefix!(ctx);
    expect(node).toMatchObject({ type: "StringLiteral", value: "hello" });
  });

  test("parsePrefix should parse a template literal", () => {
    const ctx = makeCtx("`hello`");
    const node = stringsPlugin.parsePrefix!(ctx);
    expect(node).toMatchObject({ type: "TemplateLiteral" });
  });

  test("optimize should return null for non-template nodes", () => {
    const node = { type: "NumberLiteral", value: 1, start: 0, end: 1 } as any;
    expect(stringsPlugin.optimize!(node, (n) => n)).toBeNull();
  });

  test("optimize should optimize template literal expression parts", () => {
    const node = {
      type: "TemplateLiteral",
      parts: [
        { type: "StringLiteral", value: "x=", start: 0, end: 2 },
        {
          type: "BinaryExpression",
          operator: "+",
          left: { type: "NumberLiteral", value: 1, start: 3, end: 4 },
          right: { type: "NumberLiteral", value: 2, start: 5, end: 6 },
          start: 3,
          end: 6,
        },
      ],
      start: 0,
      end: 7,
    } as any;
    const result = stringsPlugin.optimize!(node, (n) => n) as any;
    expect(result.parts[0]).toMatchObject({ type: "StringLiteral", value: "x=" });
    expect(result.parts[1]).toMatchObject({ type: "BinaryExpression" });
  });

  test("evaluate should return null for non-string nodes", () => {
    const node = { type: "NumberLiteral", value: 1, start: 0, end: 1 } as any;
    expect(stringsPlugin.evaluate!(node, {}, () => {})).toBeNull();
  });

  test("evaluate should evaluate a StringLiteral", () => {
    const node = { type: "StringLiteral", value: "hi", start: 0, end: 4 } as any;
    expect(stringsPlugin.evaluate!(node, {}, () => {})).toEqual({ value: "hi" });
  });

  test("evaluate should evaluate a TemplateLiteral", () => {
    const node = {
      type: "TemplateLiteral",
      parts: [
        { type: "StringLiteral", value: "hello ", start: 0, end: 6 },
        { type: "Identifier", name: "name", start: 7, end: 11 },
      ],
      start: 0,
      end: 12,
    } as any;
    const evalFn = (n: any, _ctx: any) => (n.type === "Identifier" ? "world" : n.value);
    expect(stringsPlugin.evaluate!(node, {}, evalFn)).toEqual({ value: "hello world" });
  });
});
