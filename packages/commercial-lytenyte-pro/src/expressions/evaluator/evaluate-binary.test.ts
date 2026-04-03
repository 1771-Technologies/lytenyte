import { describe, test, expect } from "vitest";
import { Evaluator } from "./evaluate.js";
import { evaluateBinary } from "./evaluate-binary.js";
import { standardPlugins } from "../plugins/standard.js";

const evaluator = new Evaluator(standardPlugins);
const evaluate = (expr: string, ctx?: Record<string, unknown>) => evaluator.run(expr, ctx);

describe("evaluateBinary", () => {
  test("Should evaluate addition", () => {
    expect(evaluate("a + b", { a: 1, b: 2 })).toBe(3);
  });

  test("Should evaluate subtraction", () => {
    expect(evaluate("a - b", { a: 5, b: 3 })).toBe(2);
  });

  test("Should evaluate multiplication", () => {
    expect(evaluate("a * b", { a: 3, b: 4 })).toBe(12);
  });

  test("Should evaluate division", () => {
    expect(evaluate("a / b", { a: 10, b: 2 })).toBe(5);
  });

  test("Should evaluate modulus", () => {
    expect(evaluate("a % b", { a: 7, b: 3 })).toBe(1);
  });

  test("Should evaluate exponentiation", () => {
    expect(evaluate("a ** b", { a: 2, b: 8 })).toBe(256);
  });

  test("Should evaluate less than", () => {
    expect(evaluate("a < b", { a: 1, b: 2 })).toBe(true);
    expect(evaluate("a < b", { a: 2, b: 1 })).toBe(false);
  });

  test("Should evaluate greater than", () => {
    expect(evaluate("a > b", { a: 2, b: 1 })).toBe(true);
  });

  test("Should evaluate less than or equal", () => {
    expect(evaluate("a <= b", { a: 2, b: 2 })).toBe(true);
  });

  test("Should evaluate greater than or equal", () => {
    expect(evaluate("a >= b", { a: 3, b: 2 })).toBe(true);
  });

  test("Should evaluate strict equality", () => {
    expect(evaluate("a == b", { a: 1, b: 1 })).toBe(true);
    expect(evaluate("a == b", { a: 1, b: 2 })).toBe(false);
  });

  test("Should evaluate strict inequality", () => {
    expect(evaluate("a != b", { a: 1, b: 2 })).toBe(true);
    expect(evaluate("a != b", { a: 1, b: 1 })).toBe(false);
  });

  test("Should evaluate in operator", () => {
    expect(evaluate("key in obj", { key: "a", obj: { a: 1, b: 2 } })).toBe(true);
  });

  test("Should evaluate not in operator", () => {
    expect(evaluate("key not in obj", { key: "c", obj: { a: 1 } })).toBe(true);
  });

  test("Should short-circuit AND", () => {
    let called = false;
    const fn = () => {
      called = true;
      return 1;
    };
    evaluate("false && fn()", { fn });
    expect(called).toBe(false);
  });

  test("Should short-circuit OR", () => {
    let called = false;
    const fn = () => {
      called = true;
      return 1;
    };
    evaluate("true || fn()", { fn });
    expect(called).toBe(false);
  });

  test("Should short-circuit nullish coalescing", () => {
    let called = false;
    const fn = () => {
      called = true;
      return 1;
    };
    evaluate("0 ?? fn()", { fn });
    expect(called).toBe(false);
  });

  test("Should throw on unknown binary operator", () => {
    const node = {
      type: "BinaryExpression" as const,
      operator: "***" as any,
      left: { type: "NumberLiteral" as const, value: 1, start: 0, end: 1 },
      right: { type: "NumberLiteral" as const, value: 2, start: 4, end: 5 },
      start: 0,
      end: 5,
    };
    expect(() => evaluateBinary(node, {}, 0)).toThrow("Unknown binary operator: ***");
  });
});
