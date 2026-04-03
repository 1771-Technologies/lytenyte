import { describe, test, expect } from "vitest";
import { Evaluator } from "./evaluate.js";
import { standardPlugins } from "../plugins/standard.js";

const evaluator = new Evaluator(standardPlugins);
const evaluate = (expr: string, ctx?: Record<string, unknown>) => evaluator.run(expr, ctx);

describe("evaluateArrow", () => {
  test("Should return a callable function", () => {
    const fn = evaluate("x => x + 1") as Function;
    expect(typeof fn).toBe("function");
    expect(fn(5)).toBe(6);
  });

  test("Should support multiple parameters", () => {
    const fn = evaluate("(a, b) => a * b") as Function;
    expect(fn(3, 4)).toBe(12);
  });

  test("Should support zero parameters", () => {
    const fn = evaluate("() => 42") as Function;
    expect(fn()).toBe(42);
  });

  test("Should capture parent context", () => {
    const fn = evaluate("x => x + offset", { offset: 10 }) as Function;
    expect(fn(5)).toBe(15);
  });

  test("Should shadow parent context with params", () => {
    const fn = evaluate("x => x + 1", { x: 999 }) as Function;
    expect(fn(5)).toBe(6);
  });
});
