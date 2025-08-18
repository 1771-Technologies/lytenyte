import type { FilterString } from "../+types.js";
import type { FilterStringSettings } from "./get-string-filter-settings.js";

export function evaluateStringFilter(
  filter: FilterString,
  cv: string | number | null,
  {
    includeNulls,
    caseInsensitive,
    ignorePunctuation,
    trimWhitespace,
    locale,
    regex,
    collator,
  }: FilterStringSettings,
) {
  const v = filter.value;

  if (v != null && typeof v !== "number" && typeof v !== "string") return false;
  if (cv != null && typeof cv !== "number" && typeof cv !== "string") return false;

  const op = filter.operator;
  if (cv == null || v == null) {
    if (op === "equals") {
      if (cv == null && v == null) return true;
      if (v == null && cv != null) return false;
      return includeNulls;
    }
    if (op === "not_equals") {
      if (cv == null && v == null) return false;
      if (v == null && cv != null) return true;
      return includeNulls;
    }

    if (v == null) return false;
    else return includeNulls;
  }

  if (
    op === "length" ||
    op === "length_greater_than" ||
    op === "length_greater_than_or_equals" ||
    op === "length_less_than" ||
    op === "length_less_than_or_equals" ||
    op === "not_length"
  ) {
    const leftLen =
      typeof v === "string"
        ? prep(v, caseInsensitive, ignorePunctuation, trimWhitespace, locale).length
        : v;
    const rightLen =
      typeof cv === "string"
        ? prep(cv, caseInsensitive, ignorePunctuation, trimWhitespace, locale).length
        : cv;

    if (op === "length") return leftLen === rightLen;
    else if (op === "not_length") return leftLen !== rightLen;
    else if (op === "length_greater_than") return rightLen > leftLen;
    else if (op === "length_greater_than_or_equals") return rightLen >= leftLen;
    else if (op === "length_less_than") return rightLen < leftLen;
    else return rightLen <= leftLen;
  }

  if (typeof v === "number" || typeof cv === "number") return false;

  const left = prep(v, caseInsensitive, ignorePunctuation, trimWhitespace, locale);
  const right = prep(cv, caseInsensitive, ignorePunctuation, trimWhitespace, locale);

  if (op === "matches") {
    if (!regex) return false;
    return regex.test(right);
  }

  if (op === "begins_with") return right.startsWith(left);
  if (op === "not_begins_with") return !right.startsWith(left);
  if (op === "contains") return right.includes(left);
  if (op === "not_contains") return !right.includes(left);
  if (op === "ends_with") return right.endsWith(left);
  if (op === "not_ends_with") return !right.endsWith(left);

  const col = collator;
  if (op === "equals") return col ? col.compare(left, right) === 0 : left === right;
  if (op === "not_equals") return col ? col.compare(left, right) !== 0 : left !== right;
  if (op === "greater_than") return col ? col.compare(right, left) >= 1 : right > left;
  if (op === "greater_than_or_equals") return col ? col.compare(right, left) >= 0 : right >= left;

  if (op === "less_than") return col ? col.compare(right, left) < 0 : right < left;
  if (op === "less_than_or_equals") return col ? col.compare(right, left) <= 0 : right <= left;

  return false;
}

function prep(src: string, insensitive: boolean, ignore: boolean, trim: boolean, locale: string) {
  let final = src;
  if (insensitive) final = src.toLocaleLowerCase(locale);
  if (ignore) final = final.replace(/[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]/g, "");
  if (trim) final = final.trim();

  return final;
}
