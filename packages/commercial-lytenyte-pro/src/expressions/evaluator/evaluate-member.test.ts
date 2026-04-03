import { describe, test, expect } from "vitest";
import { Evaluator } from "./evaluate.js";
import { standardPlugins } from "../plugins/standard.js";

const evaluator = new Evaluator(standardPlugins);
const evaluate = (expr: string, ctx?: Record<string, unknown>) => evaluator.run(expr, ctx);

describe("evaluateMember", () => {
  test("Should evaluate dot notation access", () => {
    expect(evaluate("obj.name", { obj: { name: "Alice" } })).toBe("Alice");
  });

  test("Should evaluate chained dot access", () => {
    expect(evaluate("a.b.c", { a: { b: { c: 42 } } })).toBe(42);
  });

  test("Should evaluate bracket notation with string", () => {
    expect(evaluate('obj["key"]', { obj: { key: "value" } })).toBe("value");
  });

  test("Should evaluate bracket notation with number", () => {
    expect(evaluate("arr[1]", { arr: [10, 20, 30] })).toBe(20);
  });

  test("Should evaluate bracket notation with variable", () => {
    expect(evaluate("obj[key]", { obj: { x: 1 }, key: "x" })).toBe(1);
  });
});
