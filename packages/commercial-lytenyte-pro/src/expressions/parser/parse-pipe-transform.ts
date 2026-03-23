import type { ASTNode } from "./types.js";
import type { ParserContext } from "./parser-context.js";
import { current, advance, expect } from "./parser-context.js";
import { parsePrimary } from "./parse-primary.js";
import { parseExpression } from "./parse-expression.js";

export function parsePipeTransform(ctx: ParserContext): ASTNode {
  let node = parsePrimary(ctx);

  if (current(ctx).type === "Punctuation" && current(ctx).value === "(") {
    advance(ctx);
    const args: ASTNode[] = [];
    while (!(current(ctx).type === "Punctuation" && current(ctx).value === ")")) {
      if (args.length > 0) expect(ctx, "Punctuation", ",");
      if (current(ctx).type === "Punctuation" && current(ctx).value === ")") break;
      args.push(parseExpression(ctx, 0));
    }
    const end = expect(ctx, "Punctuation", ")").end;
    node = {
      type: "CallExpression",
      callee: node,
      args,
      start: node.start,
      end,
    };
  }

  return node;
}
