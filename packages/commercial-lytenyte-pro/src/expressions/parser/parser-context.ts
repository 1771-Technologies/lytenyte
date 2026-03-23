import type { Token } from "../lexer/types.js";
import { ExpressionError } from "../errors/expression-error.js";
import type { Plugin } from "../plugin.js";

export interface ParserContext {
  tokens: Token[];
  pos: number;
  source: string;
  depth: number;
  plugins?: Plugin[];
}

export function current(ctx: ParserContext): Token {
  return ctx.tokens[ctx.pos];
}

export function advance(ctx: ParserContext): Token {
  return ctx.tokens[ctx.pos++];
}

export function expect(ctx: ParserContext, type: string, value?: string): Token {
  const tok = current(ctx);
  if (tok.type !== type || (value !== undefined && tok.value !== value)) {
    throw new ExpressionError(
      `Expected ${value ? `"${value}"` : type} but got ${tok.value ? `"${tok.value}"` : tok.type}`,
      { source: ctx.source, start: tok.start, end: tok.end },
    );
  }
  return advance(ctx);
}
