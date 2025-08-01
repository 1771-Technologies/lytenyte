import type { FunctionType, InterfaceType, UnionType } from "../+types";
import { GridProp } from "./shared-properties";

export const RowGroupField: InterfaceType = {
  kind: "interface",
  name: "RowGroupField<T>",
  tsDoc: `Defines a field-based grouping configuration used to compute row group keys in the grid.`,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      name: "kind",
      doc: { en: `` },
      tsDoc: `Type identifier used for discriminating group field types.`,
      optional: false,
      value: '"field"',
    },
    {
      kind: "property",
      name: "id",
      doc: { en: `` },
      tsDoc: `Unique identifier for this row group field.`,
      optional: false,
      value: "string",
    },
    {
      kind: "property",
      name: "field",
      doc: { en: `` },
      tsDoc: `The data field to be grouped by.`,
      optional: false,
      value: "FieldRowGroup<T>",
    },
    {
      kind: "property",
      name: "name",
      doc: { en: `` },
      tsDoc: `An optional display name for the row group field.`,
      optional: true,
      value: "string",
    },
  ],
};

export const RowGroupModelItem: UnionType = {
  kind: "union",
  name: "RowGroupModelItem<T>",
  tsDoc: `An item in the row group model. This can either be a column identifier (string) or a row group field definition.`,
  doc: { en: `` },
  export: true,
  types: ["string", "RowGroupField<T>"],
};

export const RowGroupDisplayMode: UnionType = {
  kind: "union",
  name: "RowGroupDisplayMode",
  tsDoc: `Enumerates the display modes available for 
  row groups in LyteNyte Grid.`,
  doc: { en: `` },
  export: true,
  types: ['"single-column"', '"multi-column"', '"custom"'],
};

export const AggFn: FunctionType = {
  kind: "function",
  name: "AggFn<T>",
  tsDoc: `Defines the function signature for custom 
  aggregation logic that computes a result based on grid data.`,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `The input data set to be aggregated.`,
      name: "data",
      value: "(T | null)[]",
      optional: false,
    },
    GridProp,
  ],
  return: "unknown",
};

export const AggModelFn: UnionType = {
  kind: "union",
  name: "AggModelFn<T>",
  tsDoc: `Describes the aggregation model configuration. 
  This can be either a string referencing a built-in 
  aggregation or a custom function.`,
  doc: { en: `` },
  export: true,
  types: ["string", "AggFn<T>"],
};
