import type { Plugin } from "../plugin.js";
import type { ParserContext } from "../parser/parser-context.js";
import { current } from "../parser/parser-context.js";

const COMPARISON_PRECEDENCE: Record<string, number> = {
  "==": 30,
  "!=": 30,
  "<": 40,
  ">": 40,
  "<=": 40,
  ">=": 40,
};

export const comparisonPlugin: Plugin = {
  name: "comparison",
  infixPrecedence: (ctx: ParserContext) => {
    const tok = current(ctx);
    if (tok.type === "Operator") {
      return COMPARISON_PRECEDENCE[tok.value];
    }
    return undefined;
  },
  optimize: (node, opt) => {
    if (node.type === "BinaryExpression" && (node as any).operator in COMPARISON_PRECEDENCE) {
      const left = opt((node as any).left);
      const right = opt((node as any).right);
      return { ...node, left, right };
    }
    return null;
  },
  evaluate: (node, context, evalFn) => {
    if (node.type === "BinaryExpression") {
      const op = (node as any).operator;
      if (op in COMPARISON_PRECEDENCE) {
        const left = evalFn((node as any).left, context) as any;
        const right = evalFn((node as any).right, context) as any;
        switch (op) {
          case "==":
            return { value: left === right };
          case "!=":
            return { value: left !== right };
          case "<":
            return { value: left < right };
          case ">":
            return { value: left > right };
          case "<=":
            return { value: left <= right };
          case ">=":
            return { value: left >= right };
        }
      }
    }
    return null;
  },
};
