import { describe, test, expect } from "vitest";
import { Evaluator } from "./evaluate.js";
import { standardPlugins } from "../plugins/standard.js";

const evaluator = new Evaluator(standardPlugins);
const evaluate = (expr: string, ctx?: Record<string, unknown>) => evaluator.run(expr, ctx);

describe("evaluateCall", () => {
  test("Should call a function from context", () => {
    expect(evaluate("add(1, 2)", { add: (a: number, b: number) => a + b })).toBe(3);
  });

  test("Should call a method with this binding", () => {
    expect(evaluate('"hello".toUpperCase()')).toBe("HELLO");
  });

  test("Should call a method with arguments", () => {
    expect(evaluate('"hello world".slice(0, 5)')).toBe("hello");
  });

  test("Should call optional member method on null and return undefined", () => {
    expect(evaluate("obj?.method()", { obj: null })).toBe(undefined);
  });

  test("Should call optional member method when object exists", () => {
    const obj = { greet: () => "hi" };
    expect(evaluate("obj?.greet()", { obj })).toBe("hi");
  });

  test("Should call method with computed property callee", () => {
    const obj = { greet: () => "hi" };
    expect(evaluate('obj["greet"]()', { obj })).toBe("hi");
  });
});
