import type { Plugin } from "../plugin.js";
import type { ParserContext } from "../parser/parser-context.js";
import { current, advance, expect } from "../parser/parser-context.js";
import { parseExpression } from "../parser/parse-expression.js";
import { isConstant } from "../compiler/is-constant.js";
import { valueOf } from "../compiler/value-of.js";

const TERNARY_PRECEDENCE = 1;

export const ternaryPlugin: Plugin = {
  name: "ternary",
  infixPrecedence: (ctx: ParserContext) => {
    const tok = current(ctx);
    if (tok.type === "Punctuation" && tok.value === "?") {
      return TERNARY_PRECEDENCE;
    }
    return undefined;
  },
  parseInfix: (ctx: ParserContext, left, minPrec) => {
    const tok = current(ctx);
    if (tok.type !== "Punctuation" || tok.value !== "?") return null;
    if (TERNARY_PRECEDENCE < minPrec) return null;

    advance(ctx);
    const consequent = parseExpression(ctx, 0);
    expect(ctx, "Punctuation", ":");
    const alternate = parseExpression(ctx, 0);

    return {
      type: "ConditionalExpression",
      test: left,
      consequent,
      alternate,
      start: left.start,
      end: alternate.end,
    } as any;
  },
  optimize: (node, opt) => {
    if (node.type === "ConditionalExpression") {
      const n = node as any;
      const test = opt(n.test);

      if (isConstant(test)) {
        return valueOf(test) ? opt(n.consequent) : opt(n.alternate);
      }

      return {
        ...node,
        test,
        consequent: opt(n.consequent),
        alternate: opt(n.alternate),
      };
    }
    return null;
  },
  evaluate: (node, context, evalFn) => {
    if (node.type === "ConditionalExpression") {
      const n = node as any;
      const test = evalFn(n.test, context);
      return { value: test ? evalFn(n.consequent, context) : evalFn(n.alternate, context) };
    }
    return null;
  },
};
