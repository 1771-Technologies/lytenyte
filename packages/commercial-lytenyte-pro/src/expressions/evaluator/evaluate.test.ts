import { describe, test, expect } from "vitest";
import { Evaluator, evaluateNode } from "./evaluate.js";
import { standardPlugins } from "../plugins/standard.js";

const evaluator = new Evaluator(standardPlugins);
const evaluate = (expr: string, ctx?: Record<string, unknown>) =>
  evaluator.run(expr, ctx, { undefinedIdentifierFallback: undefined });

describe("Evaluator", () => {
  test("Should evaluate a number literal", () => {
    expect(evaluate("42")).toBe(42);
  });

  test("Should evaluate a string literal", () => {
    expect(evaluate('"hello"')).toBe("hello");
  });

  test("Should evaluate a boolean literal", () => {
    expect(evaluate("true")).toBe(true);
    expect(evaluate("false")).toBe(false);
  });

  test("Should evaluate null", () => {
    expect(evaluate("null")).toBe(null);
  });

  test("Should evaluate undefined", () => {
    expect(evaluate("undefined")).toBe(undefined);
  });

  test("Should evaluate an identifier from context", () => {
    expect(evaluate("x", { x: 10 })).toBe(10);
  });

  test("Should return undefined for missing identifier", () => {
    expect(evaluate("x")).toBe(undefined);
  });

  test("Should evaluate arithmetic", () => {
    expect(evaluate("2 + 3")).toBe(5);
    expect(evaluate("10 - 4")).toBe(6);
    expect(evaluate("3 * 7")).toBe(21);
    expect(evaluate("15 / 3")).toBe(5);
    expect(evaluate("7 % 3")).toBe(1);
    expect(evaluate("2 ** 10")).toBe(1024);
  });

  test("Should evaluate string concatenation", () => {
    expect(evaluate('"hello" + " world"')).toBe("hello world");
  });

  test("Should evaluate comparison operators", () => {
    expect(evaluate("1 < 2")).toBe(true);
    expect(evaluate("2 > 1")).toBe(true);
    expect(evaluate("2 <= 2")).toBe(true);
    expect(evaluate("3 >= 2")).toBe(true);
    expect(evaluate("1 == 1")).toBe(true);
    expect(evaluate("1 != 2")).toBe(true);
    expect(evaluate("1 == 2")).toBe(false);
  });

  test("Should use strict equality", () => {
    expect(evaluate("1 == 1")).toBe(true);
    expect(evaluate("null == undefined")).toBe(false);
  });

  test("Should evaluate logical AND with short-circuit", () => {
    expect(evaluate("true && 42")).toBe(42);
    expect(evaluate("false && 42")).toBe(false);
  });

  test("Should evaluate logical OR with short-circuit", () => {
    expect(evaluate("false || 42")).toBe(42);
    expect(evaluate("true || 42")).toBe(true);
  });

  test("Should evaluate nullish coalescing with short-circuit", () => {
    expect(evaluate("null ?? 5")).toBe(5);
    expect(evaluate("undefined ?? 5")).toBe(5);
    expect(evaluate("0 ?? 5")).toBe(0);
    expect(evaluate("false ?? 5")).toBe(false);
  });

  test("Should evaluate in operator", () => {
    expect(evaluate('"a" in obj', { obj: { a: 1 } })).toBe(true);
    expect(evaluate('"b" in obj', { obj: { a: 1 } })).toBe(false);
  });

  test("Should evaluate not in operator", () => {
    expect(evaluate('"b" not in obj', { obj: { a: 1 } })).toBe(true);
    expect(evaluate('"a" not in obj', { obj: { a: 1 } })).toBe(false);
  });

  test("Should evaluate unary operators", () => {
    expect(evaluate("!true")).toBe(false);
    expect(evaluate("!false")).toBe(true);
    expect(evaluate("-5")).toBe(-5);
    expect(evaluate("+5")).toBe(5);
  });

  test("Should evaluate ternary expression", () => {
    expect(evaluate("true ? 1 : 2")).toBe(1);
    expect(evaluate("false ? 1 : 2")).toBe(2);
  });

  test("Should evaluate member access", () => {
    expect(evaluate("user.name", { user: { name: "Alice" } })).toBe("Alice");
  });

  test("Should evaluate computed member access", () => {
    expect(evaluate('user["name"]', { user: { name: "Alice" } })).toBe("Alice");
    expect(evaluate("arr[0]", { arr: [10, 20, 30] })).toBe(10);
  });

  test("Should evaluate optional chaining", () => {
    expect(evaluate("user?.name", { user: { name: "Alice" } })).toBe("Alice");
    expect(evaluate("user?.name", { user: null })).toBe(undefined);
    expect(evaluate("user?.name", {})).toBe(undefined);
  });

  test("Should evaluate function calls", () => {
    expect(evaluate("double(5)", { double: (x: number) => x * 2 })).toBe(10);
  });

  test("Should evaluate method calls with this binding", () => {
    expect(evaluate('"hello".toUpperCase()')).toBe("HELLO");
    expect(evaluate('"hello world".split(" ")')).toEqual(["hello", "world"]);
  });

  test("Should evaluate pipe as last argument", () => {
    expect(evaluate("5 |> double", { double: (x: number) => x * 2 })).toBe(10);
  });

  test("Should evaluate pipe with call as last argument", () => {
    const add = (a: number, b: number) => a + b;
    expect(evaluate("10 |> add(5)", { add })).toBe(15);
  });

  test("Should evaluate chained pipes", () => {
    const double = (x: number) => x * 2;
    const inc = (x: number) => x + 1;
    expect(evaluate("3 |> double |> inc", { double, inc })).toBe(7);
  });

  test("Should evaluate array literal", () => {
    expect(evaluate("[1, 2, 3]")).toEqual([1, 2, 3]);
  });

  test("Should evaluate array with spread", () => {
    expect(evaluate("[1, ...rest, 4]", { rest: [2, 3] })).toEqual([1, 2, 3, 4]);
  });

  test("Should evaluate object literal", () => {
    expect(evaluate('{ name: "Alice", age: 30 }')).toEqual({ name: "Alice", age: 30 });
  });

  test("Should evaluate object with shorthand properties", () => {
    expect(evaluate("{ x }", { x: 42 })).toEqual({ x: 42 });
  });

  test("Should evaluate object with computed keys", () => {
    expect(evaluate("{ [key]: 1 }", { key: "foo" })).toEqual({ foo: 1 });
  });

  test("Should evaluate template literal", () => {
    expect(evaluate("`hello ${name}`", { name: "world" })).toBe("hello world");
  });

  test("Should evaluate template with expression", () => {
    expect(evaluate("`${1 + 2}`")).toBe("3");
  });

  test("Should evaluate arrow function and call it", () => {
    const fn = evaluate("x => x * 2") as Function;
    expect(fn(5)).toBe(10);
  });

  test("Should evaluate multi-param arrow function", () => {
    const fn = evaluate("(a, b) => a + b") as Function;
    expect(fn(3, 4)).toBe(7);
  });

  test("Should evaluate arrow function in pipe", () => {
    const map = (fn: any, arr: number[]) => arr.map(fn);
    expect(evaluate("[1, 2, 3] |> map(x => x * 2)", { map })).toEqual([2, 4, 6]);
  });

  test("Should evaluate complex expression", () => {
    const ctx = {
      user: { name: "Alice", age: 30 },
    };
    expect(evaluate("user.age >= 18 ? user.name : null", ctx)).toBe("Alice");
  });

  test("Should evaluate nested member access", () => {
    const ctx = { a: { b: { c: 42 } } };
    expect(evaluate("a.b.c", ctx)).toBe(42);
  });

  test("Should evaluate precedence correctly", () => {
    expect(evaluate("2 + 3 * 4")).toBe(14);
    expect(evaluate("(2 + 3) * 4")).toBe(20);
  });

  test("Should accept an AST node directly", () => {
    expect(evaluator.run({ type: "NumberLiteral", value: 99, start: 0, end: 2 } as any)).toBe(99);
  });

  test("Should return AST via ast()", () => {
    const node = evaluator.ast("1 + 2");
    expect(node).toMatchObject({ type: "NumberLiteral", value: 3 });
  });

  test("Should return tokens via tokens()", () => {
    const tokens = evaluator.tokens("1 + 2");
    expect(tokens).toMatchObject([
      { type: "Number", value: "1" },
      { type: "Operator", value: "+" },
      { type: "Number", value: "2" },
      { type: "EOF" },
    ]);
  });

  test("Should work without plugins", () => {
    const core = new Evaluator();
    expect(core.run("2 + 3 * 4")).toBe(14);
  });

  test("Should throw on max depth exceeded", () => {
    const node = { type: "NumberLiteral" as const, value: 1, start: 0, end: 1 };
    expect(() => evaluateNode(node, {}, 1001)).toThrow("Maximum evaluation depth exceeded");
  });

  test("Should throw on spread element outside array", () => {
    expect(() =>
      evaluator.run({
        type: "SpreadElement",
        argument: { type: "Identifier", name: "x", start: 3, end: 4 },
        start: 0,
        end: 4,
      } as any),
    ).toThrow("Unexpected spread element outside of array literal");
  });

  test("Should throw on unknown node type without plugins", () => {
    const node = { type: "FooBar", start: 0, end: 1 } as any;
    expect(() => evaluateNode(node, {}, 0)).toThrow("Unknown node type: FooBar");
  });

  test("Should throw on unknown node type when plugin declines", () => {
    const plugin = { name: "noop", evaluate: () => null };
    const node = { type: "FooBar", start: 0, end: 1 } as any;
    expect(() => evaluateNode(node, {}, 0, [plugin])).toThrow("Unknown node type: FooBar");
  });

  test("Should use plugin evaluate hook for custom node types", () => {
    const plugin = {
      name: "test",
      evaluate: (node: any, _ctx: any, _eval: any) => {
        if (node.type === "CustomNode") return { value: node.data };
        return null;
      },
    };
    const node = { type: "CustomNode", data: 123, start: 0, end: 1 } as any;
    expect(evaluateNode(node, {}, 0, [plugin])).toBe(123);
  });

  test("Should pass working evaluate function to plugin evaluate hook", () => {
    const plugin = {
      name: "test",
      evaluate: (node: any, ctx: any, evalFn: any) => {
        if (node.type === "WrapperNode") {
          return { value: evalFn(node.inner, ctx) };
        }
        return null;
      },
    };
    const node = {
      type: "WrapperNode",
      inner: { type: "NumberLiteral", value: 42, start: 0, end: 2 },
      start: 0,
      end: 2,
    } as any;
    expect(evaluateNode(node, {}, 0, [plugin])).toBe(42);
  });

  test("Should skip plugin without evaluate hook", () => {
    const noEvalPlugin = { name: "no-eval" };
    const evalPlugin = {
      name: "has-eval",
      evaluate: (node: any) => {
        if (node.type === "CustomNode") return { value: 99 };
        return null;
      },
    };
    const node = { type: "CustomNode", start: 0, end: 1 } as any;
    expect(evaluateNode(node, {}, 0, [noEvalPlugin, evalPlugin])).toBe(99);
  });
});
