import { ExpressionError } from "../../errors/index.js";
import { scanStringLiteral } from "./scan-string-literal.js";

export function scanTemplateLiteral(source: string, start: number): { raw: string; end: number } {
  let raw = "`";
  let i = start + 1;

  while (i < source.length && source[i] !== "`") {
    if (source[i] === "\\" && i + 1 < source.length) {
      raw += source[i] + source[i + 1];
      i += 2;
      continue;
    }

    if (source[i] === "$" && i + 1 < source.length && source[i + 1] === "{") {
      raw += "${";
      i += 2;
      let depth = 1;
      while (i < source.length && depth > 0) {
        const c = source[i];

        if (c === '"' || c === "'") {
          const result = scanStringLiteral(source, i);
          raw += result.raw;
          i = result.end;
          continue;
        }

        if (c === "`") {
          const result = scanTemplateLiteral(source, i);
          raw += result.raw;
          i = result.end;
          continue;
        }

        if (c === "{") depth++;
        else if (c === "}") depth--;
        if (depth > 0) raw += c;
        i++;
      }
      raw += "}";
    } else {
      raw += source[i];
      i++;
    }
  }

  if (i >= source.length) {
    throw new ExpressionError("Unterminated template literal", { source, start, end: i });
  }
  raw += "`";
  i++;
  return { raw, end: i };
}
