import { isAlpha } from "./is-alpha";
import { isDigit } from "./is-digit";

export function isAlphaNumeric(ch: string): boolean {
  return isAlpha(ch) || isDigit(ch);
}
