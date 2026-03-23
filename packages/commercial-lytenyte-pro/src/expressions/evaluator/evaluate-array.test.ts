import { describe, test, expect } from "vitest";
import { Evaluator } from "./evaluate.js";
import { standardPlugins } from "../plugins/standard.js";

const evaluator = new Evaluator(standardPlugins);
const evaluate = (expr: string, ctx?: Record<string, unknown>) => evaluator.run(expr, ctx);

describe("evaluateArray", () => {
  test("Should evaluate an empty array", () => {
    expect(evaluate("[]")).toEqual([]);
  });

  test("Should evaluate an array with elements", () => {
    expect(evaluate("[1, 2, 3]")).toEqual([1, 2, 3]);
  });

  test("Should evaluate an array with mixed types", () => {
    expect(evaluate('[1, "two", true]')).toEqual([1, "two", true]);
  });

  test("Should evaluate an array with expressions", () => {
    expect(evaluate("[a + 1, b * 2]", { a: 1, b: 3 })).toEqual([2, 6]);
  });

  test("Should evaluate an array with spread", () => {
    expect(evaluate("[...arr]", { arr: [1, 2, 3] })).toEqual([1, 2, 3]);
  });

  test("Should evaluate an array with spread and other elements", () => {
    expect(evaluate("[0, ...rest, 4]", { rest: [1, 2, 3] })).toEqual([0, 1, 2, 3, 4]);
  });
});
