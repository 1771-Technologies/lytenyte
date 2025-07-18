import type { FunctionType, InterfaceType, PropertyType, UnionType } from "../+types.js";
import { DataProp, GridProp } from "./shared-properties.js";

const nullHandling: PropertyType = {
  kind: "property",
  name: "nullHandling",
  value: '"ignore" | "include"',
  optional: true,
  tsDoc: `
    When filtering \`null\` values represent the absence of a value. Since there is not value 
    to compare the filter on - there are two choices; keep the value, or filter it out. The 
    \`nullHandling\` property determines which option to take, where \`"ignore"\` will filter 
    out null values and \`"include"\` will keep them.

    It's important to note that filtering is performed by the row data source attached to the
    grid, hence the actual behavior depends on the source. A properly behaving data source will
    filter \`null\` values accordingly but not all sources may choose to do this. Furthermore,
    depending on the operator used for the filter, the \`nullHandling\` property may be ignored.
    For example, when comparing for equality ('===') the filter implementation should check that 
    the current value is equal to the filter value - including the absence of a value. Intuitively
    this makes sense as it allows the equality operator to be used to check for \`null\` values 
    themselves.
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
  seeAlso: [],
  tsDoc: `
    The operators that may be used for the a number filter. These correspond to the standard expected
    logical operators, like >, and <.
  `,
  doc: {
    en: ``,
  },
};

export const FilterNumberOptions: InterfaceType = {
  kind: "interface",
  name: "FilterNumberOptions",
  export: true,
  properties: [
    {
      kind: "property",
      name: "absolute",
      value: "boolean",
      optional: true,
      tsDoc: `
        Makes the number filter only consider the magnitude of a number value ignoring its sign.
        Useful when the size of the number is the main consideration.
      `,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "epsilon",
      value: "number",
      optional: true,
      tsDoc: `
        The epsilon value to use when comparing numbers. Mostly useful when comparing floats. By
        default the value is 0.0001 however it may be adjusted for higher or lower precision.
      `,
      doc: { en: `` },
    },
    nullHandling,
  ],
  tsDoc: `
    The filter options that may be provided to a number filter. The filter options will adjust 
    how the number filter behaves providing more flexibility to less effort.
  `,
  doc: { en: `` },
};

export const FilterNumber: InterfaceType = {
  kind: "interface",
  name: "FilterNumber",
  tsDoc: `
    The number filter is used to filter out rows based on a column that contains number values.
    Most useful for numerical datasets.
  `,
  doc: {
    en: ``,
  },

  seeAlso: [
    { kind: "link", name: "Filters", link: "TODO", description: "Overview of the filters" },
  ],
  export: true,
  properties: [
    {
      kind: "property",
      name: "kind",
      value: '"number"',
      optional: false,
      tsDoc: `
        A type discriminant for the {@link FilterNumber} type, which may be used to narrow the 
        the type when given a set of filters. Mainly used in the evaluation of filters, for example
        a {@link FilterCombination} accepts filters of different types.
      `,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "field",
      optional: false,
      value: "string",
      tsDoc: `
        The column reference the filter should use. This is used to extract a field value for the 
        filter for a given row. This should be the \`id\` of a column.
      `,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "operator",
      value: "FilterNumberOperator",
      optional: false,
      tsDoc: `
        The number filter operator to use when evaluating the filter. This value should be the string
        name of the operator, for example "equals" and not "==".
      `,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "value",
      value: "number | null",
      tsDoc: `
        The filter value to compare with. The actual filter evaluation outcome is determined by the
        operator applied.
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
        The filter number options to apply to the filter. Filter options alter the evaluation result
        of a filter, for example using the absolute value of a number when performing the operator
        calculation.
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
    The filter operator for strings. Some operators expect the value provided to be a number,
    for example when comparing the length of strings.
  `,
  doc: { en: `` },
  seeAlso: [],
};

export const FilterStringCollation: InterfaceType = {
  kind: "interface",
  name: "FilterStringCollation",
  export: true,
  properties: [
    {
      kind: "property",
      optional: false,
      name: "locale",
      value: "Locale",
      tsDoc: `
        The locale to use for string comparisons and operators. It should be one of the predefined
        types. If not provided the default locale on the system is used.
      `,
      doc: { en: `` },
    },
    {
      kind: "property",
      optional: true,
      name: "sensitivity",
      value: 'Intl.CollatorOptions["sensitivity"]',
      tsDoc: `
        The locale sensitivity - used to construct an Intl.Collator object. Refer to the 
        [MDN docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator)
        for more information.
      `,
      doc: { en: `` },
    },
  ],
  tsDoc: `
    The string collation options used to create an Intl.Collator object that will be used for 
    string comparisons. 
  `,
  doc: { en: `` },
};

export const FilterStringOptions: InterfaceType = {
  kind: "interface",
  name: "FilterStringOptions",
  export: true,
  properties: [
    {
      kind: "property",
      name: "regexOpts",
      value: "string",
      optional: true,
      tsDoc: `
        The regex opts to use for the construction of a regex object to use for the \`matches\` 
        string filter operator. See the [MDN docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions#advanced_searching_with_flags)
        for information on the different flags.
      `,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "trimWhitespace",
      value: "boolean",
      optional: true,
      tsDoc: `
        A flag to determine if whitespace should be stripped before string comparisons. This will
        result in leading and trailing whitespace to be ignored when performing string comparisons.
      `,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "caseInsensitive",
      value: "boolean",
      optional: true,
      tsDoc: `
        A flag indicating if the comparison should be case insensitive. By default comparisons 
        are case insensitive if the filter value does not contain an upper case letter. However,
        depending on the collator sensitivity the default value may 
        actually be case insensitive. For example a collator sensitivity of \`"base"\` or 
        \`"accent"\` result in case case insensitive comparisons.
      `,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "ignorePunctuation",
      value: "boolean",
      optional: true,
      tsDoc: `
        If punctuation characters should be ignored when performing string comparisons. By default
        punctuation is considered.
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
        The collation parameters to use for the filter evaluation. If provided these parameters will
        be used to create an \`Intl.Collator\` object that is then used in the comparison operator
        for filter evaluation.
      `,
      doc: { en: `` },
    },
  ],
  tsDoc: `
    The options to use for filter string evaluation. The options allow filter evaluation behavior
    to be altered in specific ways, such as ignoring letter casing, trimming whitespace, and 
    ignoring punctuation. The filter string options additionally allow a locale to be used for 
    string filtering.
  `,
  doc: { en: `` },
};

export const FilterString: InterfaceType = {
  kind: "interface",
  name: "FilterString",
  tsDoc: `
    The string filter used to evaluate values that are string based. Used to filter out rows based
    on the string values of a particular column.
  `,
  doc: {
    en: ``,
  },
  export: true,
  properties: [
    {
      kind: "property",
      name: "kind",
      value: '"string"',
      optional: false,
      tsDoc: `
        A type discriminant for the {@link FilterString} type, which may be used to narrow the 
        the type when given a set of filters. Mainly used in the evaluation of filters, for example
        a {@link FilterCombination} accepts filters of different types.
      `,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "field",
      optional: false,
      value: "string",
      tsDoc: `
        The column reference the filter should use. This is used to extract a field value for the 
        filter for a given row. This should be the \`id\` of a column.
      `,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "operator",
      value: "FilterStringOperator",
      optional: false,
      tsDoc: `
        The string filter operator to use when evaluating the filter. This value should be the string
        name of the operator, for example "equals" and not "==".
      `,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "value",
      value: "string | number | null",
      tsDoc: `
        The string filter evaluation value. For some filter operators a \`number\` value makes
        sense, for example, when comparing the lengths of strings. It is an undefined error to
        use a \`number\` value where a filter operator expects a \`string\`.
      `,
      doc: { en: `` },
      optional: false,
    },
    {
      kind: "property",
      name: "options",
      value: "FilterStringOptions",
      optional: true,
      tsDoc: `
        The options to apply for the string filter evaluation. The string options may be used to
        alter the behavior of filter evaluation, for example to make comparisons case insensitive.
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
    The operators available for the date filter. The operator used determines the type of 
    value that should be used.
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
        If the time should be used for date filter evaluations. By default only the date is 
        considered. Setting the \`includeTime\` to \`true\` will make the comparisons time aware.
      `,
      doc: { en: `` },
    },
  ],
  tsDoc: ``,
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
      tsDoc: ``,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "field",
      optional: false,
      value: "string",
      tsDoc: ``,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "operator",
      optional: false,
      value: "FilterDateOperator",
      tsDoc: ``,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "value",
      optional: false,
      value: "string | number | null",
      tsDoc: ``,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "options",
      optional: true,
      value: "FilterDateOptions",
      tsDoc: ``,
      doc: { en: `` },
    },
  ],
  tsDoc: ``,
  doc: { en: `` },
};

export const FilterInOperation: UnionType = {
  kind: "union",
  name: "FilterInOperator",
  export: true,
  types: ['"in"', '"not_in"'],
  tsDoc: ``,
  doc: { en: `` },
  tag: "pro",
};
export const FilterIn: InterfaceType = {
  kind: "interface",
  name: "FilterIn",
  export: true,
  properties: [
    { kind: "property", name: "kind", value: '"in"', tsDoc: ``, doc: { en: `` }, optional: false },
    {
      kind: "property",
      name: "field",
      value: "string",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
    },
    {
      kind: "property",
      name: "operator",
      value: "FilterInOperator",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
    },
    {
      kind: "property",
      name: "value",
      value: "Set<string | number | null>",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
    },
  ],
  tsDoc: ``,
  doc: { en: `` },
  tag: "pro",
};

export const FilterCombinationOperator: UnionType = {
  kind: "union",
  name: "FilterCombinationOperator",
  export: true,
  types: ['"AND"', '"OR"'],
  tsDoc: ``,
  doc: { en: `` },
};

const FilterCombinationKind: PropertyType = {
  kind: "property",
  name: "kind",
  value: '"combination"',
  optional: false,
  tsDoc: ``,
  doc: { en: `` },
};
const FilterCombinationOperatorProp: PropertyType = {
  kind: "property",
  name: "operator",
  value: "FilterCombinationOperator",
  optional: false,
  tsDoc: ``,
  doc: { en: `` },
};
export const FilterCombinationCore: InterfaceType = {
  kind: "interface",
  name: "FilterCombination",
  export: true,
  properties: [
    FilterCombinationKind,
    FilterCombinationOperatorProp,
    {
      kind: "property",
      name: "filters",
      optional: false,
      value: "Array<FilterNumber | FilterString | FilterDate | FilterCombination>",
      tsDoc: ``,
      doc: { en: `` },
    },
  ],
  tsDoc: ``,
  doc: { en: `` },
  tag: "core",
};

export const FilterCombinationPro: InterfaceType = {
  kind: "interface",
  name: "FilterCombination",
  export: true,
  properties: [
    FilterCombinationKind,
    FilterCombinationOperatorProp,
    {
      kind: "property",
      name: "filters",
      optional: false,
      value: "Array<FilterNumber | FilterString | FilterDate | FilterCombination | FilterIn>",
      tsDoc: ``,
      doc: { en: `` },
    },
  ],
  tsDoc: ``,
  doc: { en: `` },
  tag: "pro",
};

export const FilterFnParams: InterfaceType = {
  kind: "interface",
  name: "FilterFnParams<T>",
  export: true,
  tsDoc: ``,
  doc: { en: `` },
  properties: [DataProp, GridProp],
};

export const FilterFn: FunctionType = {
  kind: "function",
  name: "FilterFn<T>",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  return: "boolean",
  properties: [
    {
      kind: "property",
      name: "params",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
      value: "FilterFnParams<T>",
    },
  ],
};

export const FilterDynamic: InterfaceType = {
  kind: "interface",
  name: "FilterDynamic<T>",
  export: true,
  properties: [
    {
      kind: "property",
      tsDoc: ``,
      doc: { en: `` },
      name: "kind",
      value: '"func"',
      optional: false,
    },
    {
      kind: "property",
      tsDoc: ``,
      doc: { en: `` },
      name: "func",
      value: "FilterFn<T>",
      optional: false,
    },
  ],
  tsDoc: ``,
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
  tsDoc: ``,
  doc: { en: `` },
};

export const FilterModelItem: UnionType = {
  kind: "union",
  export: true,
  name: "FilterModelItem<T>",
  types: ["FilterNumber", "FilterString", "FilterDate", "FilterCombination", "FilterDynamic<T>"],
  tsDoc: ``,
  doc: { en: `` },
  tag: "core",
};

export const FilterModelItemPro: UnionType = {
  kind: "union",
  export: true,
  name: "FilterModelItem<T>",
  types: [
    "FilterNumber",
    "FilterString",
    "FilterDate",
    "FilterIn",
    "FilterCombination",
    "FilterDynamic<T>",
  ],
  tsDoc: ``,
  doc: { en: `` },
  tag: "pro",
};
