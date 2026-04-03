import type { ASTNode, ObjectProperty } from "./types.js";
import type { ParserContext } from "./parser-context.js";
import { current, advance, expect } from "./parser-context.js";
import { ExpressionError } from "../errors/expression-error.js";
import { parseExpression } from "./parse-expression.js";

export function parseObjectLiteral(ctx: ParserContext): ASTNode {
  const start = expect(ctx, "Punctuation", "{").start;
  const properties: ObjectProperty[] = [];

  while (!(current(ctx).type === "Punctuation" && current(ctx).value === "}")) {
    if (properties.length > 0) expect(ctx, "Punctuation", ",");
    if (current(ctx).type === "Punctuation" && current(ctx).value === "}") break;

    let key: ASTNode;
    let computed = false;

    if (current(ctx).type === "Punctuation" && current(ctx).value === "[") {
      advance(ctx);
      key = parseExpression(ctx, 0);
      expect(ctx, "Punctuation", "]");
      computed = true;
    } else {
      const tok = current(ctx);
      if (tok.type === "Identifier") {
        advance(ctx);
        key = { type: "Identifier", name: tok.value, start: tok.start, end: tok.end };

        const next = current(ctx);
        if (next.type === "Punctuation" && (next.value === "," || next.value === "}")) {
          const value: ASTNode = {
            type: "Identifier",
            name: tok.value,
            start: tok.start,
            end: tok.end,
          };
          properties.push({
            type: "ObjectProperty",
            key,
            value,
            computed: false,
            start: key.start,
            end: value.end,
          });
          continue;
        }
      } else if (tok.type === "String") {
        advance(ctx);
        key = { type: "StringLiteral", value: tok.value, start: tok.start, end: tok.end };
      } else {
        throw new ExpressionError(`Expected property name but got "${tok.value}"`, {
          source: ctx.source,
          start: tok.start,
          end: tok.end,
        });
      }
    }

    expect(ctx, "Punctuation", ":");
    const value = parseExpression(ctx, 0);

    properties.push({
      type: "ObjectProperty",
      key,
      value,
      computed,
      start: key.start,
      end: value.end,
    });
  }

  const end = expect(ctx, "Punctuation", "}").end;
  return { type: "ObjectLiteral", properties, start, end };
}
