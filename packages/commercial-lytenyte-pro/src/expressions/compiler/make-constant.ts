import type { ASTNode } from "../parser/types.js";

export function makeConstant(value: unknown, start: number, end: number): ASTNode {
  if (typeof value === "number") return { type: "NumberLiteral", value, start, end };
  if (typeof value === "string") return { type: "StringLiteral", value, start, end };
  if (typeof value === "boolean") return { type: "BooleanLiteral", value, start, end };
  if (value === null) return { type: "NullLiteral", value: null, start, end };
  return { type: "UndefinedLiteral", value: undefined, start, end };
}
