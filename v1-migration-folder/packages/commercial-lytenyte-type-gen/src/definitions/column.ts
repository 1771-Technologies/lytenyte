import type {
  FunctionType,
  InterfaceType,
  InterfaceTypePartial,
  PropertyType,
  UnionType,
} from "../+types.js";
import { ColumnProp, GridProp, RowNodeProp } from "./shared-properties.js";

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
    {
      kind: "property",
      name: "columnVisibleStartCount",
      value: "number",
      optional: false,
      doc: { en: `` },
      tsDoc: ``,
    },
    {
      kind: "property",
      name: "columnVisibleCenterCount",
      value: "number",
      optional: false,
      doc: { en: `` },
      tsDoc: ``,
    },
    {
      kind: "property",
      name: "columnVisibleEndCount",
      value: "number",
      optional: false,
      doc: { en: `` },
      tsDoc: ``,
    },
  ],
};

const SortableHint: PropertyType = {
  kind: "property",
  tsDoc: ``,
  doc: { en: `` },
  optional: true,
  value: "boolean",
  name: "sortable",
};
const RowGroupableHint: PropertyType = {
  kind: "property",
  tsDoc: ``,
  doc: { en: `` },
  optional: true,
  value: "boolean",
  name: "rowGroupable",
};
const ResizableHint: PropertyType = {
  kind: "property",
  tsDoc: ``,
  doc: { en: `` },
  optional: true,
  value: "boolean",
  name: "resizable",
};
const MovableHint: PropertyType = {
  kind: "property",
  tsDoc: ``,
  doc: { en: `` },
  optional: true,
  value: "boolean",
  name: "movable",
};

export const ColumnUIHints: InterfaceType = {
  kind: "interface",
  name: "ColumnUIHints",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  properties: [SortableHint, RowGroupableHint, ResizableHint, MovableHint],
};

export const AutosizeCellParams: InterfaceType = {
  kind: "interface",
  name: "AutosizeCellParams<T>",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  properties: [ColumnProp, GridProp, RowNodeProp],
};

export const AutosizeHeaderParams: InterfaceType = {
  kind: "interface",
  name: "AutosizeHeaderParams<T>",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  properties: [ColumnProp, GridProp],
};

export const AutosizeCellFn: FunctionType = {
  kind: "function",
  name: "AutosizeCellFn<T>",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      tsDoc: ``,
      doc: { en: `` },
      name: "params",
      optional: false,
      value: "AutosizeCellParams<T>",
    },
  ],
  return: "number | null",
};

export const AutosizeHeaderFn: FunctionType = {
  kind: "function",
  name: "AutosizeHeaderFn<T>",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      tsDoc: ``,
      doc: { en: `` },
      name: "params",
      optional: false,
      value: "AutosizeHeaderParams<T>",
    },
  ],
  return: "number | null",
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
  name: "editSetter",
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

const AutosizeCellFnProp: PropertyType = {
  kind: "property",
  name: "autosizeCellFn",
  doc: { en: `` },
  tsDoc: ``,
  value: "AutosizeCellFn<T>",
  optional: true,
};
const AutosizeHeaderFnProp: PropertyType = {
  kind: "property",
  name: "autosizeHeaderFn",
  doc: { en: `` },
  tsDoc: ``,
  value: "AutosizeHeaderFn<T>",
  optional: true,
};

export const ColumnMarker: InterfaceType = {
  kind: "interface",
  export: true,
  name: "ColumnMarker<T>",
  doc: { en: `` },
  tsDoc: ``,
  properties: [CellRenderer, HeaderRenderer, FloatingRenderer, Width, ColumnHintsProp],
};

const ColumnPartial: InterfaceTypePartial = {
  kind: "interface-partial",
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

    AutosizeCellFnProp,
    AutosizeHeaderFnProp,
  ],
};

export const Column: InterfaceType = {
  kind: "interface",
  export: true,
  name: "Column<T>",
  tsDoc: ``,
  doc: {
    en: ``,
  },
  properties: [],
  extends: ColumnPartial,
  tag: "core",
};

const ColumnBasePartial: InterfaceTypePartial = {
  kind: "interface-partial",
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

    AutosizeCellFnProp,
    AutosizeHeaderFnProp,
  ],
};

export const ColumnBase: InterfaceType = {
  kind: "interface",
  export: true,
  name: "ColumnBase<T>",
  properties: [],
  tsDoc: ``,
  doc: { en: `` },
  extends: ColumnBasePartial,
  tag: "core",
};

export const ColumnRowGroup: InterfaceType = {
  kind: "interface",
  export: true,
  name: "RowGroupColumn<T>",
  doc: { en: `` },
  tsDoc: ``,
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

    AutosizeCellFnProp,
    AutosizeHeaderFnProp,
  ],
};

/**
 * PRO
 */
const QuickSearchIgnore: PropertyType = {
  kind: "property",
  tsDoc: ``,
  doc: { en: `` },
  name: "quickSearchIgnore",
  optional: true,
  value: "boolean",
};

export const ColumnPro: InterfaceType = {
  kind: "interface",
  export: true,
  name: "Column<T>",
  tsDoc: ``,
  doc: {
    en: ``,
  },
  properties: [QuickSearchIgnore],
  extends: ColumnPartial,
  tag: "pro",
};

export const ColumnBasePro: InterfaceType = {
  kind: "interface",
  export: true,
  name: "ColumnBase<T>",
  properties: [QuickSearchIgnore],
  tsDoc: ``,
  doc: { en: `` },
  extends: ColumnBasePartial,
  tag: "pro",
};
