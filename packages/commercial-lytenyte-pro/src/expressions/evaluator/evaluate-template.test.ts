import { describe, test, expect } from "vitest";
import { Evaluator } from "./evaluate.js";
import { standardPlugins } from "../plugins/standard.js";

const evaluator = new Evaluator(standardPlugins);
const evaluate = (expr: string, ctx?: Record<string, unknown>) => evaluator.run(expr, ctx);

describe("evaluateTemplate", () => {
  test("Should evaluate a plain template", () => {
    expect(evaluate("`hello`")).toBe("hello");
  });

  test("Should evaluate a template with interpolation", () => {
    expect(evaluate("`hello ${name}`", { name: "world" })).toBe("hello world");
  });

  test("Should evaluate a template with multiple interpolations", () => {
    expect(evaluate("`${a} and ${b}`", { a: "foo", b: "bar" })).toBe("foo and bar");
  });

  test("Should evaluate a template with expression interpolation", () => {
    expect(evaluate("`result: ${x + y}`", { x: 1, y: 2 })).toBe("result: 3");
  });

  test("Should evaluate an empty template", () => {
    expect(evaluate("``")).toBe("");
  });

  test("Should coerce non-string values to string", () => {
    expect(evaluate("`count: ${n}`", { n: 42 })).toBe("count: 42");
  });
});
