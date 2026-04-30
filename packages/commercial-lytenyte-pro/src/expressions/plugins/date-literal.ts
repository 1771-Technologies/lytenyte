import type { Plugin } from "../plugin.js";
import type { DateLiteralNode, BinaryExpression } from "../parser/types.js";
import { scanString } from "../lexer/tokenize/scan-string.js";
import { current, advance } from "../parser/parser-context.js";
import { ExpressionError } from "../errors/expression-error.js";

const DATE_OPS = new Set(["==", "!=", "<", ">", "<=", ">="]);

export const dateLiteralPlugin: Plugin = {
  name: "date-literal",

  scan(source, pos) {
    if (source[pos] !== "d") return null;
    const next = source[pos + 1];
    if (next !== '"' && next !== "'") return null;

    try {
      const r = scanString(source, pos + 1);
      // Store the full source text (d"2023-02-11") so the editor overlay renders it correctly.
      return { type: "DateLiteral", value: source.slice(pos, r.end), end: r.end };
    } catch (e) {
      if (e instanceof ExpressionError) {
        throw new ExpressionError(e.rawMessage, { source, start: pos, end: e.end });
      }
      throw e;
    }
  },

  parsePrefix(ctx) {
    const tok = current(ctx);
    if (tok.type !== "DateLiteral") return null;
    advance(ctx);
    // tok.value is the full d"2023-02-11" — strip the d" prefix and closing quote for the AST.
    const dateStr = tok.value.slice(2, -1);
    return { type: "DateLiteralNode", value: dateStr, start: tok.start, end: tok.end };
  },

  evaluate(node, context, evalFn) {
    if (node.type === "DateLiteralNode") {
      const d = new Date((node as DateLiteralNode).value);
      if (isNaN(d.getTime())) {
        throw new Error(`Invalid date literal: "${(node as DateLiteralNode).value}"`);
      }
      return { value: d };
    }

    // Intercept comparison operators when at least one operand is a Date.
    // This must run before comparisonPlugin (place dateLiteralPlugin first in the array).
    if (node.type === "BinaryExpression") {
      const op = (node as BinaryExpression).operator;
      if (!DATE_OPS.has(op)) return null;

      const left = evalFn((node as BinaryExpression).left, context) as unknown;
      const right = evalFn((node as BinaryExpression).right, context) as unknown;

      if (!(left instanceof Date) && !(right instanceof Date)) return null;

      const lt = left instanceof Date ? left.getTime() : Number(left);
      const rt = right instanceof Date ? right.getTime() : Number(right);

      switch (op) {
        case "==":
          return { value: lt === rt };
        case "!=":
          return { value: lt !== rt };
        case "<":
          return { value: lt < rt };
        case ">":
          return { value: lt > rt };
        case "<=":
          return { value: lt <= rt };
        case ">=":
          return { value: lt >= rt };
      }
    }

    return null;
  },
};
