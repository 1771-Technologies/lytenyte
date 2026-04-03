import { ExpressionError } from "../../errors/index.js";
import type { PunctuationValue, Token } from "../types.js";

export function scanOperator(
  source: string,
  start: number,
): { type: Token["type"]; value: string; end: number } {
  const ch = source[start];
  const next = start + 1 < source.length ? source[start + 1] : "";

  // Spread operator ...
  if (ch === "." && next === "." && start + 2 < source.length && source[start + 2] === ".") {
    return { type: "Spread", value: "...", end: start + 3 };
  }

  // Dot (punctuation)
  if (ch === ".") {
    return { type: "Punctuation", value: ".", end: start + 1 };
  }

  // Pipe |> or logical ||
  if (ch === "|" && next === ">") {
    return { type: "Pipe", value: "|>", end: start + 2 };
  }
  if (ch === "|" && next === "|") {
    return { type: "Operator", value: "||", end: start + 2 };
  }

  // &&
  if (ch === "&" && next === "&") {
    return { type: "Operator", value: "&&", end: start + 2 };
  }

  // => (arrow)
  if (ch === "=" && next === ">") {
    return { type: "Arrow", value: "=>", end: start + 2 };
  }

  // == !=
  if (ch === "=" && next === "=") {
    return { type: "Operator", value: "==", end: start + 2 };
  }
  if (ch === "!" && next === "=") {
    return { type: "Operator", value: "!=", end: start + 2 };
  }

  // ! (logical not) - must come after != check
  if (ch === "!") {
    return { type: "Operator", value: "!", end: start + 1 };
  }

  // <= >= < >
  if (ch === "<") {
    if (next === "=") return { type: "Operator", value: "<=", end: start + 2 };
    return { type: "Operator", value: "<", end: start + 1 };
  }
  if (ch === ">") {
    if (next === "=") return { type: "Operator", value: ">=", end: start + 2 };
    return { type: "Operator", value: ">", end: start + 1 };
  }

  // ** (exponentiation) — must come before single *
  if (ch === "*" && next === "*") {
    return { type: "Operator", value: "**", end: start + 2 };
  }

  // ?. (optional chaining) or ?? (nullish coalescing) or ? (ternary)
  if (ch === "?") {
    if (next === ".") return { type: "OptionalChain", value: "?.", end: start + 2 };
    if (next === "?") return { type: "NullishCoalescing", value: "??", end: start + 2 };
    return { type: "Punctuation", value: "?", end: start + 1 };
  }

  // Single-character operators
  if (ch === "+" || ch === "-" || ch === "*" || ch === "/" || ch === "%") {
    return { type: "Operator", value: ch, end: start + 1 };
  }

  // Punctuation
  if ("()[]{},:".includes(ch)) {
    return { type: "Punctuation", value: ch as PunctuationValue, end: start + 1 };
  }

  throw new ExpressionError(`Unexpected character "${ch}"`, { source, start, end: start + 1 });
}
