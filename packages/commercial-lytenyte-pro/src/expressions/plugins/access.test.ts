import { describe, test, expect } from "vitest";
import { accessPlugin } from "./access.js";
import { tokenize } from "../lexer/tokenize/tokenize.js";
import type { ParserContext } from "../parser/parser-context";
import { standardPlugins } from "./standard.js";

function makeCtx(source: string, plugins = standardPlugins): ParserContext {
  return { tokens: tokenize(source, plugins), pos: 0, source, depth: 0, plugins };
}

describe("accessPlugin", () => {
  test("Should have name 'access'", () => {
    expect(accessPlugin.name).toBe("access");
  });

  test("parsePostfix should return null for non-access tokens", () => {
    const ctx = makeCtx("+");
    const node = { type: "Identifier", name: "a", start: 0, end: 1 } as any;
    expect(accessPlugin.parsePostfix!(ctx, node)).toBeNull();
  });

  test("optimize should return null for non-access nodes", () => {
    const node = { type: "NumberLiteral", value: 1, start: 0, end: 1 } as any;
    expect(accessPlugin.optimize!(node, (n) => n)).toBeNull();
  });

  test("optimize should recurse MemberExpression", () => {
    const node = {
      type: "MemberExpression",
      object: { type: "Identifier", name: "a", start: 0, end: 1 },
      property: { type: "Identifier", name: "b", start: 2, end: 3 },
      computed: false,
      start: 0,
      end: 3,
    } as any;
    const result = accessPlugin.optimize!(node, (n) => n) as any;
    expect(result.type).toBe("MemberExpression");
  });

  test("optimize should recurse computed MemberExpression property", () => {
    const node = {
      type: "MemberExpression",
      object: { type: "Identifier", name: "a", start: 0, end: 1 },
      property: { type: "NumberLiteral", value: 0, start: 2, end: 3 },
      computed: true,
      start: 0,
      end: 4,
    } as any;
    let optimized = false;
    const result = accessPlugin.optimize!(node, (n) => {
      if (n.type === "NumberLiteral") optimized = true;
      return n;
    }) as any;
    expect(result.type).toBe("MemberExpression");
    expect(optimized).toBe(true);
  });

  test("optimize should recurse OptionalMemberExpression", () => {
    const node = {
      type: "OptionalMemberExpression",
      object: { type: "Identifier", name: "a", start: 0, end: 1 },
      property: { type: "Identifier", name: "b", start: 3, end: 4 },
      computed: false,
      start: 0,
      end: 4,
    } as any;
    const result = accessPlugin.optimize!(node, (n) => n) as any;
    expect(result.type).toBe("OptionalMemberExpression");
  });

  test("optimize should recurse CallExpression", () => {
    const node = {
      type: "CallExpression",
      callee: { type: "Identifier", name: "fn", start: 0, end: 2 },
      args: [{ type: "NumberLiteral", value: 1, start: 3, end: 4 }],
      start: 0,
      end: 5,
    } as any;
    const result = accessPlugin.optimize!(node, (n) => n) as any;
    expect(result.type).toBe("CallExpression");
  });

  test("evaluate should return null for non-access nodes", () => {
    const node = { type: "NumberLiteral", value: 1, start: 0, end: 1 } as any;
    expect(accessPlugin.evaluate!(node, {}, () => {})).toBeNull();
  });

  test("evaluate should handle MemberExpression with dot access", () => {
    const node = {
      type: "MemberExpression",
      object: { type: "Identifier", name: "obj", start: 0, end: 3 },
      property: { type: "Identifier", name: "x", start: 4, end: 5 },
      computed: false,
      start: 0,
      end: 5,
    } as any;
    const evalFn = (n: any) => (n.type === "Identifier" && n.name === "obj" ? { x: 42 } : n);
    expect(accessPlugin.evaluate!(node, {}, evalFn)).toEqual({ value: 42 });
  });

  test("evaluate should handle computed MemberExpression", () => {
    const node = {
      type: "MemberExpression",
      object: { type: "Identifier", name: "arr", start: 0, end: 3 },
      property: { type: "NumberLiteral", value: 0, start: 4, end: 5 },
      computed: true,
      start: 0,
      end: 6,
    } as any;
    const evalFn = (n: any) => {
      if (n.type === "Identifier") return [10, 20];
      return n.value;
    };
    expect(accessPlugin.evaluate!(node, {}, evalFn)).toEqual({ value: 10 });
  });

  test("evaluate should handle OptionalMemberExpression with null object", () => {
    const node = {
      type: "OptionalMemberExpression",
      object: { type: "Identifier", name: "obj", start: 0, end: 3 },
      property: { type: "Identifier", name: "x", start: 5, end: 6 },
      computed: false,
      start: 0,
      end: 6,
    } as any;
    const evalFn = () => null;
    expect(accessPlugin.evaluate!(node, {}, evalFn)).toEqual({ value: undefined });
  });

  test("evaluate should handle OptionalMemberExpression with valid object", () => {
    const node = {
      type: "OptionalMemberExpression",
      object: { type: "Identifier", name: "obj", start: 0, end: 3 },
      property: { type: "Identifier", name: "x", start: 5, end: 6 },
      computed: false,
      start: 0,
      end: 6,
    } as any;
    const evalFn = (n: any) => (n.type === "Identifier" && n.name === "obj" ? { x: 99 } : n);
    expect(accessPlugin.evaluate!(node, {}, evalFn)).toEqual({ value: 99 });
  });

  test("evaluate should handle computed OptionalMemberExpression", () => {
    const node = {
      type: "OptionalMemberExpression",
      object: { type: "Identifier", name: "arr", start: 0, end: 3 },
      property: { type: "NumberLiteral", value: 1, start: 6, end: 7 },
      computed: true,
      start: 0,
      end: 8,
    } as any;
    const evalFn = (n: any) => {
      if (n.type === "Identifier") return [10, 20];
      return n.value;
    };
    expect(accessPlugin.evaluate!(node, {}, evalFn)).toEqual({ value: 20 });
  });

  test("evaluate should handle CallExpression", () => {
    const node = {
      type: "CallExpression",
      callee: { type: "Identifier", name: "fn", start: 0, end: 2 },
      args: [{ type: "NumberLiteral", value: 5, start: 3, end: 4 }],
      start: 0,
      end: 5,
    } as any;
    const evalFn = (n: any) => {
      if (n.type === "Identifier") return (x: number) => x * 2;
      return n.value;
    };
    expect(accessPlugin.evaluate!(node, {}, evalFn)).toEqual({ value: 10 });
  });

  test("evaluate should handle method call with this binding", () => {
    const node = {
      type: "CallExpression",
      callee: {
        type: "MemberExpression",
        object: { type: "Identifier", name: "obj", start: 0, end: 3 },
        property: { type: "Identifier", name: "greet", start: 4, end: 9 },
        computed: false,
        start: 0,
        end: 9,
      },
      args: [],
      start: 0,
      end: 11,
    } as any;
    const obj = {
      name: "Alice",
      greet() {
        return `Hi, ${this.name}`;
      },
    };
    const evalFn = (n: any) => {
      if (n.type === "Identifier") return obj;
      return n;
    };
    expect(accessPlugin.evaluate!(node, {}, evalFn)).toEqual({ value: "Hi, Alice" });
  });

  test("evaluate should handle optional method call with null object", () => {
    const node = {
      type: "CallExpression",
      callee: {
        type: "OptionalMemberExpression",
        object: { type: "Identifier", name: "obj", start: 0, end: 3 },
        property: { type: "Identifier", name: "fn", start: 5, end: 7 },
        computed: false,
        start: 0,
        end: 7,
      },
      args: [],
      start: 0,
      end: 9,
    } as any;
    const evalFn = () => null;
    expect(accessPlugin.evaluate!(node, {}, evalFn)).toEqual({ value: undefined });
  });

  test("evaluate should handle method call with computed property", () => {
    const node = {
      type: "CallExpression",
      callee: {
        type: "MemberExpression",
        object: { type: "Identifier", name: "obj", start: 0, end: 3 },
        property: { type: "StringLiteral", value: "greet", start: 4, end: 11 },
        computed: true,
        start: 0,
        end: 12,
      },
      args: [],
      start: 0,
      end: 14,
    } as any;
    const obj = {
      name: "Bob",
      greet() {
        return `Hi, ${this.name}`;
      },
    };
    const evalFn = (n: any) => {
      if (n.type === "Identifier") return obj;
      if (n.type === "StringLiteral") return n.value;
      return n;
    };
    expect(accessPlugin.evaluate!(node, {}, evalFn)).toEqual({ value: "Hi, Bob" });
  });
});
