import type { PropertyType } from "../+types.js";

export const GridProp: PropertyType = {
  kind: "property",
  name: "grid",
  value: "Grid<T>",
  doc: { en: `` },
  tsDoc: `A reference to the LyteNyte Grid instance.`,
  optional: false,
};

export const RowSelectedProp: PropertyType = {
  kind: "property",
  name: "rowSelected",
  value: "boolean",
  doc: { en: `` },
  tsDoc: `Indicates whether the row is currently selected.`,
  optional: false,
};

export const RowIndeterminateProp: PropertyType = {
  kind: "property",
  name: "rowIndeterminate",
  value: "boolean",
  doc: { en: `` },
  tsDoc: `Indicates whether the row is in an indeterminate selection state.`,
  optional: false,
};

export const IdProp: PropertyType = {
  kind: "property",
  name: "id",
  value: "string",
  doc: { en: `` },
  tsDoc: `A unique identifier that can be used for rendering keys or tracking elements.`,
  optional: false,
};

export const RowIndexProp: PropertyType = {
  kind: "property",
  name: "rowIndex",
  value: "number",
  doc: { en: `` },
  tsDoc: `The zero-based index of the row.`,
  optional: false,
};

export const ColumnIndexProp: PropertyType = {
  kind: "property",
  name: "colIndex",
  value: "number",
  doc: { en: `` },
  tsDoc: `The zero-based index of the column.`,
  optional: false,
};

export const RowNodeProp: PropertyType = {
  kind: "property",
  name: "row",
  value: "RowNode<T>",
  doc: { en: `` },
  tsDoc: `The row node instance in LyteNyte Grid.`,
  optional: false,
};

export const RowNodeAtomProp: PropertyType = {
  kind: "property",
  name: "row",
  value: "GridAtomReadonlyUnwatchable<RowNode<T> | null>",
  doc: { en: `` },
  tsDoc: `A reactive atom for the row node, allowing updates without subscriptions.`,
  optional: false,
};

export const ColumnProp: PropertyType = {
  kind: "property",
  name: "column",
  value: "Column<T>",
  doc: { en: `` },
  tsDoc: `A reference to a column definition in LyteNyte Grid.`,
  optional: false,
};

export const DataProp: PropertyType = {
  kind: "property",
  name: "data",
  doc: { en: `` },
  tsDoc: `The data object associated with the row. It may be \`null\` if the row is loading or not yet available.`,
  optional: false,
  value: "T | null",
};

export const ColPinProp: PropertyType = {
  kind: "property",
  name: "colPin",
  doc: { en: `` },
  tsDoc: `The pinning state of a column, used to fix it to the left or right side.`,
  optional: false,
  value: "ColumnPin",
};

export const RowPinProp: PropertyType = {
  kind: "property",
  name: "rowPin",
  doc: { en: `` },
  tsDoc: `The pinning state of a row, used to fix it to the top or bottom of the grid.`,
  optional: false,
  value: "RowPin",
};

export const ColumnSynonymProp: PropertyType = {
  kind: "property",
  name: "column",
  value: "Column<T> | string | number",
  tsDoc: `A flexible reference to a column, which can be a column object, its id (string), or its index (number).`,
  doc: { en: `` },
  optional: false,
};
