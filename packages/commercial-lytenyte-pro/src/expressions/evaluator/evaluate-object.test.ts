import { describe, test, expect } from "vitest";
import { Evaluator } from "./evaluate.js";
import { standardPlugins } from "../plugins/standard.js";

const evaluator = new Evaluator(standardPlugins);
const evaluate = (expr: string, ctx?: Record<string, unknown>) => evaluator.run(expr, ctx);

describe("evaluateObject", () => {
  test("Should evaluate empty object", () => {
    expect(evaluate("{}")).toEqual({});
  });

  test("Should evaluate object with identifier keys", () => {
    expect(evaluate("{ a: 1, b: 2 }")).toEqual({ a: 1, b: 2 });
  });

  test("Should evaluate object with string keys", () => {
    expect(evaluate('{ "name": "Alice" }')).toEqual({ name: "Alice" });
  });

  test("Should evaluate object with computed keys", () => {
    expect(evaluate("{ [k]: 1 }", { k: "foo" })).toEqual({ foo: 1 });
  });

  test("Should evaluate object with shorthand properties", () => {
    expect(evaluate("{ x, y }", { x: 1, y: 2 })).toEqual({ x: 1, y: 2 });
  });
});
