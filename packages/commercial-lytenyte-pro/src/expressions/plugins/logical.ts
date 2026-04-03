import type { Plugin } from "../plugin.js";
import type { ParserContext } from "../parser/parser-context.js";
import { current, advance } from "../parser/parser-context.js";
import { parseExpression } from "../parser/parse-expression.js";

const LOGICAL_PRECEDENCE: Record<string, number> = {
  "||": 10,
  "&&": 20,
  "??": 25,
};

export const logicalPlugin: Plugin = {
  name: "logical",
  infixPrecedence: (ctx: ParserContext) => {
    const tok = current(ctx);
    if (tok.type === "Operator" && (tok.value === "&&" || tok.value === "||")) {
      return LOGICAL_PRECEDENCE[tok.value];
    }
    if (tok.type === "NullishCoalescing") {
      return LOGICAL_PRECEDENCE["??"];
    }
    return undefined;
  },
  parseInfix: (ctx: ParserContext, left, minPrec) => {
    const tok = current(ctx);
    let op: string | undefined;
    let prec: number | undefined;

    if (tok.type === "Operator" && (tok.value === "&&" || tok.value === "||")) {
      op = tok.value;
      prec = LOGICAL_PRECEDENCE[op];
    } else if (tok.type === "NullishCoalescing") {
      op = "??";
      prec = LOGICAL_PRECEDENCE["??"];
    }

    if (op === undefined || prec === undefined || prec < minPrec) return null;

    advance(ctx);
    const right = parseExpression(ctx, prec + 1);
    return {
      type: "BinaryExpression",
      operator: op,
      left,
      right,
      start: left.start,
      end: right.end,
    } as any;
  },
  parseUnary: (ctx, parseNext) => {
    const tok = current(ctx);
    if (tok.type === "Operator" && tok.value === "!") {
      advance(ctx);
      const operand = parseNext(ctx);
      return {
        type: "UnaryExpression",
        operator: "!",
        operand,
        start: tok.start,
        end: operand.end,
      } as any;
    }
    return null;
  },
  optimize: (node, opt) => {
    if (node.type === "UnaryExpression" && (node as any).operator === "!") {
      const operand = opt((node as any).operand);
      if (operand.type === "BooleanLiteral") {
        return {
          type: "BooleanLiteral",
          value: !(operand as any).value,
          start: node.start,
          end: node.end,
        } as any;
      }
      return { ...node, operand };
    }
    if (
      node.type === "BinaryExpression" &&
      ((node as any).operator === "&&" || (node as any).operator === "||" || (node as any).operator === "??")
    ) {
      const left = opt((node as any).left);
      const right = opt((node as any).right);
      return { ...node, left, right };
    }
    return null;
  },
  evaluate: (node, context, evalFn) => {
    if (node.type === "UnaryExpression" && (node as any).operator === "!") {
      const operand = evalFn((node as any).operand, context);
      return { value: !operand };
    }
    if (node.type === "BinaryExpression") {
      const op = (node as any).operator;
      if (op === "&&") {
        const left = evalFn((node as any).left, context);
        return { value: left ? evalFn((node as any).right, context) : left };
      }
      if (op === "||") {
        const left = evalFn((node as any).left, context);
        return { value: left ? left : evalFn((node as any).right, context) };
      }
      if (op === "??") {
        const left = evalFn((node as any).left, context);
        return { value: left != null ? left : evalFn((node as any).right, context) };
      }
    }
    return null;
  },
};
