import { ExpressionError } from "../../errors/index.js";
import { isHexDigit } from "../predicates/is-hex-digit.js";

const MAX_CODE_POINT = 0x10ffff;
const HEX_CODE_POINT_SIZE = 5;

export function scanString(source: string, start: number): { value: string; end: number } {
  const quote = source[start];
  let value = "";
  let i = start + 1;

  while (i < source.length && source[i] !== quote) {
    if (source[i] === "\\") {
      i++;
      const escaped = source[i];
      if (escaped === "n") value += "\n";
      else if (escaped === "t") value += "\t";
      else if (escaped === "r") value += "\r";
      else if (escaped === "\\") value += "\\";
      else if (escaped === "0") value += "\0";
      else if (escaped === "x") {
        const hex = source.slice(i + 1, i + 3);
        if (hex.length < 2 || !isHexDigit(hex[0]) || !isHexDigit(hex[1])) {
          throw new ExpressionError("Invalid \\x escape", { source, start, end: i });
        }
        value += String.fromCharCode(parseInt(hex, 16));
        i += 3;
        continue;
      } else if (escaped === "u") {
        if (source[i + 1] === "{") {
          i += 2;
          let hex = "";
          while (i < source.length && source[i] !== "}" && source[i] !== quote) {
            if (!isHexDigit(source[i])) {
              throw new ExpressionError("Invalid \\u escape: non-hex digit", {
                source,
                start,
                end: i,
              });
            }
            hex += source[i];
            i++;
          }
          if (i >= source.length || source[i] !== "}") {
            throw new ExpressionError("Invalid \\u escape: missing closing brace", {
              source,
              start,
              end: i,
            });
          }
          if (hex.length === 0) {
            throw new ExpressionError("Invalid \\u escape: empty code point", {
              source,
              start,
              end: i,
            });
          }
          const codePoint = parseInt(hex, 16);
          if (codePoint > MAX_CODE_POINT) {
            throw new ExpressionError("Invalid \\u escape: code point out of range", {
              source,
              start,
              end: i,
            });
          }
          value += String.fromCodePoint(codePoint);
          i++;
          continue;
        } else {
          const hex = source.slice(i + 1, i + HEX_CODE_POINT_SIZE);
          if (hex.length < 4 || ![...hex].every(isHexDigit)) {
            throw new ExpressionError("Invalid \\u escape", { source, start, end: i });
          }
          value += String.fromCharCode(parseInt(hex, 16));
          i += HEX_CODE_POINT_SIZE;
          continue;
        }
      } else {
        value += escaped;
      }
    } else {
      value += source[i];
    }
    i++;
  }

  if (i >= source.length) {
    throw new ExpressionError("Unterminated string", { source, start, end: i });
  }
  i++;
  // We keep the string literals in the token.
  return { value: quote + value + quote, end: i };
}
