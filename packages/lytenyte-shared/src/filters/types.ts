export interface FilterCombination {
  readonly kind: "combination";
  readonly operator: FilterCombinationOperator;
  readonly filters: Array<FilterNumber | FilterString | FilterDate | FilterCombination>;
}

export type FilterCombinationOperator = "AND" | "OR";
export interface FilterDate {
  readonly kind: "date";
  readonly operator: FilterDateOperator;
  readonly value: string | number | null;
  readonly options?: FilterDateOptions;
}

export type FilterDateOperator =
  | "equals"
  | "not_equals"
  | "before"
  | "before_or_equals"
  | "after"
  | "after_or_equals"
  | "year_to_date"
  | "this_week"
  | "this_month"
  | "this_year"
  | "last_week"
  | "last_month"
  | "last_year"
  | "next_week"
  | "next_month"
  | "next_year"
  | "today"
  | "tomorrow"
  | "yesterday"
  | "week_of_year"
  | "quarter_of_year"
  | "is_weekend"
  | "is_weekday"
  | "n_days_ago"
  | "n_days_ahead"
  | "n_weeks_ago"
  | "n_weeks_ahead"
  | "n_months_ago"
  | "n_months_ahead"
  | "n_years_ago"
  | "n_years_ahead";

export interface FilterDateOptions {
  readonly nullHandling?: "ignore" | "include";
  readonly includeTime?: boolean;
}

export type FilterFn<T> = (params: FilterFnParams<T>) => boolean;

export interface FilterFnParams<T> {
  readonly data: T | null;
}

export interface FilterFunc<T> {
  readonly kind: "func";
  readonly func: FilterFn<T>;
}

export type FilterModelItem<T> = FilterNumber | FilterString | FilterDate | FilterCombination | FilterFunc<T>;
export interface FilterNumber {
  readonly kind: "number";
  readonly operator: FilterNumberOperator;
  readonly value: number | null;
  readonly options?: FilterNumberOptions;
}

export type FilterNumberOperator =
  | "greater_than"
  | "greater_than_or_equals"
  | "less_than"
  | "less_than_or_equals"
  | "equals"
  | "not_equals";

export interface FilterNumberOptions {
  readonly absolute?: boolean;
  readonly epsilon?: number;
  readonly nullHandling?: "ignore" | "include";
}

export interface FilterString {
  readonly kind: "string";
  readonly operator: FilterStringOperator;
  readonly value: string | number | null;
  readonly options?: FilterStringOptions;
}

export interface FilterStringCollation {
  readonly locale: Locale;
  readonly sensitivity?: Intl.CollatorOptions["sensitivity"];
}

export type FilterStringOperator =
  | "equals"
  | "not_equals"
  | "less_than"
  | "less_than_or_equals"
  | "greater_than"
  | "greater_than_or_equals"
  | "begins_with"
  | "not_begins_with"
  | "ends_with"
  | "not_ends_with"
  | "contains"
  | "not_contains"
  | "length"
  | "not_length"
  | "matches"
  | "length_less_than"
  | "length_less_than_or_equals"
  | "length_greater_than"
  | "length_greater_than_or_equals";

export interface FilterStringOptions {
  readonly regexOpts?: string;
  readonly trimWhitespace?: boolean;
  readonly caseInsensitive?: boolean;
  readonly ignorePunctuation?: boolean;
  readonly nullHandling?: "ignore" | "include";
  readonly collation?: FilterStringCollation;
}

export type Locale =
  | "en-US"
  | "en-GB"
  | "en-CA"
  | "en-AU"
  | "en-IN"
  | "fr-FR"
  | "fr-CA"
  | "fr-BE"
  | "fr-CH"
  | "es-ES"
  | "es-MX"
  | "es-AR"
  | "es-CO"
  | "zh-CN"
  | "zh-TW"
  | "zh-HK"
  | "zh-Hant"
  | "zh-Hans"
  | "ar-SA"
  | "ar-EG"
  | "ar-AE"
  | "de-DE"
  | "de-AT"
  | "de-CH"
  | "ja-JP"
  | "ko-KR"
  | "hi-IN"
  | "pt-BR"
  | "pt-PT"
  | "ru-RU"
  | "uk-UA"
  | "pl-PL"
  | "it-IT"
  | "nl-NL"
  | "sv-SE"
  | "tr-TR"
  | "th-TH"
  | "vi-VN"
  | "he-IL"
  | "fa-IR"
  | "el-GR";
