import type { InterfaceType, PropertyType, UnionType } from "../+types.js";

export const ColumnPin: UnionType = {
  kind: "union",
  name: "ColumnPin",
  export: true,
  tsDoc: ``,
  doc: { en: `` },
  types: ['"start"', '"end"', "null"],
};

export const ColumnMeta: InterfaceType = {
  kind: "interface",
  name: "ColumnMeta<T>",
  export: true,
  tsDoc: ``,
  doc: { en: `` },
  properties: [
    {
      kind: "property",
      name: "columnsVisible",
      value: "Column<T>[]",
      optional: false,
      tsDoc: ``,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "columnLookup",
      value: "Map<string, Column<T>>",
      optional: false,
      tsDoc: ``,
      doc: { en: `` },
    },
  ],
};

export const ColumnUIHints: InterfaceType = {
  kind: "interface",
  name: "ColumnUIHints",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      tsDoc: ``,
      doc: { en: `` },
      optional: true,
      value: "boolean",
      name: "sortable",
    },
    {
      kind: "property",
      tsDoc: ``,
      doc: { en: `` },
      optional: true,
      value: "boolean",
      name: "rowGroupable",
    },
  ],
};

/**
 * COLUMN DEFINITION
 */

const Hide: PropertyType = {
  kind: "property",
  name: "hide",
  value: "boolean",
  tsDoc: ``,
  doc: { en: `` },
  optional: true,
};

const Id: PropertyType = {
  kind: "property",
  name: "id",
  value: "string",
  tsDoc: ``,
  doc: { en: `` },
  optional: false,
};
const Width: PropertyType = {
  kind: "property",
  name: "width",
  value: "number",
  tsDoc: ``,
  doc: { en: `` },
  optional: true,
};
const WidthMax: PropertyType = {
  kind: "property",
  name: "widthMax",
  value: "number",
  tsDoc: ``,
  doc: { en: `` },
  optional: true,
};
const WidthMin: PropertyType = {
  kind: "property",
  name: "widthMin",
  value: "number",
  tsDoc: ``,
  doc: { en: `` },
  optional: true,
};
const WidthFlex: PropertyType = {
  kind: "property",
  name: "widthFlex",
  value: "number",
  tsDoc: ``,
  doc: { en: `` },
  optional: true,
};
const ColumnPinProp: PropertyType = {
  kind: "property",
  name: "pin",
  value: "ColumnPin",
  optional: true,
  tsDoc: ``,
  doc: { en: `` },
};
const ColumnGroupVisibilityProp: PropertyType = {
  kind: "property",
  name: "groupVisibility",
  value: "ColumnGroupVisibility",
  optional: true,
  tsDoc: ``,
  doc: { en: `` },
};
const ColumnGroupPath: PropertyType = {
  kind: "property",
  name: "groupPath",
  value: "string[]",
  optional: true,
  tsDoc: ``,
  doc: { en: `` },
};
const ColumnSpan: PropertyType = {
  kind: "property",
  name: "colSpan",
  optional: true,
  tsDoc: ``,
  doc: { en: `` },
  value: `number | CellSpanFn<T>`,
};
const RowSpan: PropertyType = {
  kind: "property",
  name: "rowSpan",
  optional: true,
  tsDoc: ``,
  doc: { en: `` },
  value: `number | CellSpanFn<T>`,
};

const Name: PropertyType = {
  kind: "property",
  name: "name",
  optional: true,
  tsDoc: ``,
  doc: { en: `` },
  value: "string",
};

const Field: PropertyType = {
  kind: "property",
  name: "field",
  optional: true,
  tsDoc: ``,
  doc: { en: `` },
  value: "Field<T>",
};
const CellRenderer: PropertyType = {
  kind: "property",
  name: "cellRenderer",
  optional: true,
  tsDoc: ``,
  doc: { en: `` },
  value: "string | CellRendererFn<T>",
};

const HeaderRenderer: PropertyType = {
  kind: "property",
  name: "headerRenderer",
  optional: true,
  tsDoc: ``,
  doc: { en: `` },
  value: "HeaderCellRenderer<T>",
};

const FloatingRenderer: PropertyType = {
  kind: "property",
  name: "floatingRenderer",
  optional: true,
  tsDoc: ``,
  doc: { en: `` },
  value: "HeaderFloatingCellRenderer<T>",
};

const ColumnHintsProp: PropertyType = {
  kind: "property",
  name: "uiHints",
  tsDoc: ``,
  doc: { en: `` },
  optional: true,
  value: "ColumnUIHints",
};

const EditableProp: PropertyType = {
  kind: "property",
  name: "editable",
  tsDoc: ``,
  doc: { en: `` },
  optional: true,
  value: "Editable<T>",
};

const EditRenderProp: PropertyType = {
  kind: "property",
  name: "editRenderer",
  tsDoc: ``,
  doc: { en: `` },
  optional: true,
  value: "EditRenderer<T>",
};

const EditSetterProp: PropertyType = {
  kind: "property",
  name: "editSetterProp",
  tsDoc: ``,
  doc: { en: `` },
  optional: true,
  value: "EditSetterFn<T>",
};

const ColumnType: PropertyType = {
  kind: "property",
  name: "type",
  tsDoc: ``,
  doc: { en: `` },
  optional: true,
  value: '"string" | "number" | "date" | "datetime" | ({} & string)',
};

export const ColumnCore: InterfaceType = {
  kind: "interface",
  export: true,
  name: "Column<T>",
  tag: "core",
  tsDoc: ``,
  doc: {
    en: ``,
  },
  properties: [
    Id,
    Name,
    ColumnType,
    Hide,
    Width,
    WidthMax,
    WidthMin,
    WidthFlex,
    ColumnPinProp,
    ColumnGroupVisibilityProp,
    ColumnGroupPath,

    ColumnSpan,
    RowSpan,

    Field,

    HeaderRenderer,
    FloatingRenderer,
    CellRenderer,

    ColumnHintsProp,

    EditableProp,
    EditRenderProp,
    EditSetterProp,
  ],
};

export const ColumnBaseCore: InterfaceType = {
  kind: "interface",
  export: true,
  name: "ColumnBase<T>",
  tag: "core",
  properties: [
    Hide,
    Width,
    WidthMax,
    WidthMin,
    WidthFlex,

    HeaderRenderer,
    FloatingRenderer,
    CellRenderer,
    ColumnHintsProp,

    EditableProp,
    EditRenderProp,
    EditSetterProp,
  ],
  tsDoc: ``,
  doc: { en: `` },
};

export const ColumnRowGroup: InterfaceType = {
  kind: "interface",
  export: true,
  name: "RowGroupColumn<T>",
  doc: { en: `` },
  tsDoc: ``,
  tag: "core",
  properties: [
    Name,
    Hide,
    Width,
    WidthMax,
    WidthMin,
    WidthFlex,
    ColumnPinProp,

    Field,

    CellRenderer,
    HeaderRenderer,
    FloatingRenderer,

    ColumnHintsProp,
  ],
};
