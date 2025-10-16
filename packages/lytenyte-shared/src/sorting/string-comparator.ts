import type { SortStringComparatorOptions } from "../+types.js";

const defaultCollator = new Intl.Collator();

export function stringComparator(
  left: string | null,
  right: string | null,
  {
    caseInsensitive = false,
    trimWhitespace = false,
    ignorePunctuation = false,
    locale = "en",
    collator = defaultCollator,
    nullsFirst = false,
  }: SortStringComparatorOptions,
) {
  if (left == null && right == null) return 0;
  if (left != null && right == null) return nullsFirst ? 1 : -1;
  if (left == null && right != null) return nullsFirst ? -1 : 1;

  // This should technically not happen, but in its possible for a number aggregation to be applied, in which
  // case we perform a naive sort and just compare the numbers
  if (typeof left === "number" && typeof right === "number") return left - right;

  const leftPrepped = prep(left!, caseInsensitive, ignorePunctuation, trimWhitespace, locale);
  const rightPrepped = prep(right!, caseInsensitive, ignorePunctuation, trimWhitespace, locale);

  return collator.compare(leftPrepped, rightPrepped);
}

function prep(src: string, insensitive: boolean, ignore: boolean, trim: boolean, locale: string) {
  let final = src;
  if (insensitive) final = src.toLocaleLowerCase(locale);
  if (ignore) final = final.replace(/[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]/g, "");
  if (trim) final = final.trim();

  return final;
}
