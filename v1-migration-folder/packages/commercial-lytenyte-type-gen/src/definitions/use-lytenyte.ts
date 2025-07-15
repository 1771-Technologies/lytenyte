import type { InterfaceType, PropertyType } from "../+types.js";

const Columns: PropertyType = {
  kind: "property",
  name: "columns",
  optional: true,
  value: "Column<T>[]",
  tsDoc: ``,
  doc: { en: `` },
};

const ColumnBase: PropertyType = {
  kind: "property",
  name: "columnBase",
  optional: true,
  value: "ColumnBase<T>",
  tsDoc: ``,
  doc: { en: `` },
};

const HeaderHeight: PropertyType = {
  kind: "property",
  name: "headerHeight",
  optional: true,
  value: "number",
  tsDoc: ``,
  doc: { en: `` },
};
const HeaderGroupHeight: PropertyType = {
  kind: "property",
  name: "headerGroupHeight",
  optional: true,
  value: "number",
  tsDoc: ``,
  doc: { en: `` },
};

const GridId: PropertyType = {
  kind: "property",
  name: "gridId",
  optional: false,
  value: "string",
  tsDoc: ``,
  doc: { en: `` },
};

const ColumnSizeToFit: PropertyType = {
  kind: "property",
  name: "columnSizeToFit",
  optional: true,
  value: "boolean",
  tsDoc: ``,
  doc: { en: `` },
};

const ColumnGroupExpansions: PropertyType = {
  kind: "property",
  name: "columnGroupExpansions",
  optional: true,
  value: "Record<string, boolean>",
  tsDoc: ``,
  doc: { en: `` },
};
const ColumnGroupDefaultExpansion: PropertyType = {
  kind: "property",
  name: "columnGroupDefaultExpansion",
  optional: true,
  value: "boolean",
  tsDoc: ``,
  doc: { en: `` },
};
const ColumnGroupJoinDelimiter: PropertyType = {
  kind: "property",
  name: "columnGroupJoinDelimiter",
  optional: true,
  value: "string",
  tsDoc: ``,
  doc: { en: `` },
};

const RowDataSource: PropertyType = {
  kind: "property",
  name: "rowDataSource",
  optional: true,
  value: "RowDataSource<T>",
  tsDoc: ``,
  doc: { en: `` },
};

const RowAutoHeightGuess: PropertyType = {
  kind: "property",
  name: "rowAutoHeightGuess",
  optional: true,
  value: "number",
  tsDoc: ``,
  doc: { en: `` },
};
const RowHeight: PropertyType = {
  kind: "property",
  name: "rowHeight",
  optional: true,
  value: "RowHeight",
  doc: { en: `` },
  tsDoc: ``,
};

const RowScanDistance: PropertyType = {
  kind: "property",
  name: "rowScanDistance",
  optional: true,
  value: "number",
  tsDoc: ``,
  doc: { en: `` },
};
const ColScanDistance: PropertyType = {
  kind: "property",
  name: "colScanDistance",
  optional: true,
  value: "number",
  tsDoc: ``,
  doc: { en: `` },
};

const RowOverscanTop: PropertyType = {
  kind: "property",
  name: "rowOverscanTop",
  optional: true,
  value: "number",
  tsDoc: ``,
  doc: { en: `` },
};
const RowOverscanBottom: PropertyType = {
  kind: "property",
  name: "rowOverscanBottom",
  optional: true,
  value: "number",
  tsDoc: ``,
  doc: { en: `` },
};
const ColOverscanStart: PropertyType = {
  kind: "property",
  name: "colOverscanStart",
  optional: true,
  value: "number",
  tsDoc: ``,
  doc: { en: `` },
};
const ColOverscanEnd: PropertyType = {
  kind: "property",
  name: "colOverscanEnd",
  optional: true,
  value: "number",
  tsDoc: ``,
  doc: { en: `` },
};

const RowFullWidthPredicate: PropertyType = {
  kind: "property",
  name: "rowFullWidthPredicate",
  optional: true,
  value: "RowFullWidthPredicate<T>",
  tsDoc: ``,
  doc: { en: `` },
};

const RowFullWidthRenderer: PropertyType = {
  kind: "property",
  doc: { en: `` },
  tsDoc: ``,
  name: "rowFullWidthRenderer",
  optional: true,
  value: "RowFullWidthRendererFn<T>",
};

const CellRenderers: PropertyType = {
  kind: "property",
  name: "cellRenderers",
  optional: true,
  value: "Record<string, CellRendererFn<T>>",
  tsDoc: ``,
  doc: { en: `` },
};

const SortModel: PropertyType = {
  kind: "property",
  name: "sortModel",
  optional: true,
  tsDoc: ``,
  doc: { en: `` },
  value: "SortModelItem<T>[]",
};

const Rtl: PropertyType = {
  kind: "property",
  name: "rtl",
  optional: true,
  tsDoc: ``,
  doc: { en: `` },
  value: "boolean",
};

const FilterModel: PropertyType = {
  kind: "property",
  name: "filterModel",
  optional: true,
  tsDoc: ``,
  doc: { en: `` },
  value: "FilterModelItem<T>[]",
};

const RowGroupModel: PropertyType = {
  kind: "property",
  name: "rowGroupModel",
  optional: true,
  tsDoc: ``,
  doc: { en: `` },
  value: "RowGroupModelItem<T>[]",
};

const RowGroupDisplayMode: PropertyType = {
  kind: "property",
  name: "rowGroupDisplayMode",
  tsDoc: ``,
  doc: { en: `` },
  optional: true,
  value: "RowGroupDisplayMode",
};

const RowGroupDefaultExpansion: PropertyType = {
  kind: "property",
  name: "rowGroupDefaultExpansion",
  tsDoc: ``,
  doc: { en: `` },
  optional: true,
  value: "boolean | number",
};

const RowGroupExpansions: PropertyType = {
  kind: "property",
  name: "rowGroupExpansions",
  tsDoc: ``,
  doc: { en: `` },
  optional: true,
  value: "{ [rowId: string]: boolean | undefined }",
};

const RowGroupColumn: PropertyType = {
  kind: "property",
  name: "rowGroupColumn",
  tsDoc: ``,
  doc: { en: `` },
  optional: true,
  value: "RowGroupColumn<T>",
};

const AggModel: PropertyType = {
  kind: "property",
  name: "aggModel",
  tsDoc: ``,
  doc: { en: `` },
  optional: true,
  value: "{ [columnId: string]: { fn: AggModelFn<T> } }",
};

const FloatingRowEnabled: PropertyType = {
  kind: "property",
  name: "floatingRowEnabled",
  tsDoc: ``,
  doc: { en: `` },
  optional: true,
  value: "boolean",
};
const FloatingRowHeight: PropertyType = {
  kind: "property",
  name: "floatingRowHeight",
  tsDoc: ``,
  doc: { en: `` },
  optional: true,
  value: "number",
};
const FloatingCellRenderers: PropertyType = {
  kind: "property",
  name: "floatingCellRenderers",
  tsDoc: ``,
  doc: { en: `` },
  optional: true,
  value: "Record<string, HeaderFloatingCellRendererFn<T>>",
};
const HeaderCellRenderers: PropertyType = {
  kind: "property",
  name: "headerCellRenderers",
  tsDoc: ``,
  doc: { en: `` },
  optional: true,
  value: "Record<string, HeaderCellRendererFn<T>>",
};
const EditRenderers: PropertyType = {
  kind: "property",
  name: "editRenderers",
  tsDoc: ``,
  doc: { en: `` },
  optional: true,
  value: "Record<string, EditRendererFn<T>>",
};

const EditRowValidatorFn: PropertyType = {
  kind: "property",
  name: "editRowValidatorFn",
  tsDoc: ``,
  doc: { en: `` },
  optional: true,
  value: "EditRowValidatorFn<T>",
};
const EditClickActivator: PropertyType = {
  kind: "property",
  name: "editClickActivator",
  tsDoc: ``,
  doc: { en: `` },
  optional: true,
  value: "EditClickActivator",
};
const EditCellMode: PropertyType = {
  kind: "property",
  name: "editCellMode",
  tsDoc: ``,
  doc: { en: `` },
  optional: true,
  value: "EditCellMode",
};
const ColumnMarkerProp: PropertyType = {
  kind: "property",
  name: "columnMarker",
  tsDoc: ``,
  doc: { en: `` },
  optional: true,
  value: "ColumnMarker<T>",
};

const ColumnMarkerEnabled: PropertyType = {
  kind: "property",
  name: "columnMarkerEnabled",
  tsDoc: ``,
  doc: { en: `` },
  optional: true,
  value: "boolean",
};

const RowDetailRenderer: PropertyType = {
  kind: "property",
  name: "rowDetailRenderer",
  tsDoc: ``,
  doc: { en: `` },
  optional: true,
  value: "RowDetailRendererFn<T>",
};
const RowDetailHeight: PropertyType = {
  kind: "property",
  name: "rowDetailHeight",
  tsDoc: ``,
  doc: { en: `` },
  optional: true,
  value: "RowDetailHeight",
};
const RowDetailAutoHeightGuess: PropertyType = {
  kind: "property",
  name: "rowDetailAutoHeightGuess",
  tsDoc: ``,
  doc: { en: `` },
  optional: true,
  value: "number",
};
const RowDetailExpansions: PropertyType = {
  kind: "property",
  name: "rowDetailExpansions",
  tsDoc: ``,
  doc: { en: `` },
  optional: true,
  value: "Set<string>",
};

const RowSelectedIds: PropertyType = {
  kind: "property",
  name: "rowSelectedIds",
  tsDoc: ``,
  doc: { en: `` },
  optional: true,
  value: "Set<string>",
};
const RowSelectionMode: PropertyType = {
  kind: "property",
  name: "rowSelectionMode",
  doc: { en: `` },
  optional: true,
  tsDoc: ``,
  value: "RowSelectionMode",
};
const RowSelectionActivator: PropertyType = {
  kind: "property",
  name: "rowSelectionActivator",
  doc: { en: `` },
  optional: true,
  tsDoc: ``,
  value: "RowSelectionActivator",
};
const RowSelectChildren: PropertyType = {
  kind: "property",
  name: "rowSelectChildren",
  doc: { en: `` },
  optional: true,
  tsDoc: ``,
  value: "boolean",
};

export const UseLyteNytePropsCore: InterfaceType = {
  kind: "interface",
  name: "UseLyteNyteProps<T>",
  export: true,
  tsDoc: ``,
  doc: { en: `` },
  tag: "core",
  properties: [
    Columns,
    ColumnBase,
    ColumnGroupDefaultExpansion,
    ColumnGroupExpansions,
    ColumnGroupJoinDelimiter,
    ColumnSizeToFit,
    HeaderHeight,
    HeaderGroupHeight,
    GridId,
    RowDataSource,
    RowAutoHeightGuess,
    RowHeight,
    ColScanDistance,
    RowScanDistance,
    RowOverscanTop,
    RowOverscanBottom,
    ColOverscanStart,
    ColOverscanEnd,

    RowFullWidthPredicate,
    RowFullWidthRenderer,
    CellRenderers,

    Rtl,

    SortModel,
    FilterModel,
    AggModel,

    RowGroupColumn,
    RowGroupModel,
    RowGroupDisplayMode,
    RowGroupDefaultExpansion,
    RowGroupExpansions,

    FloatingRowHeight,
    FloatingRowEnabled,
    FloatingCellRenderers,
    HeaderCellRenderers,

    EditRenderers,
    EditRowValidatorFn,
    EditClickActivator,
    EditCellMode,

    ColumnMarkerProp,
    ColumnMarkerEnabled,
    RowDetailRenderer,
    RowDetailHeight,
    RowDetailExpansions,
    RowDetailAutoHeightGuess,

    RowSelectedIds,
    RowSelectionMode,
    RowSelectionActivator,
    RowSelectChildren,
  ],
};
