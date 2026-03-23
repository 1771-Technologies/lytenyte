import { describe, test, expect } from "vitest";
import { Evaluator } from "./evaluate.js";
import { standardPlugins } from "../plugins/standard.js";

const evaluator = new Evaluator(standardPlugins);
const evaluate = (expr: string, ctx?: Record<string, unknown>) => evaluator.run(expr, ctx);

describe("evaluateConditional", () => {
  test("Should evaluate truthy branch", () => {
    expect(evaluate("x ? 1 : 2", { x: true })).toBe(1);
  });

  test("Should evaluate falsy branch", () => {
    expect(evaluate("x ? 1 : 2", { x: false })).toBe(2);
  });

  test("Should not evaluate unused branch", () => {
    let called = false;
    const fn = () => {
      called = true;
      return 0;
    };
    evaluate("true ? 1 : fn()", { fn });
    expect(called).toBe(false);
  });
});
