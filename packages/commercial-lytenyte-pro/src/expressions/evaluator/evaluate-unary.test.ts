import { describe, test, expect } from "vitest";
import { Evaluator } from "./evaluate.js";
import { evaluateUnary } from "./evaluate-unary.js";
import { standardPlugins } from "../plugins/standard.js";

const evaluator = new Evaluator(standardPlugins);
const evaluate = (expr: string, ctx?: Record<string, unknown>) => evaluator.run(expr, ctx);

describe("evaluateUnary", () => {
  test("Should evaluate logical NOT", () => {
    expect(evaluate("!x", { x: true })).toBe(false);
    expect(evaluate("!x", { x: false })).toBe(true);
  });

  test("Should evaluate numeric negation", () => {
    expect(evaluate("-x", { x: 5 })).toBe(-5);
  });

  test("Should evaluate numeric coercion", () => {
    expect(evaluate("+x", { x: "3" })).toBe(3);
  });

  test("Should throw on unknown unary operator", () => {
    expect(() => evaluateUnary("~" as any, 5)).toThrow("Unknown unary operator: ~");
  });
});
