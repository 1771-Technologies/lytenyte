import { describe, test, expect } from "vitest";
import { Evaluator } from "./evaluate.js";
import { standardPlugins } from "../plugins/standard.js";

const evaluator = new Evaluator(standardPlugins);
const evaluate = (expr: string, ctx?: Record<string, unknown>) => evaluator.run(expr, ctx);

describe("evaluatePipe", () => {
  test("Should pipe value as sole argument to identifier", () => {
    const double = (x: number) => x * 2;
    expect(evaluate("5 |> double", { double })).toBe(10);
  });

  test("Should pipe value as last argument to call expression", () => {
    const add = (a: number, b: number) => a + b;
    expect(evaluate("10 |> add(5)", { add })).toBe(15);
  });

  test("Should chain multiple pipes", () => {
    const double = (x: number) => x * 2;
    const inc = (x: number) => x + 1;
    expect(evaluate("3 |> double |> inc", { double, inc })).toBe(7);
  });

  test("Should pipe with arrow function argument", () => {
    const map = (fn: any, arr: number[]) => arr.map(fn);
    expect(evaluate("[1, 2, 3] |> map(x => x * 10)", { map })).toEqual([10, 20, 30]);
  });

  test("Should pipe with multiple call arguments", () => {
    const slice = (start: number, end: number, arr: number[]) => arr.slice(start, end);
    expect(evaluate("[1, 2, 3, 4, 5] |> slice(1, 3)", { slice })).toEqual([2, 3]);
  });
});
