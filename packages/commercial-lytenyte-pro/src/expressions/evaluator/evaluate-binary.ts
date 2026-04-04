import type { BinaryExpression } from "../parser/types.js";
import { evaluateNode } from "./evaluate.js";
import type { Plugin } from "../plugin.js";
import type { RunOptions } from "./evaluate.js";

export function evaluateBinary(
  node: BinaryExpression,
  context: Record<string, unknown>,
  depth: number,
  plugins?: Plugin[],
  options?: RunOptions,
): unknown {
  const left = evaluateNode(node.left, context, depth + 1, plugins, options) as any;
  const right = evaluateNode(node.right, context, depth + 1, plugins, options) as any;

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
