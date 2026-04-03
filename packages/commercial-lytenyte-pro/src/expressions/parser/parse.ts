import type { ASTNode } from "./types.js";
import type { ParserContext } from "./parser-context.js";
import { current } from "./parser-context.js";
import { tokenize } from "../lexer/tokenize/tokenize.js";
import { ExpressionError } from "../errors/expression-error.js";
import { parseExpression } from "./parse-expression.js";
import type { Plugin } from "../plugin.js";

const MAX_PARSE_DEPTH = 32;

export function parse(source: string, depth = 0, plugins?: Plugin[]): ASTNode {
  if (depth > MAX_PARSE_DEPTH) {
    throw new ExpressionError("Maximum template nesting depth exceeded", {
      source,
      start: 0,
      end: source.length,
    });
  }

  const tokens = tokenize(source, plugins);
  const ctx: ParserContext = { tokens, pos: 0, source, depth, plugins };

  const result = parseExpression(ctx, 0);

  if (current(ctx).type !== "EOF") {
    const tok = current(ctx);
    throw new ExpressionError(`Unexpected token "${tok.value}"`, {
      source,
      start: tok.start,
      end: tok.end,
    });
  }

  return result;
}
