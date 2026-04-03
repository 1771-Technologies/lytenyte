import { isAlpha } from "./is-alpha.js";
import { isDigit } from "./is-digit.js";

export function isAlphaNumeric(ch: string): boolean {
  return isAlpha(ch) || isDigit(ch);
}
