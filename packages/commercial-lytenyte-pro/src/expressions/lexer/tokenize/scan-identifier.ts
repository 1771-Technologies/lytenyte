import { isAlphaNumeric } from "../predicates/is-alpha-numeric.js";
import type { Token } from "../types.js";

const KEYWORDS = new Map<string, { type: Token["type"]; value: string }>([
  ["true", { type: "Boolean", value: "true" }],
  ["false", { type: "Boolean", value: "false" }],
  ["null", { type: "Null", value: "null" }],
  ["undefined", { type: "Undefined", value: "undefined" }],
  ["in", { type: "Operator", value: "in" }],
  ["not", { type: "Operator", value: "not" }],
]);

export function scanIdentifier(
  source: string,
  start: number,
): { type: Token["type"]; value: string; end: number } {
  let i = start;
  while (i < source.length && isAlphaNumeric(source[i])) i++;
  const value = source.slice(start, i);
  const kw = KEYWORDS.get(value);
  if (kw) {
    return { type: kw.type, value: kw.value, end: i };
  }
  return { type: "Identifier", value, end: i };
}
