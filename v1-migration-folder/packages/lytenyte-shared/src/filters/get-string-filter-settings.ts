import type { FilterString, Locale } from "../+types.js";

export interface FilterStringSettings {
  readonly includeNulls: boolean;
  readonly caseInsensitive: boolean;
  readonly ignorePunctuation: boolean;
  readonly trimWhitespace: boolean;
  readonly locale: Locale;
  readonly collator: null | Intl.Collator;
  readonly regex: null | RegExp;
}

export function getStringFilterSettings(filter: FilterString): FilterStringSettings {
  const sensitivity = filter.options?.collation?.sensitivity;
  const includeNulls = filter.options?.nullHandling === "include";
  const caseInsensitive =
    filter.options?.caseInsensitive ??
    (sensitivity === "base" ||
      sensitivity === "accent" ||
      (sensitivity !== "case" && sensitivity !== "variant" && !containsUppercase(filter.value)));

  const ignorePunctuation = filter.options?.ignorePunctuation ?? false;
  const trimWhitespace = filter.options?.trimWhitespace ?? false;
  const locale = filter.options?.collation?.locale ?? "en-US";

  const collator = filter.options?.collation ? new Intl.Collator(locale, { sensitivity }) : null;

  const regex =
    filter.operator === "matches"
      ? new RegExp(filter.value as string, filter.options?.regexOpts)
      : null;

  return {
    includeNulls,
    caseInsensitive,
    ignorePunctuation,
    trimWhitespace,
    locale,
    collator,
    regex,
  };
}

function containsUppercase(s: string | number | null) {
  if (typeof s !== "string") return false;

  for (let i = 0; i < s.length; i++) {
    if (s[i] === s[i].toUpperCase()) return true;
  }
  return false;
}
