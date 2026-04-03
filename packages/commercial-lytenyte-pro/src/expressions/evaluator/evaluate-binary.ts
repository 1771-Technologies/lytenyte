import type { BinaryExpression } from "../parser/types.js";
import { evaluateNode } from "./evaluate.js";
import type { Plugin } from "../plugin.js";

export function evaluateBinary(
  node: BinaryExpression,
  context: Record<string, unknown>,
  depth: number,
  plugins?: Plugin[],
): unknown {
  const left = evaluateNode(node.left, context, depth + 1, plugins) as any;
  const right = evaluateNode(node.right, context, depth + 1, plugins) as any;

  switch (node.operator) {
    case "+":
      return left + right;
    case "-":
      return left - right;
    case "*":
      return left * right;
    case "/":
      return left / right;
    case "%":
      return left % right;
    case "**":
      return left ** right;
    default:
      throw new Error(`Unknown binary operator: ${node.operator}`);
  }
}
