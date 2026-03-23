import type { Plugin } from "../plugin.js";
import type { ParserContext } from "../parser/parser-context.js";
import { current, advance } from "../parser/parser-context.js";
import { parsePipeTransform } from "../parser/parse-pipe-transform.js";

const PIPE_PRECEDENCE = 5;

export const pipePlugin: Plugin = {
  name: "pipe",
  infixPrecedence: (ctx: ParserContext) => {
    const tok = current(ctx);
    if (tok.type === "Pipe") {
      return PIPE_PRECEDENCE;
    }
    return undefined;
  },
  parseInfix: (ctx: ParserContext, left, minPrec) => {
    const tok = current(ctx);
    if (tok.type !== "Pipe") return null;
    if (PIPE_PRECEDENCE < minPrec) return null;

    advance(ctx);
    const transform = parsePipeTransform(ctx);

    return {
      type: "PipeExpression",
      input: left,
      transform,
      start: left.start,
      end: transform.end,
    } as any;
  },
  optimize: (node, opt) => {
    if (node.type === "PipeExpression") {
      const n = node as any;
      return {
        ...node,
        input: opt(n.input),
        transform: opt(n.transform),
      };
    }
    return null;
  },
  evaluate: (node, context, evalFn) => {
    if (node.type === "PipeExpression") {
      const n = node as any;
      const input = evalFn(n.input, context);

      // If the transform is a call expression, append input as last argument
      if (n.transform.type === "CallExpression") {
        const args = n.transform.args.map((a: any) => evalFn(a, context));
        args.push(input);
        const fn = evalFn(n.transform.callee, context) as any;
        return { value: fn(...args) };
      }

      // Otherwise treat as a function and call with input as sole argument
      const fn = evalFn(n.transform, context) as any;
      return { value: fn(input) };
    }
    return null;
  },
};
