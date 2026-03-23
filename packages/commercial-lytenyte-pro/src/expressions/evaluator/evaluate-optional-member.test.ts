import { describe, test, expect } from "vitest";
import { Evaluator } from "./evaluate.js";
import { standardPlugins } from "../plugins/standard.js";

const evaluator = new Evaluator(standardPlugins);
const evaluate = (expr: string, ctx?: Record<string, unknown>) => evaluator.run(expr, ctx);

describe("evaluateOptionalMember", () => {
  test("Should return property when object exists", () => {
    expect(evaluate("obj?.name", { obj: { name: "Alice" } })).toBe("Alice");
  });

  test("Should return undefined when object is null", () => {
    expect(evaluate("obj?.name", { obj: null })).toBe(undefined);
  });

  test("Should return undefined when object is undefined", () => {
    expect(evaluate("obj?.name", {})).toBe(undefined);
  });

  test("Should evaluate computed optional member", () => {
    expect(evaluate('obj?.["name"]', { obj: { name: "Alice" } })).toBe("Alice");
  });

  test("Should return undefined for computed optional member on null", () => {
    expect(evaluate('obj?.["name"]', { obj: null })).toBe(undefined);
  });
});
