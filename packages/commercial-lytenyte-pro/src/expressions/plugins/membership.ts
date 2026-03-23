import type { Plugin } from "../plugin.js";
import type { ParserContext } from "../parser/parser-context.js";
import { current, advance } from "../parser/parser-context.js";
import { parseExpression } from "../parser/parse-expression.js";

const MEMBERSHIP_PRECEDENCE = 40;

export const membershipPlugin: Plugin = {
  name: "membership",
  infixPrecedence: (ctx: ParserContext) => {
    const tok = current(ctx);
    if (tok.type === "Operator" && tok.value === "in") {
      return MEMBERSHIP_PRECEDENCE;
    }
    if (tok.type === "Operator" && tok.value === "not") {
      const next = ctx.tokens[ctx.pos + 1];
      if (next && next.type === "Operator" && next.value === "in") {
        return MEMBERSHIP_PRECEDENCE;
      }
    }
    return undefined;
  },
  parseInfix: (ctx: ParserContext, left, minPrec) => {
    const tok = current(ctx);

    if (tok.type === "Operator" && tok.value === "in") {
      if (MEMBERSHIP_PRECEDENCE < minPrec) return null;
      advance(ctx);
      const right = parseExpression(ctx, MEMBERSHIP_PRECEDENCE + 1);
      return {
        type: "BinaryExpression",
        operator: "in",
        left,
        right,
        start: left.start,
        end: right.end,
      } as any;
    }

    if (tok.type === "Operator" && tok.value === "not") {
      const next = ctx.tokens[ctx.pos + 1];
      if (next && next.type === "Operator" && next.value === "in") {
        if (MEMBERSHIP_PRECEDENCE < minPrec) return null;
        advance(ctx); // consume "not"
        advance(ctx); // consume "in"
        const right = parseExpression(ctx, MEMBERSHIP_PRECEDENCE + 1);
        return {
          type: "BinaryExpression",
          operator: "not in",
          left,
          right,
          start: left.start,
          end: right.end,
        } as any;
      }
    }

    return null;
  },
  evaluate: (node, context, evalFn) => {
    if (node.type === "BinaryExpression") {
      const op = (node as any).operator;
      if (op === "in") {
        const left = evalFn((node as any).left, context) as any;
        const right = evalFn((node as any).right, context) as any;
        return { value: left in right };
      }
      if (op === "not in") {
        const left = evalFn((node as any).left, context) as any;
        const right = evalFn((node as any).right, context) as any;
        return { value: !(left in right) };
      }
    }
    return null;
  },
};
