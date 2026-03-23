import { ExpressionError } from "../../errors/index.js";

export function scanStringLiteral(source: string, start: number): { raw: string; end: number } {
  const quote = source[start];
  let raw = quote;
  let i = start + 1;
  while (i < source.length && source[i] !== quote) {
    if (source[i] === "\\" && i + 1 < source.length) {
      raw += source[i] + source[i + 1];
      i += 2;
    } else {
      raw += source[i];
      i++;
    }
  }
  if (i >= source.length) {
    throw new ExpressionError("Unterminated string", { source, start, end: i });
  }
  raw += source[i];
  i++;
  return { raw, end: i };
}
