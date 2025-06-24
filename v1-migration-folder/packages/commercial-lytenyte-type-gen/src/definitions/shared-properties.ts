import type { PropertyType } from "../+types";

export const GridProp: PropertyType = {
  kind: "property",
  name: "grid",
  value: "Grid<T>",
  doc: { en: `` },
  tsDoc: ``,
  optional: false,
};

export const RowIndexProp: PropertyType = {
  kind: "property",
  name: "rowIndex",
  value: "number",
  doc: { en: `` },
  tsDoc: ``,
  optional: false,
};

export const ColumnIndexProp: PropertyType = {
  kind: "property",
  name: "colIndex",
  value: "number",
  doc: { en: `` },
  tsDoc: ``,
  optional: false,
};

export const RowNodeProp: PropertyType = {
  kind: "property",
  name: "row",
  value: "RowNode<T>",
  doc: { en: `` },
  tsDoc: ``,
  optional: false,
};

export const ColumnProp: PropertyType = {
  kind: "property",
  name: "column",
  value: "Column<T>",
  doc: { en: `` },
  tsDoc: ``,
  optional: false,
};

export const DataProp: PropertyType = {
  kind: "property",
  name: "data",
  doc: { en: `` },
  tsDoc: ``,
  optional: false,
  value: "T",
};
