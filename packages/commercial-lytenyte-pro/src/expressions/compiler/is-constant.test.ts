import { describe, test, expect } from "vitest";
import { isConstant } from "./is-constant.js";
import type { ASTNode } from "../parser/types";

function node(partial: ASTNode): ASTNode {
  return partial;
}

describe("isConstant", () => {
  test("Should return true for NumberLiteral", () => {
    expect(isConstant(node({ type: "NumberLiteral", value: 42, start: 0, end: 2 }))).toBe(true);
  });

  test("Should return true for StringLiteral", () => {
    expect(isConstant(node({ type: "StringLiteral", value: "hi", start: 0, end: 4 }))).toBe(true);
  });

  test("Should return true for BooleanLiteral", () => {
    expect(isConstant(node({ type: "BooleanLiteral", value: true, start: 0, end: 4 }))).toBe(true);
  });

  test("Should return true for NullLiteral", () => {
    expect(isConstant(node({ type: "NullLiteral", value: null, start: 0, end: 4 }))).toBe(true);
  });

  test("Should return false for Identifier", () => {
    expect(isConstant(node({ type: "Identifier", name: "x", start: 0, end: 1 }))).toBe(false);
  });

  test("Should return false for BinaryExpression", () => {
    expect(
      isConstant(
        node({
          type: "BinaryExpression",
          operator: "+",
          left: { type: "NumberLiteral", value: 1, start: 0, end: 1 },
          right: { type: "NumberLiteral", value: 2, start: 4, end: 5 },
          start: 0,
          end: 5,
        }),
      ),
    ).toBe(false);
  });

  test("Should return false for UndefinedLiteral", () => {
    expect(isConstant(node({ type: "UndefinedLiteral", value: undefined, start: 0, end: 9 }))).toBe(false);
  });
});
