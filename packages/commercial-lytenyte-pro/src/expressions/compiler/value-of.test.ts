import { describe, test, expect } from "vitest";
import { valueOf } from "./value-of.js";
import type { ASTNode } from "../parser/types";

function node(partial: ASTNode): ASTNode {
  return partial;
}

describe("valueOf", () => {
  test("Should return the value of a NumberLiteral", () => {
    expect(valueOf(node({ type: "NumberLiteral", value: 42, start: 0, end: 2 }))).toBe(42);
  });

  test("Should return the value of a StringLiteral", () => {
    expect(valueOf(node({ type: "StringLiteral", value: "hello", start: 0, end: 7 }))).toBe("hello");
  });

  test("Should return the value of a BooleanLiteral", () => {
    expect(valueOf(node({ type: "BooleanLiteral", value: false, start: 0, end: 5 }))).toBe(false);
  });

  test("Should return null for NullLiteral", () => {
    expect(valueOf(node({ type: "NullLiteral", value: null, start: 0, end: 4 }))).toBe(null);
  });

  test("Should return undefined for non-literal nodes", () => {
    expect(valueOf(node({ type: "Identifier", name: "x", start: 0, end: 1 }))).toBe(undefined);
  });
});
