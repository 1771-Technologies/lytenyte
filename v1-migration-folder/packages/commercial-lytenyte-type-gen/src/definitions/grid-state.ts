import type { InterfaceType, InterfaceTypePartial, PropertyType } from "../+types.js";

export const ViewBounds: InterfaceType = {
  kind: "interface",
  tsDoc: `Defines the viewport boundaries for rendering rows and columns in LyteNyte Grid. 
  These bounds are calculated based on the scroll position and the visible area of the grid.`,
  doc: { en: `` },
  export: true,
  name: "ViewBounds",
  properties: [
    {
      kind: "property",
      name: "rowTopStart",
      tsDoc: `Index of the first row pinned to the top of the grid. This will always be 0.`,
      doc: { en: `` },
      optional: false,
      value: "number",
    },
    {
      kind: "property",
      name: "rowTopEnd",
      tsDoc: `Index just past the last top-pinned row. Equal to \`1 + number of pinned rows\`.`,
      doc: { en: `` },
      optional: false,
      value: "number",
    },
    {
      kind: "property",
      name: "rowCenterStart",
      tsDoc: `Start index of the scrollable rows that should be rendered in the viewport.`,
      doc: { en: `` },
      optional: false,
      value: "number",
    },
    {
      kind: "property",
      name: "rowCenterEnd",
      tsDoc: `End index of the scrollable rows that should be rendered.`,
      doc: { en: `` },
      optional: false,
      value: "number",
    },
    {
      kind: "property",
      name: "rowCenterLast",
      tsDoc: `Index one past the last possible scrollable row in the dataset.`,
      doc: { en: `` },
      optional: false,
      value: "number",
    },
    {
      kind: "property",
      name: "rowBotStart",
      tsDoc: `Index of the first row pinned to the bottom of the grid.`,
      doc: { en: `` },
      optional: false,
      value: "number",
    },
    {
      kind: "property",
      name: "rowBotEnd",
      tsDoc: `Index just past the last bottom-pinned row.`,
      doc: { en: `` },
      optional: false,
      value: "number",
    },
    {
      kind: "property",
      name: "colStartStart",
      tsDoc: `Index of the first column pinned to the start (left side for LTR).`,
      doc: { en: `` },
      optional: false,
      value: "number",
    },
    {
      kind: "property",
      name: "colStartEnd",
      tsDoc: `Index one past the last column pinned to the start.`,
      doc: { en: `` },
      optional: false,
      value: "number",
    },
    {
      kind: "property",
      name: "colCenterStart",
      tsDoc: `Start index of scrollable columns to render.`,
      doc: { en: `` },
      optional: false,
      value: "number",
    },
    {
      kind: "property",
      name: "colCenterEnd",
      tsDoc: `End index of scrollable columns to render.`,
      doc: { en: `` },
      optional: false,
      value: "number",
    },
    {
      kind: "property",
      name: "colCenterLast",
      tsDoc: `Index one past the last possible scrollable column in the grid.`,
      doc: { en: `` },
      optional: false,
      value: "number",
    },
    {
      kind: "property",
      name: "colEndStart",
      tsDoc: `Index of the first column pinned to the end (right side for LTR).`,
      doc: { en: `` },
      optional: false,
      value: "number",
    },
    {
      kind: "property",
      name: "colEndEnd",
      tsDoc: `Index one past the last column pinned to the end.`,
      doc: { en: `` },
      optional: false,
      value: "number",
    },
  ],
};

/**
 * Grid State
 */
const Columns: PropertyType = {
  kind: "property",
  name: "columns",
  optional: false,
  value: "GridAtom<Column<T>[]>",
  tsDoc: `All column definitions registered in the grid, including both visible and hidden columns.`,
  doc: { en: `` },
};

const ColumnBase: PropertyType = {
  kind: "property",
  name: "columnBase",
  optional: false,
  value: "GridAtom<ColumnBase<T>>",
  tsDoc: `A base column configuration object used as a fallback for individual columns.`,
  doc: { en: `` },
};

const GridId: PropertyType = {
  kind: "property",
  name: "gridId",
  optional: false,
  value: "GridAtom<string>",
  tsDoc: `A unique identifier associated with the grid instance.`,
  doc: { en: `` },
};

const ColumnSizeToFit: PropertyType = {
  kind: "property",
  name: "columnSizeToFit",
  optional: false,
  value: "GridAtom<boolean>",
  tsDoc: `Controls whether columns should automatically resize to fit the available width of the grid viewport.`,
  doc: { en: `` },
};

const Viewport: PropertyType = {
  kind: "property",
  name: "viewport",
  optional: false,
  value: "GridAtom<HTMLElement | null>",
  tsDoc: `The HTML element representing the viewport of the grid. May be null before initialization.`,
  doc: { en: `` },
};

const ViewportWidthInner: PropertyType = {
  kind: "property",
  name: "viewportWidthInner",
  optional: false,
  value: "GridAtom<number>",
  tsDoc: `The internal width of the viewport, usually equal to the clientWidth of the viewport element.`,
  doc: { en: `` },
};

const ViewportHeightInner: PropertyType = {
  kind: "property",
  name: "viewportHeightInner",
  optional: false,
  value: "GridAtom<number>",
  tsDoc: `The internal height of the viewport, typically matching the clientHeight of the viewport element.`,
  doc: { en: `` },
};

const ViewportWidthOuter: PropertyType = {
  kind: "property",
  name: "viewportWidthOuter",
  optional: false,
  value: "GridAtom<number>",
  tsDoc: `The outer width of the viewport, corresponding to its offsetWidth.`,
  doc: { en: `` },
};

const ViewportHeightOuter: PropertyType = {
  kind: "property",
  name: "viewportHeightOuter",
  optional: false,
  value: "GridAtom<number>",
  tsDoc: `The outer height of the viewport, corresponding to its offsetHeight.`,
  doc: { en: `` },
};

const HeaderHeight: PropertyType = {
  kind: "property",
  name: "headerHeight",
  optional: false,
  value: "GridAtom<number>",
  tsDoc: `The vertical height (in pixels) allocated for the header row of the grid.`,
  doc: { en: `` },
};

const HeaderGroupHeight: PropertyType = {
  kind: "property",
  name: "headerGroupHeight",
  optional: false,
  value: "GridAtom<number>",
  tsDoc: `The vertical height (in pixels) allocated for grouped header rows, if present.`,
  doc: { en: `` },
};

const XPositions: PropertyType = {
  kind: "property",
  name: "xPositions",
  optional: false,
  value: "GridAtomReadonly<Uint32Array>",
  tsDoc: `The horizontal (x-axis) pixel positions of each visible column in the grid. Used to determine 
  where each column should render on screen.`,
  doc: { en: `` },
};

const WidthTotal: PropertyType = {
  kind: "property",
  name: "widthTotal",
  optional: false,
  value: "GridAtomReadonly<number>",
  tsDoc: `The total combined width (in pixels) of all visible columns in the grid.`,
  doc: { en: `` },
};

const ColumnGroupExpansions: PropertyType = {
  kind: "property",
  name: "columnGroupExpansions",
  optional: false,
  value: "GridAtom<Record<string, boolean>>",
  tsDoc: `A map of column group ids to their expansion state. This controls whether individual groups 
  are expanded or collapsed. Direct mutation bypasses grid events.`,
  doc: { en: `` },
};

const ColumnGroupDefaultExpansion: PropertyType = {
  kind: "property",
  name: "columnGroupDefaultExpansion",
  optional: false,
  value: "GridAtom<boolean>",
  tsDoc: `The default expansion state for column groups when no specific state has been set.`,
  doc: { en: `` },
};

const ColumnGroupJoinDelimiter: PropertyType = {
  kind: "property",
  name: "columnGroupJoinDelimiter",
  optional: false,
  value: "GridAtom<string>",
  tsDoc: `The delimiter string used to construct hierarchical column group ids by joining nested keys.`,
  doc: { en: `` },
};

const ColumnGroupMeta: PropertyType = {
  kind: "property",
  name: "columnGroupMeta",
  optional: false,
  value: "GridAtomReadonly<ColumnGroupMeta>",
  tsDoc: `Computed metadata about the column group structure in the grid. This is used internally for 
  layout and interaction logic involving grouped headers.`,
  doc: { en: `` },
};

const ColumnMeta: PropertyType = {
  kind: "property",
  name: "columnMeta",
  optional: false,
  value: "GridAtomReadonly<ColumnMeta<T>>",
  tsDoc: `Computed metadata for each column in the grid, including rendering metrics and positional 
  information. Useful for custom layout or advanced plugin behavior.`,
  doc: { en: `` },
};

const RowDataStore: PropertyType = {
  kind: "property",
  name: "rowDataStore",
  optional: false,
  value: "RowDataStore<T>",
  tsDoc: `The backing store for row data within the grid. This is managed internally and should not be 
  mutated directly unless implementing a custom data source.`,
  doc: { en: `` },
};

const RowDataSource: PropertyType = {
  kind: "property",
  name: "rowDataSource",
  optional: false,
  value: "GridAtom<RowDataSource<T>>",
  tsDoc: `The configured row data source for the grid. This defines how rows are fetched, paged, or 
  streamed into the grid.`,
  doc: { en: `` },
};

const YPositions: PropertyType = {
  kind: "property",
  name: "yPositions",
  optional: false,
  value: "GridAtomReadonly<Uint32Array>",
  tsDoc: `The vertical (y-axis) pixel positions of rows in the grid. Determines how each row is positioned 
  within the scrollable area.`,
  doc: { en: `` },
};

const HeightTotal: PropertyType = {
  kind: "property",
  name: "heightTotal",
  optional: false,
  value: "GridAtomReadonly<number>",
  tsDoc: `The total height (in pixels) of all rows currently present in the grid.`,
  doc: { en: `` },
};

const RowAutoHeightGuess: PropertyType = {
  kind: "property",
  name: "rowAutoHeightGuess",
  optional: false,
  value: "GridAtom<number>",
  tsDoc: `A fallback row height (in pixels) used before actual row heights are measured. 
  Especially useful when rendering rows with dynamic or unknown content heights.`,
  doc: { en: `` },
};

const RowHeight: PropertyType = {
  kind: "property",
  name: "rowHeight",
  optional: false,
  value: "GridAtom<RowHeight>",
  doc: { en: `` },
  tsDoc: `The height configuration for rows in the grid. This may be a fixed number, a function, or a 
  configuration object.`,
};

const RowScanDistance: PropertyType = {
  kind: "property",
  name: "rowScanDistance",
  optional: false,
  value: "GridAtom<number>",
  tsDoc: `Controls how many rows back the grid should look when computing layout for row-spanning cells. 
  Higher values allow larger spans but impact performance.`,
  doc: { en: `` },
};

const ColScanDistance: PropertyType = {
  kind: "property",
  name: "colScanDistance",
  optional: false,
  value: "GridAtom<number>",
  tsDoc: `Controls how many columns back the grid should look when computing layout for column-spanning 
  cells. Larger values allow broader spans but can reduce rendering efficiency.`,
  doc: { en: `` },
};

const RowOverscanTop: PropertyType = {
  kind: "property",
  name: "rowOverscanTop",
  optional: false,
  value: "GridAtom<number>",
  tsDoc: `Specifies the number of additional rows to render above the visible viewport. Increasing this 
  value can reduce visible loading artifacts when scrolling upward, at the cost of performance.`,
  doc: { en: `` },
};

const RowOverscanBottom: PropertyType = {
  kind: "property",
  name: "rowOverscanBottom",
  optional: false,
  value: "GridAtom<number>",
  tsDoc: `Specifies the number of additional rows to render below the visible viewport. Increasing this 
  value can reduce flickering when scrolling downward, but may negatively impact rendering performance.`,
  doc: { en: `` },
};

const ColOverscanStart: PropertyType = {
  kind: "property",
  name: "colOverscanStart",
  optional: false,
  value: "GridAtom<number>",
  tsDoc: `Specifies the number of extra columns to render before the first visible column. Helps with 
  smoother horizontal scrolling to the left.`,
  doc: { en: `` },
};

const ColOverscanEnd: PropertyType = {
  kind: "property",
  name: "colOverscanEnd",
  optional: false,
  value: "GridAtom<number>",
  tsDoc: `Specifies the number of extra columns to render after the last visible column. Helps with 
  smoother horizontal scrolling to the right.`,
  doc: { en: `` },
};

const RowFullWidthPredicate: PropertyType = {
  kind: "property",
  name: "rowFullWidthPredicate",
  optional: false,
  value: "GridAtom<{ fn: RowFullWidthPredicate<T>}>",
  tsDoc: `A predicate function used to determine whether a given row should be rendered as a 
  full-width row. Full-width rows span across all columns and bypass standard cell layout.`,
  doc: { en: `` },
};

const RowFullWidthRenderer: PropertyType = {
  kind: "property",
  doc: { en: `` },
  tsDoc: `The component function that renders full-width rows in the grid. This renderer is called 
  whenever a row matches the full-width predicate.`,
  name: "rowFullWidthRenderer",
  optional: false,
  value: "GridAtom<{ fn: RowFullWidthRendererFn<T> }>",
};

const CellRenderers: PropertyType = {
  kind: "property",
  name: "cellRenderers",
  optional: false,
  value: "GridAtom<Record<string, CellRendererFn<T>>>",
  tsDoc: `A registry of named cell renderer functions. These can be referenced by name in 
  individual column definitions to customize cell rendering behavior.`,
  doc: { en: `` },
};

const SortModel: PropertyType = {
  kind: "property",
  name: "sortModel",
  optional: false,
  tsDoc: `An array representing the current sort state of the grid. Each entry defines 
  a column and its sort direction. An empty array means no active sorting.`,
  doc: { en: `` },
  value: "GridAtom<SortModelItem<T>[]>",
};

const Rtl: PropertyType = {
  kind: "property",
  name: "rtl",
  optional: false,
  tsDoc: `Boolean flag that determines whether the grid renders in right-to-left (RTL) mode.`,
  doc: { en: `` },
  value: "GridAtom<boolean>",
};

const FilterModel: PropertyType = {
  kind: "property",
  name: "filterModel",
  optional: false,
  tsDoc: `An array of filters currently applied to the grid. If empty, no filters are active.`,
  doc: { en: `` },
  value: "GridAtom<Record<string, FilterModelItem<T>>>",
};

const RowGroupModel: PropertyType = {
  kind: "property",
  name: "rowGroupModel",
  optional: false,
  tsDoc: `An array representing the fields or columns being used to group rows. An empty array 
  disables row grouping.`,
  doc: { en: `` },
  value: "GridAtom<RowGroupModelItem<T>[]>",
};

const RowGroupDisplayMode: PropertyType = {
  kind: "property",
  name: "rowGroupDisplayMode",
  tsDoc: `Specifies how automatically generated row group columns should be displayed in the grid. 
  This controls their visibility and layout.`,
  doc: { en: `` },
  optional: false,
  value: "GridAtom<RowGroupDisplayMode>",
};

const RowGroupDefaultExpansion: PropertyType = {
  kind: "property",
  name: "rowGroupDefaultExpansion",
  tsDoc: `Controls the default expansion state of all row groups. If a number is provided, groups up to that 
  depth will be expanded by default.`,
  doc: { en: `` },
  optional: false,
  value: "GridAtom<boolean | number>",
};

const RowGroupExpansions: PropertyType = {
  kind: "property",
  name: "rowGroupExpansions",
  tsDoc: `An object mapping row group ids to their expansion state. Updating this directly will not trigger 
  grid events and should be done with care.`,
  doc: { en: `` },
  optional: false,
  value: "GridAtom<{ [rowId: string]: boolean | undefined }>",
};

const RowGroupColumn: PropertyType = {
  kind: "property",
  name: "rowGroupColumn",
  tsDoc: `Defines the template or configuration for the automatically generated row group column. 
  This controls its appearance and behavior.`,
  doc: { en: `` },
  optional: false,
  value: "GridAtom<RowGroupColumn<T>>",
};

const AggModel: PropertyType = {
  kind: "property",
  name: "aggModel",
  tsDoc: `The aggregation model configuration for the grid. Each entry maps a column id to its associated 
  aggregation function. Aggregation results are typically displayed in group or summary rows.`,
  doc: { en: `` },
  optional: false,
  value: "GridAtom<{ [columnId: string]: { fn: AggModelFn<T> } }>",
};

const FloatingRowEnabled: PropertyType = {
  kind: "property",
  name: "floatingRowEnabled",
  tsDoc: `Controls whether the floating row is enabled in the grid. When enabled, the floating row 
  appears fixed below the column headers.`,
  doc: { en: `` },
  optional: false,
  value: "GridAtom<boolean>",
};

const FloatingRowHeight: PropertyType = {
  kind: "property",
  name: "floatingRowHeight",
  tsDoc: `Specifies the height, in pixels, of the floating row when enabled.`,
  doc: { en: `` },
  optional: false,
  value: "GridAtom<number>",
};

const FloatingCellRenderers: PropertyType = {
  kind: "property",
  name: "floatingCellRenderers",
  tsDoc: `A map of named floating row cell renderers. These renderers can be assigned by name 
  in the floating row column configurations.`,
  doc: { en: `` },
  optional: false,
  value: "GridAtom<Record<string, HeaderFloatingCellRendererFn<T>>>",
};

const HeaderCellRenderers: PropertyType = {
  kind: "property",
  name: "headerCellRenderers",
  tsDoc: `A map of named header cell renderers. These can be referenced in column definitions to 
  customize how column headers are displayed.`,
  doc: { en: `` },
  optional: false,
  value: "GridAtom<Record<string, HeaderCellRendererFn<T>>>",
};

const EditRenderers: PropertyType = {
  kind: "property",
  name: "editRenderers",
  tsDoc: `A map of named edit renderers. These renderers are used to customize the editing 
  experience for cells in editable columns.`,
  doc: { en: `` },
  optional: false,
  value: "GridAtom<Record<string, EditRendererFn<T>>>",
};

const EditRowValidatorFn: PropertyType = {
  kind: "property",
  name: "editRowValidatorFn",
  tsDoc: `A function used to validate updates to a row during an edit. This validator can prevent 
  invalid edits before they are applied to the grid state.`,
  doc: { en: `` },
  optional: false,
  value: "GridAtom<{ fn: EditRowValidatorFn<T> }>",
};

const EditClickActivator: PropertyType = {
  kind: "property",
  name: "editClickActivator",
  tsDoc: `Specifies the mouse interaction pattern (e.g., single click, double click) required to 
  activate a cell edit.`,
  doc: { en: `` },
  optional: false,
  value: "GridAtom<EditClickActivator>",
};

const EditCellMode: PropertyType = {
  kind: "property",
  name: "editCellMode",
  tsDoc: `Determines the cell edit mode for the grid. Modes include read-only and editable states.`,
  doc: { en: `` },
  optional: false,
  value: "GridAtom<EditCellMode>",
};

const EditActivePosition: PropertyType = {
  kind: "property",
  name: "editActivePosition",
  value: "GridAtomReadonly<EditActivePosition<T> | null>",
  tsDoc: `Represents the current active edit position in the grid. If no edit is active, this is null.`,
  doc: { en: `` },
  optional: false,
};

const ColumnMarker: PropertyType = {
  kind: "property",
  name: "columnMarker",
  value: "GridAtom<ColumnMarker<T>>",
  tsDoc: `Configuration object for the marker column, which is often used to indicate row-specific states 
  like expansion or editing.`,
  doc: { en: `` },
  optional: false,
};

const ColumnMarkerEnabled: PropertyType = {
  kind: "property",
  name: "columnMarkerEnabled",
  value: "GridAtom<boolean>",
  tsDoc: `Enables or disables the marker column in the grid.`,
  doc: { en: `` },
  optional: false,
};

const RowDetailRenderer: PropertyType = {
  kind: "property",
  name: "rowDetailRenderer",
  tsDoc: `The function that renders additional row detail content when a row is expanded.`,
  doc: { en: `` },
  optional: false,
  value: "GridAtom<{ fn: RowDetailRendererFn<T> }>",
};

const RowDetailHeight: PropertyType = {
  kind: "property",
  name: "rowDetailHeight",
  tsDoc: `Specifies the height of the row detail section when expanded.`,
  doc: { en: `` },
  optional: false,
  value: "GridAtom<RowDetailHeight>",
};

const RowDetailAutoHeightGuess: PropertyType = {
  kind: "property",
  name: "rowDetailAutoHeightGuess",
  tsDoc: `The default estimated height for row detail sections before their actual height has 
  been measured.`,
  doc: { en: `` },
  optional: false,
  value: "GridAtom<number>",
};

const RowDetailExpansions: PropertyType = {
  kind: "property",
  name: "rowDetailExpansions",
  tsDoc: `Represents the set of row ids with expanded row detail sections.`,
  doc: { en: `` },
  optional: false,
  value: "GridAtom<Set<string>>",
};

const RowSelectedIds: PropertyType = {
  kind: "property",
  name: "rowSelectedIds",
  tsDoc: `A set of selected row ids in the grid.`,
  doc: { en: `` },
  optional: false,
  value: "GridAtom<Set<string>>",
};

const RowSelectionMode: PropertyType = {
  kind: "property",
  name: "rowSelectionMode",
  doc: { en: `` },
  optional: false,
  tsDoc: `Specifies the selection mode of the grid, such as single or multiple row selection.`,
  value: "GridAtom<RowSelectionMode>",
};

const RowSelectionPivot: PropertyType = {
  kind: "property",
  name: "rowSelectionPivot",
  doc: { en: `` },
  optional: false,
  tsDoc: `Identifies the anchor row used for shift-based range selections. Defines the selection 
  starting point.`,
  value: "GridAtom<string | null>",
};

const RowSelectionActivator: PropertyType = {
  kind: "property",
  name: "rowSelectionActivator",
  doc: { en: `` },
  optional: false,
  tsDoc: `Specifies the interaction pattern or input trigger that initiates row selection, 
  such as clicks or keyboard inputs.`,
  value: "GridAtom<RowSelectionActivator>",
};

const RowSelectChildren: PropertyType = {
  kind: "property",
  name: "rowSelectChildren",
  doc: { en: `` },
  optional: false,
  tsDoc: `If true, selecting a parent row will automatically select its child rows. Useful for hierarchical 
  or grouped data selection.`,
  value: "GridAtom<boolean>",
};

const ViewBoundsProp: PropertyType = {
  kind: "property",
  name: "viewBounds",
  doc: { en: `` },
  optional: false,
  tsDoc: `The current view bounds of the grid, representing the row and column segments 
  that should be rendered based on scroll position and viewport.`,
  value: "GridAtomReadonly<ViewBounds>",
};

const ColumnDoubleClickToAutosize: PropertyType = {
  kind: "property",
  name: "columnDoubleClickToAutosize",
  tsDoc: `If true, double-clicking on a column's resize handle will trigger an autosize 
  for that column based on its content.`,
  doc: { en: `` },
  optional: false,
  value: "GridAtom<boolean>",
};

const VirtualizeRows: PropertyType = {
  kind: "property",
  name: "virtualizeRows",
  tsDoc: `Controls whether rows should be virtualized. Improves performance for large datasets 
  by only rendering visible rows. Enabled by default.`,
  doc: { en: `` },
  optional: false,
  value: "GridAtom<boolean>",
};

const VirtualizeColumns: PropertyType = {
  kind: "property",
  name: "virtualizeCols",
  tsDoc: `Controls whether columns should be virtualized. Improves performance for large column 
  sets by only rendering visible columns. Enabled by default.`,
  doc: { en: `` },
  optional: false,
  value: "GridAtom<boolean>",
};

const GridStatePartial: InterfaceTypePartial = {
  kind: "interface-partial",
  properties: [
    Columns,
    ColumnMeta,
    ColumnBase,
    ColumnGroupDefaultExpansion,
    ColumnGroupExpansions,
    ColumnGroupJoinDelimiter,
    ColumnGroupMeta,
    ColumnSizeToFit,
    GridId,
    XPositions,
    YPositions,
    WidthTotal,
    HeightTotal,
    Viewport,
    ViewportWidthInner,
    ViewportWidthOuter,
    ViewportHeightInner,
    ViewportHeightOuter,
    HeaderHeight,
    HeaderGroupHeight,
    RowDataStore,
    RowDataSource,
    RowAutoHeightGuess,
    RowHeight,
    RowScanDistance,
    ColScanDistance,

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
    RowGroupModel,
    RowGroupColumn,
    RowGroupDisplayMode,
    RowGroupDefaultExpansion,
    RowGroupExpansions,

    FloatingRowEnabled,
    FloatingRowHeight,
    FloatingCellRenderers,
    HeaderCellRenderers,

    EditRenderers,
    EditRowValidatorFn,
    EditClickActivator,
    EditCellMode,
    EditActivePosition,

    ColumnMarker,
    ColumnMarkerEnabled,
    ColumnDoubleClickToAutosize,

    RowDetailRenderer,
    RowDetailHeight,
    RowDetailAutoHeightGuess,
    RowDetailExpansions,

    RowSelectedIds,
    RowSelectionMode,
    RowSelectionPivot,
    RowSelectionActivator,
    RowSelectChildren,

    ViewBoundsProp,

    VirtualizeColumns,
    VirtualizeRows,
  ],
};

export const GridState: InterfaceType = {
  kind: "interface",
  export: true,
  name: "GridState<T>",
  tsDoc: `The declarative state object of LyteNyte Grid. This state encapsulates all mutable and observable
  grid properties that affect layout, data, selection, and rendering. Updating any of these atoms will trigger 
  corresponding changes in the grid UI. These state values can also be used to create and synchronize external
  components such as toolbars, panels, or widgets.`,
  doc: { en: `` },
  tag: "core",
  properties: [],
  extends: GridStatePartial,
};

/**
 * PRO
 */

const QuickSearch: PropertyType = {
  kind: "property",
  doc: { en: `` },
  name: "quickSearch",
  optional: false,
  tsDoc: `Represents the current quick search input applied to the grid. When set, rows will be filtered 
  using this value. If null or an empty string, no quick search filtering will be applied.`,
  value: "GridAtom<string | null>",
};

const FilterInModel: PropertyType = {
  kind: "property",
  name: "filterInModel",
  optional: false,
  value: "GridAtom<Record<string, FilterIn>>",
  tsDoc: `The in (set) filter model to apply to LyteNyte Grid.`,
  doc: { en: `` },
};

const QuickSearchSensitivity: PropertyType = {
  kind: "property",
  doc: { en: `` },
  name: "quickSearchSensitivity",
  optional: false,
  tsDoc: `Specifies whether the quick search is case-sensitive or insensitive. Controls how text is matched 
  during quick search filtering.`,
  value: "GridAtom<FilterQuickSearchSensitivity>",
};

export const ColumnPivotModel: PropertyType = {
  kind: "property",
  doc: { en: `` },
  name: "columnPivotModel",
  optional: false,
  tsDoc: `The current column pivot model in use. This model defines how column pivoting is structured
  in the grid and which columns are used to generate pivot dimensions.`,
  value: "GridAtom<ColumnPivotModel<T>>",
};

export const ColumnPivotMode: PropertyType = {
  kind: "property",
  doc: { en: `` },
  name: "columnPivotMode",
  optional: false,
  tsDoc: `Controls whether column pivoting is enabled in the grid. When true, pivot columns will be 
  generated based on the active pivot model.`,
  value: "GridAtom<boolean>",
};

export const ColumnPivotColumns: PropertyType = {
  kind: "property",
  tsDoc: `The generated columns from the current pivot model. These columns represent data values 
  derived from pivot operations. They may be updated, but changes may be overridden if the pivot model changes.`,
  doc: { en: `` },
  name: "columnPivotColumns",
  optional: false,
  value: "GridAtom<Column<T>[]>",
};

export const ColumnPivotColumnGroupExpansions: PropertyType = {
  kind: "property",
  tsDoc: `Tracks the expansion state of column groups generated by pivot operations. Each key is 
  a group id, and the value indicates whether it's expanded or collapsed.`,
  doc: { en: `` },
  name: "columnPivotColumnGroupExpansions",
  optional: false,
  value: "GridAtom<Record<string, boolean | undefined>>",
};

export const ColumnPivotRowGroupExpansions: PropertyType = {
  kind: "property",
  tsDoc: `Tracks the expansion state of row groups generated by the current pivot model. Each key is 
  a row group id, and the value determines its expansion state.`,
  doc: { en: `` },
  name: "columnPivotRowGroupExpansions",
  optional: false,
  value: "GridAtom<{ [rowId: string]: boolean | undefined }>",
};

const DialogFrame: PropertyType = {
  kind: "property",
  doc: { en: `` },
  name: "dialogFrames",
  optional: false,
  tsDoc: `A dictionary of dialog frames currently managed by the grid. These frames can be programmatically 
  opened or closed using the \`dialogFrameOpen\` and \`dialogFrameClose\` API methods.`,
  value: "GridAtom<Record<string, DialogFrame<T>>>",
};

const PopoverFrame: PropertyType = {
  kind: "property",
  doc: { en: `` },
  name: "popoverFrames",
  optional: false,
  tsDoc: `A dictionary of popover frames currently managed by the grid. These can be dynamically shown 
  or hidden using the \`popoverFrameOpen\` and \`popoverFrameClose\` API methods.`,
  value: "GridAtom<Record<string, PopoverFrame<T>>>",
};

const CellSelections: PropertyType = {
  kind: "property",
  doc: { en: `` },
  tsDoc: `An array of cell selections currently active in the grid. Each selection is a rectangular 
  range of selected cells, useful for bulk editing, clipboard actions, or analytics.`,
  name: "cellSelections",
  optional: false,
  value: "GridAtom<DataRect[]>",
};

const CellSelectionMode: PropertyType = {
  kind: "property",
  doc: { en: `` },
  tsDoc: `Controls the grid's current cell selection mode. This determines how users may interact with 
  and select individual or grouped cells.`,
  name: "cellSelectionMode",
  optional: false,
  value: "GridAtom<CellSelectionMode>",
};

export const GridStatePro: InterfaceType = {
  kind: "interface",
  export: true,
  name: "GridState<T>",
  tsDoc: `The declarative state object of LyteNyte Grid. This state encapsulates all mutable and observable
  grid properties that affect layout, data, selection, and rendering. Updating any of these atoms will trigger 
  corresponding changes in the grid UI. These state values can also be used to create and synchronize external
  components such as toolbars, panels, or widgets.`,
  doc: { en: `` },
  tag: "pro",
  properties: [
    QuickSearch,
    QuickSearchSensitivity,
    ColumnPivotModel,
    ColumnPivotMode,
    ColumnPivotColumns,
    ColumnPivotRowGroupExpansions,
    ColumnPivotColumnGroupExpansions,
    FilterInModel,
    DialogFrame,
    PopoverFrame,
    CellSelections,
    CellSelectionMode,
  ],
  extends: GridStatePartial,
};
