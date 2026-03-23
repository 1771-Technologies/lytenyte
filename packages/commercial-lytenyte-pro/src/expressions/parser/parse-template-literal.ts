import type { ASTNode } from "./types.js";
import type { ParserContext } from "./parser-context.js";
import { advance } from "./parser-context.js";
import { parse } from "./parse.js";

export function parseTemplateLiteral(ctx: ParserContext): ASTNode {
  const tok = advance(ctx);
  const raw = tok.value.slice(1, -1);
  const parts: ASTNode[] = [];
  let i = 0;
  let textStart = 0;

  while (i < raw.length) {
    if (raw[i] === "$" && i + 1 < raw.length && raw[i + 1] === "{") {
      if (i > textStart) {
        const text = raw.slice(textStart, i);
        parts.push({ type: "StringLiteral", value: text, start: tok.start, end: tok.end });
      }
      i += 2;
      let depth = 1;
      const exprStart = i;
      while (i < raw.length && depth > 0) {
        if (raw[i] === "{") depth++;
        else if (raw[i] === "}") depth--;
        if (depth > 0) i++;
      }
      const exprSource = raw.slice(exprStart, i);
      i++;
      textStart = i;
      const exprAst = parse(exprSource, ctx.depth + 1, ctx.plugins);
      parts.push(exprAst);
    } else {
      i++;
    }
  }

  if (textStart < raw.length) {
    const text = raw.slice(textStart);
    parts.push({ type: "StringLiteral", value: text, start: tok.start, end: tok.end });
  }

  return { type: "TemplateLiteral", parts, start: tok.start, end: tok.end };
}
