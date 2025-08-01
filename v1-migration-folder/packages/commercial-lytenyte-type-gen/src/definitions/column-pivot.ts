import type { InterfaceType } from "../+types";

export const ColumnPivotRowItem: InterfaceType = {
  kind: "interface",
  name: "ColumnPivotRowItem",
  doc: { en: `` },
  tsDoc: `
  Configuration for row-level grouping in a column pivot model.

  These items define which fields should be used to group rows before creating pivot columns.
  `,
  export: true,
  properties: [
    {
      kind: "property",
      name: "field",
      tsDoc: `The column id to group rows by.`,
      doc: { en: `` },
      optional: false,
      value: "string",
    },
    {
      kind: "property",
      name: "active",
      tsDoc: `
      Indicates whether this grouping is active.

      Defaults to \`true\`. Set to \`false\` to temporarily disable this row grouping without removing it.
      `,
      doc: { en: `` },
      optional: true,
      value: "boolean",
    },
  ],
};

export const ColumnPivotColumnItem: InterfaceType = {
  kind: "interface",
  name: "ColumnPivotColumnItem",
  tsDoc: `
  Configuration for the column dimension of a pivot.

  Each item defines a field whose values will be used to generate dynamic columns in the pivot view.
  `,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      doc: { en: `` },
      name: "field",
      optional: false,
      tsDoc: `The column id used to generate pivoted columns.`,
      value: "string",
    },
    {
      kind: "property",
      name: "active",
      tsDoc: `
      Determines whether this column pivot is currently active.

      Defaults to \`true\`.
      `,
      doc: { en: `` },
      optional: true,
      value: "boolean",
    },
  ],
};

export const ColumnPivotValueItem: InterfaceType = {
  kind: "interface",
  doc: { en: `` },
  export: true,
  name: "ColumnPivotValueItem<T>",
  tsDoc: `
  Configuration for value fields in a pivot (also known as measures).

  These values define what numeric or aggregate data should be shown for each cell in the pivot result.
  `,
  properties: [
    {
      kind: "property",
      name: "field",
      doc: { en: `` },
      optional: false,
      tsDoc: `The column id representing the value to aggregate.`,
      value: "string",
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `The aggregation function to apply to the value. See {@link AggModelFn}.`,
      name: "aggFn",
      optional: false,
      value: "AggModelFn<T>",
    },
    {
      kind: "property",
      name: "active",
      tsDoc: `
      Indicates whether this value item is enabled.

      Defaults to \`true\`. Set to \`false\` to exclude this value from the pivot result.
      `,
      doc: { en: `` },
      optional: true,
      value: "boolean",
    },
  ],
};

export const ColumnPivotModel: InterfaceType = {
  kind: "interface",
  export: true,
  name: "ColumnPivotModel<T>",
  doc: { en: `` },
  tsDoc: `
  The full configuration model for column pivoting in LyteNyte Grid.

  This includes row grouping, column generation, value aggregation, and sort/filter
  configuration for the pivoted result.
  `,
  properties: [
    {
      kind: "property",
      name: "rows",
      tsDoc: `Row-level groupings for the pivot. See {@link ColumnPivotRowItem}.`,
      doc: { en: `` },
      optional: false,
      value: "ColumnPivotRowItem[]",
    },
    {
      kind: "property",
      name: "columns",
      tsDoc: `Fields to pivot on for generating dynamic columns. See {@link ColumnPivotColumnItem}.`,
      doc: { en: `` },
      optional: false,
      value: "ColumnPivotColumnItem[]",
    },
    {
      kind: "property",
      name: "values",
      tsDoc: `
      The value items (measures) to compute and display in the pivot result.

      Each value is aggregated for every dynamic column combination created by the pivot.
      See {@link ColumnPivotValueItem}.
      `,
      doc: { en: `` },
      optional: false,
      value: "ColumnPivotValueItem<T>[]",
    },
    {
      kind: "property",
      name: "sorts",
      tsDoc: `
      Sorting configuration for the pivot result view.

      The sort keys must match dynamically generated pivot column ids.
      `,
      doc: { en: `` },
      optional: false,
      value: "SortModelItem<T>[]",
    },
    {
      kind: "property",
      name: "filters",
      tsDoc: `
      Filtering configuration for the pivot view.

      Like the sort model, filters apply to the dynamically generated pivot columns.
      `,
      doc: { en: `` },
      optional: false,
      value: "FilterModelItem<T>[]",
    },
  ],
};
