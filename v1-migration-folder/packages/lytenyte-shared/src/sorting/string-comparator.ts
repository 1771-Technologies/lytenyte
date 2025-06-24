export interface StringComparator {
  readonly caseInsensitive: boolean;
  readonly trimWhitespace: boolean;
  readonly ignorePunctuation: boolean;
  readonly nullsFirst: boolean;
  readonly locale: string;
  readonly collator: Intl.Collator;
}

export function stringComparator(
  left: string | null,
  right: string | null,
  {
    caseInsensitive,
    trimWhitespace,
    ignorePunctuation,
    locale,
    collator,
    nullsFirst,
  }: StringComparator
) {
  if (left == null && right == null) return 0;
  if (left != null && right == null) return nullsFirst ? 1 : -1;
  if (left == null && right != null) return nullsFirst ? -1 : 1;

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
