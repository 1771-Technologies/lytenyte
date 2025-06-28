import type { FunctionType, InterfaceType, PropertyType, UnionType } from "../+types";

const NullsFirstProp: PropertyType = {
  kind: "property",
  name: "nullsFirst",
  optional: true,
  tsDoc: ``,
  doc: { en: `` },
  value: "boolean",
};

export const SortStringComparatorOptions: InterfaceType = {
  kind: "interface",
  name: "SortStringComparatorOptions",
  export: true,
  tsDoc: ``,
  doc: { en: `` },
  properties: [
    {
      kind: "property",
      name: "caseInsensitive",
      value: "boolean",
      optional: true,
      tsDoc: ``,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "trimWhitespace",
      tsDoc: ``,
      doc: { en: `` },
      value: "boolean",
      optional: true,
    },
    {
      kind: "property",
      name: "ignorePunctuation",
      tsDoc: ``,
      doc: { en: `` },
      optional: true,
      value: "boolean",
    },
    {
      kind: "property",
      name: "locale",
      optional: true,
      tsDoc: ``,
      doc: { en: `` },
      value: "string",
    },
    {
      kind: "property",
      name: "collator",
      optional: true,
      tsDoc: ``,
      doc: { en: `` },
      value: "Intl.Collator",
    },
    NullsFirstProp,
  ],
};

export const SortNumberComparatorOptions: InterfaceType = {
  kind: "interface",
  name: "SortNumberComparatorOptions",
  export: true,
  tsDoc: ``,
  doc: { en: `` },
  properties: [
    NullsFirstProp,
    {
      kind: "property",
      name: "absoluteValue",
      tsDoc: ``,
      doc: { en: `` },
      optional: true,
      value: "boolean",
    },
  ],
};

export const SortDateComparatorOptions: InterfaceType = {
  kind: "interface",
  name: "SortDateComparatorOptions",
  export: true,
  tsDoc: ``,
  doc: { en: `` },
  properties: [
    NullsFirstProp,
    {
      kind: "property",
      name: "toIsoDateString",
      tsDoc: ``,
      doc: { en: `` },
      optional: true,
      value: "(v: unknown) => string",
    },
    {
      kind: "property",
      name: "includeTime",
      tsDoc: ``,
      doc: { en: `` },
      optional: true,
      value: "boolean",
    },
  ],
};

export const SortComparators: UnionType = {
  kind: "union",
  name: "SortComparators",
  export: true,
  tsDoc: ``,
  doc: { en: `` },
  types: ['"string"', '"number"', '"date"', "(string & {})"],
};

export const SortComparatorFn: FunctionType = {
  kind: "function",
  name: "SortComparatorFn<T>",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  return: "number",
  properties: [
    {
      kind: "property",
      name: "left",
      doc: { en: `` },
      tsDoc: ``,
      optional: false,
      value: "T | Record<string, unknown>",
    },
    {
      kind: "property",
      name: "right",
      doc: { en: `` },
      tsDoc: ``,
      optional: false,
      value: "T | Record<string, unknown>",
    },
    {
      kind: "property",
      name: "options",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
      value: "any",
    },
  ],
};

const ColumnIdProp: PropertyType = {
  kind: "property",
  name: "columnId",
  doc: { en: `` },
  optional: false,
  tsDoc: ``,
  value: "string | null",
};
export const SortStringColumnSort: InterfaceType = {
  kind: "interface",
  name: "SortStringColumnSort",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      name: "kind",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
      value: '"string"',
    },
    {
      kind: "property",
      name: "options",
      doc: { en: `` },
      tsDoc: ``,
      optional: true,
      value: "SortStringComparatorOptions",
    },
  ],
};

export const SortNumberColumnSort: InterfaceType = {
  kind: "interface",
  name: "SortNumberColumnSort",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      name: "kind",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
      value: '"number"',
    },
    {
      kind: "property",
      name: "options",
      doc: { en: `` },
      tsDoc: ``,
      optional: true,
      value: "SortNumberComparatorOptions",
    },
  ],
};

export const SortDateColumnSort: InterfaceType = {
  kind: "interface",
  name: "SortDateColumnSort",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      name: "kind",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
      value: '"date"',
    },
    {
      kind: "property",
      name: "options",
      doc: { en: `` },
      tsDoc: ``,
      optional: true,
      value: "SortDateComparatorOptions",
    },
  ],
};

export const SortCustomSort: InterfaceType = {
  kind: "interface",
  name: "SortCustomSort<T>",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  properties: [
    ColumnIdProp,
    {
      kind: "property",
      name: "kind",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
      value: '"custom"',
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: ``,
      name: "comparator",
      optional: false,
      value: "SortComparatorFn<T>",
    },
    {
      kind: "property",
      name: "options",
      doc: { en: `` },
      tsDoc: ``,
      optional: true,
      value: "any",
    },
  ],
};

export const SortGridSorts: UnionType = {
  kind: "union",
  name: "SortGridSorts<T>",
  doc: { en: `` },
  export: true,
  tsDoc: ``,
  types: [
    "SortCustomSort<T>",
    "SortDateColumnSort",
    "SortNumberColumnSort",
    "SortStringColumnSort",
  ],
};

export const SortModelItem: InterfaceType = {
  kind: "interface",
  name: "SortModelItem<T>",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      name: "sort",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
      value: "SortGridSorts<T>",
    },
    ColumnIdProp,
    {
      kind: "property",
      name: "isDescending",
      tsDoc: ``,
      doc: { en: `` },
      optional: true,
      value: "boolean",
    },
  ],
};
