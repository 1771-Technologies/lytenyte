import type { ReactNode } from "react";

/**
 * The initial props that may be passed to the `useLyteNyte` hook. The hook
 *     returns the state representation of LyteNyte Grid.
 *
 *   @group Grid State
 */
export interface UseLyteNyteProps<T> {
  /**
   * The initial column definitions.
   */
  readonly columns?: Column<T>[];

  /**
   * The base column definition.
   */
  readonly columnBase?: ColumnBase<T>;

  /**
   * The default expansion state for column groups if not specified explicitly.
   */
  readonly columnGroupDefaultExpansion?: boolean;

  /**
   * The initial expansion state for column groups.
   */
  readonly columnGroupExpansions?: Record<string, boolean>;

  /**
   * A delimiter used to concatenate group paths into a single group id.
   */
  readonly columnGroupJoinDelimiter?: string;

  /**
   * Indicates whether the grid should size columns to fit the available width.
   */
  readonly columnSizeToFit?: boolean;

  /**
   * The height in pixels that the header should occupy.
   */
  readonly headerHeight?: number;

  /**
   * The height in pixels for the header groups.
   */
  readonly headerGroupHeight?: number;

  /**
   * A unique identifier for the grid instance.
   */
  readonly gridId: string;

  /**
   * The data source used by LyteNyte Grid to manage and provide row data.
   */
  readonly rowDataSource?: RowDataSource<T>;

  /**
   * Initial height guess for auto-height rows, used before actual measurement.
   */
  readonly rowAutoHeightGuess?: number;

  /**
   * Row height strategy used by LyteNyte Grid for rendering rows.
   */
  readonly rowHeight?: RowHeight;

  /**
   * The number of columns LyteNyte Grid should scan when computing layout.
   */
  readonly colScanDistance?: number;

  /**
   * The number of rows LyteNyte Grid should scan when computing layout.
   */
  readonly rowScanDistance?: number;

  /**
   * The number of rows above the first visible row to render.
   */
  readonly rowOverscanTop?: number;

  /**
   * The number of rows below the last visible row to render.
   */
  readonly rowOverscanBottom?: number;

  /**
   * The number of columns before the first visible column to render.
   */
  readonly colOverscanStart?: number;

  /**
   * The number of columns after the last visible column to render.
   */
  readonly colOverscanEnd?: number;

  /**
   * The function predicate used to determine if a row should be rendered as full width.
   */
  readonly rowFullWidthPredicate?: RowFullWidthPredicate<T>;

  /**
   * The renderer used to render the content of a full width row.
   */
  readonly rowFullWidthRenderer?: RowFullWidthRendererFn<T>;

  /**
   * The map of named cell renderers that can be referenced by name in the grid.
   */
  readonly cellRenderers?: Record<string, CellRendererFn<T>>;

  /**
   * Whether to use right-to-left rendering. If false, left-to-right is assumed.
   */
  readonly rtl?: boolean;

  /**
   * The initial sort model to apply to the grid.
   */
  readonly sortModel?: SortModelItem<T>[];

  /**
   * The initial filter model to apply to the grid.
   */
  readonly filterModel?: Record<string, FilterModelItem<T>>;

  /**
   * The initial aggregation model to apply to LyteNyte Grid.
   */
  readonly aggModel?: { [columnId: string]: { fn: AggModelFn<T> } };

  /**
   * Template for generating row group columns dynamically.
   */
  readonly rowGroupColumn?: RowGroupColumn<T>;

  /**
   * The initial row group model configuration to apply.
   */
  readonly rowGroupModel?: RowGroupModelItem<T>[];

  /**
   * The row group display mode to use in the grid.
   */
  readonly rowGroupDisplayMode?: RowGroupDisplayMode;

  /**
   * Default expansion depth for row groups. Can be a boolean or a depth number.
   */
  readonly rowGroupDefaultExpansion?: boolean | number;

  /**
   * Initial expansion state of specific row groups by row id.
   */
  readonly rowGroupExpansions?: { [rowId: string]: boolean | undefined };

  /**
   * The height in px of the floating row.
   */
  readonly floatingRowHeight?: number;

  /**
   * A boolean indicating if the floating row should be enabled.
   */
  readonly floatingRowEnabled?: boolean;

  /**
   * The floating cell renderers that may be referenced by name.
   */
  readonly floatingCellRenderers?: Record<string, HeaderFloatingCellRendererFn<T>>;

  /**
   * The header cell renderers that may be referenced by name.
   */
  readonly headerCellRenderers?: Record<string, HeaderCellRendererFn<T>>;

  /**
   * The edit renderers that may be referenced by name.
   */
  readonly editRenderers?: Record<string, EditRendererFn<T>>;

  /**
   * A function for validating grid updates at a row level.
   */
  readonly editRowValidatorFn?: EditRowValidatorFn<T>;

  /**
   * The mouse interaction that should begin cell editing.
   */
  readonly editClickActivator?: EditClickActivator;

  /**
   * The initial cell edit mode.
   */
  readonly editCellMode?: EditCellMode;

  /**
   * The column marker definition.
   */
  readonly columnMarker?: ColumnMarker<T>;

  /**
   * A boolean indicating if the column marker should be visible.
   */
  readonly columnMarkerEnabled?: boolean;

  /**
   * A boolean indicating if double click to autosize a column should be enabled.
   */
  readonly columnDoubleClickToAutosize?: boolean;

  /**
   * A function used to render the content for a row detail area.
   */
  readonly rowDetailRenderer?: RowDetailRendererFn<T>;

  /**
   * The height of the row detail area.
   */
  readonly rowDetailHeight?: RowDetailHeight;

  /**
   * The initial row detail expansion state.
   */
  readonly rowDetailExpansions?: Set<string>;

  /**
   * The initial guess of the height of a row detail area before the actual height is observed.
   */
  readonly rowDetailAutoHeightGuess?: number;

  /**
   * The initial selected row ids.
   */
  readonly rowSelectedIds?: Set<string>;

  /**
   * The row selection mode to use.
   */
  readonly rowSelectionMode?: RowSelectionMode;

  /**
   * The mouse interaction that should begin row selection.
   */
  readonly rowSelectionActivator?: RowSelectionActivator;

  /**
   * A boolean indicating if the row selection should select children as well.
   */
  readonly rowSelectChildren?: boolean;

  /**
   * A boolean indicating if the columns in the grid should be virtualized.
   */
  readonly virtualizeCols?: boolean;

  /**
   * A boolean indicating if the rows in the grid should be virtualized.
   */
  readonly virtualizeRows?: boolean;

  /**
   * The quick search filter value.
   */
  readonly quickSearch?: string | null;

  /**
   * The case sensitivity of the quick search filter.
   */
  readonly quickSearchSensitivity?: FilterQuickSearchSensitivity;

  /**
   * A boolean indicating if the column pivot mode should be on.
   */
  readonly columnPivotMode?: boolean;

  /**
   * The initial column pivot model to apply to LyteNyte Grid.
   */
  readonly columnPivotModel?: ColumnPivotModel<T>;

  /**
   * The dialog frames available in the grid.
   */
  readonly dialogFrames?: Record<string, DialogFrame<T>>;

  /**
   * The popover frames available in the grid.
   */
  readonly popoverFrames?: Record<string, PopoverFrame<T>>;

  /**
   * The in (set) filter model to apply to LyteNyte Grid.
   */
  readonly filterInModel?: Record<string, FilterIn>;

  /**
   * The initial cell selections in the grid.
   */
  readonly cellSelections?: DataRect[];

  /**
   * The cell selection mode to use.
   */
  readonly cellSelectionMode?: CellSelectionMode;
}

/**
 * The declarative state object of LyteNyte Grid. This state encapsulates all mutable and observable
 *   grid properties that affect layout, data, selection, and rendering. Updating any of these atoms will trigger
 *   corresponding changes in the grid UI. These state values can also be used to create and synchronize external
 *   components such as toolbars, panels, or widgets.
 *
 *   @group Grid State
 */
export interface GridState<T> {
  /**
   * All column definitions registered in the grid, including both visible and hidden columns.
   */
  readonly columns: GridAtom<Column<T>[]>;

  /**
   * Computed metadata for each column in the grid, including rendering metrics and positional
   *   information. Useful for custom layout or advanced plugin behavior.
   */
  readonly columnMeta: GridAtomReadonly<ColumnMeta<T>>;

  /**
   * A base column configuration object used as a fallback for individual columns.
   */
  readonly columnBase: GridAtom<ColumnBase<T>>;

  /**
   * The default expansion state for column groups when no specific state has been set.
   */
  readonly columnGroupDefaultExpansion: GridAtom<boolean>;

  /**
   * A map of column group ids to their expansion state. This controls whether individual groups
   *   are expanded or collapsed. Direct mutation bypasses grid events.
   */
  readonly columnGroupExpansions: GridAtom<Record<string, boolean>>;

  /**
   * The delimiter string used to construct hierarchical column group ids by joining nested keys.
   */
  readonly columnGroupJoinDelimiter: GridAtom<string>;

  /**
   * Computed metadata about the column group structure in the grid. This is used internally for
   *   layout and interaction logic involving grouped headers.
   */
  readonly columnGroupMeta: GridAtomReadonly<ColumnGroupMeta>;

  /**
   * Controls whether columns should automatically resize to fit the available width of the grid viewport.
   */
  readonly columnSizeToFit: GridAtom<boolean>;

  /**
   * A unique identifier associated with the grid instance.
   */
  readonly gridId: GridAtom<string>;

  /**
   * The horizontal (x-axis) pixel positions of each visible column in the grid. Used to determine
   *   where each column should render on screen.
   */
  readonly xPositions: GridAtomReadonly<Uint32Array>;

  /**
   * The vertical (y-axis) pixel positions of rows in the grid. Determines how each row is positioned
   *   within the scrollable area.
   */
  readonly yPositions: GridAtomReadonly<Uint32Array>;

  /**
   * The total combined width (in pixels) of all visible columns in the grid.
   */
  readonly widthTotal: GridAtomReadonly<number>;

  /**
   * The total height (in pixels) of all rows currently present in the grid.
   */
  readonly heightTotal: GridAtomReadonly<number>;

  /**
   * The HTML element representing the viewport of the grid. May be null before initialization.
   */
  readonly viewport: GridAtom<HTMLElement | null>;

  /**
   * The internal width of the viewport, usually equal to the clientWidth of the viewport element.
   */
  readonly viewportWidthInner: GridAtom<number>;

  /**
   * The outer width of the viewport, corresponding to its offsetWidth.
   */
  readonly viewportWidthOuter: GridAtom<number>;

  /**
   * The internal height of the viewport, typically matching the clientHeight of the viewport element.
   */
  readonly viewportHeightInner: GridAtom<number>;

  /**
   * The outer height of the viewport, corresponding to its offsetHeight.
   */
  readonly viewportHeightOuter: GridAtom<number>;

  /**
   * The vertical height (in pixels) allocated for the header row of the grid.
   */
  readonly headerHeight: GridAtom<number>;

  /**
   * The vertical height (in pixels) allocated for grouped header rows, if present.
   */
  readonly headerGroupHeight: GridAtom<number>;

  /**
   * The backing store for row data within the grid. This is managed internally and should not be
   *   mutated directly unless implementing a custom data source.
   */
  readonly rowDataStore: RowDataStore<T>;

  /**
   * The configured row data source for the grid. This defines how rows are fetched, paged, or
   *   streamed into the grid.
   */
  readonly rowDataSource: GridAtom<RowDataSource<T>>;

  /**
   * A fallback row height (in pixels) used before actual row heights are measured.
   *   Especially useful when rendering rows with dynamic or unknown content heights.
   */
  readonly rowAutoHeightGuess: GridAtom<number>;

  /**
   * The height configuration for rows in the grid. This may be a fixed number, a function, or a
   *   configuration object.
   */
  readonly rowHeight: GridAtom<RowHeight>;

  /**
   * Controls how many rows back the grid should look when computing layout for row-spanning cells.
   *   Higher values allow larger spans but impact performance.
   */
  readonly rowScanDistance: GridAtom<number>;

  /**
   * Controls how many columns back the grid should look when computing layout for column-spanning
   *   cells. Larger values allow broader spans but can reduce rendering efficiency.
   */
  readonly colScanDistance: GridAtom<number>;

  /**
   * Specifies the number of additional rows to render above the visible viewport. Increasing this
   *   value can reduce visible loading artifacts when scrolling upward, at the cost of performance.
   */
  readonly rowOverscanTop: GridAtom<number>;

  /**
   * Specifies the number of additional rows to render below the visible viewport. Increasing this
   *   value can reduce flickering when scrolling downward, but may negatively impact rendering performance.
   */
  readonly rowOverscanBottom: GridAtom<number>;

  /**
   * Specifies the number of extra columns to render before the first visible column. Helps with
   *   smoother horizontal scrolling to the left.
   */
  readonly colOverscanStart: GridAtom<number>;

  /**
   * Specifies the number of extra columns to render after the last visible column. Helps with
   *   smoother horizontal scrolling to the right.
   */
  readonly colOverscanEnd: GridAtom<number>;

  /**
   * A predicate function used to determine whether a given row should be rendered as a
   *   full-width row. Full-width rows span across all columns and bypass standard cell layout.
   */
  readonly rowFullWidthPredicate: GridAtom<{ fn: RowFullWidthPredicate<T> }>;

  /**
   * The component function that renders full-width rows in the grid. This renderer is called
   *   whenever a row matches the full-width predicate.
   */
  readonly rowFullWidthRenderer: GridAtom<{ fn: RowFullWidthRendererFn<T> }>;

  /**
   * A registry of named cell renderer functions. These can be referenced by name in
   *   individual column definitions to customize cell rendering behavior.
   */
  readonly cellRenderers: GridAtom<Record<string, CellRendererFn<T>>>;

  /**
   * Boolean flag that determines whether the grid renders in right-to-left (RTL) mode.
   */
  readonly rtl: GridAtom<boolean>;

  /**
   * An array representing the current sort state of the grid. Each entry defines
   *   a column and its sort direction. An empty array means no active sorting.
   */
  readonly sortModel: GridAtom<SortModelItem<T>[]>;

  /**
   * An array of filters currently applied to the grid. If empty, no filters are active.
   */
  readonly filterModel: GridAtom<Record<string, FilterModelItem<T>>>;

  /**
   * The aggregation model configuration for the grid. Each entry maps a column id to its associated
   *   aggregation function. Aggregation results are typically displayed in group or summary rows.
   */
  readonly aggModel: GridAtom<{ [columnId: string]: { fn: AggModelFn<T> } }>;

  /**
   * An array representing the fields or columns being used to group rows. An empty array
   *   disables row grouping.
   */
  readonly rowGroupModel: GridAtom<RowGroupModelItem<T>[]>;

  /**
   * Defines the template or configuration for the automatically generated row group column.
   *   This controls its appearance and behavior.
   */
  readonly rowGroupColumn: GridAtom<RowGroupColumn<T>>;

  /**
   * Specifies how automatically generated row group columns should be displayed in the grid.
   *   This controls their visibility and layout.
   */
  readonly rowGroupDisplayMode: GridAtom<RowGroupDisplayMode>;

  /**
   * Controls the default expansion state of all row groups. If a number is provided, groups up to that
   *   depth will be expanded by default.
   */
  readonly rowGroupDefaultExpansion: GridAtom<boolean | number>;

  /**
   * An object mapping row group ids to their expansion state. Updating this directly will not trigger
   *   grid events and should be done with care.
   */
  readonly rowGroupExpansions: GridAtom<{
    [rowId: string]: boolean | undefined;
  }>;

  /**
   * Controls whether the floating row is enabled in the grid. When enabled, the floating row
   *   appears fixed below the column headers.
   */
  readonly floatingRowEnabled: GridAtom<boolean>;

  /**
   * Specifies the height, in pixels, of the floating row when enabled.
   */
  readonly floatingRowHeight: GridAtom<number>;

  /**
   * A map of named floating row cell renderers. These renderers can be assigned by name
   *   in the floating row column configurations.
   */
  readonly floatingCellRenderers: GridAtom<Record<string, HeaderFloatingCellRendererFn<T>>>;

  /**
   * A map of named header cell renderers. These can be referenced in column definitions to
   *   customize how column headers are displayed.
   */
  readonly headerCellRenderers: GridAtom<Record<string, HeaderCellRendererFn<T>>>;

  /**
   * A map of named edit renderers. These renderers are used to customize the editing
   *   experience for cells in editable columns.
   */
  readonly editRenderers: GridAtom<Record<string, EditRendererFn<T>>>;

  /**
   * A function used to validate updates to a row during an edit. This validator can prevent
   *   invalid edits before they are applied to the grid state.
   */
  readonly editRowValidatorFn: GridAtom<{ fn: EditRowValidatorFn<T> }>;

  /**
   * Specifies the mouse interaction pattern (e.g., single click, double click) required to
   *   activate a cell edit.
   */
  readonly editClickActivator: GridAtom<EditClickActivator>;

  /**
   * Determines the cell edit mode for the grid. Modes include read-only and editable states.
   */
  readonly editCellMode: GridAtom<EditCellMode>;

  /**
   * Represents the current active edit position in the grid. If no edit is active, this is null.
   */
  readonly editActivePosition: GridAtomReadonly<EditActivePosition<T> | null>;

  /**
   * Configuration object for the marker column, which is often used to indicate row-specific states
   *   like expansion or editing.
   */
  readonly columnMarker: GridAtom<ColumnMarker<T>>;

  /**
   * Enables or disables the marker column in the grid.
   */
  readonly columnMarkerEnabled: GridAtom<boolean>;

  /**
   * If true, double-clicking on a column's resize handle will trigger an autosize
   *   for that column based on its content.
   */
  readonly columnDoubleClickToAutosize: GridAtom<boolean>;

  /**
   * The function that renders additional row detail content when a row is expanded.
   */
  readonly rowDetailRenderer: GridAtom<{ fn: RowDetailRendererFn<T> }>;

  /**
   * Specifies the height of the row detail section when expanded.
   */
  readonly rowDetailHeight: GridAtom<RowDetailHeight>;

  /**
   * The default estimated height for row detail sections before their actual height has
   *   been measured.
   */
  readonly rowDetailAutoHeightGuess: GridAtom<number>;

  /**
   * Represents the set of row ids with expanded row detail sections.
   */
  readonly rowDetailExpansions: GridAtom<Set<string>>;

  /**
   * A set of selected row ids in the grid.
   */
  readonly rowSelectedIds: GridAtom<Set<string>>;

  /**
   * Specifies the selection mode of the grid, such as single or multiple row selection.
   */
  readonly rowSelectionMode: GridAtom<RowSelectionMode>;

  /**
   * Identifies the anchor row used for shift-based range selections. Defines the selection
   *   starting point.
   */
  readonly rowSelectionPivot: GridAtom<string | null>;

  /**
   * Specifies the interaction pattern or input trigger that initiates row selection,
   *   such as clicks or keyboard inputs.
   */
  readonly rowSelectionActivator: GridAtom<RowSelectionActivator>;

  /**
   * If true, selecting a parent row will automatically select its child rows. Useful for hierarchical
   *   or grouped data selection.
   */
  readonly rowSelectChildren: GridAtom<boolean>;

  /**
   * The current view bounds of the grid, representing the row and column segments
   *   that should be rendered based on scroll position and viewport.
   */
  readonly viewBounds: GridAtomReadonly<ViewBounds>;

  /**
   * Controls whether columns should be virtualized. Improves performance for large column
   *   sets by only rendering visible columns. Enabled by default.
   */
  readonly virtualizeCols: GridAtom<boolean>;

  /**
   * Controls whether rows should be virtualized. Improves performance for large datasets
   *   by only rendering visible rows. Enabled by default.
   */
  readonly virtualizeRows: GridAtom<boolean>;

  /**
   * Represents the current quick search input applied to the grid. When set, rows will be filtered
   *   using this value. If null or an empty string, no quick search filtering will be applied.
   */
  readonly quickSearch: GridAtom<string | null>;

  /**
   * Specifies whether the quick search is case-sensitive or insensitive. Controls how text is matched
   *   during quick search filtering.
   */
  readonly quickSearchSensitivity: GridAtom<FilterQuickSearchSensitivity>;

  /**
   * The current column pivot model in use. This model defines how column pivoting is structured
   *   in the grid and which columns are used to generate pivot dimensions.
   */
  readonly columnPivotModel: GridAtom<ColumnPivotModel<T>>;

  /**
   * Controls whether column pivoting is enabled in the grid. When true, pivot columns will be
   *   generated based on the active pivot model.
   */
  readonly columnPivotMode: GridAtom<boolean>;

  /**
   * The generated columns from the current pivot model. These columns represent data values
   *   derived from pivot operations. They may be updated, but changes may be overridden if the pivot model changes.
   */
  readonly columnPivotColumns: GridAtom<Column<T>[]>;

  /**
   * Tracks the expansion state of row groups generated by the current pivot model. Each key is
   *   a row group id, and the value determines its expansion state.
   */
  readonly columnPivotRowGroupExpansions: GridAtom<{
    [rowId: string]: boolean | undefined;
  }>;

  /**
   * Tracks the expansion state of column groups generated by pivot operations. Each key is
   *   a group id, and the value indicates whether it's expanded or collapsed.
   */
  readonly columnPivotColumnGroupExpansions: GridAtom<Record<string, boolean | undefined>>;

  /**
   * The in (set) filter model to apply to LyteNyte Grid.
   */
  readonly filterInModel: GridAtom<Record<string, FilterIn>>;

  /**
   * A dictionary of dialog frames currently managed by the grid. These frames can be programmatically
   *   opened or closed using the `dialogFrameOpen` and `dialogFrameClose` API methods.
   */
  readonly dialogFrames: GridAtom<Record<string, DialogFrame<T>>>;

  /**
   * A dictionary of popover frames currently managed by the grid. These can be dynamically shown
   *   or hidden using the `popoverFrameOpen` and `popoverFrameClose` API methods.
   */
  readonly popoverFrames: GridAtom<Record<string, PopoverFrame<T>>>;

  /**
   * An array of cell selections currently active in the grid. Each selection is a rectangular
   *   range of selected cells, useful for bulk editing, clipboard actions, or analytics.
   */
  readonly cellSelections: GridAtom<DataRect[]>;

  /**
   * Controls the grid's current cell selection mode. This determines how users may interact with
   *   and select individual or grouped cells.
   */
  readonly cellSelectionMode: GridAtom<CellSelectionMode>;
}

/**
 * Defines the viewport boundaries for rendering rows and columns in LyteNyte Grid.
 *   These bounds are calculated based on the scroll position and the visible area of the grid.
 *
 *   @group Grid View
 */
export interface ViewBounds {
  /**
   * Index of the first row pinned to the top of the grid. This will always be 0.
   */
  readonly rowTopStart: number;

  /**
   * Index just past the last top-pinned row. Equal to `1 + number of pinned rows`.
   */
  readonly rowTopEnd: number;

  /**
   * Start index of the scrollable rows that should be rendered in the viewport.
   */
  readonly rowCenterStart: number;

  /**
   * End index of the scrollable rows that should be rendered.
   */
  readonly rowCenterEnd: number;

  /**
   * Index one past the last possible scrollable row in the dataset.
   */
  readonly rowCenterLast: number;

  /**
   * Index of the first row pinned to the bottom of the grid.
   */
  readonly rowBotStart: number;

  /**
   * Index just past the last bottom-pinned row.
   */
  readonly rowBotEnd: number;

  /**
   * Index of the first column pinned to the start (left side for LTR).
   */
  readonly colStartStart: number;

  /**
   * Index one past the last column pinned to the start.
   */
  readonly colStartEnd: number;

  /**
   * Start index of scrollable columns to render.
   */
  readonly colCenterStart: number;

  /**
   * End index of scrollable columns to render.
   */
  readonly colCenterEnd: number;

  /**
   * Index one past the last possible scrollable column in the grid.
   */
  readonly colCenterLast: number;

  /**
   * Index of the first column pinned to the end (right side for LTR).
   */
  readonly colEndStart: number;

  /**
   * Index one past the last column pinned to the end.
   */
  readonly colEndEnd: number;
}

/**
 * The grid object encapsulates the full LyteNyte Grid instance, including its state, view, and imperative API.
 *   It is returned by the `useLyteNyte` hook and serves as the primary interface for interacting with the grid programmatically.
 *
 *   @group Grid State
 */
export interface Grid<T> {
  /**
   * The declarative state of LyteNyte Grid. This contains all core
   *       and optional features represented as atoms.
   */
  readonly state: GridState<T>;

  /**
   * The current layout view of the grid, reflecting visible headers and rows
   *       based on virtualization and scroll position.
   */
  readonly view: GridAtomReadonly<GridView<T>>;

  /**
   * The imperative API of LyteNyte Grid for triggering actions such
   *       as column resizing, row expansion, and selection.
   */
  readonly api: GridApi<T>;
}

/**
 * Represents the current visual layout of the grid including headers and rows.
 *   This structure is used by LyteNyte Grid headless components
 *   or for building custom visualizations.
 *
 *   @group Grid View
 */
export interface GridView<T> {
  /**
   * Header layout structure currently being rendered in the viewport.
   */
  readonly header: HeaderLayout<T>;

  /**
   * Row layout sections (top, center, bottom) rendered in the viewport.
   */
  readonly rows: RowSectionLayouts<T>;
}

/**
 * Describes a standard header cell layout in the grid, used to position and render individual column headers.
 *
 *   @group Grid View
 */
export interface HeaderCellLayout<T> {
  /**
   * The starting row index in the header hierarchy for this cell.
   */
  readonly rowStart: number;

  /**
   * The exclusive ending row index in the header hierarchy for this cell.
   */
  readonly rowEnd: number;

  /**
   * The number of header rows this header spans vertically.
   */
  readonly rowSpan: number;

  /**
   * The starting column index in the visible layout this header covers.
   */
  readonly colStart: number;

  /**
   * The exclusive ending column index in the visible layout this header covers.
   */
  readonly colEnd: number;

  /**
   * The number of columns this header spans horizontally.
   */
  readonly colSpan: number;

  /**
   * Indicates which pin section this column belongs to: 'start', 'end', or 'center'.
   */
  readonly colPin: ColumnPin;

  /**
   * True if this column is the first column in the set of columns pinned to the end.
   */
  readonly colFirstEndPin?: boolean;

  /**
   * True if this column is the last column in the set of columns pinned to the start.
   */
  readonly colLastStartPin?: boolean;

  /**
   * A unique identifier that can be used for rendering keys or tracking elements.
   */
  readonly id: string;

  /**
   * A discriminator indicating this is a standard header cell.
   */
  readonly kind: "cell";

  /**
   * A reference to a column definition in LyteNyte Grid.
   */
  readonly column: Column<T>;
}

/**
 * Describes a floating header cell layout, which remains fixed during scroll operations.
 *
 *   @group Grid View
 */
export interface HeaderCellFloating<T> {
  /**
   * The starting row index in the header hierarchy for this cell.
   */
  readonly rowStart: number;

  /**
   * The exclusive ending row index in the header hierarchy for this cell.
   */
  readonly rowEnd: number;

  /**
   * The number of header rows this header spans vertically.
   */
  readonly rowSpan: number;

  /**
   * The starting column index in the visible layout this header covers.
   */
  readonly colStart: number;

  /**
   * The exclusive ending column index in the visible layout this header covers.
   */
  readonly colEnd: number;

  /**
   * The number of columns this header spans horizontally.
   */
  readonly colSpan: number;

  /**
   * Indicates which pin section this column belongs to: 'start', 'end', or 'center'.
   */
  readonly colPin: ColumnPin;

  /**
   * True if this column is the first column in the set of columns pinned to the end.
   */
  readonly colFirstEndPin?: boolean;

  /**
   * True if this column is the last column in the set of columns pinned to the start.
   */
  readonly colLastStartPin?: boolean;

  /**
   * A unique identifier that can be used for rendering keys or tracking elements.
   */
  readonly id: string;

  /**
   * A discriminator indicating this is a floating (sticky) header cell.
   */
  readonly kind: "floating";

  /**
   * A reference to a column definition in LyteNyte Grid.
   */
  readonly column: Column<T>;
}

/**
 * Describes a group of columns within the header. Used by LyteNyte
 *   Grid to render grouped column headers with optional collapsibility and structural metadata.
 *
 *   @group Grid View
 */
export interface HeaderGroupCellLayout {
  /**
   * The starting row index in the header hierarchy for this cell.
   */
  readonly rowStart: number;

  /**
   * The exclusive ending row index in the header hierarchy for this cell.
   */
  readonly rowEnd: number;

  /**
   * The number of header rows this header spans vertically.
   */
  readonly rowSpan: number;

  /**
   * The starting column index in the visible layout this header covers.
   */
  readonly colStart: number;

  /**
   * The exclusive ending column index in the visible layout this header covers.
   */
  readonly colEnd: number;

  /**
   * The number of columns this header spans horizontally.
   */
  readonly colSpan: number;

  /**
   * Indicates which pin section this column belongs to: 'start', 'end', or 'center'.
   */
  readonly colPin: ColumnPin;

  /**
   * True if this column is the first column in the set of columns pinned to the end.
   */
  readonly colFirstEndPin?: boolean;

  /**
   * True if this column is the last column in the set of columns pinned to the start.
   */
  readonly colLastStartPin?: boolean;

  /**
   * Discriminant indicating this layout item is a header group.
   */
  readonly kind: "group";

  /**
   * Indicates whether this column group can be collapsed in the UI.
   */
  readonly isCollapsible: boolean;

  /**
   * The id for the header group. Note this is not unique across all header groups. In particular
   *       split header groups with the same path will share the same id. Prefer `idOccurrence` for unique keys.
   */
  readonly id: string;

  /**
   * Unique identifier that includes header split occurrence information.
   */
  readonly idOccurrence: string;

  /**
   * Hierarchy path representing this column group's position and ancestry.
   */
  readonly groupPath: string[];

  /**
   * Column ids that are included within this header group.
   */
  readonly columnIds: string[];

  /**
   * Start index of the group in the column layout.
   */
  readonly start: number;

  /**
   * Exclusive end index of the group in the column layout.
   */
  readonly end: number;

  /**
   * Indicates that this is a temporary placeholder group for drag-and-drop movement.
   *       Should be ignored for typical rendering.
   */
  readonly isHiddenMove?: boolean;
}

/**
 * Defines the overall structure of header rows in the grid.
 *   This layout is recalculated based on viewport changes and virtualized rendering.
 *
 *   @group Grid View
 */
export interface HeaderLayout<T> {
  /**
   * Total number of header rows rendered, including groups and nested headers.
   */
  readonly maxRow: number;

  /**
   * Total number of columns involved in the header layout.
   */
  readonly maxCol: number;

  /**
   * Two-dimensional array of header layout cells organized by row hierarchy.
   */
  readonly layout: HeaderLayoutCell<T>[][];
}

/**
 * Represents a union of all possible header layout cell types:
 *   normal header, floating header, or header group.
 *
 *   @group Grid View
 */
export type HeaderLayoutCell<T> =
  | HeaderCellLayout<T>
  | HeaderCellFloating<T>
  | HeaderGroupCellLayout;

/**
 * Represents the layout metadata for a single cell within a row, including span and contextual info.
 *
 *   @group Grid View
 */
export interface RowCellLayout<T> {
  /**
   * Discriminator to identify a standard cell layout object.
   */
  readonly kind: "cell";

  /**
   * Number of columns this cell spans across.
   */
  readonly colSpan: number;

  /**
   * Number of rows this cell spans across.
   */
  readonly rowSpan: number;

  /**
   * A unique identifier that can be used for rendering keys or tracking elements.
   */
  readonly id: string;

  /**
   * The zero-based index of the row.
   */
  readonly rowIndex: number;

  /**
   * The zero-based index of the column.
   */
  readonly colIndex: number;

  /**
   * A reactive atom for the row node, allowing updates without subscriptions.
   */
  readonly row: GridAtomReadonlyUnwatchable<RowNode<T> | null>;

  /**
   * A reference to a column definition in LyteNyte Grid.
   */
  readonly column: Column<T>;

  /**
   * The pinning state of a column, used to fix it to the left or right side.
   */
  readonly colPin: ColumnPin;

  /**
   * The pinning state of a row, used to fix it to the top or bottom of the grid.
   */
  readonly rowPin: RowPin;

  /**
   * True if this column is the first column in the set of columns pinned to the end.
   */
  readonly colFirstEndPin?: boolean;

  /**
   * True if this column is the last column in the set of columns pinned to the start.
   */
  readonly colLastStartPin?: boolean;

  /**
   * True if this row is the last row pinned to the top of the grid.
   */
  readonly rowLastPinTop?: boolean;

  /**
   * True if this row is the first row pinned to the bottom of the grid.
   */
  readonly rowFirstPinBottom?: boolean;

  /**
   * True if this row contains the currently focused cell and should be included in layout calculation.
   */
  readonly rowIsFocusRow?: boolean;
}

/**
 * Describes the layout of a full-width row which spans all columns.
 *   These are typically used for summary or group rows.
 *
 *   @group Grid View
 */
export interface RowFullWidthRowLayout<T> {
  /**
   * Discriminator for identifying full-width row layout objects.
   */
  readonly kind: "full-width";

  /**
   * A unique identifier that can be used for rendering keys or tracking elements.
   */
  readonly id: string;

  /**
   * The zero-based index of the row.
   */
  readonly rowIndex: number;

  /**
   * A reactive atom for the row node, allowing updates without subscriptions.
   */
  readonly row: GridAtomReadonlyUnwatchable<RowNode<T> | null>;

  /**
   * The pinning state of a row, used to fix it to the top or bottom of the grid.
   */
  readonly rowPin: RowPin;

  /**
   * True if this row is the last row pinned to the top of the grid.
   */
  readonly rowLastPinTop?: boolean;

  /**
   * True if this row is the first row pinned to the bottom of the grid.
   */
  readonly rowFirstPinBottom?: boolean;

  /**
   * True if this row contains the currently focused cell and should be included in layout calculation.
   */
  readonly rowIsFocusRow?: boolean;
}

/**
 * A row layout is either a standard row or a full-width row, depending on its content and configuration.
 *
 *   @group Grid View
 */
export type RowLayout<T> = RowNormalRowLayout<T> | RowFullWidthRowLayout<T>;

/**
 * Describes the layout of a standard row in LyteNyte Grid,
 *   including cell arrangement and row-level metadata.
 *
 *   @group Grid View
 */
export interface RowNormalRowLayout<T> {
  /**
   * Discriminator identifying this layout as a normal row.
   */
  readonly kind: "row";

  /**
   * The zero-based index of the row.
   */
  readonly rowIndex: number;

  /**
   * A reactive atom for the row node, allowing updates without subscriptions.
   */
  readonly row: GridAtomReadonlyUnwatchable<RowNode<T> | null>;

  /**
   * The pinning state of a row, used to fix it to the top or bottom of the grid.
   */
  readonly rowPin: RowPin;

  /**
   * True if this row is the last row pinned to the top of the grid.
   */
  readonly rowLastPinTop?: boolean;

  /**
   * True if this row is the first row pinned to the bottom of the grid.
   */
  readonly rowFirstPinBottom?: boolean;

  /**
   * True if this row contains the currently focused cell and should be included in layout calculation.
   */
  readonly rowIsFocusRow?: boolean;

  /**
   * A unique identifier that can be used for rendering keys or tracking elements.
   */
  readonly id: string;

  /**
   * List of cell layout metadata for this row.
   */
  readonly cells: RowCellLayout<T>[];
}

/**
 * Organizes the rows into three separate sections: top (pinned), center (scrollable),
 *   and bottom (pinned). Used to optimize row virtualization and rendering.
 *
 *   @group Grid View
 */
export interface RowSectionLayouts<T> {
  /**
   * Layout information for pinned rows at the top of the grid.
   */
  readonly top: RowLayout<T>[];

  /**
   * Layout information for scrollable rows in the grid.
   */
  readonly center: RowLayout<T>[];

  /**
   * Layout information for pinned rows at the bottom of the grid.
   */
  readonly bottom: RowLayout<T>[];

  /**
   * Cumulative height of all top-pinned rows in pixels.
   */
  readonly rowTopTotalHeight: number;

  /**
   * Cumulative height of all scrollable center rows in pixels.
   */
  readonly rowCenterTotalHeight: number;

  /**
   * Cumulative height of all bottom-pinned rows in pixels.
   */
  readonly rowBottomTotalHeight: number;

  /**
   * Index of the currently focused row, if it exists. Focused rows may
   *       appear in the layout even if not otherwise visible.
   */
  readonly rowFocusedIndex: number | null;

  /**
   * Index of the first center (scrollable) row.
   */
  readonly rowFirstCenter: number;
}

/**
 * A function used by LyteNyte Grid to determine the ideal width for a column based
 * on a representative sample of cell content.
 *
 * This is called when autosize is triggered via the grid's API. Returning `null`
 * disables sizing behavior.
 *
 * @group Column
 */
export type AutosizeCellFn<T> = (
  /**
   * The input parameters passed to the autosize function to determine the optimal
   * column width.
   */
  params: AutosizeCellParams<T>,
) => number | null;

/**
 * Parameters passed to the {@link AutosizeCellFn} function.
 *
 * These provide context about the cell and grid configuration so that the function
 * can determine the optimal column width based on cell content.
 *
 * @group Column
 */
export interface AutosizeCellParams<T> {
  /**
   * A reference to a column definition in LyteNyte Grid.
   */
  readonly column: Column<T>;

  /**
   * A reference to the LyteNyte Grid instance.
   */
  readonly grid: Grid<T>;

  /**
   * The row node instance in LyteNyte Grid.
   */
  readonly row: RowNode<T>;
}

/**
 * A function used by LyteNyte Grid to calculate the ideal width for a column header
 * based on the header's rendered content.
 *
 * This is called as part of the grid's autosize process.
 *
 * @group Column
 */
export type AutosizeHeaderFn<T> = (
  /**
   * The input parameters used to evaluate the ideal width for a column header.
   */
  params: AutosizeHeaderParams<T>,
) => number | null;

/**
 * Parameters passed to the {@link AutosizeHeaderFn} function.
 *
 * These are used by LyteNyte Grid to calculate the ideal column width based on the
 * header content.
 *
 * @group Column
 */
export interface AutosizeHeaderParams<T> {
  /**
   * A reference to a column definition in LyteNyte Grid.
   */
  readonly column: Column<T>;

  /**
   * A reference to the LyteNyte Grid instance.
   */
  readonly grid: Grid<T>;
}

/**
 * Represents the default column configuration used by LyteNyte Grid.
 *
 * This serves as a base template that provides fallback values for various column properties.
 * Rather than merging, LyteNyte Grid looks up configuration properties on the column first,
 * then on the default.
 *
 * This allows you to set column-wide defaults that apply retroactively to all applicable columns
 * without rewriting each one.
 *
 * @group Column
 */
export interface ColumnBase<T> {
  /**
   * Controls the visibility of the column. When set to `true`, the column is hidden from the grid display.
   */
  readonly hide?: boolean;

  /**
   * Specifies the preferred width of the column. This value is ignored if flex sizing is used, or if it violates the column's min/max bounds.
   */
  readonly width?: number;

  /**
   * Defines the maximum width the column is allowed to occupy.
   */
  readonly widthMax?: number;

  /**
   * Defines the minimum width the column is allowed to occupy.
   */
  readonly widthMin?: number;

  /**
   * Specifies the flex ratio this column should take when distributing remaining space.
   *
   *   Similar to CSS `flex`, it controls how extra space is shared among flex-enabled columns.
   */
  readonly widthFlex?: number;

  /**
   * Function used to render the column's header. Must return a React node.
   */
  readonly headerRenderer?: HeaderCellRenderer<T>;

  /**
   * Function used to render a floating row cell. Only called when floating rows are enabled. Must return a React node.
   */
  readonly floatingCellRenderer?: HeaderFloatingCellRenderer<T>;

  /**
   * Defines how to render the cell content. Accepts a renderer function or a string referencing a registered renderer.
   */
  readonly cellRenderer?: string | CellRendererFn<T>;

  /**
   * Describes the capabilities and intended UI behavior of the column. These hints are used by external UI components.
   */
  readonly uiHints?: ColumnUIHints;

  /**
   * Controls whether cells in the column can be edited.
   *
   *   Editing is only possible when both the grid is in edit mode and this flag is set.
   */
  readonly editable?: Editable<T>;

  /**
   * Specifies a custom cell editor to use when the cell enters edit mode.
   */
  readonly editRenderer?: EditRenderer<T>;

  /**
   * Custom logic for applying an edit to the row's data. Required when editing fields that need special update logic.
   */
  readonly editSetter?: EditSetterFn<T>;

  /**
   * Function that computes the ideal width for the column based on sampled cell content.
   */
  readonly autosizeCellFn?: AutosizeCellFn<T>;

  /**
   * Function that computes the ideal width for the column header based on its content.
   */
  readonly autosizeHeaderFn?: AutosizeHeaderFn<T>;

  /**
   * When `true`, the column is excluded from the quick search filter.
   *
   * Useful for non-textual or metadata columns that should not be searchable by users.
   */
  readonly quickSearchIgnore?: boolean;
}

/**
 * Defines the structure of a marker column.
 *
 *   The marker column is a grid managed column used to support features like selection checkboxes or row drag handles.
 *
 *   @group Column
 */
export interface ColumnMarker<T> {
  /**
   * Defines how to render the cell content. Accepts a renderer function or a string referencing a registered renderer.
   */
  readonly cellRenderer?: string | CellRendererFn<T>;

  /**
   * Function used to render the column's header. Must return a React node.
   */
  readonly headerRenderer?: HeaderCellRenderer<T>;

  /**
   * Function used to render a floating row cell. Only called when floating rows are enabled. Must return a React node.
   */
  readonly floatingCellRenderer?: HeaderFloatingCellRenderer<T>;

  /**
   * Specifies the preferred width of the column. This value is ignored if flex sizing is used, or if it violates the column's min/max bounds.
   */
  readonly width?: number;

  /**
   * Describes the capabilities and intended UI behavior of the column. These hints are used by external UI components.
   */
  readonly uiHints?: ColumnUIHints;
}

/**
 * Represents runtime metadata for the current column configuration in LyteNyte Grid.
 *
 * This metadata is primarily useful for programmatic interaction with the grid. The values
 * are derived from the grid's internal column state and may change depending on modes
 * like pivoting. For example, when pivot mode is enabled, `columnsVisible` refers to
 * visible pivot columns instead of the regular ones.
 *
 * @group Column
 */
export interface ColumnMeta<T> {
  /**
   * An array of currently visible columns, accounting for `hide` flags and
   * column group collapse states.
   */
  readonly columnsVisible: Column<T>[];

  /**
   * A lookup map from column id to column definition. Useful for quick access or
   * metadata introspection.
   */
  readonly columnLookup: Map<string, Column<T>>;

  /**
   * The count of visible columns pinned to the start of the grid.
   */
  readonly columnVisibleStartCount: number;

  /**
   * The count of visible columns that are unpinned (center-aligned).
   */
  readonly columnVisibleCenterCount: number;

  /**
   * The count of visible columns pinned to the end of the grid.
   */
  readonly columnVisibleEndCount: number;
}

/**
 * Represents the possible pinned positions a column can occupy in LyteNyte Grid.
 *
 * The actual position is determined by the document's reading direction:
 * - In left-to-right (LTR) mode, `"start"` pins to the left and `"end"` to the right.
 * - In right-to-left (RTL) mode, this behavior is reversed.
 *
 * This approach aligns with CSS logical properties for layout direction.
 *
 * @group Column
 */
export type ColumnPin = "start" | "end" | null;

/**
 * Describes UI hints related to column pivot functionality.
 *
 * These hints indicate whether a column is eligible to act as a value, row group, or
 * column pivot in a pivot table configuration. External components can use these values
 * to determine pivot-related capabilities.
 *
 * @group Column
 */
export interface ColumnPivotUIHints {
  /**
   * Indicates whether the column can be used as a pivot value.
   */
  readonly value?: boolean;

  /**
   * Indicates whether the column can be used as a pivot row group.
   */
  readonly rows?: boolean;

  /**
   * Indicates whether the column can be used as a pivot column header.
   */
  readonly columns?: boolean;
}

/**
 * Describes a column definition in LyteNyte Grid.
 *
 * Columns define how data is presented and interacted with in the grid. They control
 * rendering, grouping, sorting, filtering, editing, and more.
 *
 * A grid must define at least one column to display meaningful data. Columns are essential
 * for determining:
 * - How rows are visualized
 * - What each cell renders
 * - How rows are grouped and sorted
 * - How filters are evaluated
 *
 * @group Column
 */
export interface Column<T> {
  /**
   * A required unique identifier for the column. This value must be distinct among all columns.
   */
  readonly id: string;

  /**
   * A human-readable name for the column. Useful when `id` is more technical or programmatic.
   */
  readonly name?: string;

  /**
   * Specifies the column's data type. Can be one of the built-in types or a custom string label.
   */
  readonly type?: "string" | "number" | "date" | "datetime" | ({} & string);

  /**
   * Controls the visibility of the column. When set to `true`, the column is hidden from the grid display.
   */
  readonly hide?: boolean;

  /**
   * Specifies the preferred width of the column. This value is ignored if flex sizing is used, or if it violates the column's min/max bounds.
   */
  readonly width?: number;

  /**
   * Defines the maximum width the column is allowed to occupy.
   */
  readonly widthMax?: number;

  /**
   * Defines the minimum width the column is allowed to occupy.
   */
  readonly widthMin?: number;

  /**
   * Specifies the flex ratio this column should take when distributing remaining space.
   *
   *   Similar to CSS `flex`, it controls how extra space is shared among flex-enabled columns.
   */
  readonly widthFlex?: number;

  /**
   * Defines whether the column is pinned to the start or end of the grid. Pinned columns remain visible regardless of horizontal scroll.
   */
  readonly pin?: ColumnPin;

  /**
   * Controls the visibility behavior of a column when its group is collapsed.
   *
   *   Determines whether the column is always visible, only visible when expanded, or only visible when collapsed.
   */
  readonly groupVisibility?: ColumnGroupVisibility;

  /**
   * Represents the hierarchical path of column groups the column belongs to. Each string corresponds to a level in the nesting hierarchy.
   */
  readonly groupPath?: string[];

  /**
   * Defines how many columns the cell should span. Can be a fixed number or a function that returns a span dynamically.
   */
  readonly colSpan?: number | CellSpanFn<T>;

  /**
   * Defines how many rows the cell should span. Can be a fixed number or a function that returns a span dynamically.
   */
  readonly rowSpan?: number | CellSpanFn<T>;

  /**
   * Determines how the cell value should be retrieved or computed for the column. If omitted, the column's `id` is used as a fallback.
   */
  readonly field?: Field<T>;

  /**
   * Function used to render the column's header. Must return a React node.
   */
  readonly headerRenderer?: HeaderCellRenderer<T>;

  /**
   * Function used to render a floating row cell. Only called when floating rows are enabled. Must return a React node.
   */
  readonly floatingCellRenderer?: HeaderFloatingCellRenderer<T>;

  /**
   * Defines how to render the cell content. Accepts a renderer function or a string referencing a registered renderer.
   */
  readonly cellRenderer?: string | CellRendererFn<T>;

  /**
   * Describes the capabilities and intended UI behavior of the column. These hints are used by external UI components.
   */
  readonly uiHints?: ColumnUIHints;

  /**
   * Controls whether cells in the column can be edited.
   *
   *   Editing is only possible when both the grid is in edit mode and this flag is set.
   */
  readonly editable?: Editable<T>;

  /**
   * Specifies a custom cell editor to use when the cell enters edit mode.
   */
  readonly editRenderer?: EditRenderer<T>;

  /**
   * Custom logic for applying an edit to the row's data. Required when editing fields that need special update logic.
   */
  readonly editSetter?: EditSetterFn<T>;

  /**
   * Function that computes the ideal width for the column based on sampled cell content.
   */
  readonly autosizeCellFn?: AutosizeCellFn<T>;

  /**
   * Function that computes the ideal width for the column header based on its content.
   */
  readonly autosizeHeaderFn?: AutosizeHeaderFn<T>;

  /**
   * When `true`, the column is excluded from the quick search filter.
   *
   * Useful for non-textual or metadata columns that should not be searchable by users.
   */
  readonly quickSearchIgnore?: boolean;
}

/**
 * The internal definition used by LyteNyte Grid to automatically generate group columns
 * when row grouping is enabled.
 *
 * These columns are created behind the scenes to represent group headers and aggregations
 * and can be configured via this interface.
 *
 * @group Column
 */
export interface RowGroupColumn<T> {
  /**
   * A human-readable name for the column. Useful when `id` is more technical or programmatic.
   */
  readonly name?: string;

  /**
   * Controls the visibility of the column. When set to `true`, the column is hidden from the grid display.
   */
  readonly hide?: boolean;

  /**
   * Specifies the preferred width of the column. This value is ignored if flex sizing is used, or if it violates the column's min/max bounds.
   */
  readonly width?: number;

  /**
   * Defines the maximum width the column is allowed to occupy.
   */
  readonly widthMax?: number;

  /**
   * Defines the minimum width the column is allowed to occupy.
   */
  readonly widthMin?: number;

  /**
   * Specifies the flex ratio this column should take when distributing remaining space.
   *
   *   Similar to CSS `flex`, it controls how extra space is shared among flex-enabled columns.
   */
  readonly widthFlex?: number;

  /**
   * Defines whether the column is pinned to the start or end of the grid. Pinned columns remain visible regardless of horizontal scroll.
   */
  readonly pin?: ColumnPin;

  /**
   * Determines how the cell value should be retrieved or computed for the column. If omitted, the column's `id` is used as a fallback.
   */
  readonly field?: Field<T>;

  /**
   * Defines how to render the cell content. Accepts a renderer function or a string referencing a registered renderer.
   */
  readonly cellRenderer?: string | CellRendererFn<T>;

  /**
   * Function used to render the column's header. Must return a React node.
   */
  readonly headerRenderer?: HeaderCellRenderer<T>;

  /**
   * Function used to render a floating row cell. Only called when floating rows are enabled. Must return a React node.
   */
  readonly floatingCellRenderer?: HeaderFloatingCellRenderer<T>;

  /**
   * Describes the capabilities and intended UI behavior of the column. These hints are used by external UI components.
   */
  readonly uiHints?: ColumnUIHints;

  /**
   * Function that computes the ideal width for the column based on sampled cell content.
   */
  readonly autosizeCellFn?: AutosizeCellFn<T>;

  /**
   * Function that computes the ideal width for the column header based on its content.
   */
  readonly autosizeHeaderFn?: AutosizeHeaderFn<T>;
}

/**
 * UI hints describing column capabilities in LyteNyte Grid.
 *
 * These hints can be used by external components to drive UI decisions (e.g.
 * enabling/disabling sort or resize handles). They are not enforced by LyteNyte Grid
 * and can be bypassed by modifying grid state directly.
 *
 * Includes support for pivot-specific behaviors via {@link ColumnPivotUIHints}.
 *
 * @group Column
 */
export interface ColumnUIHints {
  /**
   * UI hint indicating whether this column supports sorting. LyteNyte Grid may
   * hide sort controls if this is set to `false`.
   */
  readonly sortable?: boolean;

  /**
   * UI hint indicating whether this column can be used for row grouping.
   */
  readonly rowGroupable?: boolean;

  /**
   * UI hint indicating whether the column can be resized by the user.
   * When set to `false`, resize handles will be hidden.
   */
  readonly resizable?: boolean;

  /**
   * UI hint indicating whether the column can be repositioned by dragging.
   * This only affects drag-and-drop behaviors; programmatic moves are still possible.
   */
  readonly movable?: boolean;

  /**
   * UI hint specifying the default aggregation function to apply to this column.
   *
   * This is especially relevant in pivot mode or when row grouping is active.
   */
  readonly aggDefault?: string;

  /**
   * UI hint specifying the list of valid aggregation functions that can be applied to this column.
   * If unset, the column may not support aggregation.
   */
  readonly aggsAllowed?: string[];

  /**
   * UI hints for pivot-related behaviors, specifying whether a column can act as a value,
   * row, or column pivot.
   */
  readonly columnPivot?: ColumnPivotUIHints;
}

/**
 * Provides metadata related to column groups in LyteNyte Grid.
 *
 * This metadata is auto-generated by the grid based on the configured column definitions.
 * It is used internally to manage layout and grouping behavior, but is also exposed for
 * advanced use cases where programmatic interaction with group structures is needed.
 *
 * @group Column Groups
 */
export interface ColumnGroupMeta {
  /**
   * A map linking each column id to its associated group id hierarchy.
   *
   * Only populated for columns that belong to at least one group. The group ids reflect the
   * nesting structure and are ordered from outermost to innermost group.
   */
  readonly colIdToGroupIds: Map<string, string[]>;

  /**
   * A set of all valid group ids found in the grid.
   *
   * Group ids are derived by joining nested group names using the configured group delimiter.
   * Used for validation, lookup, and rendering logic.
   */
  readonly validGroupIds: Set<string>;

  /**
   * Indicates whether a given column group is collapsible.
   *
   * For a group to be collapsible:
   * - It must contain at least one column visible when the group is **collapsed**
   * - It must also contain at least one column visible only when the group is **expanded**
   *
   * The map uses group ids as keys and a boolean as the value.
   */
  readonly groupIsCollapsible: Map<string, boolean>;
}

/**
 * Controls the visibility behavior of a column within a column group.
 *
 * - `"always"`: The column is always visible regardless of the group's state.
 * - `"close"`: The column is visible only when the group is **collapsed**.
 * - `"open"`: The column is visible only when the group is **expanded**.
 *
 * Used to build dynamic, collapsible column group layouts in LyteNyte Grid.
 *
 * @group Column Groups
 */
export type ColumnGroupVisibility = "always" | "close" | "open";

/**
 * Parameters required to initialize a client-side row data source.
 *
 * @group Row Data Source
 */
export interface ClientRowDataSourcePaginatedParams<T> {
  /**
   * The primary dataset passed to LyteNyte Grid for display.
   */
  readonly data: T[];

  /**
   * Rows to pin to the top of the grid, rendered above all scrollable rows.
   */
  readonly topData?: T[];

  /**
   * Rows to pin to the bottom of the grid, rendered below all scrollable rows.
   */
  readonly bottomData?: T[];

  /**
   * If true, the data source will reflect external mutations to the original data array.
   */
  readonly reflectData?: boolean;

  /**
   * Callback to derive a unique id for grouped (branch) rows based on group value path.
   */
  readonly rowIdBranch?: (path: string[]) => string;

  /**
   * Callback to derive a unique id for each leaf row. Receives the row data and index.
   */
  readonly rowIdLeaf?: (d: RowLeaf<T>, i: number) => string;

  /**
   * Callback that transforms a set of values for a given column into the in filter items LyteNyte Grid should use.
   */
  readonly transformInFilterItem?: (params: {
    column: Column<T>;
    values: unknown[];
  }) => FilterInFilterItem[];

  /**
   * The number of rows to have per page. This will impact the total page count.
   */
  readonly rowsPerPage?: number;
}

/**
 * Enhanced parameters for a client-side row data source with additional filtering support.
 *
 * @group Row Data Source
 */
export interface ClientRowDataSourceParams<T> {
  /**
   * The primary dataset passed to LyteNyte Grid for display.
   */
  readonly data: T[];

  /**
   * Rows to pin to the top of the grid, rendered above all scrollable rows.
   */
  readonly topData?: T[];

  /**
   * Rows to pin to the bottom of the grid, rendered below all scrollable rows.
   */
  readonly bottomData?: T[];

  /**
   * If true, the data source will reflect external mutations to the original data array.
   */
  readonly reflectData?: boolean;

  /**
   * Callback to derive a unique id for grouped (branch) rows based on group value path.
   */
  readonly rowIdBranch?: (path: string[]) => string;

  /**
   * Callback to derive a unique id for each leaf row. Receives the row data and index.
   */
  readonly rowIdLeaf?: (d: RowLeaf<T>, i: number) => string;

  /**
   * Callback that transforms a set of values for a given column into the in filter items LyteNyte Grid should use.
   */
  readonly transformInFilterItem?: (params: {
    column: Column<T>;
    values: unknown[];
  }) => FilterInFilterItem[];
}

/**
 * Parameters for initializing a tree-structured data source in LyteNyte Grid.
 *
 * @group Row Data Source
 */
export interface ClientTreeDataSourceParams<T> {
  /**
   * The primary dataset passed to LyteNyte Grid for display.
   */
  readonly data: T[];

  /**
   * Rows to pin to the top of the grid, rendered above all scrollable rows.
   */
  readonly topData?: T[];

  /**
   * Rows to pin to the bottom of the grid, rendered below all scrollable rows.
   */
  readonly bottomData?: T[];

  /**
   * If true, the data source will reflect external mutations to the original data array.
   */
  readonly reflectData?: boolean;

  /**
   * Callback to derive a unique id for grouped (branch) rows based on group value path.
   */
  readonly rowIdBranch?: (path: string[]) => string;

  /**
   * Callback to derive a unique id for each leaf row. Receives the row data and index.
   */
  readonly rowIdLeaf?: (d: RowLeaf<T>, i: number) => string;

  /**
   * Callback that transforms a set of values for a given column into the in filter items LyteNyte Grid should use.
   */
  readonly transformInFilterItem?: (params: {
    column: Column<T>;
    values: unknown[];
  }) => FilterInFilterItem[];

  /**
   * Returns the hierarchical path to group a given data row in tree mode.
   */
  readonly getPathFromData: (data: RowLeaf<T>) => (string | null | undefined)[];
}

/**
 * A paginated client-side row data source for LyteNyte Grid.
 *   It divides the full dataset into pages based on the configured page
 *   size, reducing the number of rows rendered at any one time to
 *   improve UI responsiveness and performance.
 *
 *   @group Row Data Source
 */
export interface RowDataSourceClientPaginated<T> {
  /**
   * Initializes the row data source. Called by LyteNyte Grid when the grid is ready.
   */
  readonly init: (grid: Grid<T>) => void;

  /**
   * Returns the row node for a given row id. May return `null` if the id is undefined.
   */
  readonly rowById: (id: string) => RowNode<T> | null;

  /**
   * Returns the row node for a given index. May return `null` if index is out of bounds.
   */
  readonly rowByIndex: (index: number) => RowNode<T> | null;

  /**
   * Returns the row index corresponding to a row id, or `null` if not found.
   */
  readonly rowToIndex: (rowId: string) => number | null;

  /**
   * Handles expansion state changes for grouped rows.
   */
  readonly rowExpand: (expansion: Record<string, boolean>) => void;

  /**
   * Handles row selection updates and modifies selection state.
   */
  readonly rowSelect: (params: RdsRowSelectParams) => void;

  /**
   * Selects or deselects all rows based on the provided parameters.
   */
  readonly rowSelectAll: (params: RowSelectAllOptions) => void;

  /**
   * Returns `true` if all rows are selected, otherwise `false`.
   */
  readonly rowAreAllSelected: (rowId?: string) => boolean;

  /**
   * Returns the list of child row ids associated with a given parent row id.
   */
  readonly rowAllChildIds: (rowId: string) => string[];

  /**
   * Updates row data using a map of row ids or indexes mapped to updated values.
   */
  readonly rowUpdate: (updates: Map<string | number, any>) => void;

  /**
   * Deletes rows by their id or index using a provided array of keys.
   */
  readonly rowDelete: (deletions: (string | number)[]) => void;

  /**
   * Adds new rows to the grid optionally at a specific index, beginning, or end.
   */
  readonly rowAdd: (newRows: any[], atIndex?: number | "beginning" | "end") => void;

  /**
   * Sets the data for the center rows (scrollable rows) of the grid. Effectively replacing the current row data.
   */
  readonly rowSetCenterData: (newRows: any[]) => void;

  /**
   * Sets the data for rows pinned to the top section.
   */
  readonly rowSetTopData: (data: any[]) => void;

  /**
   * Sets the data for rows pinned to the bottom section.
   */
  readonly rowSetBotData: (data: any[]) => void;

  /**
   * The properties of the current pagination state.
   */
  readonly page: RowDataSourceClientPageState;

  /**
   * Returns the available in-filter items for the specified column.
   *   May return items synchronously or as a Promise.
   *
   *   @group Row Data Source
   */
  readonly inFilterItems: (
    column: Column<T>,
  ) => Promise<FilterInFilterItem[]> | FilterInFilterItem[];

  /**
   * A client data source method to retrieve the raw data passed to the data source.
   */
  readonly rowData: (section: RowSection) => T[];
}

/**
 * Represents pagination-related state for the client row data source in
 *   LyteNyte Grid. These values enable pagination logic within the grid's UI and interactions.
 *
 *   @group Row Data Source
 */
export interface RowDataSourceClientPageState {
  /**
   * The currently active page number.
   */
  readonly current: GridAtom<number>;

  /**
   * The number of rows displayed per page.
   */
  readonly perPage: GridAtom<number>;

  /**
   * The total number of available pages.
   */
  readonly pageCount: GridAtomReadonly<number>;
}

/**
 * A client-side row data source used by LyteNyte Grid. All operations
 *   are handled on the client, assuming the complete dataset is available in memory.
 *
 *   This implementation is suitable for small to moderately sized datasets. For large-scale datasets, such as those
 *   exceeding hundreds of thousands of rows, a server-based data source
 *   is recommended for performance and memory efficiency.
 *
 *   @group Row Data Source
 */
export interface RowDataSourceClient<T> {
  /**
   * Initializes the row data source. Called by LyteNyte Grid when the grid is ready.
   */
  readonly init: (grid: Grid<T>) => void;

  /**
   * Returns the row node for a given row id. May return `null` if the id is undefined.
   */
  readonly rowById: (id: string) => RowNode<T> | null;

  /**
   * Returns the row node for a given index. May return `null` if index is out of bounds.
   */
  readonly rowByIndex: (index: number) => RowNode<T> | null;

  /**
   * Returns the row index corresponding to a row id, or `null` if not found.
   */
  readonly rowToIndex: (rowId: string) => number | null;

  /**
   * Handles expansion state changes for grouped rows.
   */
  readonly rowExpand: (expansion: Record<string, boolean>) => void;

  /**
   * Handles row selection updates and modifies selection state.
   */
  readonly rowSelect: (params: RdsRowSelectParams) => void;

  /**
   * Selects or deselects all rows based on the provided parameters.
   */
  readonly rowSelectAll: (params: RowSelectAllOptions) => void;

  /**
   * Returns `true` if all rows are selected, otherwise `false`.
   */
  readonly rowAreAllSelected: (rowId?: string) => boolean;

  /**
   * Returns the list of child row ids associated with a given parent row id.
   */
  readonly rowAllChildIds: (rowId: string) => string[];

  /**
   * Updates row data using a map of row ids or indexes mapped to updated values.
   */
  readonly rowUpdate: (updates: Map<string | number, any>) => void;

  /**
   * Deletes rows by their id or index using a provided array of keys.
   */
  readonly rowDelete: (deletions: (string | number)[]) => void;

  /**
   * Adds new rows to the grid optionally at a specific index, beginning, or end.
   */
  readonly rowAdd: (newRows: any[], atIndex?: number | "beginning" | "end") => void;

  /**
   * Sets the data for the center rows (scrollable rows) of the grid. Effectively replacing the current row data.
   */
  readonly rowSetCenterData: (newRows: any[]) => void;

  /**
   * Sets the data for rows pinned to the top section.
   */
  readonly rowSetTopData: (data: any[]) => void;

  /**
   * Sets the data for rows pinned to the bottom section.
   */
  readonly rowSetBotData: (data: any[]) => void;

  /**
   * Returns the available in-filter items for the specified column.
   *   May return items synchronously or as a Promise.
   *
   *   @group Row Data Source
   */
  readonly inFilterItems: (
    column: Column<T>,
  ) => Promise<FilterInFilterItem[]> | FilterInFilterItem[];

  /**
   * A client data source method to retrieve the raw data passed to the data source.
   */
  readonly rowData: (section: RowSection) => T[];
}

/**
 * The row data source interface used by LyteNyte Grid to retrieve and manage row data.
 *   This includes functionality for row expansion, selection, and CRUD operations.
 *
 *   @group Row Data Source
 */
export interface RowDataSource<T> {
  /**
   * Initializes the row data source. Called by LyteNyte Grid when the grid is ready.
   */
  readonly init: (grid: Grid<T>) => void;

  /**
   * Returns the row node for a given row id. May return `null` if the id is undefined.
   */
  readonly rowById: (id: string) => RowNode<T> | null;

  /**
   * Returns the row node for a given index. May return `null` if index is out of bounds.
   */
  readonly rowByIndex: (index: number) => RowNode<T> | null;

  /**
   * Returns the row index corresponding to a row id, or `null` if not found.
   */
  readonly rowToIndex: (rowId: string) => number | null;

  /**
   * Handles expansion state changes for grouped rows.
   */
  readonly rowExpand: (expansion: Record<string, boolean>) => void;

  /**
   * Handles row selection updates and modifies selection state.
   */
  readonly rowSelect: (params: RdsRowSelectParams) => void;

  /**
   * Selects or deselects all rows based on the provided parameters.
   */
  readonly rowSelectAll: (params: RowSelectAllOptions) => void;

  /**
   * Returns `true` if all rows are selected, otherwise `false`.
   */
  readonly rowAreAllSelected: (rowId?: string) => boolean;

  /**
   * Returns the list of child row ids associated with a given parent row id.
   */
  readonly rowAllChildIds: (rowId: string) => string[];

  /**
   * Updates row data using a map of row ids or indexes mapped to updated values.
   */
  readonly rowUpdate: (updates: Map<string | number, any>) => void;

  /**
   * Deletes rows by their id or index using a provided array of keys.
   */
  readonly rowDelete: (deletions: (string | number)[]) => void;

  /**
   * Adds new rows to the grid optionally at a specific index, beginning, or end.
   */
  readonly rowAdd: (newRows: any[], atIndex?: number | "beginning" | "end") => void;

  /**
   * Sets the data for the center rows (scrollable rows) of the grid. Effectively replacing the current row data.
   */
  readonly rowSetCenterData: (newRows: any[]) => void;

  /**
   * Sets the data for rows pinned to the top section.
   */
  readonly rowSetTopData: (data: any[]) => void;

  /**
   * Sets the data for rows pinned to the bottom section.
   */
  readonly rowSetBotData: (data: any[]) => void;

  /**
   * Returns the available in-filter items for the specified column.
   *   May return items synchronously or as a Promise.
   *
   *   @group Row Data Source
   */
  readonly inFilterItems: (
    column: Column<T>,
  ) => Promise<FilterInFilterItem[]> | FilterInFilterItem[];
}

/**
 * A high-performance row data source for LyteNyte Grid that enables
 *   server-side data loading in slices. This data source supports virtually
 *   unlimited data volumes by querying only the required data ranges from a backend source.
 *
 *   Unlike client-side data sources, all row operations—including filtering, sorting,
 *   grouping, and pagination—must be handled on the server. This design provides
 *   maximum flexibility and scalability, including support for server-driven trees
 *   and pagination, but requires a more complex implementation on the backend.
 *
 *   @group Row Data Source
 */
export interface RowDataSourceServer<T> {
  /**
   * Initializes the row data source. Called by LyteNyte Grid when the grid is ready.
   */
  readonly init: (grid: Grid<T>) => void;

  /**
   * Returns the row node for a given row id. May return `null` if the id is undefined.
   */
  readonly rowById: (id: string) => RowNode<T> | null;

  /**
   * Returns the row node for a given index. May return `null` if index is out of bounds.
   */
  readonly rowByIndex: (index: number) => RowNode<T> | null;

  /**
   * Returns the row index corresponding to a row id, or `null` if not found.
   */
  readonly rowToIndex: (rowId: string) => number | null;

  /**
   * Handles expansion state changes for grouped rows.
   */
  readonly rowExpand: (expansion: Record<string, boolean>) => void;

  /**
   * Handles row selection updates and modifies selection state.
   */
  readonly rowSelect: (params: RdsRowSelectParams) => void;

  /**
   * Selects or deselects all rows based on the provided parameters.
   */
  readonly rowSelectAll: (params: RowSelectAllOptions) => void;

  /**
   * Returns `true` if all rows are selected, otherwise `false`.
   */
  readonly rowAreAllSelected: (rowId?: string) => boolean;

  /**
   * Returns the list of child row ids associated with a given parent row id.
   */
  readonly rowAllChildIds: (rowId: string) => string[];

  /**
   * Updates row data using a map of row ids or indexes mapped to updated values.
   */
  readonly rowUpdate: (updates: Map<string | number, any>) => void;

  /**
   * Deletes rows by their id or index using a provided array of keys.
   */
  readonly rowDelete: (deletions: (string | number)[]) => void;

  /**
   * Adds new rows to the grid optionally at a specific index, beginning, or end.
   */
  readonly rowAdd: (newRows: any[], atIndex?: number | "beginning" | "end") => void;

  /**
   * Sets the data for the center rows (scrollable rows) of the grid. Effectively replacing the current row data.
   */
  readonly rowSetCenterData: (newRows: any[]) => void;

  /**
   * Sets the data for rows pinned to the top section.
   */
  readonly rowSetTopData: (data: any[]) => void;

  /**
   * Sets the data for rows pinned to the bottom section.
   */
  readonly rowSetBotData: (data: any[]) => void;

  /**
   * Returns the available in-filter items for the specified column.
   *   May return items synchronously or as a Promise.
   *
   *   @group Row Data Source
   */
  readonly inFilterItems: (
    column: Column<T>,
  ) => Promise<FilterInFilterItem[]> | FilterInFilterItem[];

  /**
   * Indicates whether the server data source is currently fetching data.
   *       This can be used to show a loading indicator in the UI.
   */
  readonly isLoading: GridAtomReadonly<boolean>;

  /**
   * If the initial data load for the server data fails, the loadError will be set with the
   *       error value. This is only set if the initial load failed.
   */
  readonly loadError: GridAtomReadonly<unknown>;

  /**
   * Retries the failed data load requests.
   */
  readonly retry: () => void;

  /**
   * Pushes data responses directly into the data source. Useful for
   *       preloading, live updates, or streaming responses.
   */
  readonly pushResponses: (req: (DataResponse | DataResponsePinned)[]) => void;

  /**
   * Triggers the data fetching pipeline with a set of requests. Can
   *       optionally invoke a callback upon successful completion.
   */
  readonly pushRequests: (
    req: DataRequest[],
    onSuccess?: () => void,
    onError?: (e: unknown) => void,
  ) => void;

  /**
   * Resets the internal state and clears all server data previously fetched by the grid.
   */
  readonly reset: () => void;
}

/**
 * The internal row data store used by LyteNyte Grid to manage row metadata, counts, and access functions.
 *
 * @group Row Data Source
 */
export interface RowDataStore<T> {
  /**
   * Total number of rows present in the grid.
   */
  readonly rowCount: GridAtomReadonly<number>;

  /**
   * Number of rows pinned to the top section.
   */
  readonly rowTopCount: GridAtom<number>;

  /**
   * Number of scrollable rows in the center section.
   */
  readonly rowCenterCount: GridAtom<number>;

  /**
   * Number of rows pinned to the bottom section.
   */
  readonly rowBottomCount: GridAtom<number>;

  /**
   * Retrieves the row node for the given row index.
   */
  readonly rowForIndex: (row: number) => GridAtomReadonlyUnwatchable<RowNode<T> | null>;

  /**
   * Clears the cached row node data in the store.
   */
  readonly rowClearCache: () => void;

  /**
   * Invalidates the row node for the given index, forcing a refresh.
   */
  readonly rowInvalidateIndex: (row: number) => void;
}

/**
 * Parameters passed to the row selection handler within the row data source.
 *
 * @group Row Data Source
 */
export interface RdsRowSelectParams {
  /**
   * The starting row id of the selection range.
   */
  readonly startId: string;

  /**
   * The ending row id of the selection range.
   */
  readonly endId: string;

  /**
   * Indicates whether to include child rows in the selection.
   */
  readonly selectChildren: boolean;

  /**
   * Indicates whether the action should deselect the specified rows.
   */
  readonly deselect: boolean;

  /**
   * The current selection mode applied to the row operation.
   */
  readonly mode: RowSelectionMode;
}

/**
 * Represents a mutable piece of reactive grid state. This atom allows reading,
 *   updating, watching, and consuming its value reactively within React components.
 *
 *   @group Grid Atom
 */
export interface GridAtom<T> {
  /**
   * Retrieves the current value stored in the atom. This method provides read access
   *   to the state managed by the atom.
   *
   *   @group Grid Atom
   */
  readonly get: () => T;

  /**
   * Updates the atom's value. Accepts either a new value or a function that receives
   *   the current value and returns the updated value.
   *
   *   @group Grid Atom
   */
  readonly set: (v: T | ((p: T) => T)) => void;

  /**
   * Registers a listener function to be invoked whenever the atom's value changes.
   *   Returns a cleanup function to remove the listener.
   *
   *   @group Grid Atom
   */
  readonly watch: (fn: () => void) => () => void;

  /**
   * A React hook that subscribes to the atom's value and causes the component to re-render
   *   whenever the atom changes.
   *
   *   @group Grid Atom
   */
  readonly useValue: () => T;
}

/**
 * Represents an immutable version of a grid atom that supports read, watch, and reactive
 *   usage but does not allow updates.
 *
 *   @group Grid Atom
 */
export interface GridAtomReadonly<T> {
  /**
   * Retrieves the current value stored in the atom. This method provides read access
   *   to the state managed by the atom.
   *
   *   @group Grid Atom
   */
  readonly get: () => T;

  /**
   * Registers a listener function to be invoked whenever the atom's value changes.
   *   Returns a cleanup function to remove the listener.
   *
   *   @group Grid Atom
   */
  readonly watch: (fn: () => void) => () => void;

  /**
   * A React hook that subscribes to the atom's value and causes the component to re-render
   *   whenever the atom changes.
   *
   *   @group Grid Atom
   */
  readonly useValue: () => T;
}

/**
 * Represents the most minimal read-only version of a grid atom. It supports value
 *   retrieval and reactive consumption, but not watching or updates.
 *
 *   @group Grid Atom
 */
export interface GridAtomReadonlyUnwatchable<T> {
  /**
   * Retrieves the current value stored in the atom. This method provides read access
   *   to the state managed by the atom.
   *
   *   @group Grid Atom
   */
  readonly get: () => T;

  /**
   * A React hook that subscribes to the atom's value and causes the component to re-render
   *   whenever the atom changes.
   *
   *   @group Grid Atom
   */
  readonly useValue: () => T;
}

/**
 * Predicate function to determine if a row should render in full-width mode.
 * Commonly used for custom summary or grouped views.
 *
 * @group Row
 */
export type RowFullWidthPredicate<T> = (
  /**
   * The input parameters provided to the full width predicate.
   */
  params: RowFullWidthPredicateParams<T>,
) => boolean;

/**
 * Parameters provided to the {@link RowFullWidthPredicate} function to determine
 * if a row should span full width of the grid.
 *
 * @group Row
 */
export interface RowFullWidthPredicateParams<T> {
  /**
   * A reference to the LyteNyte Grid instance.
   */
  readonly grid: Grid<T>;

  /**
   * The zero-based index of the row.
   */
  readonly rowIndex: number;

  /**
   * The row node instance in LyteNyte Grid.
   */
  readonly row: RowNode<T>;
}

/**
 * Function to render the full-width row content. Returns a ReactNode to be rendered as the row.
 *
 * @group Row
 */
export type RowFullWidthRendererFn<T> = (
  /**
   * The full width renderer input parameters.
   */
  params: RowFullWidthRendererParams<T>,
) => ReactNode;

/**
 * Parameters provided to the full-width row renderer.
 * Includes row metadata and selection state.
 *
 * @group Row
 */
export interface RowFullWidthRendererParams<T> {
  /**
   * The zero-based index of the row.
   */
  readonly rowIndex: number;

  /**
   * The row node instance in LyteNyte Grid.
   */
  readonly row: RowNode<T>;

  /**
   * A reference to the LyteNyte Grid instance.
   */
  readonly grid: Grid<T>;

  /**
   * Indicates whether the row is currently selected.
   */
  readonly rowSelected: boolean;

  /**
   * Indicates whether the row is in an indeterminate selection state.
   */
  readonly rowIndeterminate: boolean;
}

/**
 * Represents a group (branch) row which may contain children rows (leaf or other groups).
 * Group rows are used in hierarchical views and support expansion/collapse behavior.
 *
 * @group Row
 */
export interface RowGroup {
  /**
   * A unique `id` for a given row. The `id` is generated by a given {@link RowDataSource}.
   * Every row must have a unique `id`.
   */
  readonly id: string;

  /**
   * An optional flag indicating whether the row is currently loading data.
   * Useful for asynchronous data loading scenarios.
   */
  readonly loading?: boolean;

  /**
   * An error object associated with this row. The type is intentionally flexible,
   * and should be interpreted by the consumer based on context.
   */
  readonly error?: unknown;

  /**
   * Discriminant used to identify this row as a `RowGroup`.
   */
  readonly kind: "branch";

  /**
   * The group key used to organize this branch in the hierarchy. Acts as part of the grouping path.
   */
  readonly key: string | null;

  /**
   * Group-level aggregated or summarized data. Must be an object with string keys;
   * values may be any type depending on aggregation strategy.
   */
  readonly data: Record<string, unknown>;

  /**
   * Depth level from the root; used to determine visual indenting and structure.
   */
  readonly depth: number;
}

/**
 * A height configuration for rows. May be:
 * - A fixed number (e.g. 30),
 * - A fill value (e.g. `fill:1`),
 * - A function that returns dynamic row height based on index.
 *
 * @group Row
 */
export type RowHeight = number | `fill:${number}` | ((i: number) => number);

/**
 * Represents a leaf row in the grid. A leaf row is a terminal node that has no children.
 * These rows typically represent the raw dataset and are used for aggregations and visual representation.
 *
 * @group Row
 */
export interface RowLeaf<T = any> {
  /**
   * A unique `id` for a given row. The `id` is generated by a given {@link RowDataSource}.
   * Every row must have a unique `id`.
   */
  readonly id: string;

  /**
   * An optional flag indicating whether the row is currently loading data.
   * Useful for asynchronous data loading scenarios.
   */
  readonly loading?: boolean;

  /**
   * An error object associated with this row. The type is intentionally flexible,
   * and should be interpreted by the consumer based on context.
   */
  readonly error?: unknown;

  /**
   * Discriminant used to identify this row as a `RowLeaf`.
   */
  readonly kind: "leaf";

  /**
   * The data payload associated with this row. Usually a plain object or array,
   * this is passed to column field logic to extract cell values.
   */
  readonly data: T | null;
}

/**
 * A union of {@link RowLeaf} and {@link RowGroup}. Represents any row that may appear in the grid view.
 * Used generically when the row type is not known ahead of time.
 *
 * @group Row
 */
export type RowNode<T> = RowLeaf<T> | RowGroup;

/**
 * Indicates the pinning position of a row:
 * - "top": pinned to top,
 * - "bottom": pinned to bottom,
 * - null: not pinned.
 * Pinned rows remain visible during scrolling.
 *
 * @group Row
 */
export type RowPin = "top" | "bottom" | null;

/**
 * Specifies which section of the grid a row belongs to:
 * - "top": pinned to the top area,
 * - "bottom": pinned to the bottom area,
 * - "center": scrollable middle area,
 * - "flat": single flattened section.
 *
 * @group Row
 */
export type RowSection = "top" | "bottom" | "center" | "flat";

/**
 * A function that computes the row or column span for a given cell in LyteNyte Grid.
 *
 * This function supports both row and column spanning, depending on where it's applied. It must
 * return a numeric value greater than or equal to `1`, indicating how many rows or columns
 * the cell should span.
 *
 * **Performance Note**: This function is called frequently during layout calculations,
 * so it must be fast and efficient to avoid UI lag.
 *
 * **Consistency Requirement**:
 *
 * LyteNyte Grid expects spans to be logically consistent and non-overlapping. For instance,
 * if a cell at row index 0 returns a span of 3, then the cells at row indices 1 and 2 must
 * return a span of 1 (i.e. not spanned), as they are covered by the span starting at row 0.
 *
 * Inconsistent or overlapping span calculations may cause layout breakage due to LyteNyte's
 * look-back layout resolution strategy.
 *
 * **Scan Distance**:
 *
 * Use the grid's `rowScanDistance` and `colScanDistance` properties to define how far
 * the grid should look when resolving spans. These act as guarantees that no span will exceed
 * the specified limits.
 *
 * **Visibility**:
 *
 * Cells that are spanned over (i.e. covered by another cell's span) will not be rendered and
 * are excluded from the layout and DOM. Ensure your span logic accounts for this behavior.
 *
 * @group Row And Column Spanning
 */
export type CellSpanFn<T> = (
  /**
   * Arguments passed to the span function, including row/column index and row data.
   *
   * See {@link CellSpanFnParams}.
   */
  params: CellSpanFnParams<T>,
) => number;

/**
 * Input parameters for {@link CellSpanFn}, which determines the span of a given cell.
 *
 * These parameters include:
 * - The grid instance
 * - Row and column indices
 * - The row node representing the full row data
 *
 * Used to compute dynamic row or column spans for advanced layout use cases.
 *
 * @group Row And Column Spanning
 */
export interface CellSpanFnParams<T> {
  /**
   * A reference to the LyteNyte Grid instance.
   */
  readonly grid: Grid<T>;

  /**
   * The zero-based index of the row.
   */
  readonly rowIndex: number;

  /**
   * The zero-based index of the column.
   */
  readonly colIndex: number;

  /**
   * The row node instance in LyteNyte Grid.
   */
  readonly row: RowNode<T>;
}

/**
 * Represents the two forms of data that can be passed into functions like sort comparators.
 *
 *   These are partial views of the row:
 *   - A `leaf` form, representing actual row-level data (`T | null`)
 *   - A `branch` form, representing nested row structures with a key lookup
 *
 *   Note: These do not include attributes like `rowId` or `rowIndex` as those may not be available yet.
 *
 *   @group Field
 */
export type FieldDataParam<T> =
  | { kind: "leaf"; data: T | null }
  | { kind: "branch"; data: Record<string, unknown>; key: string | null };

/**
 * A dynamic field function used to derive values for a column.
 *
 *   This function may be invoked repeatedly, once per cell per column, so it must be optimized for efficiency.
 *
 *   @group Field
 */
export type FieldFn<T> = (
  /**
   * The structured input data for computing the custom field.
   */
  params: FieldFnParams<T>,
) => unknown;

/**
 * The parameters passed to functional column fields.
 *
 *   LyteNyte Grid calls these functions dynamically during rendering or computation.
 *   These calls can occur frequently (e.g., for every cell in a column), so implementations should prioritize performance.
 *
 *   @group Field
 */
export interface FieldFnParams<T> {
  /**
   * A reference to the LyteNyte Grid instance.
   */
  readonly grid: Grid<T>;

  /**
   * A reference to a column definition in LyteNyte Grid.
   */
  readonly column: Column<T>;

  /**
   * A representation of the row data, used in computing custom fields or sorting logic.
   *
   * @group Field
   */
  readonly data: FieldDataParam<T>;
}

/**
 * Specifies a string-based path used to extract values from a nested data structure, similar to `lodash.get`.
 *
 *   Example: `"point.x"` will return `data.point.x`. Useful for deeply nested row data.
 *
 *   @group field
 */
export interface FieldPath {
  /**
   * Discriminator for type guards. Should always be set to `"path"`.
   */
  readonly kind: "path";

  /**
   * Dot separated accessor path for value retrieval.
   */
  readonly path: string;
}

/**
 * A function used to derive row grouping values distinct from cell display values.
 *
 *   Ideal for customizing how rows are grouped in the UI or logic layer.
 *
 *   @group Field
 */
export type FieldRowGroupFn<T> = (
  /**
   * The input parameters for computing custom row group values.
   */
  params: FieldRowGroupParamsFn<T>,
) => unknown;

/**
 * Defines the parameters used for custom row group field functions.
 *
 *   Enables grouping logic to be decoupled from the data's displayed value.
 *
 *   @group Field
 */
export interface FieldRowGroupParamsFn<T> {
  /**
   * A reference to the LyteNyte Grid instance.
   */
  readonly grid: Grid<T>;

  /**
   * The data object associated with the row. It may be `null` if the row is loading or not yet available.
   */
  readonly data: T | null;
}

/**
 * Defines the acceptable formats for row group fields.
 *   Includes primitives, path-based accessors, or a custom function for grouping behavior.
 *
 *   @group Field
 */
export type FieldRowGroup<T> = number | string | FieldPath | FieldRowGroupFn<T>;

/**
 * Specifies the various forms that a column field may take.
 *
 * - A primitive value (`string` or `number`)
 * - A path-based accessor
 * - A custom function for dynamic computation
 *
 * @group Field
 */
export type Field<T> = number | string | FieldPath | FieldFn<T>;

/**
 * A function that returns a {@link ReactNode} representing the rendered content of a cell.
 *
 * This function is called once per cell for the associated column. Cell renderers should be
 * optimized for performance, as slow renderers may degrade the overall responsiveness of the grid.
 *
 * Avoid unnecessary re-renders or expensive calculations inside this function.
 *
 * @group Cell Rendering
 */
export type CellRendererFn<T> = (
  /**
   * The full set of parameters available to the cell renderer. See {@link CellRendererParams}.
   */
  params: CellRendererParams<T>,
) => ReactNode;

/**
 * Input parameters passed to the {@link CellRendererFn}, which is responsible for rendering the display content
 * of a specific cell in the grid.
 *
 * Includes metadata and context such as the grid instance, row and column positions, selection state,
 * and the full row node data.
 *
 * @group Cell Rendering
 */
export interface CellRendererParams<T> {
  /**
   * A reference to the LyteNyte Grid instance.
   */
  readonly grid: Grid<T>;

  /**
   * A reference to a column definition in LyteNyte Grid.
   */
  readonly column: Column<T>;

  /**
   * The row node instance in LyteNyte Grid.
   */
  readonly row: RowNode<T>;

  /**
   * The zero-based index of the row.
   */
  readonly rowIndex: number;

  /**
   * The zero-based index of the column.
   */
  readonly colIndex: number;

  /**
   * Indicates whether the row is currently selected.
   */
  readonly rowSelected: boolean;

  /**
   * Indicates whether the row is in an indeterminate selection state.
   */
  readonly rowIndeterminate: boolean;

  /**
   * The pinning state of a row, used to fix it to the top or bottom of the grid.
   */
  readonly rowPin: RowPin;
}

/**
 * The parameters the `columnAutosize` method accepts.
 *
 *   @group Grid API
 */
export interface ColumnAutosizeParams<T> {
  /**
   * If `true`, performs the autosize calculation without applying the changes. Returns the calculated widths.
   */
  readonly dryRun?: boolean;

  /**
   * If `true`, includes the column header when calculating the autosize width.
   */
  readonly includeHeader?: boolean;

  /**
   * A list of columns to autosize. If omitted, all columns are included in the operation.
   */
  readonly columns?: (string | number | Column<T>)[];
}

/**
 * The parameters that may be provided to the `columnMove` API method.
 *
 *   @group Grid API
 */
export interface ColumnMoveParams<T> {
  /**
   * The columns being moved. May be the column id or the column itself. All the columns should
   *       be present in the grid's column definitions.
   */
  readonly moveColumns: (string | Column<T>)[];

  /**
   * The move target for the columns. The target may not be present in the move columns, i.e. can not move
   *       a column to itself.
   */
  readonly moveTarget: string | number | Column<T>;

  /**
   * If the move columns should be placed before the target column.
   */
  readonly before?: boolean;

  /**
   * If the pin state of the columns being moved should be updated to match the target column.
   */
  readonly updatePinState?: boolean;
}

/**
 * The accepted input types for the `focusCell` method, which updates the active focus in LyteNyte Grid.
 * Supports various formats:
 *
 * - A row/column pair to focus a specific cell.
 * - A header or group header cell position.
 * - A directional alias ("next", "prev", "up", "down") relative to the current focus (only when the grid is focused).
 *
 * @group Grid API
 */
export type FocusCellParams<T> =
  | { row: number; column: string | number | Column<T> }
  | PositionHeaderCell
  | Omit<PositionHeaderGroupCell, "columnStartIndex" | "columnEndIndex">
  | "next"
  | "prev"
  | "up"
  | "down";

/**
 * The LyteNyte Grid API provides a comprehensive set of methods that allow developers
 *   to programmatically query, update, and manipulate grid state and data.
 *
 *   @group Grid API
 */
export interface GridApi<T> {
  /**
   * Retrieves the calculated value for a specific column and row. Useful in cases where the column's
   *   field is not a direct path, or when additional logic is involved in determining cell values.
   *   It provides access to LyteNyte Grid's internal field evaluation pipeline.
   */
  readonly columnField: (columnOrId: string | Column<T>, row: FieldDataParam<T>) => unknown;

  /**
   * Returns the column at the specified visible index. If the index is out of bounds or
   *   the column is hidden (due to visibility rules or collapsed groups), this will return null.
   */
  readonly columnByIndex: (columnIndex: number) => Column<T> | null;

  /**
   * Returns the index of a visible column based on its id or column object.
   *   Returns -1 if the column is not currently visible (e.g., hidden or inside a collapsed group).
   */
  readonly columnIndex: (columnOrId: string | Column<T>) => number;

  /**
   * Retrieves the current sort object and its index from the sort model for a given column.
   *   If no sort applies to the column, returns null.
   */
  readonly sortForColumn: (columnOrId: string) => { sort: SortModelItem<T>; index: number } | null;

  /**
   * Type guard that determines whether a row node is a leaf node (i.e., not a group).
   *   Useful when working with union row types such as RowLeaf and RowGroup.
   */
  readonly rowIsLeaf: (row: RowNode<T>) => row is RowLeaf<T>;

  /**
   * Type guard that checks if a row node is a group. Helps distinguish between leaf and group rows.
   */
  readonly rowIsGroup: (row: RowNode<T>) => row is RowGroup;

  /**
   * Returns the group index associated with a group column. Useful in header or cell renderers
   *   dealing with auto-generated group columns in the grid.
   */
  readonly rowGroupColumnIndex: (c: Column<T>) => number;

  /**
   * Toggles the expansion state of a group row. Optionally accepts a boolean state to set
   *   expansion explicitly. This method triggers the row group expansion lifecycle.
   */
  readonly rowGroupToggle: (row: RowGroup, state?: boolean) => void;

  /**
   * Applies multiple group row expansion states using a mapping of row ids to expansion booleans.
   *   Useful when restoring or syncing expansion state.
   */
  readonly rowGroupApplyExpansions: (expansions: Record<string, boolean>) => void;

  /**
   * Returns a boolean indicating if the specified group row is currently expanded.
   */
  readonly rowGroupIsExpanded: (row: RowGroup) => boolean;

  /**
   * Adds an event listener to the grid for a specified event.
   *   Returns a function that can be called to remove the listener.
   */
  readonly eventAddListener: <K extends keyof GridEvents<T>>(
    event: K,
    fn: (event: Parameters<Required<GridEvents<T>>[K]>[0]) => void,
  ) => () => void;

  /**
   * Removes a registered event listener. The exact event and handler function must be provided.
   */
  readonly eventRemoveListener: <K extends keyof GridEvents<T>>(
    event: K,
    fn: (event: Parameters<Required<GridEvents<T>>[K]>[0]) => void,
  ) => void;

  /**
   * Manually dispatches a grid event with a given payload. This is intended for advanced usage
   *   where custom behavior or testing scenarios require simulating native event lifecycles.
   */
  readonly eventFire: <K extends keyof GridEvents<T>>(
    name: K,
    event: Parameters<Required<GridEvents<T>>[K]>[0],
  ) => void;

  /**
   * Ensures the specified row and/or column is scrolled into view.
   * Accepts a configuration object that controls the scroll behavior.
   */
  readonly scrollIntoView: (options: ScrollIntoViewOptions<T>) => void;

  /**
   * Sets focus to a specific cell or navigates the focus based on a direction keyword.
   * Useful for keyboard-driven navigation and programmatic focus management.
   */
  readonly focusCell: (position: FocusCellParams<T>) => void;

  /**
   * Starts cell editing at a specified location. If the grid is set to read-only mode, this method has no effect.
   */
  readonly editBegin: (params: EditBeginParams<T>) => void;

  /**
   * Ends the currently active cell edit. If there is no active edit session, the method does nothing.
   * Can optionally cancel the edit if `true` is passed.
   */
  readonly editEnd: (cancel?: boolean) => void;

  /**
   * Returns `true` if the provided cell is currently being edited. Useful for conditionally rendering custom cell UI.
   */
  readonly editIsCellActive: (params: EditBeginParams<T>) => boolean;

  /**
   * Applies an edit to the specified cell programmatically. This directly updates the data without going through the UI.
   */
  readonly editUpdate: (params: EditUpdateParams<T>) => void;

  /**
   * Checks whether the detail panel for the given row is currently expanded. Returns `true` if expanded.
   */
  readonly rowDetailIsExpanded: (rowOrId: string | RowNode<T>) => boolean;

  /**
   * Toggles the detail expansion for the specified row. Optionally provide a boolean to explicitly set the expansion state.
   */
  readonly rowDetailToggle: (rowOrId: string | RowNode<T>, state?: boolean) => void;

  /**
   * Returns the rendered height of the row's detail section only. Does not include the standard row height.
   */
  readonly rowDetailRenderedHeight: (rowOrId: string | RowNode<T>) => number;

  /**
   * Retrieves a row by its unique id. Returns `null` or `undefined` if the row doesn't exist or
   * is not currently available in the data source.
   */
  readonly rowById: (id: string) => RowNode<T> | null | undefined;

  /**
   * Retrieves a row based on its index and optional section (body, pinned top, or pinned bottom).
   * Returns `null` or `undefined` if the index is out of range.
   */
  readonly rowByIndex: (index: number, section?: RowSection) => RowNode<T> | null | undefined;

  /**
   * Selects a specific set of rows based on the provided {@link RowSelectOptions}.
   * Triggers corresponding selection-related grid events.
   */
  readonly rowSelect: (params: RowSelectOptions) => void;

  /**
   * Selects all rows in the current grid view. Accepts {@link RowSelectAllOptions} for fine-grained control.
   * Triggers selection-related events.
   */
  readonly rowSelectAll: (params?: RowSelectAllOptions) => void;

  /**
   * Returns the list of currently selected row nodes.
   * Note that some returned rows may not be part of the visible grid, depending on the data state.
   */
  readonly rowSelected: () => RowNode<T>[];

  /**
   * A method that may be used in DOM event handlers to trigger row selection logic.
   *   Ideal for integrating checkbox-based or custom selection workflows. Also supports bulk row selection.
   */
  readonly rowHandleSelect: (params: RowHandleSelectParams) => void;

  /**
   * A React hook that returns props and state for row dragging support.
   *   These props can be attached to a drag handle in your component to initiate drag behavior.
   *   This must follow React’s hook rules.
   */
  readonly useRowDrag: (params: UseRowDragParams<T>) => {
    dragProps: any;
    isDragging: boolean;
  };

  /**
   * Resizes one or more columns by providing an object where each key is a column id and the value is the new width in pixels.
   */
  readonly columnResize: (columns: Record<string, number>) => void;

  /**
   * Returns the column with the specified id. If no matching column is found, returns `undefined`.
   */
  readonly columnById: (id: string) => Column<T> | undefined;

  /**
   * Applies updates to one or more columns. Each key in the object is a column id, and each value is the set of updates to apply.
   */
  readonly columnUpdate: (updates: Record<string, Omit<Column<T>, "id">>) => void;

  /**
   * Moves one or more columns before or after a specified target column.
   *   This operation respects column group visibility and layout rules.
   */
  readonly columnMove: (params: ColumnMoveParams<T>) => void;

  /**
   * Toggles the expansion state of one or more column groups.
   *   You can also pass a boolean to directly set the expansion state.
   */
  readonly columnToggleGroup: (group: string | string[], state?: boolean) => void;

  /**
   * Automatically adjusts the widths of columns based on their content. Accepts optional parameters to control the behavior.
   */
  readonly columnAutosize: (params: ColumnAutosizeParams<T>) => Record<string, number>;

  /**
   * Returns the raw cell data within a rectangular selection of the grid.
   *   This can be useful for custom data processing or exporting workflows.
   *
   *   @group Grid API
   */
  readonly exportDataRect: (params?: ExportDataRectParams) => Promise<ExportDataRectResult<T>>;

  /**
   * Exports the cell data for a given rectangle of the grid as a CSV-formatted string.
   *   The rectangle can be customized through parameters such as selected rows, columns, or cell ranges.
   *
   *   @group Grid API
   */
  readonly exportCsv: (params?: ExportCsvParams) => Promise<string>;

  /**
   * Generates a downloadable CSV `Blob` from the selected rectangular area of grid cell data.
   *   Can be used to trigger a file download in the browser.
   *
   *   @group Grid API
   */
  readonly exportCsvFile: (params?: ExportCsvParams) => Promise<Blob>;

  /**
   * Opens a dialog frame by its id. You may optionally provide a context object
   *       that will be passed into the dialog's renderer for dynamic configuration.
   */
  readonly dialogFrameOpen: (id: string, context?: any) => void;

  /**
   * Closes dialog frames. If an id is provided, only the dialog with that id is closed;
   *       otherwise, all open dialogs will be closed.
   */
  readonly dialogFrameClose: (id?: string) => void;

  /**
   * Opens a popover frame at the specified target element or virtual target.
   *       An optional context can be passed into the popover renderer for configuration.
   */
  readonly popoverFrameOpen: (
    id: string,
    target: HTMLElement | VirtualTarget,
    context?: any,
  ) => void;

  /**
   * Closes popover frames. If an id is provided, only the corresponding frame is closed;
   *       otherwise, all popover frames will be dismissed.
   */
  readonly popoverFrameClose: (id?: string) => void;

  /**
   * Returns the grid-relative position of the specified HTML element.
   *       This can help determine if an element belongs to a specific grid cell,
   *       header, or other region—useful for anchoring popovers or tooltips.
   */
  readonly positionFromElement: (el: HTMLElement) => PositionUnion | null;
}

/**
 * The parameters used for the `rowHandleSelect` API method of LyteNyte Grid.
 *
 *   @group Grid API
 */
export interface RowHandleSelectParams {
  /**
   * The event target to handle.
   */
  readonly target: EventTarget;

  /**
   * Indicates whether the shift key is pressed. Required for enabling range-based (bulk) row selections.
   */
  readonly shiftKey: boolean;
}

/**
 * Options for the `scrollIntoView` API. Allows you to scroll a specific row and/or column into view,
 *     ensuring they are visible in the viewport.
 *
 *     @group Grid API
 */
export interface ScrollIntoViewOptions<T> {
  /**
   * The column index, column id, or column object to bring into view. Triggers a horizontal scroll if the column is not currently visible.
   */
  readonly column?: number | string | Column<T>;

  /**
   * The index of the row to bring into view. Triggers a vertical scroll if the row is not currently visible.
   */
  readonly row?: number;

  /**
   * Defines the scrolling behavior. "smooth" animates the scroll, "auto" uses browser default behavior, and "instant" jumps immediately.
   */
  readonly behavior?: "smooth" | "auto" | "instant";
}

/**
 * Represents a virtual DOM target with bounding information, used in situations
 *   where a physical DOM element does not exist. Commonly used for positioning popovers
 *   or overlays within LyteNyte Grid.
 *
 *   @group Frames
 */
export interface VirtualTarget {
  /**
   * Returns the bounding rectangle representing the virtual target.
   *       Equivalent to a DOMRect but without the `toJSON` method.
   */
  readonly getBoundingClientRect: () => Omit<DOMRect, "toJSON">;

  /**
   * Returns an array of client rectangles for the virtual target, useful
   *       for rendering inline tooltips or positioning logic.
   */
  readonly getClientRects?: () => Omit<DOMRect, "toJSON">[];

  /**
   * Specifies a context element that acts as a reference for the virtual element.
   *       Helps in aligning or calculating relative positions.
   */
  readonly contextElement?: HTMLElement;
}

/**
 * Function signature for custom sort comparators.
 *
 * @group Sort
 */
export type SortComparatorFn<T> = (
  /**
   * Left-hand value for comparison.
   */
  left: FieldDataParam<T>,
  /**
   * Right-hand value for comparison.
   */
  right: FieldDataParam<T>,
  /**
   * Optional configuration data used by the comparator.
   */
  options: any,
) => number;

/**
 * Predefined sort comparator types supported by LyteNyte Grid.
 *
 * @group Sort
 */
export type SortComparators = "string" | "number" | "date" | (string & {});

/**
 * Definition for a user-defined custom sort comparator.
 *
 * @group Sort
 */
export interface SortCustomSort<T> {
  /**
   * The column identifier associated with the sort. May be null if not defined.
   *
   * @group Sort
   */
  readonly columnId: string | null;

  /**
   * Discriminant for the custom sort type.
   */
  readonly kind: "custom";

  /**
   * The comparator function used for custom sorting.
   */
  readonly comparator: SortComparatorFn<T>;

  /**
   * Optional configuration for the custom comparator.
   */
  readonly options?: any;
}

/**
 * A built-in date sort model definition.
 *
 * @group Sort
 */
export interface SortDateColumnSort {
  /**
   * Discriminant for the date sort type.
   */
  readonly kind: "date";

  /**
   * Optional date comparator options.
   */
  readonly options?: SortDateComparatorOptions;
}

/**
 * Options used for date-based sorting.
 *
 * @group Sort
 */
export interface SortDateComparatorOptions {
  /**
   * A boolean indicating if null values should appear first in the sort order.
   *
   * @group Sort
   */
  readonly nullsFirst?: boolean;

  /**
   * A function to convert a value to an ISO date string.
   */
  readonly toIsoDateString?: (v: unknown) => string;

  /**
   * Whether to include the time portion of the date during comparison.
   */
  readonly includeTime?: boolean;
}

/**
 * Union of all supported grid sort types.
 *
 * @group Sort
 */
export type SortGridSorts<T> =
  | SortCustomSort<T>
  | SortDateColumnSort
  | SortNumberColumnSort
  | SortStringColumnSort;

/**
 * A model item representing an active sort applied to the grid.
 *
 * @group Sort
 */
export interface SortModelItem<T> {
  /**
   * The sort type being applied.
   */
  readonly sort: SortGridSorts<T>;

  /**
   * The column identifier associated with the sort. May be null if not defined.
   *
   * @group Sort
   */
  readonly columnId: string | null;

  /**
   * Whether the sort direction is descending.
   */
  readonly isDescending?: boolean;
}

/**
 * A built-in numeric sort model definition.
 *
 * @group Sort
 */
export interface SortNumberColumnSort {
  /**
   * Discriminant for the number sort type.
   */
  readonly kind: "number";

  /**
   * Optional numeric comparator options.
   */
  readonly options?: SortNumberComparatorOptions;
}

/**
 * Options for number-based sorting.
 *
 * @group Sort
 */
export interface SortNumberComparatorOptions {
  /**
   * A boolean indicating if null values should appear first in the sort order.
   *
   * @group Sort
   */
  readonly nullsFirst?: boolean;

  /**
   * Whether to compare absolute values instead of raw numbers.
   */
  readonly absoluteValue?: boolean;
}

/**
 * A built-in string sort model definition.
 *
 * @group Sort
 */
export interface SortStringColumnSort {
  /**
   * Discriminant for the string sort type.
   */
  readonly kind: "string";

  /**
   * Optional string comparator options.
   */
  readonly options?: SortStringComparatorOptions;
}

/**
 * Options used when sorting string values.
 *
 * @group Sort
 */
export interface SortStringComparatorOptions {
  /**
   * Whether string sorting should ignore case.
   */
  readonly caseInsensitive?: boolean;

  /**
   * Whether leading/trailing whitespace should be trimmed before sorting.
   */
  readonly trimWhitespace?: boolean;

  /**
   * Whether punctuation should be ignored during sorting.
   */
  readonly ignorePunctuation?: boolean;

  /**
   * The locale used for collation-based sorting.
   */
  readonly locale?: string;

  /**
   * An optional Intl.Collator instance to use for string comparison.
   */
  readonly collator?: Intl.Collator;

  /**
   * A boolean indicating if null values should appear first in the sort order.
   *
   * @group Sort
   */
  readonly nullsFirst?: boolean;
}

/**
 * A logical grouping filter used to apply multiple filters together
 * using AND or OR logic.
 *
 * Combination filters enable complex conditional logic by nesting
 * different filters into a tree structure.
 *
 * @group Filters
 */
export interface FilterCombination {
  /**
   * Type discriminator for a combination filter.
   * Identifies this object as a logical combination of sub-filters.
   */
  readonly kind: "combination";

  /**
   * The logical operator to apply when evaluating the list of filters
   * (e.g., AND, OR).
   */
  readonly operator: FilterCombinationOperator;

  /**
   * The list of filters to combine using the specified operator.
   *
   * This list may contain any combination of core filter types,
   * including nested combination filters.
   */
  readonly filters: Array<FilterNumber | FilterString | FilterDate | FilterCombination>;
}

/**
 * Logical operators used to join multiple filters inside a combination filter.
 *
 * @group Filters
 */
export type FilterCombinationOperator = "AND" | "OR";

/**
 * A filter type for evaluating date fields in a grid dataset.
 *
 * Date filters enable both exact and relative comparisons of date values and are essential
 * for time-series or event-driven data. LyteNyte Grid expects date values to follow a standard
 * ISO string format like `"2025-02-01 12:00:11-02:00"`.
 *
 * If filtering on timestamps or partial dates, be mindful of timezone offsets and whether
 * time components are relevant to your comparison.
 *
 * @group Filters
 */
export interface FilterDate {
  /**
   * Type discriminator used to identify this filter as a date-based filter.
   *
   * Helps distinguish between multiple filter types when working with compound filters.
   */
  readonly kind: "date";

  /**
   * The comparison operator to apply. Determines how the field value is matched
   * against the provided filter `value`.
   *
   * Refer to {@link FilterDateOperator} for the complete set of options.
   */
  readonly operator: FilterDateOperator;

  /**
   * The comparison value used by the filter.
   *
   * This may be:
   * - A date string (e.g., "2025-01-01") for direct comparisons
   * - A number (e.g., 7) for relative filters like "n_days_ago"
   * - Null, for special null-matching semantics
   *
   * The exact type depends on the operator in use.
   */
  readonly value: string | number | null;

  /**
   * Optional configuration to control how the date is parsed and compared.
   *
   * For example, setting `includeTime` enables precise comparisons down to milliseconds.
   */
  readonly options?: FilterDateOptions;
}

/**
 * Set of valid comparison operators for evaluating date-based filters.
 *
 * These operators support both fixed comparisons (e.g., "equals", "before") and dynamic
 * relative date expressions (e.g., "n_days_ago", "last_week", "is_weekend").
 *
 * The required type of the `value` field depends on the selected operator.
 *
 * @group Filters
 */
export type FilterDateOperator =
  | "equals"
  | "not_equals"
  | "before"
  | "before_or_equals"
  | "after"
  | "after_or_equals"
  | "year_to_date"
  | "this_week"
  | "this_month"
  | "this_year"
  | "last_week"
  | "last_month"
  | "last_year"
  | "next_week"
  | "next_month"
  | "next_year"
  | "today"
  | "tomorrow"
  | "yesterday"
  | "week_of_year"
  | "quarter_of_year"
  | "is_weekend"
  | "is_weekday"
  | "n_days_ago"
  | "n_days_ahead"
  | "n_weeks_ago"
  | "n_weeks_ahead"
  | "n_months_ago"
  | "n_months_ahead"
  | "n_years_ago"
  | "n_years_ahead";

/**
 * Optional modifiers to customize date filter evaluation behavior.
 *
 * Includes options like null handling and whether time values should be considered
 * during comparisons.
 *
 * @group Filters
 */
export interface FilterDateOptions {
  /**
   * Controls how `null` values are treated when applying the filter.
   *
   * - `"ignore"`: Excludes rows where the value is `null`
   * - `"include"`: Retains rows with `null` values
   *
   * **Note:** Actual behavior depends on the row data source. Properly implemented sources will
   * respect this setting, but others may not. Additionally, this setting may be ignored by some
   * filter operators. For instance, equality checks may treat `null` as a valid match if it's
   * explicitly passed as the filter value.
   */
  readonly nullHandling?: "ignore" | "include";

  /**
   * If true, includes time components (hours, minutes, seconds) when comparing date values.
   *
   * By default, only the calendar date is compared. Enabling this flag allows for high-precision
   * filtering, which is useful for timestamp-based data (e.g., log entries or event schedules).
   */
  readonly includeTime?: boolean;
}

/**
 * A function-based filter used for advanced filtering logic that cannot
 * be represented using built-in filter types.
 *
 * The function should return `true` to keep a row or `false` to filter it out.
 *
 * @group Filters
 */
export type FilterFn<T> = (
  /**
   * The parameters passed to the function filter, providing row data
   * and grid context.
   */
  params: FilterFnParams<T>,
) => boolean;

/**
 * The parameters passed to a custom function filter.
 *
 * Includes both the current row's data and the overall grid configuration.
 *
 * @group Filters
 */
export interface FilterFnParams<T> {
  /**
   * The data object associated with the row. It may be `null` if the row is loading or not yet available.
   */
  readonly data: T | null;

  /**
   * A reference to the LyteNyte Grid instance.
   */
  readonly grid: Grid<T>;
}

/**
 * A functional filter definition. It provides ultimate flexibility
 * for filtering scenarios that don't conform to basic models.
 *
 * Should be used selectively and optimized for performance.
 *
 * @group Filters
 */
export interface FilterFunc<T> {
  /**
   * Type discriminator used to identify this as a function filter.
   */
  readonly kind: "func";

  /**
   * The filter function to evaluate for each row.
   */
  readonly func: FilterFn<T>;
}

/**
 * Represents a set-based filter that checks whether a value is included
 * in (or excluded from) a set of values.
 *
 * Often referred to as a "Set Filter", this is a PRO-only feature in
 * LyteNyte Grid and cannot be nested in combination filters.
 *
 * @group Filters
 */
export interface FilterIn {
  /**
   * Type discriminator used to identify this filter as an `in` filter.
   * Ensures correct handling within the filter model.
   */
  readonly kind: "in";

  /**
   * Specifies whether to include or exclude the values in the set.
   * See {@link FilterInOperator}.
   */
  readonly operator: FilterInOperator;

  /**
   * The set of allowed or disallowed values to filter against.
   *
   * Values may include strings, numbers, or nulls. The operator
   * determines how this set is interpreted.
   */
  readonly value: Set<string | number | null>;
}

/**
 * Represents a displayable filter option for use with the `in` filter UI component.
 *
 * Supports grouping and human-friendly labeling for raw filter values.
 *
 * @group Filters
 */
export interface FilterInFilterItem {
  /**
   * A unique id for the in filter item.
   */
  readonly id: string;

  /**
   * The display label for the item in the UI. Should be human-readable
   * even when the value itself is raw or technical.
   */
  readonly label: string;

  /**
   * The value to be matched in the in-filter set. Typically a string or number.
   */
  readonly value: unknown;

  /**
   * Grouping path to organize filter values into nested structures.
   *
   * This is useful for tree-based UIs where items belong to categories
   * (e.g., year > month > day).
   */
  readonly groupPath?: string[];
}

/**
 * The valid operators for an `in` filter.
 *
 * - `"in"`: Tests for inclusion in the set.
 * - `"not_in"`: Tests for exclusion from the set.
 *
 * @group Filters
 */
export type FilterInOperator = "in" | "not_in";

/**
 * The full set of filter types available in the LyteNyte Grid.
 *
 * @group Filters
 */
export type FilterModelItem<T> =
  | FilterNumber
  | FilterString
  | FilterDate
  | FilterCombination
  | FilterFunc<T>;

/**
 * Defines a filter for numeric columns.
 *
 * Applies common comparison logic to include or exclude rows based on numerical values in a specified column.
 *
 * @group Filters
 */
export interface FilterNumber {
  /**
   * Discriminant property used for type narrowing and filter dispatching.
   * Identifies this object as a number-based filter.
   */
  readonly kind: "number";

  /**
   * Operator to apply in the filter condition (e.g., `greater_than`, `equals`).
   *
   * Determines how the row value is compared to the provided `value`.
   */
  readonly operator: FilterNumberOperator;

  /**
   * Target value for the filter.
   *
   * This will be used as the right-hand operand when applying the operator to each row's value. May be `null` if specifically filtering for nulls.
   */
  readonly value: number | null;

  /**
   * Optional behavior modifiers for the filter such as absolute value comparison and null handling.
   *
   * These settings enhance precision and flexibility when filtering numerical data.
   */
  readonly options?: FilterNumberOptions;
}

/**
 * Logical operators available for number-based filtering.
 * These correspond to the traditional comparison operators, `>, <=`, etc.
 *
 *
 * @group Filters
 */
export type FilterNumberOperator =
  | "greater_than"
  | "greater_than_or_equals"
  | "less_than"
  | "less_than_or_equals"
  | "equals"
  | "not_equals";

/**
 * Optional configuration values for number filters. These options allow fine-tuning of filter behavior,
 * especially in cases involving precision or null handling.
 *
 * @group Filters
 */
export interface FilterNumberOptions {
  /**
   * If set to `true`, the filter will compare absolute values instead of signed numbers.
   *
   * Useful for scenarios where magnitude is more relevant than direction (e.g., distance, deviation).
   */
  readonly absolute?: boolean;

  /**
   * Floating-point precision buffer when evaluating comparisons.
   *
   * For example, a comparison using `epsilon = 0.0001` allows for minor rounding differences
   * when dealing with decimal values.
   */
  readonly epsilon?: number;

  /**
   * Controls how `null` values are treated when applying the filter.
   *
   * - `"ignore"`: Excludes rows where the value is `null`
   * - `"include"`: Retains rows with `null` values
   *
   * **Note:** Actual behavior depends on the row data source. Properly implemented sources will
   * respect this setting, but others may not. Additionally, this setting may be ignored by some
   * filter operators. For instance, equality checks may treat `null` as a valid match if it's
   * explicitly passed as the filter value.
   */
  readonly nullHandling?: "ignore" | "include";
}

/**
 * Sensitivity mode for the quick search functionality.
 *
 * - `"case-sensitive"`: Exact matches required.
 * - `"case-insensitive"`: Case differences are ignored.
 *
 * @group Filters
 */
export type FilterQuickSearchSensitivity = "case-sensitive" | "case-insensitive";

/**
 * Filter configuration for string-based column data.
 *
 * Supports a wide range of operators such as exact match, substring containment, regex matching, and string length comparisons.
 *
 * @group Filters
 */
export interface FilterString {
  /**
   * Type discriminant used internally to identify this as a string filter.
   * Useful when filters are stored in a mixed array.
   */
  readonly kind: "string";

  /**
   * The filtering operator (e.g., "contains", "equals", "length_greater_than").
   */
  readonly operator: FilterStringOperator;

  /**
   * The value to compare against.
   *
   * May be:
   * - `string`: for most text comparisons
   * - `number`: for length-based operators
   * - `null`: when matching absence of value
   */
  readonly value: string | number | null;

  /**
   * Optional modifiers to control filter behavior including case sensitivity, whitespace, punctuation,
   * and locale-sensitive matching.
   */
  readonly options?: FilterStringOptions;
}

/**
 * Collation configuration for locale-sensitive string comparisons.
 *
 * Used to construct an `Intl.Collator` instance, which enables proper handling of language and region-specific rules.
 *
 * @group Filters
 */
export interface FilterStringCollation {
  /**
   * The locale string to apply during comparisons (e.g., "en", "de", "zh-CN").
   * This determines how values are interpreted for culturally appropriate sorting.
   */
  readonly locale: Locale;

  /**
   * Specifies the sensitivity of character comparisons (e.g., case vs. accent differences).
   *
   * See the [Intl.Collator documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator)
   * for details on supported sensitivity levels.
   */
  readonly sensitivity?: Intl.CollatorOptions["sensitivity"];
}

/**
 * List of operators available for string filtering.
 *
 * These include comparison operators (e.g., "equals"), substring checks (e.g., "contains"), and
 * length-based checks (e.g., "length_less_than"). Some operators require a numeric `value`
 * (e.g., those dealing with string length).
 *
 * @group Filters
 */
export type FilterStringOperator =
  | "equals"
  | "not_equals"
  | "less_than"
  | "less_than_or_equals"
  | "greater_than"
  | "greater_than_or_equals"
  | "begins_with"
  | "not_begins_with"
  | "ends_with"
  | "not_ends_with"
  | "contains"
  | "not_contains"
  | "length"
  | "not_length"
  | "matches"
  | "length_less_than"
  | "length_less_than_or_equals"
  | "length_greater_than"
  | "length_greater_than_or_equals";

/**
 * Optional settings to modify the behavior of string filter evaluation.
 *
 * These provide control over how string values are matched, such as case sensitivity, whitespace trimming,
 * regular expression flags, and locale-based collation.
 *
 * @group Filters
 */
export interface FilterStringOptions {
  /**
   * Flags to apply when using the `matches` operator (e.g., "i" for case-insensitive, "g" for global).
   *
   * See the [MDN RegExp flags guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions#advanced_searching_with_flags)
   * for details.
   */
  readonly regexOpts?: string;

  /**
   * If true, trims leading and trailing whitespace from both the value and target before comparing.
   */
  readonly trimWhitespace?: boolean;

  /**
   * If true, string comparisons are case-insensitive.
   *
   * Note: Some locales may implicitly perform case-insensitive comparisons depending on `sensitivity`.
   */
  readonly caseInsensitive?: boolean;

  /**
   * If true, removes punctuation from strings before evaluating the comparison.
   */
  readonly ignorePunctuation?: boolean;

  /**
   * Controls how `null` values are treated when applying the filter.
   *
   * - `"ignore"`: Excludes rows where the value is `null`
   * - `"include"`: Retains rows with `null` values
   *
   * **Note:** Actual behavior depends on the row data source. Properly implemented sources will
   * respect this setting, but others may not. Additionally, this setting may be ignored by some
   * filter operators. For instance, equality checks may treat `null` as a valid match if it's
   * explicitly passed as the filter value.
   */
  readonly nullHandling?: "ignore" | "include";

  /**
   * Collation options to apply locale-sensitive sorting and comparison behavior using `Intl.Collator`.
   */
  readonly collation?: FilterStringCollation;
}

/**
 * The supported locale identifiers for string filtering and collation.
 *
 * Used to configure internationalized string comparison behavior.
 *
 * @group Filters
 */
export type Locale =
  | "en-US"
  | "en-GB"
  | "en-CA"
  | "en-AU"
  | "en-IN"
  | "fr-FR"
  | "fr-CA"
  | "fr-BE"
  | "fr-CH"
  | "es-ES"
  | "es-MX"
  | "es-AR"
  | "es-CO"
  | "zh-CN"
  | "zh-TW"
  | "zh-HK"
  | "zh-Hant"
  | "zh-Hans"
  | "ar-SA"
  | "ar-EG"
  | "ar-AE"
  | "de-DE"
  | "de-AT"
  | "de-CH"
  | "ja-JP"
  | "ko-KR"
  | "hi-IN"
  | "pt-BR"
  | "pt-PT"
  | "ru-RU"
  | "uk-UA"
  | "pl-PL"
  | "it-IT"
  | "nl-NL"
  | "sv-SE"
  | "tr-TR"
  | "th-TH"
  | "vi-VN"
  | "he-IL"
  | "fa-IR"
  | "el-GR";

/**
 * Defines the function signature for custom
 *   aggregation logic that computes a result based on grid data.
 *
 *   @group Row Grouping
 */
export type AggFn<T> = (
  /**
   * The input data set to be aggregated.
   */
  data: (T | null)[],
  /**
   * A reference to the LyteNyte Grid instance.
   */
  grid: Grid<T>,
) => unknown;

/**
 * Describes the aggregation model configuration.
 *   This can be either a string referencing a built-in
 *   aggregation or a custom function.
 *
 *   @group Row Grouping
 */
export type AggModelFn<T> = string | AggFn<T>;

/**
 * Enumerates the display modes available for
 *   row groups in LyteNyte Grid.
 *
 *   @group Row Grouping
 */
export type RowGroupDisplayMode = "single-column" | "multi-column" | "custom";

/**
 * Defines a field-based grouping configuration used to compute row group keys in the grid.
 *
 *   @group Row Grouping
 */
export interface RowGroupField<T> {
  /**
   * Type identifier used for discriminating group field types.
   */
  readonly kind: "field";

  /**
   * Unique identifier for this row group field.
   */
  readonly id: string;

  /**
   * The data field to be grouped by.
   */
  readonly field: FieldRowGroup<T>;

  /**
   * An optional display name for the row group field.
   */
  readonly name?: string;
}

/**
 * An item in the row group model. This can either be a column identifier (string) or a row group field definition.
 *
 *   @group Row Grouping
 */
export type RowGroupModelItem<T> = string | RowGroupField<T>;

/**
 * A callback function type for the columnMoveBegin event, fired when a column move starts.
 *
 * @group Events
 */
export type ColumnMoveBeginFn<T> = (
  /**
   * The parameters passed to the columnMoveBegin event.
   */
  params: ColumnMoveBeginParams<T>,
) => void;

/**
 * The parameters provided when a column move operation begins. This event allows the move action to be canceled.
 *
 * @group Events
 */
export interface ColumnMoveBeginParams<T> {
  /**
   * An array of column definitions representing the columns being moved during the operation.
   */
  readonly moveColumns: Column<T>[];

  /**
   * The target column reference used to determine the new insertion position for the moved columns.
   */
  readonly moveTarget: Column<T>;

  /**
   * Indicates whether the moved columns should be inserted before (`true`) or after (`false`) the target column.
   */
  readonly before: boolean;

  /**
   * Whether the moved columns should inherit the pinning state of the target column.
   */
  readonly updatePinState: boolean;

  /**
   * A reference to the LyteNyte Grid instance.
   */
  readonly grid: Grid<T>;

  /**
   * A function that, when invoked, cancels the column move operation.
   */
  readonly preventDefault: () => void;
}

/**
 * A callback function type for the columnMoveEnd event, fired when a column move completes.
 *
 * @group Events
 */
export type ColumnMoveEndFn<T> = (
  /**
   * The parameters passed to the columnMoveEnd event.
   */
  params: ColumnMoveEndParams<T>,
) => void;

/**
 * The parameters emitted when a column move operation has completed.
 *
 * @group Events
 */
export interface ColumnMoveEndParams<T> {
  /**
   * An array of column definitions representing the columns being moved during the operation.
   */
  readonly moveColumns: Column<T>[];

  /**
   * The target column reference used to determine the new insertion position for the moved columns.
   */
  readonly moveTarget: Column<T>;

  /**
   * Indicates whether the moved columns should be inserted before (`true`) or after (`false`) the target column.
   */
  readonly before: boolean;

  /**
   * Whether the moved columns should inherit the pinning state of the target column.
   */
  readonly updatePinState: boolean;

  /**
   * A reference to the LyteNyte Grid instance.
   */
  readonly grid: Grid<T>;
}

/**
 * An event fired when a cell begins editing. This provides an opportunity to cancel the edit before any changes are made.
 *
 *   @group Events
 */
export type EditBegin<T> = (
  /**
   * Details about the cell and context for the edit initiation.
   */
  params: OnEditBeginParams<T>,
) => void;

/**
 * An event fired when an in-progress cell edit is canceled. Most commonly triggered by user interaction, such as pressing the Escape key.
 *
 *   @group Events
 */
export type EditCancel<T> = (
  /**
   * Information about the cell and state at the time of cancellation.
   */
  params: OnEditCancelParams<T>,
) => void;

/**
 * An event fired when a cell finishes editing successfully (i.e., without error or cancellation).
 *
 *   @group Events
 */
export type EditEnd<T> = (
  /**
   * Details about the edit session and updated value, if applicable.
   */
  params: OnEditEndParams<T>,
) => void;

/**
 * An event fired when an error occurs during cell editing—either due to validation failure or runtime exception.
 *
 *   @group Events
 */
export type EditError<T> = (
  /**
   * Contextual details and error object associated with the failure.
   */
  params: OnEditErrorParams<T>,
) => void;

/**
 * A comprehensive map of all possible events that LyteNyte Grid may emit during its lifecycle.
 *
 * @group Events
 */
export interface GridEvents<T> {
  /**
   * Event fired when a row group expansion is about to begin. This allows canceling the expansion via preventDefault.
   */
  readonly rowExpandBegin?: RowExpandBeginFn<T>;

  /**
   * Event fired once a row group expansion has successfully completed.
   */
  readonly rowExpand?: RowExpandFn<T>;

  /**
   * Event fired if an error occurs during the row group expansion process.
   */
  readonly rowExpandError?: RowExpandErrorFn<T>;

  /**
   * Event fired when a cell begins editing. Provides an opportunity to cancel the edit action.
   */
  readonly editBegin?: EditBegin<T>;

  /**
   * Event fired when a cell edit is successfully completed.
   */
  readonly editEnd?: EditEnd<T>;

  /**
   * Event fired when cell editing is canceled, typically via keyboard action like Escape.
   */
  readonly editCancel?: EditCancel<T>;

  /**
   * Event fired if an error occurs during cell editing, such as validation failure or exception.
   */
  readonly editError?: EditError<T>;

  /**
   * Event fired when a row detail expansion is about to begin. Can be canceled.
   */
  readonly rowDetailExpansionBegin?: RowDetailExpansionBegin<T>;

  /**
   * Event fired when a row detail expansion has successfully completed.
   */
  readonly rowDetailExpansionEnd?: RowDetailExpansionEnd<T>;

  /**
   * Event fired when row selection starts. Allows preventing the selection.
   */
  readonly rowSelectBegin?: RowSelectBegin<T>;

  /**
   * Event fired when row selection has completed.
   */
  readonly rowSelectEnd?: RowSelectEnd<T>;

  /**
   * Event fired at the start of a "select all rows" operation. Can be canceled.
   */
  readonly rowSelectAllBegin?: RowSelectAllBegin<T>;

  /**
   * Event fired when a "select all rows" operation completes.
   */
  readonly rowSelectAllEnd?: RowSelectAllEnd<T>;

  /**
   * Event fired when a column drag move operation begins.
   */
  readonly columnMoveDragBegin?: ColumnMoveBeginFn<T>;

  /**
   * Event fired when a column drag move operation finishes.
   */
  readonly columnMoveDragEnd?: ColumnMoveEndFn<T>;

  /**
   * Event fired when a column move operation begins, not necessarily via drag.
   */
  readonly columnMoveBegin?: ColumnMoveBeginFn<T>;

  /**
   * Event fired when a column move operation completes.
   */
  readonly columnMoveEnd?: ColumnMoveEndFn<T>;
}

/**
 * An event fired when the row detail expansion process begins. This provides an opportunity to cancel expansion before it takes effect.
 *
 *   @group Events
 */
export type RowDetailExpansionBegin<T> = (
  /**
   * The event payload passed to the `rowDetailExpansionBegin` callback.
   */
  params: RowDetailExpansionBeginParams<T>,
) => void;

/**
 * The parameters for the `rowDetailExpansionBegin` event. This event allows preventing expansion of row detail sections by calling `preventDefault()`.
 *
 *
 *   @group Events
 */
export interface RowDetailExpansionBeginParams<T> {
  /**
   * A reference to the LyteNyte Grid instance.
   */
  readonly grid: Grid<T>;

  /**
   * A `Set` containing the row ids currently marked for detail expansion.
   */
  readonly expansions: Set<string>;

  /**
   * Call this function to cancel the row detail expansion.
   */
  readonly preventDefault: () => void;
}

/**
 * An event fired after the row detail expansion completes successfully.
 *
 *   @group Events
 */
export type RowDetailExpansionEnd<T> = (
  /**
   * The event payload passed to the `rowDetailExpansionEnd` callback.
   */
  params: RowDetailExpansionEndParams<T>,
) => void;

/**
 * The parameters for the `rowDetailExpansionEnd` event, fired once a row detail expansion operation is complete.
 *
 *
 *   @group Events
 */
export interface RowDetailExpansionEndParams<T> {
  /**
   * A reference to the LyteNyte Grid instance.
   */
  readonly grid: Grid<T>;

  /**
   * A `Set` of row ids that are currently expanded in the detail view.
   */
  readonly expansions: Set<string>;
}

/**
 * Event handler function type for the `rowExpand` event. Called when row group expansion is successfully completed.
 *
 *   @group Events
 */
export type RowExpandFn<T> = (
  /**
   * The parameters provided to the `rowExpand` event.
   */
  params: RowExpandParams<T>,
) => void;

/**
 * Event handler function type for the `rowExpandBegin` event. Triggered before row group expansion, allowing you to cancel the operation.
 *
 *   @group Events
 */
export type RowExpandBeginFn<T> = (
  /**
   * The parameters provided to the `rowExpandBegin` event.
   */
  params: RowExpandBeginParams<T>,
) => void;

/**
 * Describes the parameters passed to the `rowExpandBegin` event. This event is triggered before row group expansion occurs and provides a way to cancel the action.
 *
 * @group Events
 */
export interface RowExpandBeginParams<T> {
  /**
   * A reference to the LyteNyte Grid instance.
   */
  readonly grid: Grid<T>;

  /**
   * A map representing the current expansion state of row groups. Each key corresponds to a row id, and the value indicates whether that row group is expanded.
   */
  readonly expansions: { [rowId: string]: boolean };

  /**
   * Callback to prevent the row group from expanding. Must be explicitly invoked within the event handler.
   */
  readonly preventDefault: () => void;
}

/**
 * Event handler function type for the `rowExpandError` event. Called when row group expansion fails due to an error.
 *
 *   @group Events
 */
export type RowExpandErrorFn<T> = (
  /**
   * The parameters provided to the `rowExpandError` event.
   */
  params: RowExpandErrorParams<T>,
) => void;

/**
 * Describes the parameters passed to the `rowExpandError` event. This event is emitted when an error occurs during row group expansion.
 *
 *   @group Events
 */
export interface RowExpandErrorParams<T> {
  /**
   * A reference to the LyteNyte Grid instance.
   */
  readonly grid: Grid<T>;

  /**
   * A map representing the current expansion state of row groups. Each key corresponds to a row id, and the value indicates whether that row group is expanded.
   */
  readonly expansions: { [rowId: string]: boolean };

  /**
   * The error that was thrown or returned during row group expansion.
   */
  readonly error: unknown;
}

/**
 * Describes the parameters passed to the `rowExpand` event. This event is emitted after a row group has been successfully expanded.
 *
 *   @group Events
 */
export interface RowExpandParams<T> {
  /**
   * A reference to the LyteNyte Grid instance.
   */
  readonly grid: Grid<T>;

  /**
   * A map representing the current expansion state of row groups. Each key corresponds to a row id, and the value indicates whether that row group is expanded.
   */
  readonly expansions: { [rowId: string]: boolean };
}

/**
 * An event triggered when the "select all" operation begins. It provides an opportunity to cancel the selection.
 *
 * @group Events
 */
export type RowSelectAllBegin<T> = (
  /**
   * The parameters associated with the "select all" operation.
   */
  params: RowSelectAllBeginParams<T>,
) => void;

/**
 * The parameters provided when a "select all" operation starts. This event allows the operation to be canceled.
 *
 * @group Events
 */
export interface RowSelectAllBeginParams<T> {
  /**
   * Indicates whether the selection event represents a deselection.
   * If `true`, the row was deselected; otherwise, it was selected.
   */
  readonly deselect: boolean;

  /**
   * A reference to the LyteNyte Grid instance.
   */
  readonly grid: Grid<T>;

  /**
   * A function that, when invoked, prevents all rows from being selected.
   */
  readonly preventDefault: () => void;
}

/**
 * An event triggered once the "select all" operation is complete.
 *
 * @group Events
 */
export type RowSelectAllEnd<T> = (
  /**
   * The parameters describing the completed "select all" action.
   */
  params: RowSelectAllEndParams<T>,
) => void;

/**
 * The parameters passed when a "select all" operation completes.
 *
 * @group Events
 */
export interface RowSelectAllEndParams<T> {
  /**
   * Indicates whether the selection event represents a deselection.
   * If `true`, the row was deselected; otherwise, it was selected.
   */
  readonly deselect: boolean;

  /**
   * A reference to the LyteNyte Grid instance.
   */
  readonly grid: Grid<T>;
}

/**
 * An event triggered when a row selection starts. This event allows cancellation before the selection is finalized.
 *
 * @group Events
 */
export type RowSelectBegin<T> = (
  /**
   * The parameters describing the row selection attempt.
   */
  params: RowSelectBeginParams<T>,
) => void;

/**
 * The parameters provided when a row selection begins. This event occurs before the selection change takes effect,
 * giving the caller an opportunity to prevent it.
 *
 * @group Events
 */
export interface RowSelectBeginParams<T> {
  /**
   * The id of the row that was selected or deselected during the selection event.
   */
  readonly selected: string;

  /**
   * A reference to the LyteNyte Grid instance.
   */
  readonly grid: Grid<T>;

  /**
   * Indicates whether the selection event represents a deselection.
   * If `true`, the row was deselected; otherwise, it was selected.
   */
  readonly deselect: boolean;

  /**
   * A function that, when called, cancels the row selection operation.
   */
  readonly preventDefault: () => void;
}

/**
 * An event triggered once the row selection is finalized.
 *
 * @group Events
 */
export type RowSelectEnd<T> = (
  /**
   * The parameters describing the completed row selection.
   */
  params: RowSelectEndParams<T>,
) => void;

/**
 * The parameters passed when a row selection has completed.
 *
 * @group Events
 */
export interface RowSelectEndParams<T> {
  /**
   * The id of the row that was selected or deselected during the selection event.
   */
  readonly selected: string;

  /**
   * A reference to the LyteNyte Grid instance.
   */
  readonly grid: Grid<T>;

  /**
   * Indicates whether the selection event represents a deselection.
   * If `true`, the row was deselected; otherwise, it was selected.
   */
  readonly deselect: boolean;
}

/**
 * A function used to render the content of a header cell.
 *   It receives renderer parameters and returns a ReactNode to render.
 *
 *   @group Column Header
 */
export type HeaderCellRendererFn<T> = (
  /**
   * Parameters provided to the header cell renderer, including grid context and the target column.
   */
  params: HeaderCellRendererParams<T>,
) => ReactNode;

/**
 * Parameters passed to the header cell renderer function. This
 *   provides access to the grid and column for rendering context.
 *
 *   @group Column Header
 */
export interface HeaderCellRendererParams<T> {
  /**
   * A reference to the LyteNyte Grid instance.
   */
  readonly grid: Grid<T>;

  /**
   * A reference to a column definition in LyteNyte Grid.
   */
  readonly column: Column<T>;
}

/**
 * Renderer function for floating header cells. Returns the visual
 *   contents for floating headers using provided parameters.
 *
 *   @group Column Header
 */
export type HeaderFloatingCellRendererFn<T> = (
  /**
   * Parameters passed to the floating cell renderer function, including grid and column information.
   */
  params: HeaderFloatingCellRendererParams<T>,
) => ReactNode;

/**
 * Parameters passed to the floating cell renderer. Provides grid
 *   and column context to determine what should be rendered.
 *
 *   @group Column Header
 */
export interface HeaderFloatingCellRendererParams<T> {
  /**
   * A reference to the LyteNyte Grid instance.
   */
  readonly grid: Grid<T>;

  /**
   * A reference to a column definition in LyteNyte Grid.
   */
  readonly column: Column<T>;
}

/**
 * Floating header cell renderer reference. Can be a string
 *   referencing a registered floating renderer or a function used directly by the column.
 *
 *   @group Column Header
 */
export type HeaderFloatingCellRenderer<T> = string | HeaderFloatingCellRendererFn<T>;

/**
 * Header cell renderer reference. This may be a registered renderer
 *   name (string) or a renderer function. If a string is used, it should match a renderer registered in the grid state.
 *
 *   @group Column Header
 */
export type HeaderCellRenderer<T> = string | HeaderCellRendererFn<T>;

/**
 * Describes the currently active cell position if editing is in progress.
 *
 * When no edit is active, this will be `undefined`.
 *
 * @group Cell Edit
 */
export interface EditActivePosition<T> {
  /**
   * The zero-based index of the row.
   */
  readonly rowIndex: number;

  /**
   * A reference to a column definition in LyteNyte Grid.
   */
  readonly column: Column<T>;
}

/**
 * Parameters accepted by the `editBegin` method to start editing a specific cell.
 *
 * @group Cell Edit
 */
export interface EditBeginParams<T> {
  /**
   * Optional override value to use as the initial edit value. Defaults to the cell's
   * current value.
   */
  readonly init?: any;

  /**
   * A flexible reference to a column, which can be a column object, its id (string), or its index (number).
   */
  readonly column: Column<T> | string | number;

  /**
   * The zero-based index of the row.
   */
  readonly rowIndex: number;
}

/**
 * Controls whether a grid operates in inline editing mode:
 *
 * - `"cell"`: Editing is active and inline
 * - `"readonly"`: Editing is disabled entirely
 *
 * @group Cell Edit
 */
export type EditCellMode = "cell" | "readonly";

/**
 * Specifies what kind of mouse interaction should initiate editing:
 *
 * - `"single"`: Single click
 * - `"double-click"`: Double click
 * - `"none"`: Editing must be started via API or programmatically
 *
 *
 * @group Cell Edit
 */
export type EditClickActivator = "single" | "double-click" | "none";

/**
 * Defines the edit renderer for a column.
 *
 * Can be either:
 * - A string key referencing a registered editor component
 * - A function of type {@link EditRendererFn} for custom rendering logic
 *
 * @group Cell Edit
 */
export type EditRenderer<T> = string | EditRendererFn<T>;

/**
 * A function that returns a React component to be rendered in edit mode for a given cell.
 *
 * Used for customizing editing UI. If omitted, a default HTML input will be used.
 *
 * @group Cell Edit
 */
export type EditRendererFn<T> = (
  /**
   * Parameters passed to the edit renderer. See {@link EditRendererFnParams}.
   */
  params: EditRendererFnParams<T>,
) => ReactNode;

/**
 * Input parameters for the {@link EditRendererFn}, used to render the edit UI for a cell.
 *
 * These include positional and contextual data such as row, column, value, and grid
 * instance, along with row validation status and change handlers.
 *
 * @group Cell Edit
 */
export interface EditRendererFnParams<T> {
  /**
   * The zero-based index of the row.
   */
  readonly rowIndex: number;

  /**
   * The row node instance in LyteNyte Grid.
   */
  readonly row: RowNode<T>;

  /**
   * A reference to the LyteNyte Grid instance.
   */
  readonly grid: Grid<T>;

  /**
   * A reference to a column definition in LyteNyte Grid.
   */
  readonly column: Column<T>;

  /**
   * Tracks the row's current validation status while editing.
   *
   * - `false`: validation failed
   * - `true` or `null`: validation passed or hasn't run
   * - `Record<string, any>`: failed with details per column
   *
   * @group Cell Edit
   */
  readonly rowValidationState: Record<string, any> | boolean | null;

  /**
   * The value currently being edited in the active cell.
   *
   * Managed internally by the grid, but should be aligned with the expected shape of your
   * application's data model.
   *
   * @group Cell Edit
   */
  readonly value: any;

  /**
   * A callback that must be called with the new value when the user changes the input.
   *
   * This triggers internal grid state updates and row validation.
   */
  readonly onChange: (c: any) => void;
}

/**
 * A function that validates a fully edited row.
 *
 * Supports synchronous or object-based results for per-column validation. Must return:
 *
 * - `true` or `null` if the row is valid
 * - `false` or a `Record<string, any>` describing errors if invalid
 *
 * @group Cell Edit
 */
export type EditRowValidatorFn<T> = (
  /**
   * Inputs to the validator. See {@link EditRowValidatorFnParams}.
   */
  params: EditRowValidatorFnParams<T>,
) => Record<string, any> | boolean;

/**
 * Input arguments passed to {@link EditRowValidatorFn}.
 *
 * Used to perform validation on the entire row during or after edit submission.
 *
 * @group Cell Edit
 */
export interface EditRowValidatorFnParams<T> {
  /**
   * A reference to the LyteNyte Grid instance.
   */
  readonly grid: Grid<T>;

  /**
   * The row node instance in LyteNyte Grid.
   */
  readonly row: RowNode<T>;

  /**
   * The zero-based index of the row.
   */
  readonly rowIndex: number;

  /**
   * The row data to validate.
   */
  readonly data: any;
}

/**
 * A function that returns a new row object based on the edited cell value.
 *
 * Required when dealing with nested, computed, or non-primitive values that the grid
 * cannot update automatically.
 *
 * @group Cell Edit
 */
export type EditSetterFn<T> = (
  /**
   * The parameters for the edit setter. See {@link EditSetterParams}.
   */
  params: EditSetterParams<T>,
) => any;

/**
 * Input parameters passed to an {@link EditSetterFn}.
 *
 * Provides the context needed to compute and apply new row data based on edit input.
 *
 * @group Cell Edit
 */
export interface EditSetterParams<T> {
  /**
   * A reference to the LyteNyte Grid instance.
   */
  readonly grid: Grid<T>;

  /**
   * The row node instance in LyteNyte Grid.
   */
  readonly row: RowNode<T>;

  /**
   * The zero-based index of the row.
   */
  readonly rowIndex: number;

  /**
   * A reference to a column definition in LyteNyte Grid.
   */
  readonly column: Column<T>;

  /**
   * The current edit value of the cell being edited. Useful when the cell is derived from data and not
   * actually present in the row data.
   */
  readonly value: any;

  /**
   * The new row data after applying edits. This is an intermediate representation,
   * not yet committed to the grid.
   */
  readonly data: any;
}

/**
 * Parameters passed to the `editUpdate` method, used to submit a value change.
 *
 * @group Cell Edit
 */
export interface EditUpdateParams<T> {
  /**
   * The value to apply to the cell. It will go through normal validation and update
   * handling.
   */
  readonly value: any;

  /**
   * A flexible reference to a column, which can be a column object, its id (string), or its index (number).
   */
  readonly column: Column<T> | string | number;

  /**
   * The zero-based index of the row.
   */
  readonly rowIndex: number;
}

/**
 * A column-level property that controls editability of cells.
 *
 * - Use `true` to enable editing for all rows.
 * - Use {@link EditableFn} for conditional, row-specific editability.
 *
 * @group Cell Edit
 */
export type Editable<T> = boolean | EditableFn<T>;

/**
 * A predicate function that determines whether a particular cell is editable.
 *
 * If cell editing is enabled in LyteNyte Grid, this function is evaluated per cell. Use
 * `true` for globally editable columns or {@link EditableFn} for row-specific logic.
 *
 * @group Cell Edit
 */
export type EditableFn<T> = (
  /**
   * The parameters passed to the editable function. See {@link EditableFnParams}.
   */
  params: EditableFnParams<T>,
) => boolean;

/**
 * Parameters passed to {@link EditableFn}, the predicate function used to determine
 * if a specific cell in the grid is editable.
 *
 * These include the row index, the row node object, the grid instance, and the column
 * definition.
 *
 * @group Cell Edit
 */
export interface EditableFnParams<T> {
  /**
   * The zero-based index of the row.
   */
  readonly rowIndex: number;

  /**
   * The row node instance in LyteNyte Grid.
   */
  readonly row: RowNode<T>;

  /**
   * A reference to the LyteNyte Grid instance.
   */
  readonly grid: Grid<T>;

  /**
   * A reference to a column definition in LyteNyte Grid.
   */
  readonly column: Column<T>;
}

/**
 * Parameters dispatched with the `onEditBegin` event, triggered when editing starts.
 *
 * @group Events
 */
export interface OnEditBeginParams<T> {
  /**
   * A reference to a column definition in LyteNyte Grid.
   */
  readonly column: Column<T>;

  /**
   * The zero-based index of the row.
   */
  readonly rowIndex: number;

  /**
   * Call this method to cancel edit initiation. Editing will not start if called.
   */
  readonly preventDefault: () => void;
}

/**
 * Parameters passed to the `onEditCancel` event, triggered when editing is aborted (e.g., Escape key).
 *
 * @group Events
 */
export interface OnEditCancelParams<T> {
  /**
   * A reference to a column definition in LyteNyte Grid.
   */
  readonly column: Column<T>;

  /**
   * The zero-based index of the row.
   */
  readonly rowIndex: number;

  /**
   * The current value of the cell during an edit interaction.
   *
   * @group Events
   */
  readonly data: any;
}

/**
 * Parameters passed to the `onEditEnd` event, triggered when editing successfully completes.
 *
 * @group Events
 */
export interface OnEditEndParams<T> {
  /**
   * A reference to a column definition in LyteNyte Grid.
   */
  readonly column: Column<T>;

  /**
   * The zero-based index of the row.
   */
  readonly rowIndex: number;

  /**
   * The current value of the cell during an edit interaction.
   *
   * @group Events
   */
  readonly data: any;
}

/**
 * Parameters passed to the `onEditError` event, triggered when validation or logic errors occur during editing.
 *
 * @group Events
 */
export interface OnEditErrorParams<T> {
  /**
   * A reference to a column definition in LyteNyte Grid.
   */
  readonly column: Column<T>;

  /**
   * The zero-based index of the row.
   */
  readonly rowIndex: number;

  /**
   * The current value of the cell during an edit interaction.
   *
   * @group Events
   */
  readonly data: any;

  /**
   * Outcome of the row validator.
   * Can be `false` (invalid) or a record describing per-column issues.
   */
  readonly validation: Record<string, any> | boolean;

  /**
   * Any uncaught exception encountered while applying the edit.
   */
  readonly error?: unknown;
}

/**
 * Describes the focus position of a floating header cell.
 *
 *   @group Navigation
 */
export interface PositionFloatingCell {
  /**
   * Discriminant for identifying this as a floating header cell.
   */
  readonly kind: "floating-cell";

  /**
   * The zero-based index of the column.
   */
  readonly colIndex: number;
}

/**
 * Describes the focus position when a full width row is active.
 *
 *   @group Navigation
 */
export interface PositionFullWidthRow {
  /**
   * Discriminant indicating this position refers to a full width row.
   */
  readonly kind: "full-width";

  /**
   * The zero-based index of the row.
   */
  readonly rowIndex: number;

  /**
   * The zero-based index of the column.
   */
  readonly colIndex: number;
}

/**
 * Represents the current focus position of a regular cell in the grid.
 *
 *   @group Navigation
 */
export interface PositionGridCell {
  /**
   * Discriminant for identifying this as a regular grid cell position.
   */
  readonly kind: "cell";

  /**
   * The zero-based index of the row.
   */
  readonly rowIndex: number;

  /**
   * The zero-based index of the column.
   */
  readonly colIndex: number;

  /**
   * Reference to the root cell. If `null`, this cell is not hidden by spanning and is its own root.
   */
  readonly root: PositionGridCellRoot | null;
}

/**
 * The root reference of a grid cell. If a cell is obscured by a rowspan
 *   or colspan, it points to the actual root cell containing the data.
 *
 *   @group Navigation
 */
export interface PositionGridCellRoot {
  /**
   * The zero-based index of the column.
   */
  readonly colIndex: number;

  /**
   * The zero-based index of the row.
   */
  readonly rowIndex: number;

  /**
   * The number of rows spanned by the root cell.
   */
  readonly rowSpan: number;

  /**
   * The number of columns spanned by the root cell.
   */
  readonly colSpan: number;
}

/**
 * Describes the focus position of a standard header cell.
 *
 *   @group Navigation
 */
export interface PositionHeaderCell {
  /**
   * Discriminant for identifying this as a header cell position.
   */
  readonly kind: "header-cell";

  /**
   * The zero-based index of the column.
   */
  readonly colIndex: number;
}

/**
 * Describes the focus position of a header group cell in the column hierarchy.
 *
 *   @group Navigation
 */
export interface PositionHeaderGroupCell {
  /**
   * Discriminant indicating this is a header group cell.
   */
  readonly kind: "header-group-cell";

  /**
   * The inclusive start index of the group column range.
   */
  readonly columnStartIndex: number;

  /**
   * The exclusive end index of the group column range.
   */
  readonly columnEndIndex: number;

  /**
   * The header hierarchy row index of the group.
   */
  readonly hierarchyRowIndex: number;

  /**
   * The zero-based index of the column.
   */
  readonly colIndex: number;
}

/**
 * Union of all valid focusable positions in the grid: cells, headers, full width rows, etc.
 *
 *   @group Navigation
 */
export type PositionUnion =
  | PositionGridCell
  | PositionFloatingCell
  | PositionHeaderCell
  | PositionFullWidthRow
  | PositionHeaderGroupCell;

/**
 * Specifies the height of the row detail section.
 *   Can be a fixed number of pixels or "auto" to size based on content.
 *
 *   @group Row Data Source
 */
export type RowDetailHeight = number | "auto";

/**
 * A function used to render custom row detail content.
 *   It should return a ReactNode to be displayed in the row's
 *   expanded detail area.
 *
 *   @group Row Data Source
 */
export type RowDetailRendererFn<T> = (
  /**
   * The parameters passed into the row detail renderer function.
   */
  params: RowDetailRendererParams<T>,
) => ReactNode;

/**
 * Defines the parameters passed to a row detail renderer. These parameters
 *   include the row index, the row node metadata,
 *   and a reference to the grid instance.
 *
 *   @group Row Data Source
 */
export interface RowDetailRendererParams<T> {
  /**
   * The zero-based index of the row.
   */
  readonly rowIndex: number;

  /**
   * The row node instance in LyteNyte Grid.
   */
  readonly row: RowNode<T>;

  /**
   * A reference to the LyteNyte Grid instance.
   */
  readonly grid: Grid<T>;
}

/**
 * Options for performing bulk selection or deselection of all rows.
 *
 * @group Row Selection
 */
export interface RowSelectAllOptions {
  /**
   * If true, all rows will be deselected rather than selected.
   */
  readonly deselect?: boolean;
}

/**
 * Configuration options used when performing row selection operations.
 *
 * @group Row Selection
 */
export interface RowSelectOptions {
  /**
   * The unique identifier of the row to be selected.
   */
  readonly selected: string;

  /**
   * Sets the pivot row for range selections. Useful for extending selection ranges.
   */
  readonly pivot?: string;

  /**
   * When true, selects the range of rows between the pivot and the selected row.
   */
  readonly selectBetweenPivot?: boolean;

  /**
   * If true, the specified row will be deselected instead of selected.
   */
  readonly deselect?: boolean;

  /**
   * If true, any child rows associated with the selected row will also be selected.
   */
  readonly selectChildren?: boolean;
}

/**
 * Defines the interaction behavior that activates row selection.
 *   - "single-click" selects a row with a single mouse click.
 *   - "double-click" requires a double-click to select.
 *   - "none" disables interaction-based row selection.
 *
 *   @group Row Selection
 */
export type RowSelectionActivator = "single-click" | "double-click" | "none";

/**
 * Specifies the available row selection modes supported by LyteNyte Grid.
 *   - "single" allows only one row to be selected at a time.
 *   - "multiple" allows multiple row selections.
 *   - "none" disables row selection entirely.
 *
 *   @group Row Selection
 */
export type RowSelectionMode = "single" | "multiple" | "none";

/**
 * Contains data associated with a drag operation,
 *   including transferable and site-local information.
 *
 *   @group Row Drag
 */
export interface DragData {
  /**
   * Data that remains local to the site and is
   *       not transferred via the drag event's DataTransfer object.
   */
  readonly siteLocalData?: Record<string, any>;

  /**
   * String-based key-value pairs to be transferred with the drag event.
   */
  readonly dataTransfer?: Record<string, string>;
}

/**
 * Callback function executed during a drag event.
 *
 *   @group Row Drag
 */
export type DragEventFn = (
  /**
   * Arguments received during the drag event.
   */
  params: DragEventParams,
) => void;

/**
 * Arguments passed during a drag event lifecycle.
 *
 *   @group Row Drag
 */
export interface DragEventParams {
  /**
   * Current drag state data.
   */
  readonly state: DragData;

  /**
   * Current cursor position during the drag.
   */
  readonly position: DragPosition;

  /**
   * The HTML element currently being dragged.
   */
  readonly dragElement: HTMLElement;
}

/**
 * Function to render the drag placeholder UI. This UI
 *   is rendered in isolation and does not respond to app state changes.
 *
 *   @group Row Drag
 */
export type DragPlaceholderFn<T> = (
  /**
   * Parameters for rendering the placeholder.
   */
  params: DragPlaceholderParams<T>,
) => ReactNode;

/**
 * Parameters passed when rendering the drag placeholder content.
 *
 * @group Row Drag
 */
export interface DragPlaceholderParams<T> {
  /**
   * A reference to the LyteNyte Grid instance.
   */
  readonly grid: Grid<T>;

  /**
   * The data associated with the current drag session.
   */
  readonly dragData: DragData;
}

/**
 * Represents the current pointer position during a drag operation.
 *
 *   @group Row Drag
 */
export interface DragPosition {
  /**
   * Client X coordinate.
   */
  readonly x: number;

  /**
   * Client Y coordinate.
   */
  readonly y: number;
}

/**
 * Fired when a drop action is finalized and the dragged element is released over a drop zone.
 *
 * @group Row Drag
 */
export type DropEventFn = (
  /**
   * The parameters passed to the drop event function.
   */
  params: DropEventParams,
) => void;

/**
 * Represents the full context passed to the drop event handler.
 *
 * @group Row Drag
 */
export interface DropEventParams {
  /**
   * The drag data at the time of drop.
   */
  readonly state: DragData;

  /**
   * Details the last-known drag position and target info before drop.
   */
  readonly moveState: DragMoveState;

  /**
   * The HTML element onto which the drop occurred.
   */
  readonly dropElement: HTMLElement;

  /**
   * The HTML element that was dragged.
   */
  readonly dragElement: HTMLElement;
}

/**
 * Describes the final state of a drag-and-drop move operation.
 *
 *   @group Row Drag
 */
export interface DragMoveState {
  /**
   * Indicates if the drag was initiated via keyboard.
   */
  readonly isKeyboard: boolean;

  /**
   * X coordinate of the drop.
   */
  readonly x: number;

  /**
   * Y coordinate of the drop.
   */
  readonly y: number;

  /**
   * Element into which the drag was dropped.
   */
  readonly dropElement: HTMLElement;

  /**
   * Element that was being dragged.
   */
  readonly dragElement: HTMLElement;

  /**
   * Bounding rectangle of the drop target.
   */
  readonly rect: DOMRect;

  /**
   * True if the drop occurred in the top half of the element.
   */
  readonly topHalf: boolean;

  /**
   * True if the drop occurred in the left half of the element.
   */
  readonly leftHalf: boolean;
}

/**
 * Function used to provide the data that will be associated with a drag operation.
 *
 *   @group Row Drag
 */
export type GetDragDataFn<T> = (
  /**
   * Parameters passed to the function that generates drag data.
   */
  params: GetDragDataParams<T>,
) => DragData;

/**
 * Defines the input parameters for the function
 *   that provides data during a drag operation.
 *
 *   @group Row Drag
 */
export interface GetDragDataParams<T> {
  /**
   * A reference to the LyteNyte Grid instance.
   */
  readonly grid: Grid<T>;

  /**
   * The row node instance in LyteNyte Grid.
   */
  readonly row: RowNode<T>;
}

/**
 * Parameters for configuring drag behavior using a React hook.
 *
 * @group Row Drag
 */
export interface UseRowDragParams<T> {
  /**
   * Function to compute the drag payload when dragging begins.
   */
  readonly getDragData: GetDragDataFn<T>;

  /**
   * Invoked frequently as the drag position updates.
   */
  readonly onDragMove?: DragEventFn;

  /**
   * Called at the beginning of a drag operation.
   */
  readonly onDragStart?: DragEventFn;

  /**
   * Called at the end of a drag operation, regardless of drop.
   */
  readonly onDragEnd?: DragEventFn;

  /**
   * Triggered when the drag results in a drop.
   */
  readonly onDrop?: DropEventFn;

  /**
   * Function to generate placeholder content for the drag preview.
   */
  readonly placeholder?: DragPlaceholderFn<T>;

  /**
   * Offset [x, y] in pixels from the cursor position for rendering the drag placeholder.
   */
  readonly placeholderOffset?: [number, number];

  /**
   * Keyboard key used to initiate drag mode.
   */
  readonly keyActivate?: string;

  /**
   * Keyboard key used to move to the next drop zone.
   */
  readonly keyNext?: string;

  /**
   * Keyboard key used to move to the previous drop zone.
   */
  readonly keyPrev?: string;

  /**
   * Keyboard key used to execute the drop.
   */
  readonly keyDrop?: string;

  /**
   * Accessible label describing how to perform the drag operation.
   */
  readonly dragInstructions?: string;

  /**
   * Screen reader message to announce drag start.
   */
  readonly announceDragStart?: string;

  /**
   * Screen reader message to announce drag end.
   */
  readonly announceDragEnd?: string;
}

/**
 * Represents a rectangular selection of cells in LyteNyte Grid.
 *
 * A DataRect defines its range by numerical row and column indices. It is used to extract
 * or operate on a subset of the grid's data regardless of row or column reordering. However,
 * if the number of rows or columns changes, the rect may be invalidated if it extends
 * beyond the new bounds.
 *
 * @group Export
 */
export interface DataRect {
  /**
   * The starting row index (inclusive).
   */
  readonly rowStart: number;

  /**
   * The ending row index (exclusive).
   */
  readonly rowEnd: number;

  /**
   * The starting column index (inclusive).
   */
  readonly columnStart: number;

  /**
   * The ending column index (exclusive).
   */
  readonly columnEnd: number;
}

/**
 * Parameters for exporting a CSV file from LyteNyte Grid.
 *
 * @group Export
 */
export interface ExportCsvParams {
  /**
   * Whether to include column headers in the CSV output.
   */
  readonly includeHeader?: boolean;

  /**
   * Whether to include column group headers in the CSV output.
   */
  readonly includeGroupHeaders?: boolean;

  /**
   * Whether group headers should be rendered as uniform-length arrays.
   */
  readonly uniformGroupHeaders?: boolean;

  /**
   * Delimiter character to use for separating values in the CSV output.
   */
  readonly delimiter?: string;

  /**
   * Optional DataRect specifying the area to export.
   *
   * If not provided, the grid exports the currently visible data range.
   */
  readonly dataRect?: DataRect;
}

/**
 * Signature for the function that exports a DataRect from the grid.
 *
 * Called via the LyteNyte Grid API when exporting a selection of cells.
 *
 * @group Export
 */
export type ExportDataRectFn<T> = (
  /**
   * Optional parameters for exporting a DataRect.
   */
  params: ExportDataRectParams,
) => Promise<ExportDataRectResult<T>>;

/**
 * Parameters for exporting a specific rectangular region of the grid using a DataRect.
 *
 * @group Export
 */
export interface ExportDataRectParams {
  /**
   * The specific DataRect to export. If omitted, the grid may default to a visible range.
   */
  readonly dataRect?: DataRect;

  /**
   * Whether group headers should be returned as symmetrical arrays (i.e., uniform across rows).
   *
   * Useful when dealing with column groups that span multiple columns.
   */
  readonly uniformGroupHeaders?: boolean;
}

/**
 * The result structure returned after exporting a DataRect from LyteNyte Grid.
 *
 * @group Export
 */
export interface ExportDataRectResult<T> {
  /**
   * An array of header ids for the exported columns.
   */
  readonly headers: string[];

  /**
   * A matrix of group header labels corresponding to the exported columns.
   */
  readonly groupHeaders: (string | null)[][];

  /**
   * The 2D data matrix for the selected cells. Row and column spans are not applied.
   */
  readonly data: unknown[][];

  /**
   * The column definitions associated with the exported data.
   */
  readonly columns: Column<T>[];
}

/**
 * Configuration for the column dimension of a pivot.
 *
 * Each item defines a field whose values will be used to generate dynamic columns in the pivot view.
 *
 * @group Column Pivots
 */
export interface ColumnPivotColumnItem {
  /**
   * The column id used to generate pivoted columns.
   */
  readonly field: string;

  /**
   * Determines whether this column pivot is currently active.
   *
   * Defaults to `true`.
   */
  readonly active?: boolean;
}

/**
 * The full configuration model for column pivoting in LyteNyte Grid.
 *
 * This includes row grouping, column generation, value aggregation, and sort/filter
 * configuration for the pivoted result.
 *
 * @group Column Pivots
 */
export interface ColumnPivotModel<T> {
  /**
   * Row-level groupings for the pivot. See {@link ColumnPivotRowItem}.
   */
  readonly rows: ColumnPivotRowItem[];

  /**
   * Fields to pivot on for generating dynamic columns. See {@link ColumnPivotColumnItem}.
   */
  readonly columns: ColumnPivotColumnItem[];

  /**
   * The value items (measures) to compute and display in the pivot result.
   *
   * Each value is aggregated for every dynamic column combination created by the pivot.
   * See {@link ColumnPivotValueItem}.
   */
  readonly values: ColumnPivotValueItem<T>[];

  /**
   * Sort configuration for the pivot result view.
   *
   * The sort keys must match dynamically generated pivot column ids.
   */
  readonly sorts: SortModelItem<T>[];

  /**
   * Filter configuration for the pivot view.
   *
   * Like the sort model, filters apply to the dynamically generated pivot columns.
   */
  readonly filters: Record<string, FilterModelItem<T>>;

  /**
   * In Filter configuration for the pivot view.
   *
   * Like the sort model, in filters apply to the dynamically generated pivot columns.
   */
  readonly filtersIn: Record<string, FilterIn>;
}

/**
 * Configuration for row-level grouping in a column pivot model.
 *
 * These items define which fields should be used to group rows before creating pivot columns.
 *
 * @group Column Pivots
 */
export interface ColumnPivotRowItem {
  /**
   * The column id to group rows by.
   */
  readonly field: string;

  /**
   * Indicates whether this grouping is active.
   *
   * Defaults to `true`. Set to `false` to temporarily disable this row grouping without removing it.
   */
  readonly active?: boolean;
}

/**
 * Configuration for value fields in a pivot (also known as measures).
 *
 * These values define what numeric or aggregate data should be shown for each cell in the pivot result.
 *
 * @group Column Pivots
 */
export interface ColumnPivotValueItem<T> {
  /**
   * The column id representing the value to aggregate.
   */
  readonly field: string;

  /**
   * The aggregation function to apply to the value. See {@link AggModelFn}.
   */
  readonly aggFn: AggModelFn<T>;

  /**
   * Indicates whether this value item is enabled.
   *
   * Defaults to `true`. Set to `false` to exclude this value from the pivot result.
   */
  readonly active?: boolean;
}

/**
 * Defines a dialog frame configuration used by LyteNyte Grid.
 *
 *   This structure is passed to grid internals to associate a rendering component
 *   for dialogs triggered by grid interactions.
 *
 *   @group Frames
 */
export interface DialogFrame<T> {
  /**
   * Component renderer function to use for this dialog frame.
   */
  readonly component: DialogFrameRenderer<T>;
}

/**
 * Function responsible for rendering a dialog component.
 *
 *   LyteNyte Grid does not provide a dialog component by default. Instead, it expects
 *   developers to use their preferred dialog libraries. This renderer function receives
 *   control parameters and should return a valid ReactNode to render as a dialog.
 *
 *   Note: The dialog component used should support controlled open/close behavior.
 *
 *   @group Frames
 */
export type DialogFrameRenderer<T> = (
  /**
   * Parameters passed into the renderer, including grid and frame info.
   */
  params: DialogFrameRendererParams<T>,
) => ReactNode;

/**
 * Parameters provided to the dialog frame renderer function.
 *
 *   These include the grid context, the frame being rendered, and any additional
 *   user-provided context.
 *
 *   @group Frames
 */
export interface DialogFrameRendererParams<T> {
  /**
   * A reference to the LyteNyte Grid instance.
   */
  readonly grid: Grid<T>;

  /**
   * Custom context data passed to the frame being rendered.
   *
   *   This context is supplied programmatically at the point of invoking the frame.
   *   It can contain any arbitrary information required for rendering behavior.
   *
   *   @group Frames
   */
  readonly context?: any;

  /**
   * The dialog frame definition currently being rendered.
   */
  readonly frame: DialogFrame<T>;
}

/**
 * Describes a popover frame and the component renderer used to display it.
 *
 *   The popover frame is triggered by LyteNyte Grid interactions and used to display
 *   contextual information, editors, or auxiliary UI near a cell or element.
 *
 *   @group Frames
 */
export interface PopoverFrame<T> {
  /**
   * Renderer function to generate the popover content.
   */
  readonly component: PopoverFrameRenderer<T>;
}

/**
 * Function that renders a popover component for a given context.
 *
 *   LyteNyte Grid does not include a built-in popover renderer. Developers must use their
 *   own popover UI libraries and integrate them by implementing this renderer interface.
 *
 *   @group Frames
 */
export type PopoverFrameRenderer<T> = (
  /**
   * The parameters to be passed into the popover renderer.
   */
  params: PopoverFrameRendererParams<T>,
) => ReactNode;

/**
 * Parameters passed to the popover frame renderer function.
 *
 *   Includes information about the grid, the target HTML element or virtual
 *   target to anchor the popover, and the frame being rendered.
 *
 *   @group Frames
 */
export interface PopoverFrameRendererParams<T> {
  /**
   * A reference to the LyteNyte Grid instance.
   */
  readonly grid: Grid<T>;

  /**
   * Custom context data passed to the frame being rendered.
   *
   *   This context is supplied programmatically at the point of invoking the frame.
   *   It can contain any arbitrary information required for rendering behavior.
   *
   *   @group Frames
   */
  readonly context?: any;

  /**
   * The popover frame definition that should be rendered.
   */
  readonly frame: PopoverFrame<T>;

  /**
   * The target element or virtual position where the popover should be anchored.
   */
  readonly target: HTMLElement | VirtualTarget;
}

/**
 * Specifies the available modes for cell selection in LyteNyte Grid.
 *
 * This is a **PRO-only** feature that controls how users can interact with and select cells:
 *
 * - `"range"`: Allows a single rectangular selection of cells.
 * - `"multi-range"`: Enables multiple, possibly overlapping, independent cell selections.
 * - `"none"`: Disables all cell selection interactions.
 *
 * Useful for enabling features like copy-paste, cell highlighting, and keyboard navigation.
 *
 * @group Cell Selection
 */
export type CellSelectionMode = "range" | "multi-range" | "none";

/**
 * Fetches pivoted columns for the grid's current pivot configuration.
 *
 * @group Row Data Source
 */
export type DataColumnPivotFetcherFn<T> = (
  /**
   * The parameters provided to the column pivot fetcher.
   */
  params: DataColumnPivotFetcherParams<T>,
) => Promise<Column<T>[]>;

/**
 * Parameters passed to the column pivot fetcher function.
 *
 * @group Row Data Source
 */
export interface DataColumnPivotFetcherParams<T> {
  /**
   * A reference to the LyteNyte Grid instance.
   */
  readonly grid: Grid<T>;

  /**
   * Timestamp representing the time of the request.
   */
  readonly reqTime: number;

  /**
   * The full model describing the pivot request state.
   */
  readonly model: DataRequestModel<T>;
}

/**
 * Fetches grid row data asynchronously for the LyteNyte Server Data Source.
 *
 * @group Row Data Source
 */
export type DataFetcherFn<T> = (
  /**
   * The parameters provided to the data fetch function.
   */
  params: DataFetcherParams<T>,
) => Promise<(DataResponse | DataResponsePinned)[]>;

/**
 * Input parameters provided to a grid data fetcher function.
 *
 * @group Row Data Source
 */
export interface DataFetcherParams<T> {
  /**
   * A reference to the LyteNyte Grid instance.
   */
  readonly grid: Grid<T>;

  /**
   * Array of individual data fetch requests.
   */
  readonly requests: DataRequest[];

  /**
   * Unix timestamp representing when the request was initiated.
   */
  readonly reqTime: number;

  /**
   * The full data request model describing grid state.
   */
  readonly model: DataRequestModel<T>;
}

/**
 * Fetches items used in "in" filters from a server-side source.
 *
 * @group Row Data Source
 */
export type DataInFilterItemFetcherFn<T> = (
  /**
   * The parameters for the in-filter fetcher function.
   */
  params: DataInFilterItemFetcherParams<T>,
) => Promise<FilterInFilterItem[]> | FilterInFilterItem[];

/**
 * Parameters passed to the in-filter fetcher function.
 *
 * @group Row Data Source
 */
export interface DataInFilterItemFetcherParams<T> {
  /**
   * A reference to the LyteNyte Grid instance.
   */
  readonly grid: Grid<T>;

  /**
   * A reference to a column definition in LyteNyte Grid.
   */
  readonly column: Column<T>;

  /**
   * Timestamp for the in-filter fetch request.
   */
  readonly reqTime: number;
}

/**
 * Represents a specific request for data to an external data source.
 *
 * @group Row Data Source
 */
export interface DataRequest {
  /**
   * Unique id for the request, useful for caching and deduplication.
   */
  readonly id: string;

  /**
   * Hierarchy path for the request. An empty array represents the root level.
   */
  readonly path: (string | null)[];

  /**
   * Start offset of the requested rows, relative to the current path.
   */
  readonly start: number;

  /**
   * End offset of the requested rows, relative to the current path.
   */
  readonly end: number;

  /**
   * Grid row index where the request starts.
   */
  readonly rowStartIndex: number;

  /**
   * Grid row index where the request ends.
   */
  readonly rowEndIndex: number;
}

/**
 * Describes the current grid state used to construct a request for external data.
 *
 * @group Row Data Source
 */
export interface DataRequestModel<T> {
  /**
   * Array of column sort configurations.
   */
  readonly sorts: SortModelItem<T>[];

  /**
   * The simple filters currently applied to columns. The key of the record is the column
   *       id. It is not guaranteed that the column id in the filters is present in the columns in the grid.
   */
  readonly filters: Record<string, FilterModelItem<T>>;

  /**
   * The in (set) filters currently applied to the columns. The key of the record is the column
   *       id. It is not guaranteed that the column id in the in filters is present in the columns in the grid.
   */
  readonly filtersIn: Record<string, FilterIn>;

  /**
   * Quick search text value, or null if not in use.
   */
  readonly quickSearch: string | null;

  /**
   * Group model defining how rows are grouped.
   */
  readonly group: RowGroupModelItem<T>[];

  /**
   * Expansion state of row groups by group key.
   */
  readonly groupExpansions: Record<string, boolean | undefined>;

  /**
   * Map of aggregation functions per column.
   */
  readonly aggregations: Record<string, { fn: AggModelFn<T> }>;

  /**
   * Expansion state of pivot row groups.
   */
  readonly pivotGroupExpansions: Record<string, boolean | undefined>;

  /**
   * Indicates whether pivot mode is enabled.
   */
  readonly pivotMode: boolean;

  /**
   * Model describing current pivot column state.
   */
  readonly pivotModel: ColumnPivotModel<T>;
}

/**
 * Response object for row data from a center section request.
 *
 * @group Row Data Source
 */
export interface DataResponse {
  /**
   * Must be "center" — the section this response applies to.
   */
  readonly kind: "center";

  /**
   * Array of leaf or branch rows returned for the given path.
   */
  readonly data: (DataResponseLeafItem | DataResponseBranchItem)[];

  /**
   * Updated row count for the associated path.
   */
  readonly size: number;

  /**
   * Unix timestamp indicating when the data is valid from. Used to resolve response conflicts.
   */
  readonly asOfTime: number;

  /**
   * Hierarchy path the data belongs to. Empty array means root.
   */
  readonly path: (string | null)[];

  /**
   * Start offset within the hierarchy segment.
   */
  readonly start: number;

  /**
   * End offset within the hierarchy segment.
   */
  readonly end: number;
}

/**
 * Represents a group (branch) row returned from a data request.
 *
 * @group Row Data Source
 */
export interface DataResponseBranchItem {
  /**
   * Discriminates the item as a branch response.
   */
  readonly kind: "branch";

  /**
   * Unique identifier used to create the branch row.
   */
  readonly id: string;

  /**
   * The row data associated with this branch.
   */
  readonly data: any;

  /**
   * The key of the group the row represents.
   */
  readonly key: string | null;

  /**
   * Number of immediate children under this group.
   */
  readonly childCount: number;
}

/**
 * Represents a row of data (a leaf node) returned in a server response.
 *
 * @group Row Data Source
 */
export interface DataResponseLeafItem {
  /**
   * Type identifier for a leaf response item.
   */
  readonly kind: "leaf";

  /**
   * Unique row identifier for the grid.
   */
  readonly id: string;

  /**
   * Arbitrary data associated with this row.
   */
  readonly data: any;
}

/**
 * Response object for setting pinned row data (top or bottom).
 *
 * @group Row Data Source
 */
export interface DataResponsePinned {
  /**
   * Specifies the pinned section this data applies to: "top" or "bottom".
   */
  readonly kind: "top" | "bottom";

  /**
   * Array of leaf rows for the pinned section.
   */
  readonly data: DataResponseLeafItem[];

  /**
   * Unix timestamp indicating when the data is valid from. Used to resolve response conflicts.
   */
  readonly asOfTime: number;
}

/**
 * Parameters for configuring the server row data source.
 *
 * @group Row Data Source
 */
export interface RowDataSourceServerParams<T> {
  /**
   * Function that fetches grid data when rows are requested.
   */
  readonly dataFetcher: DataFetcherFn<T>;

  /**
   * Optional function to fetch columns when pivot mode is enabled.
   */
  readonly dataColumnPivotFetcher?: DataColumnPivotFetcherFn<T>;

  /**
   * Optional function for fetching items for in-type filters.
   */
  readonly dataInFilterItemFetcher?: DataInFilterItemFetcherFn<T>;

  /**
   * Function called to handle cell updates in the grid.
   */
  readonly cellUpdateHandler?: (updates: Map<string, any>) => void;

  /**
   * Whether cell updates should be applied optimistically.
   */
  readonly cellUpdateOptimistically?: boolean;

  /**
   * Number of rows to fetch in a single data block request.
   */
  readonly blockSize?: number;
}
