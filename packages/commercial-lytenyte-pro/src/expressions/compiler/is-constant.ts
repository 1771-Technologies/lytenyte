import type { ASTNode } from "../parser/types.js";

export function isConstant(node: ASTNode): boolean {
  return (
    node.type === "NumberLiteral" ||
    node.type === "StringLiteral" ||
    node.type === "BooleanLiteral" ||
    node.type === "NullLiteral"
  );
}
