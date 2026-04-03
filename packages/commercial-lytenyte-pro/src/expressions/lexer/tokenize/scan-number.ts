import { isDigit } from "../predicates/is-digit.js";
import { isHexDigit } from "../predicates/is-hex-digit.js";
import { isOctalDigit } from "../predicates/is-octal-digit.js";
import { isBinaryDigit } from "../predicates/is-binary-digit.js";
import { consumeDigits } from "./consume-digits.js";

export function scanNumber(source: string, start: number): { value: string; end: number } {
  const ch = source[start];
  const next = source[start + 1];
  let i = start;

  if (ch === "0" && (next === "x" || next === "X")) {
    i = consumeDigits(source, i + 2, isHexDigit);
  } else if (ch === "0" && (next === "o" || next === "O")) {
    i = consumeDigits(source, i + 2, isOctalDigit);
  } else if (ch === "0" && (next === "b" || next === "B")) {
    i = consumeDigits(source, i + 2, isBinaryDigit);
  } else {
    i = consumeDigits(source, i, isDigit);

    if (i < source.length && source[i] === "." && i + 1 < source.length && isDigit(source[i + 1])) {
      i = consumeDigits(source, i + 1, isDigit);
    }

    if (i < source.length && (source[i] === "e" || source[i] === "E")) {
      i++;
      if (i < source.length && (source[i] === "+" || source[i] === "-")) i++;
      i = consumeDigits(source, i, isDigit);
    }
  }

  return { value: source.slice(start, i), end: i };
}
