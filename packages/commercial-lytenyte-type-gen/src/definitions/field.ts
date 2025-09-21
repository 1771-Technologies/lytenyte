import type { FunctionType, InterfaceType, PropertyType, UnionType } from "../+types";
import { ColumnProp, DataProp, GridProp } from "./shared-properties.js";

export const FieldDataParam: UnionType = {
  kind: "union",
  name: "FieldDataParam<T>",
  tsDoc: `Represents the two forms of data that can be passed into functions like sort comparators.
  
  These are partial views of the row:
  - A \`leaf\` form, representing actual row-level data (\`T | null\`)
  - A \`branch\` form, representing nested row structures with a key lookup

  Note: These do not include attributes like \`rowId\` or \`rowIndex\` as those may not be available yet.
  
  @group Field
  `,
  doc: { en: `` },
  export: true,
  types: [
    '{ kind: "leaf", data: T | null }',
    '{ kind: "branch", data: Record<string, unknown>, key: string | null }',
  ],
};

export const FieldDataParamProperty: PropertyType = {
  kind: "property",
  name: "data",
  doc: { en: `` },
  tsDoc: `
  A representation of the row data, used in computing custom fields or sorting logic.
  
  @group Field
  `,
  optional: false,
  value: "FieldDataParam<T>",
};

export const FieldFnParams: InterfaceType = {
  kind: "interface",
  name: "FieldFnParams<T>",
  export: true,
  tsDoc: `The parameters passed to functional column fields.
  
  LyteNyte Grid calls these functions dynamically during rendering or computation.
  These calls can occur frequently (e.g., for every cell in a column), so implementations should prioritize performance.
  
  @group Field
  `,
  doc: { en: `` },
  properties: [GridProp, ColumnProp, FieldDataParamProperty],
};

export const FieldFn: FunctionType = {
  kind: "function",
  name: "FieldFn<T>",
  export: true,
  properties: [
    {
      kind: "property",
      name: "params",
      doc: { en: `` },
      tsDoc: `The structured input data for computing the custom field.`,
      optional: false,
      value: "FieldFnParams<T>",
    },
  ],
  return: "unknown",
  doc: { en: `` },
  tsDoc: `A dynamic field function used to derive values for a column.

  This function may be invoked repeatedly, once per cell per column, so it must be optimized for efficiency.
  
  @group Field
  `,
};

export const FieldPath: InterfaceType = {
  kind: "interface",
  name: "FieldPath",
  doc: { en: `` },
  tsDoc: `Specifies a string-based path used to extract values from a nested data structure, similar to \`lodash.get\`.

  Example: \`"point.x"\` will return \`data.point.x\`. Useful for deeply nested row data.
  
  @group Field
  `,
  export: true,
  properties: [
    {
      kind: "property",
      name: "kind",
      optional: false,
      doc: { en: `` },
      tsDoc: `Discriminator for type guards. Should always be set to \`"path"\`.`,
      value: '"path"',
    },
    {
      kind: "property",
      name: "path",
      value: "string",
      tsDoc: `Dot separated accessor path for value retrieval.`,
      doc: { en: `` },
      optional: false,
    },
  ],
};

export const FieldRowGroupParamsFn: InterfaceType = {
  kind: "interface",
  name: "FieldRowGroupParamsFn<T>",
  export: true,
  tsDoc: `Defines the parameters used for custom row group field functions.

  Enables grouping logic to be decoupled from the data's displayed value.
  
  @group Field
  `,
  doc: { en: `` },
  properties: [GridProp, DataProp],
};

export const FieldRowGroupFn: FunctionType = {
  kind: "function",
  name: "FieldRowGroupFn<T>",
  export: true,
  properties: [
    {
      kind: "property",
      tsDoc: `The input parameters for computing custom row group values.`,
      doc: { en: `` },
      name: "params",
      value: "FieldRowGroupParamsFn<T>",
      optional: false,
    },
  ],
  return: "unknown",
  tsDoc: `A function used to derive row grouping values distinct from cell display values.

  Ideal for customizing how rows are grouped in the UI or logic layer.
  
  @group Field
  `,
  doc: { en: `` },
};

export const FieldUnion: UnionType = {
  kind: "union",
  export: true,
  name: "Field<T>",
  tsDoc: `Specifies the various forms that a column field may take.

- A primitive value (\`string\` or \`number\`)
- A path-based accessor
- A custom function for dynamic computation

@group Field
`,
  doc: { en: `` },
  types: ["number", "string", "FieldPath", "FieldFn<T>"],
};

export const FieldRowGroupUnion: UnionType = {
  kind: "union",
  export: true,
  name: "FieldRowGroup<T>",
  tsDoc: `Defines the acceptable formats for row group fields.
  Includes primitives, path-based accessors, or a custom function for grouping behavior.
  
  @group Field
  `,
  doc: { en: `` },
  types: ["number", "string", "FieldPath", "FieldRowGroupFn<T>"],
};
