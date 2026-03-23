import { describe, test, expect } from "vitest";
import { collectionsPlugin } from "./collections.js";
import { tokenize } from "../lexer/tokenize/tokenize.js";
import type { ParserContext } from "../parser/parser-context";
import { standardPlugins } from "./standard.js";

function makeCtx(source: string, plugins = standardPlugins): ParserContext {
  return { tokens: tokenize(source, plugins), pos: 0, source, depth: 0, plugins };
}

describe("collectionsPlugin", () => {
  test("Should have name 'collections'", () => {
    expect(collectionsPlugin.name).toBe("collections");
  });

  test("parsePrefix should return null for non-collection tokens", () => {
    const ctx = makeCtx("42");
    expect(collectionsPlugin.parsePrefix!(ctx)).toBeNull();
  });

  test("parsePrefix should parse array literal", () => {
    const ctx = makeCtx("[1]");
    const node = collectionsPlugin.parsePrefix!(ctx) as any;
    expect(node).toMatchObject({ type: "ArrayLiteral" });
  });

  test("parsePrefix should parse object literal", () => {
    const ctx = makeCtx("{ x: 1 }");
    const node = collectionsPlugin.parsePrefix!(ctx) as any;
    expect(node).toMatchObject({ type: "ObjectLiteral" });
  });

  test("parsePrefix should parse spread element", () => {
    const ctx = makeCtx("...arr");
    const node = collectionsPlugin.parsePrefix!(ctx) as any;
    expect(node).toMatchObject({ type: "SpreadElement" });
  });

  test("optimize should return null for non-collection nodes", () => {
    const node = { type: "NumberLiteral", value: 1, start: 0, end: 1 } as any;
    expect(collectionsPlugin.optimize!(node, (n) => n)).toBeNull();
  });

  test("optimize should recurse into ArrayLiteral elements", () => {
    const node = {
      type: "ArrayLiteral",
      elements: [{ type: "NumberLiteral", value: 1, start: 1, end: 2 }],
      start: 0,
      end: 3,
    } as any;
    const result = collectionsPlugin.optimize!(node, (n) => n) as any;
    expect(result.type).toBe("ArrayLiteral");
  });

  test("optimize should recurse into ObjectLiteral properties", () => {
    const node = {
      type: "ObjectLiteral",
      properties: [
        {
          key: { type: "Identifier", name: "x", start: 2, end: 3 },
          value: { type: "NumberLiteral", value: 1, start: 5, end: 6 },
          computed: false,
        },
      ],
      start: 0,
      end: 8,
    } as any;
    const result = collectionsPlugin.optimize!(node, (n) => n) as any;
    expect(result.type).toBe("ObjectLiteral");
  });

  test("optimize should recurse into ObjectLiteral computed keys", () => {
    const node = {
      type: "ObjectLiteral",
      properties: [
        {
          key: { type: "Identifier", name: "k", start: 2, end: 3 },
          value: { type: "NumberLiteral", value: 1, start: 6, end: 7 },
          computed: true,
        },
      ],
      start: 0,
      end: 9,
    } as any;
    let keyOptimized = false;
    collectionsPlugin.optimize!(node, (n) => {
      if (n.type === "Identifier" && (n as any).name === "k") keyOptimized = true;
      return n;
    });
    expect(keyOptimized).toBe(true);
  });

  test("evaluate should return null for non-collection nodes", () => {
    const node = { type: "NumberLiteral", value: 1, start: 0, end: 1 } as any;
    expect(collectionsPlugin.evaluate!(node, {}, () => {})).toBeNull();
  });

  test("evaluate should evaluate ArrayLiteral", () => {
    const node = {
      type: "ArrayLiteral",
      elements: [
        { type: "NumberLiteral", value: 1, start: 1, end: 2 },
        { type: "NumberLiteral", value: 2, start: 4, end: 5 },
      ],
      start: 0,
      end: 6,
    } as any;
    const evalFn = (n: any) => n.value;
    expect(collectionsPlugin.evaluate!(node, {}, evalFn)).toEqual({ value: [1, 2] });
  });

  test("evaluate should evaluate ArrayLiteral with spread", () => {
    const node = {
      type: "ArrayLiteral",
      elements: [
        {
          type: "SpreadElement",
          argument: { type: "Identifier", name: "arr", start: 4, end: 7 },
          start: 1,
          end: 7,
        },
      ],
      start: 0,
      end: 8,
    } as any;
    const evalFn = (n: any) => {
      if (n.type === "Identifier") return [10, 20];
      return n.value;
    };
    expect(collectionsPlugin.evaluate!(node, {}, evalFn)).toEqual({ value: [10, 20] });
  });

  test("evaluate should evaluate ObjectLiteral", () => {
    const node = {
      type: "ObjectLiteral",
      properties: [
        {
          key: { type: "Identifier", name: "x", start: 2, end: 3 },
          value: { type: "NumberLiteral", value: 42, start: 5, end: 7 },
          computed: false,
        },
      ],
      start: 0,
      end: 9,
    } as any;
    const evalFn = (n: any) => n.value ?? n.name;
    expect(collectionsPlugin.evaluate!(node, {}, evalFn)).toEqual({ value: { x: 42 } });
  });

  test("evaluate should evaluate ObjectLiteral with computed key", () => {
    const node = {
      type: "ObjectLiteral",
      properties: [
        {
          key: { type: "Identifier", name: "k", start: 2, end: 3 },
          value: { type: "NumberLiteral", value: 1, start: 6, end: 7 },
          computed: true,
        },
      ],
      start: 0,
      end: 9,
    } as any;
    const evalFn = (n: any) => {
      if (n.type === "Identifier") return "foo";
      return n.value;
    };
    expect(collectionsPlugin.evaluate!(node, {}, evalFn)).toEqual({ value: { foo: 1 } });
  });

  test("evaluate should evaluate ObjectLiteral with string key", () => {
    const node = {
      type: "ObjectLiteral",
      properties: [
        {
          key: { type: "StringLiteral", value: "name", start: 2, end: 8 },
          value: { type: "NumberLiteral", value: 1, start: 10, end: 11 },
          computed: false,
        },
      ],
      start: 0,
      end: 13,
    } as any;
    const evalFn = (n: any) => n.value;
    expect(collectionsPlugin.evaluate!(node, {}, evalFn)).toEqual({ value: { name: 1 } });
  });
});
