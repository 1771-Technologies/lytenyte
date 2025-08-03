import type { FunctionType, InterfaceType, PropertyType, UnionType } from "../+types.js";
import { DataProp, GridProp } from "./shared-properties.js";

const nullHandling: PropertyType = {
  kind: "property",
  name: "nullHandling",
  value: '"ignore" | "include"',
  optional: true,
  tsDoc: `
    Controls how \`null\` values are treated when applying the filter.

    - \`"ignore"\`: Excludes rows where the value is \`null\`
    - \`"include"\`: Retains rows with \`null\` values

    **Note:** Actual behavior depends on the row data source. Properly implemented sources will
    respect this setting, but others may not. Additionally, this setting may be ignored by some
    filter operators. For instance, equality checks may treat \`null\` as a valid match if it's
    explicitly passed as the filter value.
  `,
  doc: { en: `` },
};

export const FilterNumberOperator: UnionType = {
  kind: "union",
  name: "FilterNumberOperator",
  export: true,
  types: [
    '"greater_than"',
    '"greater_than_or_equals"',
    '"less_than"',
    '"less_than_or_equals"',
    '"equals"',
    '"not_equals"',
  ],
  tsDoc: `
    Logical operators available for number-based filtering.
    
    These correspond to traditional comparison operators:
    - \`greater_than\` → \`>\`
    - \`less_than_or_equals\` → \`<=\`
    etc.
  `,
  doc: { en: `` },
};

export const FilterNumberOptions: InterfaceType = {
  kind: "interface",
  name: "FilterNumberOptions",
  export: true,
  tsDoc: `
    Optional configuration values for number filters. These options allow fine-tuning of filter behavior,
    especially in cases involving precision or null handling.
  `,
  doc: { en: `` },
  properties: [
    {
      kind: "property",
      name: "absolute",
      value: "boolean",
      optional: true,
      tsDoc: `
        If set to \`true\`, the filter will compare absolute values instead of signed numbers.
        
        Useful for scenarios where magnitude is more relevant than direction (e.g., distance, deviation).
      `,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "epsilon",
      value: "number",
      optional: true,
      tsDoc: `
        Floating-point precision buffer when evaluating comparisons.
        
        For example, a comparison using \`epsilon = 0.0001\` allows for minor rounding differences
        when dealing with decimal values.
      `,
      doc: { en: `` },
    },
    nullHandling,
  ],
};

export const FilterNumber: InterfaceType = {
  kind: "interface",
  name: "FilterNumber",
  export: true,
  tsDoc: `
    Defines a filter for numeric columns.

    Applies common comparison logic to include or exclude rows based on numerical values in a specified column.
  `,
  doc: { en: `` },
  seeAlso: [
    { kind: "link", name: "Filters", link: "TODO", description: "Overview of the filters" },
  ],
  properties: [
    {
      kind: "property",
      name: "kind",
      value: '"number"',
      optional: false,
      tsDoc: `
        Discriminant property used for type narrowing and filter dispatching.
        Identifies this object as a number-based filter.
      `,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "field",
      optional: false,
      value: "string",
      tsDoc: `
        Column \`id\` this filter targets.

        This string should match the \`id\` field defined in a column schema and is used to retrieve
        the relevant value from each row.
      `,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "operator",
      value: "FilterNumberOperator",
      optional: false,
      tsDoc: `
        Operator to apply in the filter condition (e.g., \`greater_than\`, \`equals\`).
        
        Determines how the row value is compared to the provided \`value\`.
      `,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "value",
      value: "number | null",
      tsDoc: `
        Target value for the filter.

        This will be used as the right-hand operand when applying the operator to each row's value.
        May be \`null\` if specifically filtering for nulls.
      `,
      doc: { en: `` },
      optional: false,
    },
    {
      kind: "property",
      name: "options",
      value: "FilterNumberOptions",
      optional: true,
      tsDoc: `
        Optional behavior modifiers for the filter such as absolute value comparison and null handling.

        These settings enhance precision and flexibility when filtering numerical data.
      `,
      doc: { en: `` },
    },
  ],
};

export const FilterStringOperator: UnionType = {
  kind: "union",
  name: "FilterStringOperator",
  export: true,
  types: [
    '"equals"',
    '"not_equals"',
    '"less_than"',
    '"less_than_or_equals"',
    '"greater_than"',
    '"greater_than_or_equals"',
    '"begins_with"',
    '"not_begins_with"',
    '"ends_with"',
    '"not_ends_with"',
    '"contains"',
    '"not_contains"',
    '"length"',
    '"not_length"',
    '"matches"',
    '"length_less_than"',
    '"length_less_than_or_equals"',
    '"length_greater_than"',
    '"length_greater_than_or_equals"',
  ],
  tsDoc: `
    List of operators available for string filtering.

    These include comparison operators (e.g., "equals"), substring checks (e.g., "contains"), and
    length-based checks (e.g., "length_less_than"). Some operators require a numeric \`value\`
    (e.g., those dealing with string length).
  `,
  doc: { en: `` },
  seeAlso: [],
};

export const FilterStringCollation: InterfaceType = {
  kind: "interface",
  name: "FilterStringCollation",
  export: true,
  tsDoc: `
    Collation configuration for locale-sensitive string comparisons.

    Used to construct an \`Intl.Collator\` instance, which enables proper handling of language and region-specific rules.
  `,
  doc: { en: `` },
  properties: [
    {
      kind: "property",
      optional: false,
      name: "locale",
      value: "Locale",
      tsDoc: `
        The locale string to apply during comparisons (e.g., "en", "de", "zh-CN").
        This determines how values are interpreted for culturally appropriate sorting.
      `,
      doc: { en: `` },
    },
    {
      kind: "property",
      optional: true,
      name: "sensitivity",
      value: 'Intl.CollatorOptions["sensitivity"]',
      tsDoc: `
        Specifies the sensitivity of character comparisons (e.g., case vs. accent differences).

        See the [Intl.Collator documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator)
        for details on supported sensitivity levels.
      `,
      doc: { en: `` },
    },
  ],
};

export const FilterStringOptions: InterfaceType = {
  kind: "interface",
  name: "FilterStringOptions",
  export: true,
  tsDoc: `
    Optional settings to modify the behavior of string filter evaluation.

    These provide control over how string values are matched, such as case sensitivity, whitespace trimming,
    regular expression flags, and locale-based collation.
  `,
  doc: { en: `` },
  properties: [
    {
      kind: "property",
      name: "regexOpts",
      value: "string",
      optional: true,
      tsDoc: `
        Flags to apply when using the \`matches\` operator (e.g., "i" for case-insensitive, "g" for global).

        See the [MDN RegExp flags guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions#advanced_searching_with_flags)
        for details.
      `,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "trimWhitespace",
      value: "boolean",
      optional: true,
      tsDoc: `
        If true, trims leading and trailing whitespace from both the value and target before comparing.
      `,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "caseInsensitive",
      value: "boolean",
      optional: true,
      tsDoc: `
        If true, string comparisons are case-insensitive.

        Note: Some locales may implicitly perform case-insensitive comparisons depending on \`sensitivity\`.
      `,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "ignorePunctuation",
      value: "boolean",
      optional: true,
      tsDoc: `
        If true, removes punctuation from strings before evaluating the comparison.
      `,
      doc: { en: `` },
    },
    nullHandling,
    {
      kind: "property",
      name: "collation",
      value: "FilterStringCollation",
      optional: true,
      tsDoc: `
        Collation options to apply locale-sensitive sorting and comparison behavior using \`Intl.Collator\`.
      `,
      doc: { en: `` },
    },
  ],
};

export const FilterString: InterfaceType = {
  kind: "interface",
  name: "FilterString",
  export: true,
  tsDoc: `
    Filter configuration for string-based column data.

    Supports a wide range of operators such as exact match, substring containment, regex matching, and string length comparisons.
  `,
  doc: { en: `` },
  properties: [
    {
      kind: "property",
      name: "kind",
      value: '"string"',
      optional: false,
      tsDoc: `
        Type discriminant used internally to identify this as a string filter.
        Useful when filters are stored in a mixed array.
      `,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "field",
      value: "string",
      optional: false,
      tsDoc: `
        The column \`id\` the filter applies to.

        The value will be used to retrieve the corresponding field from each row.
      `,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "operator",
      value: "FilterStringOperator",
      optional: false,
      tsDoc: `
        The filtering operator (e.g., "contains", "equals", "length_greater_than").
      `,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "value",
      value: "string | number | null",
      optional: false,
      tsDoc: `
        The value to compare against.

        May be:
        - \`string\`: for most text comparisons
        - \`number\`: for length-based operators
        - \`null\`: when matching absence of value
      `,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "options",
      value: "FilterStringOptions",
      optional: true,
      tsDoc: `
        Optional modifiers to control filter behavior including case sensitivity, whitespace, punctuation,
        and locale-sensitive matching.
      `,
      doc: { en: `` },
    },
  ],
};

export const FilterDateOperator: UnionType = {
  kind: "union",
  name: "FilterDateOperator",
  export: true,
  types: [
    '"equals"',
    '"not_equals"',
    '"before"',
    '"before_or_equals"',
    '"after"',
    '"after_or_equals"',
    '"year_to_date"',
    '"this_week"',
    '"this_month"',
    '"this_year"',
    '"last_week"',
    '"last_month"',
    '"last_year"',
    '"next_week"',
    '"next_month"',
    '"next_year"',
    '"today"',
    '"tomorrow"',
    '"yesterday"',
    '"week_of_year"',
    '"quarter_of_year"',
    '"is_weekend"',
    '"is_weekday"',
    '"n_days_ago"',
    '"n_days_ahead"',
    '"n_weeks_ago"',
    '"n_weeks_ahead"',
    '"n_months_ago"',
    '"n_months_ahead"',
    '"n_years_ago"',
    '"n_years_ahead"',
  ],
  tsDoc: `
    Set of valid comparison operators for evaluating date-based filters.

    These operators support both fixed comparisons (e.g., "equals", "before") and dynamic
    relative date expressions (e.g., "n_days_ago", "last_week", "is_weekend").
    
    The required type of the \`value\` field depends on the selected operator.
  `,
  doc: { en: `` },
  seeAlso: [],
};

export const FilterDateOptions: InterfaceType = {
  kind: "interface",
  name: "FilterDateOptions",
  export: true,
  properties: [
    nullHandling,
    {
      kind: "property",
      name: "includeTime",
      optional: true,
      value: "boolean",
      tsDoc: `
        If true, includes time components (hours, minutes, seconds) when comparing date values.

        By default, only the calendar date is compared. Enabling this flag allows for high-precision
        filtering, which is useful for timestamp-based data (e.g., log entries or event schedules).
      `,
      doc: { en: `` },
    },
  ],
  tsDoc: `
    Optional modifiers to customize date filter evaluation behavior.

    Includes options like null handling and whether time values should be considered
    during comparisons.
  `,
  doc: { en: `` },
};

export const FilterDate: InterfaceType = {
  kind: "interface",
  name: "FilterDate",
  export: true,
  properties: [
    {
      kind: "property",
      name: "kind",
      optional: false,
      value: '"date"',
      tsDoc: `
        Type discriminator used to identify this filter as a date-based filter.

        Helps distinguish between multiple filter types when working with compound filters.
      `,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "field",
      optional: false,
      value: "string",
      tsDoc: `
        The identifier of the column this filter applies to.

        This should match the \`id\` of a column whose value represents a date in ISO string format.
      `,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "operator",
      optional: false,
      value: "FilterDateOperator",
      tsDoc: `
        The comparison operator to apply. Determines how the field value is matched
        against the provided filter \`value\`.

        Refer to {@link FilterDateOperator} for the complete set of options.
      `,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "value",
      optional: false,
      value: "string | number | null",
      tsDoc: `
        The comparison value used by the filter.

        This may be:
        - A date string (e.g., "2025-01-01") for direct comparisons
        - A number (e.g., 7) for relative filters like "n_days_ago"
        - Null, for special null-matching semantics

        The exact type depends on the operator in use.
      `,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "options",
      optional: true,
      value: "FilterDateOptions",
      tsDoc: `
        Optional configuration to control how the date is parsed and compared.

        For example, setting \`includeTime\` enables precise comparisons down to milliseconds.
      `,
      doc: { en: `` },
    },
  ],
  tsDoc: `
    A filter type for evaluating date fields in a grid dataset.

    Date filters enable both exact and relative comparisons of date values and are essential
    for time-series or event-driven data. LyteNyte Grid expects date values to follow a standard
    ISO string format like \`"2025-02-01 12:00:11-02:00"\`.

    If filtering on timestamps or partial dates, be mindful of timezone offsets and whether
    time components are relevant to your comparison.
  `,
  doc: { en: `` },
};

export const FilterInOperation: UnionType = {
  kind: "union",
  name: "FilterInOperator",
  export: true,
  types: ['"in"', '"not_in"'],
  tsDoc: `
    The valid operators for an \`in\` filter.

    - \`"in"\`: Tests for inclusion in the set.
    - \`"not_in"\`: Tests for exclusion from the set.
  `,
  doc: { en: `` },
  tag: "pro",
};

export const FilterIn: InterfaceType = {
  kind: "interface",
  name: "FilterIn",
  export: true,
  properties: [
    {
      kind: "property",
      name: "kind",
      value: '"in"',
      optional: false,
      tsDoc: `
        Type discriminator used to identify this filter as an \`in\` filter.
        Ensures correct handling within the filter model.
      `,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "field",
      value: "string",
      optional: false,
      tsDoc: `
        The \`id\` of the column whose values are to be filtered.
        This identifies the source field for filter evaluation.
      `,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "operator",
      value: "FilterInOperator",
      optional: false,
      tsDoc: `
        Specifies whether to include or exclude the values in the set.
        See {@link FilterInOperator}.
      `,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "value",
      value: "Set<string | number | null>",
      optional: false,
      tsDoc: `
        The set of allowed or disallowed values to filter against.

        Values may include strings, numbers, or nulls. The operator
        determines how this set is interpreted.
      `,
      doc: { en: `` },
    },
  ],
  tsDoc: `
    Represents a set-based filter that checks whether a value is included
    in (or excluded from) a set of values.

    Often referred to as a "Set Filter", this is a PRO-only feature in
    LyteNyte Grid and cannot be nested in combination filters.
  `,
  doc: { en: `` },
  tag: "pro",
};

export const FilterCombinationOperator: UnionType = {
  kind: "union",
  name: "FilterCombinationOperator",
  export: true,
  types: ['"AND"', '"OR"'],
  tsDoc: `
    Logical operators used to join multiple filters inside a combination filter.
  `,
  doc: { en: `` },
};

const FilterCombinationKind: PropertyType = {
  kind: "property",
  name: "kind",
  value: '"combination"',
  optional: false,
  tsDoc: `
    Type discriminator for a combination filter.
    Identifies this object as a logical combination of sub-filters.
  `,
  doc: { en: `` },
};

const FilterCombinationOperatorProp: PropertyType = {
  kind: "property",
  name: "operator",
  value: "FilterCombinationOperator",
  optional: false,
  tsDoc: `
    The logical operator to apply when evaluating the list of filters
    (e.g., AND, OR).
  `,
  doc: { en: `` },
};

export const FilterCombination: InterfaceType = {
  kind: "interface",
  name: "FilterCombination",
  export: true,
  properties: [
    FilterCombinationKind,
    FilterCombinationOperatorProp,
    {
      kind: "property",
      name: "filters",
      value: "Array<FilterNumber | FilterString | FilterDate | FilterCombination>",
      optional: false,
      tsDoc: `
        The list of filters to combine using the specified operator.

        This list may contain any combination of core filter types,
        including nested combination filters.
      `,
      doc: { en: `` },
    },
  ],
  tsDoc: `
    A logical grouping filter used to apply multiple filters together
    using AND or OR logic.

    Combination filters enable complex conditional logic by nesting
    different filters into a tree structure.
  `,
  doc: { en: `` },
};

export const FilterFnParams: InterfaceType = {
  kind: "interface",
  name: "FilterFnParams<T>",
  export: true,
  tsDoc: `
    The parameters passed to a custom function filter.

    Includes both the current row's data and the overall grid configuration.
  `,
  doc: { en: `` },
  properties: [DataProp, GridProp],
};

export const FilterFn: FunctionType = {
  kind: "function",
  name: "FilterFn<T>",
  export: true,
  return: "boolean",
  properties: [
    {
      kind: "property",
      name: "params",
      value: "FilterFnParams<T>",
      optional: false,
      tsDoc: `
        The parameters passed to the function filter, providing row data
        and grid context.
      `,
      doc: { en: `` },
    },
  ],
  tsDoc: `
    A function-based filter used for advanced filtering logic that cannot
    be represented using built-in filter types.

    The function should return \`true\` to keep a row or \`false\` to filter it out.
  `,
  doc: { en: `` },
};

export const FilterFunc: InterfaceType = {
  kind: "interface",
  name: "FilterFunc<T>",
  export: true,
  properties: [
    {
      kind: "property",
      name: "kind",
      value: '"func"',
      optional: false,
      tsDoc: `
        Type discriminator used to identify this as a function filter.
      `,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "func",
      value: "FilterFn<T>",
      optional: false,
      tsDoc: `
        The filter function to evaluate for each row.
      `,
      doc: { en: `` },
    },
  ],
  tsDoc: `
    A functional filter definition. It provides ultimate flexibility
    for filtering scenarios that don't conform to basic models.

    Should be used selectively and optimized for performance.
  `,
  doc: { en: `` },
};

export const Locale: UnionType = {
  kind: "union",
  name: "Locale",
  export: true,
  types: [
    '"en-US"',
    '"en-GB"',
    '"en-CA"',
    '"en-AU"',
    '"en-IN"',
    '"fr-FR"',
    '"fr-CA"',
    '"fr-BE"',
    '"fr-CH"',
    '"es-ES"',
    '"es-MX"',
    '"es-AR"',
    '"es-CO"',
    '"zh-CN"',
    '"zh-TW"',
    '"zh-HK"',
    '"zh-Hant"',
    '"zh-Hans"',
    '"ar-SA"',
    '"ar-EG"',
    '"ar-AE"',
    '"de-DE"',
    '"de-AT"',
    '"de-CH"',
    '"ja-JP"',
    '"ko-KR"',
    '"hi-IN"',
    '"pt-BR"',
    '"pt-PT"',
    '"ru-RU"',
    '"uk-UA"',
    '"pl-PL"',
    '"it-IT"',
    '"nl-NL"',
    '"sv-SE"',
    '"tr-TR"',
    '"th-TH"',
    '"vi-VN"',
    '"he-IL"',
    '"fa-IR"',
    '"el-GR"',
  ],
  tsDoc: `
    The supported locale identifiers for string filtering and collation.

    Used to configure internationalized string comparison behavior.
  `,
  doc: { en: `` },
};

export const FilterModelItem: UnionType = {
  kind: "union",
  name: "FilterModelItem<T>",
  export: true,
  types: ["FilterNumber", "FilterString", "FilterDate", "FilterCombination", "FilterFunc<T>"],
  tsDoc: `
    The full set of filter types available in the LyteNyte Grid core edition.
  `,
  doc: { en: `` },
  tag: "core",
};

export const FilterModelItemPro: UnionType = {
  kind: "union",
  name: "FilterModelItem<T>",
  export: true,
  types: [
    "FilterNumber",
    "FilterString",
    "FilterDate",
    "FilterIn",
    "FilterCombination",
    "FilterFunc<T>",
  ],
  tsDoc: `
    The full set of filter types supported in the PRO edition of LyteNyte Grid.

    Includes advanced set-based filtering with the \`FilterIn\` type.
  `,
  doc: { en: `` },
  tag: "pro",
};

export const FilterQuickSearchSensitivity: UnionType = {
  kind: "union",
  name: "FilterQuickSearchSensitivity",
  export: true,
  types: ['"case-sensitive"', '"case-insensitive"'],
  tsDoc: `
    Sensitivity mode for the quick search functionality.

    - \`"case-sensitive"\`: Exact matches required.
    - \`"case-insensitive"\`: Case differences are ignored.
  `,
  doc: { en: `` },
  tag: "pro",
};

export const FilterInFilterItem: InterfaceType = {
  kind: "interface",
  name: "FilterInFilterItem",
  export: true,
  tag: "pro",
  properties: [
    {
      kind: "property",
      name: "label",
      value: "string",
      optional: false,
      tsDoc: `
        The display label for the item in the UI. Should be human-readable
        even when the value itself is raw or technical.
      `,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "value",
      value: "unknown",
      optional: false,
      tsDoc: `
        The value to be matched in the in-filter set. Typically a string or number.
      `,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "group",
      value: "string[]",
      optional: true,
      tsDoc: `
        Grouping path to organize filter values into nested structures.

        This is useful for tree-based UIs where items belong to categories
        (e.g., year > month > day).
      `,
      doc: { en: `` },
    },
  ],
  tsDoc: `
    Represents a displayable filter option for use with the \`in\` filter UI component.

    Supports grouping and human-friendly labeling for raw filter values.
  `,
  doc: { en: `` },
};
