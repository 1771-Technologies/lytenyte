import type { ASTNode } from "./types.js";
import type { ParserContext } from "./parser-context.js";
import { current, advance, expect } from "./parser-context.js";
import { ExpressionError } from "../errors/expression-error.js";
import { parseExpression } from "./parse-expression.js";

export function parsePrimary(ctx: ParserContext): ASTNode {
  // Plugin prefix hooks
  if (ctx.plugins) {
    for (const plugin of ctx.plugins) {
      if (plugin.parsePrefix) {
        const node = plugin.parsePrefix(ctx);
        if (node) return node;
      }
    }
  }

  const tok = current(ctx);

  // Core: number literals
  if (tok.type === "Number") {
    advance(ctx);
    const raw = tok.value.replace(/_/g, "");
    return { type: "NumberLiteral", value: Number(raw), start: tok.start, end: tok.end };
  }

  // Core: identifiers
  if (tok.type === "Identifier") {
    advance(ctx);
    return { type: "Identifier", name: tok.value, start: tok.start, end: tok.end };
  }

  // Core: parenthesized expressions (grouping)
  if (tok.type === "Punctuation" && tok.value === "(") {
    advance(ctx);
    const expr = parseExpression(ctx, 0);
    expect(ctx, "Punctuation", ")");
    return expr;
  }

  throw new ExpressionError(
    `Unexpected ${tok.type === "EOF" ? "end of expression" : `token "${tok.value}"`}`,
    { source: ctx.source, start: tok.start, end: tok.end },
  );
}
