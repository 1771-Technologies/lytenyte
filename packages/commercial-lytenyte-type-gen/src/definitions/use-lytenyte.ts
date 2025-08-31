import type { InterfaceType, InterfaceTypePartial, PropertyType } from "../+types.js";

const Columns: PropertyType = {
  kind: "property",
  name: "columns",
  optional: true,
  value: "Column<T>[]",
  tsDoc: `The initial column definitions.`,
  doc: { en: `` },
};

const ColumnBase: PropertyType = {
  kind: "property",
  name: "columnBase",
  optional: true,
  value: "ColumnBase<T>",
  tsDoc: `The base column definition.`,
  doc: { en: `` },
};

const HeaderHeight: PropertyType = {
  kind: "property",
  name: "headerHeight",
  optional: true,
  value: "number",
  tsDoc: `The height in pixels that the header should occupy.`,
  doc: { en: `` },
};

const HeaderGroupHeight: PropertyType = {
  kind: "property",
  name: "headerGroupHeight",
  optional: true,
  value: "number",
  tsDoc: `The height in pixels for the header groups.`,
  doc: { en: `` },
};

const GridId: PropertyType = {
  kind: "property",
  name: "gridId",
  optional: false,
  value: "string",
  tsDoc: `A unique identifier for the grid instance.`,
  doc: { en: `` },
};

const ColumnSizeToFit: PropertyType = {
  kind: "property",
  name: "columnSizeToFit",
  optional: true,
  value: "boolean",
  tsDoc: `Indicates whether the grid should size columns to fit the available width.`,
  doc: { en: `` },
};

const ColumnGroupExpansions: PropertyType = {
  kind: "property",
  name: "columnGroupExpansions",
  optional: true,
  value: "Record<string, boolean>",
  tsDoc: `The initial expansion state for column groups.`,
  doc: { en: `` },
};

const ColumnGroupDefaultExpansion: PropertyType = {
  kind: "property",
  name: "columnGroupDefaultExpansion",
  optional: true,
  value: "boolean",
  tsDoc: `The default expansion state for column groups if not specified explicitly.`,
  doc: { en: `` },
};

const ColumnGroupJoinDelimiter: PropertyType = {
  kind: "property",
  name: "columnGroupJoinDelimiter",
  optional: true,
  value: "string",
  tsDoc: `A delimiter used to concatenate group paths into a single group id.`,
  doc: { en: `` },
};

const RowDataSource: PropertyType = {
  kind: "property",
  name: "rowDataSource",
  optional: true,
  value: "RowDataSource<T>",
  tsDoc: `The data source used by LyteNyte Grid to manage and provide row data.`,
  doc: { en: `` },
};

const RowAutoHeightGuess: PropertyType = {
  kind: "property",
  name: "rowAutoHeightGuess",
  optional: true,
  value: "number",
  tsDoc: `Initial height guess for auto-height rows, used before actual measurement.`,
  doc: { en: `` },
};

const RowHeight: PropertyType = {
  kind: "property",
  name: "rowHeight",
  optional: true,
  value: "RowHeight",
  tsDoc: `Row height strategy used by LyteNyte Grid for rendering rows.`,
  doc: { en: `` },
};

const RowScanDistance: PropertyType = {
  kind: "property",
  name: "rowScanDistance",
  optional: true,
  value: "number",
  tsDoc: `The number of rows LyteNyte Grid should scan when computing layout.`,
  doc: { en: `` },
};

const ColScanDistance: PropertyType = {
  kind: "property",
  name: "colScanDistance",
  optional: true,
  value: "number",
  tsDoc: `The number of columns LyteNyte Grid should scan when computing layout.`,
  doc: { en: `` },
};

const RowOverscanTop: PropertyType = {
  kind: "property",
  name: "rowOverscanTop",
  optional: true,
  value: "number",
  tsDoc: `The number of rows above the first visible row to render.`,
  doc: { en: `` },
};

const RowOverscanBottom: PropertyType = {
  kind: "property",
  name: "rowOverscanBottom",
  optional: true,
  value: "number",
  tsDoc: `The number of rows below the last visible row to render.`,
  doc: { en: `` },
};

const ColOverscanStart: PropertyType = {
  kind: "property",
  name: "colOverscanStart",
  optional: true,
  value: "number",
  tsDoc: `The number of columns before the first visible column to render.`,
  doc: { en: `` },
};

const ColOverscanEnd: PropertyType = {
  kind: "property",
  name: "colOverscanEnd",
  optional: true,
  value: "number",
  tsDoc: `The number of columns after the last visible column to render.`,
  doc: { en: `` },
};

const RowFullWidthPredicate: PropertyType = {
  kind: "property",
  name: "rowFullWidthPredicate",
  optional: true,
  value: "RowFullWidthPredicate<T> | null",
  tsDoc: `The function predicate used to determine if a row should be rendered as full width.`,
  doc: { en: `` },
};

const RowFullWidthRenderer: PropertyType = {
  kind: "property",
  name: "rowFullWidthRenderer",
  optional: true,
  value: "RowFullWidthRendererFn<T>",
  tsDoc: `The renderer used to render the content of a full width row.`,
  doc: { en: `` },
};

const CellRenderers: PropertyType = {
  kind: "property",
  name: "cellRenderers",
  optional: true,
  value: "Record<string, CellRendererFn<T>>",
  tsDoc: `The map of named cell renderers that can be referenced by name in the grid.`,
  doc: { en: `` },
};

const SortModel: PropertyType = {
  kind: "property",
  name: "sortModel",
  optional: true,
  value: "SortModelItem<T>[]",
  tsDoc: `The initial sort model to apply to the grid.`,
  doc: { en: `` },
};

const Rtl: PropertyType = {
  kind: "property",
  name: "rtl",
  optional: true,
  value: "boolean",
  tsDoc: `Whether to use right-to-left rendering. If false, left-to-right is assumed.`,
  doc: { en: `` },
};

const FilterModel: PropertyType = {
  kind: "property",
  name: "filterModel",
  optional: true,
  value: "Record<string, FilterModelItem<T>>",
  tsDoc: `The initial filter model to apply to the grid.`,
  doc: { en: `` },
};

const RowGroupModel: PropertyType = {
  kind: "property",
  name: "rowGroupModel",
  optional: true,
  value: "RowGroupModelItem<T>[]",
  tsDoc: `The initial row group model configuration to apply.`,
  doc: { en: `` },
};

const RowGroupDisplayMode: PropertyType = {
  kind: "property",
  name: "rowGroupDisplayMode",
  optional: true,
  value: "RowGroupDisplayMode",
  tsDoc: `The row group display mode to use in the grid.`,
  doc: { en: `` },
};

const RowGroupDefaultExpansion: PropertyType = {
  kind: "property",
  name: "rowGroupDefaultExpansion",
  optional: true,
  value: "boolean | number",
  tsDoc: `Default expansion depth for row groups. Can be a boolean or a depth number.`,
  doc: { en: `` },
};

const RowGroupExpansions: PropertyType = {
  kind: "property",
  name: "rowGroupExpansions",
  optional: true,
  value: "{ [rowId: string]: boolean | undefined }",
  tsDoc: `Initial expansion state of specific row groups by row id.`,
  doc: { en: `` },
};

const RowGroupColumn: PropertyType = {
  kind: "property",
  name: "rowGroupColumn",
  optional: true,
  value: "RowGroupColumn<T>",
  tsDoc: `Template for generating row group columns dynamically.`,
  doc: { en: `` },
};

const AggModel: PropertyType = {
  kind: "property",
  name: "aggModel",
  optional: true,
  value: "{ [columnId: string]: { fn: AggModelFn<T> } }",
  tsDoc: `The initial aggregation model to apply to LyteNyte Grid.`,
  doc: { en: `` },
};

const FloatingRowEnabled: PropertyType = {
  kind: "property",
  name: "floatingRowEnabled",
  optional: true,
  value: "boolean",
  tsDoc: `A boolean indicating if the floating row should be enabled.`,
  doc: { en: `` },
};

const FloatingRowHeight: PropertyType = {
  kind: "property",
  name: "floatingRowHeight",
  optional: true,
  value: "number",
  tsDoc: `The height in px of the floating row.`,
  doc: { en: `` },
};

const FloatingCellRenderers: PropertyType = {
  kind: "property",
  name: "floatingCellRenderers",
  optional: true,
  value: "Record<string, HeaderFloatingCellRendererFn<T>>",
  tsDoc: `The floating cell renderers that may be referenced by name.`,
  doc: { en: `` },
};

const HeaderCellRenderers: PropertyType = {
  kind: "property",
  name: "headerCellRenderers",
  optional: true,
  value: "Record<string, HeaderCellRendererFn<T>>",
  tsDoc: `The header cell renderers that may be referenced by name.`,
  doc: { en: `` },
};

const EditRenderers: PropertyType = {
  kind: "property",
  name: "editRenderers",
  optional: true,
  value: "Record<string, EditRendererFn<T>>",
  tsDoc: `The edit renderers that may be referenced by name.`,
  doc: { en: `` },
};

const EditRowValidatorFn: PropertyType = {
  kind: "property",
  name: "editRowValidatorFn",
  optional: true,
  value: "EditRowValidatorFn<T>",
  tsDoc: `A function for validating grid updates at a row level.`,
  doc: { en: `` },
};

const EditClickActivator: PropertyType = {
  kind: "property",
  name: "editClickActivator",
  optional: true,
  value: "EditClickActivator",
  tsDoc: `The mouse interaction that should begin cell editing.`,
  doc: { en: `` },
};

const EditCellMode: PropertyType = {
  kind: "property",
  name: "editCellMode",
  optional: true,
  value: "EditCellMode",
  tsDoc: `The initial cell edit mode.`,
  doc: { en: `` },
};

const ColumnMarkerProp: PropertyType = {
  kind: "property",
  name: "columnMarker",
  optional: true,
  value: "ColumnMarker<T>",
  tsDoc: `The column marker definition.`,
  doc: { en: `` },
};

const ColumnMarkerEnabled: PropertyType = {
  kind: "property",
  name: "columnMarkerEnabled",
  optional: true,
  value: "boolean",
  tsDoc: `A boolean indicating if the column marker should be visible.`,
  doc: { en: `` },
};

const RowDetailRenderer: PropertyType = {
  kind: "property",
  name: "rowDetailRenderer",
  optional: true,
  value: "RowDetailRendererFn<T>",
  tsDoc: `A function used to render the content for a row detail area.`,
  doc: { en: `` },
};

const RowDetailHeight: PropertyType = {
  kind: "property",
  name: "rowDetailHeight",
  optional: true,
  value: "RowDetailHeight",
  tsDoc: `The height of the row detail area.`,
  doc: { en: `` },
};

const RowDetailAutoHeightGuess: PropertyType = {
  kind: "property",
  name: "rowDetailAutoHeightGuess",
  optional: true,
  value: "number",
  tsDoc: `The initial guess of the height of a row detail area before the actual height is observed.`,
  doc: { en: `` },
};

const RowDetailExpansions: PropertyType = {
  kind: "property",
  name: "rowDetailExpansions",
  optional: true,
  value: "Set<string>",
  tsDoc: `The initial row detail expansion state.`,
  doc: { en: `` },
};

const RowSelectedIds: PropertyType = {
  kind: "property",
  name: "rowSelectedIds",
  optional: true,
  value: "Set<string>",
  tsDoc: `The initial selected row ids.`,
  doc: { en: `` },
};

const RowSelectionMode: PropertyType = {
  kind: "property",
  name: "rowSelectionMode",
  optional: true,
  value: "RowSelectionMode",
  tsDoc: `The row selection mode to use.`,
  doc: { en: `` },
};

const RowSelectionActivator: PropertyType = {
  kind: "property",
  name: "rowSelectionActivator",
  optional: true,
  value: "RowSelectionActivator",
  tsDoc: `The mouse interaction that should begin row selection.`,
  doc: { en: `` },
};

const RowSelectChildren: PropertyType = {
  kind: "property",
  name: "rowSelectChildren",
  optional: true,
  value: "boolean",
  tsDoc: `A boolean indicating if the row selection should select children as well.`,
  doc: { en: `` },
};

const ColumnDoubleClickToAutosize: PropertyType = {
  kind: "property",
  name: "columnDoubleClickToAutosize",
  optional: true,
  value: "boolean",
  tsDoc: `A boolean indicating if double click to autosize a column should be enabled.`,
  doc: { en: `` },
};

const VirtualizeRows: PropertyType = {
  kind: "property",
  name: "virtualizeRows",
  optional: true,
  value: "boolean",
  tsDoc: `A boolean indicating if the rows in the grid should be virtualized.`,
  doc: { en: `` },
};

const VirtualizeColumns: PropertyType = {
  kind: "property",
  name: "virtualizeCols",
  optional: true,
  value: "boolean",
  tsDoc: `A boolean indicating if the columns in the grid should be virtualized.`,
  doc: { en: `` },
};

const UseLyteNytePropsPartial: InterfaceTypePartial = {
  kind: "interface-partial",
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
    ColumnDoubleClickToAutosize,

    RowDetailRenderer,
    RowDetailHeight,
    RowDetailExpansions,
    RowDetailAutoHeightGuess,

    RowSelectedIds,
    RowSelectionMode,
    RowSelectionActivator,
    RowSelectChildren,

    VirtualizeColumns,
    VirtualizeRows,
  ],
};

export const UseLyteNyteProps: InterfaceType = {
  kind: "interface",
  name: "UseLyteNyteProps<T>",
  export: true,
  tsDoc: `The initial props that may be passed to the \`useLyteNyte\` hook. The hook
  returns the state representation of LyteNyte Grid.
  
  @group Grid State
  `,
  doc: { en: `` },
  extends: UseLyteNytePropsPartial,
  tag: "core",
  properties: [],
};

const QuickSearch: PropertyType = {
  kind: "property",
  name: "quickSearch",
  optional: true,
  value: "string | null",
  tsDoc: `The quick search filter value.`,
  doc: { en: `` },
};

const FilterInModel: PropertyType = {
  kind: "property",
  name: "filterInModel",
  optional: true,
  value: "Record<string, FilterIn>",
  tsDoc: `The in (set) filter model to apply to LyteNyte Grid.`,
  doc: { en: `` },
};

const QuickSearchSensitivity: PropertyType = {
  kind: "property",
  name: "quickSearchSensitivity",
  optional: true,
  value: "FilterQuickSearchSensitivity",
  tsDoc: `The case sensitivity of the quick search filter.`,
  doc: { en: `` },
};

const ColumnPivotModel: PropertyType = {
  kind: "property",
  name: "columnPivotModel",
  optional: true,
  value: "ColumnPivotModel<T>",
  tsDoc: `The initial column pivot model to apply to LyteNyte Grid.`,
  doc: { en: `` },
};

const ColumnPivotMode: PropertyType = {
  kind: "property",
  name: "columnPivotMode",
  optional: true,
  value: "boolean",
  tsDoc: `A boolean indicating if the column pivot mode should be on.`,
  doc: { en: `` },
};

const DialogFrame: PropertyType = {
  kind: "property",
  name: "dialogFrames",
  optional: true,
  value: "Record<string, DialogFrame<T>>",
  tsDoc: `The dialog frames available in the grid.`,
  doc: { en: `` },
};

const PopoverFrame: PropertyType = {
  kind: "property",
  name: "popoverFrames",
  optional: true,
  value: "Record<string, PopoverFrame<T>>",
  tsDoc: `The popover frames available in the grid.`,
  doc: { en: `` },
};

const CellSelections: PropertyType = {
  kind: "property",
  name: "cellSelections",
  optional: true,
  value: "DataRect[]",
  tsDoc: `The initial cell selections in the grid.`,
  doc: { en: `` },
};

const CellSelectionMode: PropertyType = {
  kind: "property",
  name: "cellSelectionMode",
  optional: true,
  value: "CellSelectionMode",
  tsDoc: `The cell selection mode to use.`,
  doc: { en: `` },
};

export const UseLyteNytePropsPro: InterfaceType = {
  kind: "interface",
  name: "UseLyteNyteProps<T>",
  export: true,
  tsDoc: `The initial props that may be passed to the \`useLyteNyte\` hook. The hook
    returns the state representation of LyteNyte Grid.
    
  @group Grid State
  `,
  doc: { en: `` },
  extends: UseLyteNytePropsPartial,
  tag: "pro",
  properties: [
    QuickSearch,
    QuickSearchSensitivity,
    ColumnPivotMode,
    ColumnPivotModel,
    DialogFrame,
    PopoverFrame,
    FilterInModel,
    CellSelections,
    CellSelectionMode,
  ],
};
