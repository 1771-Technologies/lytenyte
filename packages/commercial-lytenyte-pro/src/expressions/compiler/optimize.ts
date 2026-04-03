import type { ASTNode } from "../parser/types.js";
import { isConstant } from "./is-constant.js";
import { valueOf } from "./value-of.js";
import { evalConstant } from "./eval-constant.js";
import { makeConstant } from "./make-constant.js";
import type { Plugin } from "../plugin.js";

export function optimize(node: ASTNode, plugins?: Plugin[]): ASTNode {
  const opt = (n: ASTNode): ASTNode => optimize(n, plugins);

  // Try plugin optimization first
  if (plugins) {
    for (const plugin of plugins) {
      if (plugin.optimize) {
        const result = plugin.optimize(node, opt);
        if (result) return result;
      }
    }
  }

  switch (node.type) {
    case "BinaryExpression": {
      const left = opt(node.left);
      const right = opt(node.right);

      if (isConstant(left) && isConstant(right)) {
        const result = evalConstant(node.operator, valueOf(left), valueOf(right));
        if (result !== undefined) {
          return makeConstant(result, node.start, node.end);
        }
      }

      return { ...node, left, right };
    }

    case "UnaryExpression": {
      const operand = opt(node.operand);
      if (isConstant(operand)) {
        const val = valueOf(operand);
        if (node.operator === "-" && typeof val === "number") {
          return {
            type: "NumberLiteral",
            value: -val,
            start: node.start,
            end: node.end,
          };
        }
      }
      return { ...node, operand };
    }

    default:
      return node;
  }
}
