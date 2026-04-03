import type { ASTNode } from "./types.js";
import type { ParserContext } from "./parser-context.js";
import { current, advance } from "./parser-context.js";
import { parsePostfix } from "./parse-postfix.js";

export function parseUnary(ctx: ParserContext): ASTNode {
  // Plugin unary hooks
  if (ctx.plugins) {
    for (const plugin of ctx.plugins) {
      if (plugin.parseUnary) {
        const node = plugin.parseUnary(ctx, parseUnary);
        if (node) return node;
      }
    }
  }

  const tok = current(ctx);

  // Core: arithmetic unary (-, +)
  if (tok.type === "Operator" && (tok.value === "-" || tok.value === "+")) {
    advance(ctx);
    const operand = parseUnary(ctx);
    return {
      type: "UnaryExpression",
      operator: tok.value,
      operand,
      start: tok.start,
      end: operand.end,
    };
  }

  return parsePostfix(ctx);
}
