import type { ASTNode } from "../parser/types.js";

export function valueOf(node: ASTNode): unknown {
  if (node.type === "NumberLiteral") return node.value;
  if (node.type === "StringLiteral") return node.value;
  if (node.type === "BooleanLiteral") return node.value;
  if (node.type === "NullLiteral") return null;
  return undefined;
}
