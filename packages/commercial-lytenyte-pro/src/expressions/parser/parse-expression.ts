import type { ASTNode } from "./types.js";
import type { ParserContext } from "./parser-context.js";
import { current, advance } from "./parser-context.js";
import { PRECEDENCE } from "./precedence.js";
import { parseUnary } from "./parse-unary.js";

export function parseExpression(ctx: ParserContext, minPrec = 0): ASTNode {
  let left = parseUnary(ctx);

  while (true) {
    const tok = current(ctx);
    let prec: number | undefined;

    // Core precedence (arithmetic only)
    if (tok.type === "Operator") {
      prec = PRECEDENCE[tok.value];
    }

    // Plugin precedence
    if (prec === undefined && ctx.plugins) {
      for (const plugin of ctx.plugins) {
        if (plugin.infixPrecedence) {
          prec = plugin.infixPrecedence(ctx);
          if (prec !== undefined) break;
        }
      }
    }

    if (prec !== undefined && prec >= minPrec) {
      // Try plugin parseInfix first (for ternary, pipe, membership, etc.)
      if (ctx.plugins) {
        let handled = false;
        for (const plugin of ctx.plugins) {
          if (plugin.parseInfix) {
            const node = plugin.parseInfix(ctx, left, minPrec);
            if (node) {
              left = node;
              handled = true;
              break;
            }
          }
        }
        if (handled) continue;
      }

      // Default: standard binary expression
      const op = advance(ctx);
      const isRightAssoc = op.value === "**";
      const nextMinPrec = isRightAssoc ? prec : prec + 1;
      const right = parseExpression(ctx, nextMinPrec);

      left = {
        type: "BinaryExpression",
        operator: op.value as any,
        left,
        right,
        start: left.start,
        end: right.end,
      };
      continue;
    }

    // No precedence — try plugin parseInfix (for things without precedence entry)
    if (prec === undefined && ctx.plugins) {
      let handled = false;
      for (const plugin of ctx.plugins) {
        if (plugin.parseInfix) {
          const node = plugin.parseInfix(ctx, left, minPrec);
          if (node) {
            left = node;
            handled = true;
            break;
          }
        }
      }
      if (handled) continue;
    }

    break;
  }

  return left;
}
