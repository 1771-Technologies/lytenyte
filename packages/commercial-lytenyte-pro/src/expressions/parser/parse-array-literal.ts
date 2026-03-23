import type { ASTNode } from "./types.js";
import type { ParserContext } from "./parser-context.js";
import { current, expect } from "./parser-context.js";
import { parseExpression } from "./parse-expression.js";

export function parseArrayLiteral(ctx: ParserContext): ASTNode {
  const start = expect(ctx, "Punctuation", "[").start;
  const elements: ASTNode[] = [];

  while (!(current(ctx).type === "Punctuation" && current(ctx).value === "]")) {
    if (elements.length > 0) expect(ctx, "Punctuation", ",");
    if (current(ctx).type === "Punctuation" && current(ctx).value === "]") break;
    elements.push(parseExpression(ctx, 0));
  }

  const end = expect(ctx, "Punctuation", "]").end;
  return { type: "ArrayLiteral", elements, start, end };
}
