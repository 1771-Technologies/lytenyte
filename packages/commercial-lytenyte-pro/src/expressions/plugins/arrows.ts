import type { Plugin } from "../plugin.js";
import type { ASTNode } from "../parser/types.js";
import type { ParserContext } from "../parser/parser-context.js";
import { current, advance, expect } from "../parser/parser-context.js";
import { parseExpression } from "../parser/parse-expression.js";

function isArrowParams(ctx: ParserContext): boolean {
  let i = ctx.pos + 1;
  let depth = 1;
  while (i < ctx.tokens.length && depth > 0) {
    const t = ctx.tokens[i];
    if (t.type === "Punctuation" && t.value === "(") depth++;
    else if (t.type === "Punctuation" && t.value === ")") depth--;
    if (depth > 0) i++;
  }
  const after = ctx.tokens[i + 1];
  return after?.type === "Arrow";
}

function parseArrowFunction(ctx: ParserContext): ASTNode {
  const start = current(ctx).start;
  advance(ctx); // consume (

  const params: string[] = [];
  while (!(current(ctx).type === "Punctuation" && current(ctx).value === ")")) {
    if (params.length > 0) expect(ctx, "Punctuation", ",");
    const param = expect(ctx, "Identifier");
    params.push(param.value);
  }
  expect(ctx, "Punctuation", ")"); // consume )
  advance(ctx); // consume =>

  const body = parseExpression(ctx, 0);
  return {
    type: "ArrowFunctionExpression",
    params,
    body,
    start,
    end: body.end,
  } as any;
}

export const arrowsPlugin: Plugin = {
  name: "arrows",
  parsePrefix: (ctx: ParserContext) => {
    const tok = current(ctx);

    // Single-param arrow: identifier => expr
    if (tok.type === "Identifier" && ctx.tokens[ctx.pos + 1]?.type === "Arrow") {
      advance(ctx); // consume identifier
      advance(ctx); // consume =>
      const body = parseExpression(ctx, 0);
      return {
        type: "ArrowFunctionExpression",
        params: [tok.value],
        body,
        start: tok.start,
        end: body.end,
      } as any;
    }

    // Multi-param arrow: (a, b) => expr
    if (tok.type === "Punctuation" && tok.value === "(" && isArrowParams(ctx)) {
      return parseArrowFunction(ctx);
    }

    return null;
  },
  optimize: (node, opt) => {
    if (node.type === "ArrowFunctionExpression") {
      return { ...node, body: opt((node as any).body) };
    }
    return null;
  },
  evaluate: (node, context, evalFn) => {
    if (node.type === "ArrowFunctionExpression") {
      const n = node as any;
      return {
        value: (...args: unknown[]) => {
          const childContext = { ...context };
          for (let i = 0; i < n.params.length; i++) {
            childContext[n.params[i]] = args[i];
          }
          return evalFn(n.body, childContext);
        },
      };
    }
    return null;
  },
};
