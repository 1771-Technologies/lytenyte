import type { FunctionType, InterfaceType, PropertyType, UnionType } from "../+types.js";

const NullsFirstProp: PropertyType = {
  kind: "property",
  name: "nullsFirst",
  optional: true,
  tsDoc: `
  A boolean indicating if null values should appear first in the sort order.
  
  @group Sort
  `,
  doc: { en: `` },
  value: "boolean",
};

export const SortStringComparatorOptions: InterfaceType = {
  kind: "interface",
  name: "SortStringComparatorOptions",
  export: true,
  tsDoc: `
  Options used when sorting string values.
  
  @group Sort
  `,
  doc: { en: `` },
  properties: [
    {
      kind: "property",
      name: "caseInsensitive",
      value: "boolean",
      optional: true,
      tsDoc: `Whether string sorting should ignore case.`,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "trimWhitespace",
      value: "boolean",
      optional: true,
      tsDoc: `Whether leading/trailing whitespace should be trimmed before sorting.`,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "ignorePunctuation",
      value: "boolean",
      optional: true,
      tsDoc: `Whether punctuation should be ignored during sorting.`,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "locale",
      value: "string",
      optional: true,
      tsDoc: `The locale used for collation-based sorting.`,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "collator",
      value: "Intl.Collator",
      optional: true,
      tsDoc: `An optional Intl.Collator instance to use for string comparison.`,
      doc: { en: `` },
    },
    NullsFirstProp,
  ],
};

export const SortNumberComparatorOptions: InterfaceType = {
  kind: "interface",
  name: "SortNumberComparatorOptions",
  export: true,
  tsDoc: `
  Options for number-based sorting.
  
  @group Sort
  `,
  doc: { en: `` },
  properties: [
    NullsFirstProp,
    {
      kind: "property",
      name: "absoluteValue",
      value: "boolean",
      optional: true,
      tsDoc: `Whether to compare absolute values instead of raw numbers.`,
      doc: { en: `` },
    },
  ],
};

export const SortDateComparatorOptions: InterfaceType = {
  kind: "interface",
  name: "SortDateComparatorOptions",
  export: true,
  tsDoc: `
  Options used for date-based sorting.
  
  @group Sort
  `,
  doc: { en: `` },
  properties: [
    NullsFirstProp,
    {
      kind: "property",
      name: "toIsoDateString",
      value: "(v: unknown) => string",
      optional: true,
      tsDoc: `A function to convert a value to an ISO date string.`,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "includeTime",
      value: "boolean",
      optional: true,
      tsDoc: `Whether to include the time portion of the date during comparison.`,
      doc: { en: `` },
    },
  ],
};

export const SortComparators: UnionType = {
  kind: "union",
  name: "SortComparators",
  export: true,
  tsDoc: `
  Predefined sort comparator types supported by LyteNyte Grid.
  
  @group Sort
  `,
  doc: { en: `` },
  types: ['"string"', '"number"', '"date"', "(string & {})"],
};

export const SortComparatorFn: FunctionType = {
  kind: "function",
  name: "SortComparatorFn<T>",
  tsDoc: `
  Function signature for custom sort comparators.
  
  @group Sort
  `,
  doc: { en: `` },
  export: true,
  return: "number",
  properties: [
    {
      kind: "property",
      name: "left",
      value: "FieldDataParam<T>",
      optional: false,
      tsDoc: `Left-hand value for comparison.`,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "right",
      value: "FieldDataParam<T>",
      optional: false,
      tsDoc: `Right-hand value for comparison.`,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "options",
      value: "any",
      optional: false,
      tsDoc: `Optional configuration data used by the comparator.`,
      doc: { en: `` },
    },
  ],
};

const ColumnIdProp: PropertyType = {
  kind: "property",
  name: "columnId",
  value: "string | null",
  optional: false,
  tsDoc: `
  The column identifier associated with the sort. May be null if not defined.
  
  @group Sort
  `,
  doc: { en: `` },
};

export const SortStringColumnSort: InterfaceType = {
  kind: "interface",
  name: "SortStringColumnSort",
  tsDoc: `
  A built-in string sort model definition.
  
  @group Sort
  `,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      name: "kind",
      value: '"string"',
      optional: false,
      tsDoc: `Discriminant for the string sort type.`,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "options",
      value: "SortStringComparatorOptions",
      optional: true,
      tsDoc: `Optional string comparator options.`,
      doc: { en: `` },
    },
  ],
};

export const SortNumberColumnSort: InterfaceType = {
  kind: "interface",
  name: "SortNumberColumnSort",
  tsDoc: `
  A built-in numeric sort model definition.
  
  @group Sort
  `,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      name: "kind",
      value: '"number"',
      optional: false,
      tsDoc: `Discriminant for the number sort type.`,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "options",
      value: "SortNumberComparatorOptions",
      optional: true,
      tsDoc: `Optional numeric comparator options.`,
      doc: { en: `` },
    },
  ],
};

export const SortDateColumnSort: InterfaceType = {
  kind: "interface",
  name: "SortDateColumnSort",
  tsDoc: `
  A built-in date sort model definition.
  
  @group Sort
  `,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      name: "kind",
      value: '"date"',
      optional: false,
      tsDoc: `Discriminant for the date sort type.`,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "options",
      value: "SortDateComparatorOptions",
      optional: true,
      tsDoc: `Optional date comparator options.`,
      doc: { en: `` },
    },
  ],
};

export const SortCustomSort: InterfaceType = {
  kind: "interface",
  name: "SortCustomSort<T>",
  tsDoc: `
  Definition for a user-defined custom sort comparator.
  
  @group Sort
  `,
  doc: { en: `` },
  export: true,
  properties: [
    ColumnIdProp,
    {
      kind: "property",
      name: "kind",
      value: '"custom"',
      optional: false,
      tsDoc: `Discriminant for the custom sort type.`,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "comparator",
      value: "SortComparatorFn<T>",
      optional: false,
      tsDoc: `The comparator function used for custom sorting.`,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "options",
      value: "any",
      optional: true,
      tsDoc: `Optional configuration for the custom comparator.`,
      doc: { en: `` },
    },
  ],
};

export const SortGridSorts: UnionType = {
  kind: "union",
  name: "SortGridSorts<T>",
  tsDoc: `
  Union of all supported grid sort types.
  
  @group Sort
  `,
  doc: { en: `` },
  export: true,
  types: ["SortCustomSort<T>", "SortDateColumnSort", "SortNumberColumnSort", "SortStringColumnSort"],
};

export const SortModelItem: InterfaceType = {
  kind: "interface",
  name: "SortModelItem<T>",
  tsDoc: `
  A model item representing an active sort applied to the grid.
  
  @group Sort
  `,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      name: "sort",
      value: "SortGridSorts<T>",
      optional: false,
      tsDoc: `The sort type being applied.`,
      doc: { en: `` },
    },
    ColumnIdProp,
    {
      kind: "property",
      name: "isDescending",
      value: "boolean",
      optional: true,
      tsDoc: `Whether the sort direction is descending.`,
      doc: { en: `` },
    },
  ],
};
