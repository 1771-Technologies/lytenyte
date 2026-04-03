import { describe, test, expect } from "vitest";
import { compile } from "./compile.js";
import type { ASTNode } from "../parser/types";

describe("compile", () => {
  test("Should return optimized AST", () => {
    const ast: ASTNode = {
      type: "BinaryExpression",
      operator: "+",
      left: { type: "NumberLiteral", value: 1, start: 0, end: 1 },
      right: { type: "NumberLiteral", value: 2, start: 4, end: 5 },
      start: 0,
      end: 5,
    };
    expect(compile(ast)).toMatchObject({
      type: "NumberLiteral",
      value: 3,
    });
  });

  test("Should pass through leaf nodes unchanged", () => {
    const ast: ASTNode = { type: "Identifier", name: "x", start: 0, end: 1 };
    expect(compile(ast)).toBe(ast);
  });
});
