import type { InterfaceType, InterfaceTypePartial, PropertyType, UnionType } from "../+types";

const ColumnField: PropertyType = {
  kind: "property",
  name: "columnField",
  tsDoc: `Retrieves the calculated value for a specific column and row. Useful in cases where the column's 
  field is not a direct path, or when additional logic is involved in determining cell values. 
  It provides access to LyteNyte Grid's internal field evaluation pipeline.`,
  value: "(columnOrId: string | Column<T>, row: FieldDataParam<T>) => unknown",
  doc: { en: `` },
  optional: false,
};

const ColumnFromIndex: PropertyType = {
  kind: "property",
  name: "columnFromIndex",
  value: "(columnIndex: number) => Column<T> | null",
  tsDoc: `Returns the column at the specified visible index. If the index is out of bounds or 
  the column is hidden (due to visibility rules or collapsed groups), this will return null.`,
  doc: { en: `` },
  optional: false,
};

const ColumnIndex: PropertyType = {
  kind: "property",
  name: "columnIndex",
  value: "(columnOrId: string | Column<T>) => number",
  tsDoc: `Returns the index of a visible column based on its id or column object. 
  Returns -1 if the column is not currently visible (e.g., hidden or inside a collapsed group).`,
  doc: { en: `` },
  optional: false,
};

const SortForColumn: PropertyType = {
  kind: "property",
  name: "sortForColumn",
  tsDoc: `Retrieves the current sort object and its index from the sort model for a given column.
  If no sort applies to the column, returns null.`,
  doc: { en: `` },
  value: "(columnOrId: string) => { sort: SortModelItem<T>, index: number } | null",
  optional: false,
};

const RowIsLeaf: PropertyType = {
  kind: "property",
  name: "rowIsLeaf",
  tsDoc: `Type guard that determines whether a row node is a leaf node (i.e., not a group).
  Useful when working with union row types such as RowLeaf and RowGroup.`,
  doc: { en: `` },
  value: "(row: RowNode<T>) => row is RowLeaf<T>",
  optional: false,
};

const RowIsGroup: PropertyType = {
  kind: "property",
  name: "rowIsGroup",
  tsDoc: `Type guard that checks if a row node is a group. Helps distinguish between leaf and group rows.`,
  doc: { en: `` },
  value: "(row: RowNode<T>) => row is RowGroup",
  optional: false,
};

const RowGroupColumnIndex: PropertyType = {
  kind: "property",
  name: "rowGroupColumnIndex",
  tsDoc: `Returns the group index associated with a group column. Useful in header or cell renderers 
  dealing with auto-generated group columns in the grid.`,
  doc: { en: `` },
  value: "(c: Column<T>) => number",
  optional: false,
};

const RowGroupToggleExpansion: PropertyType = {
  kind: "property",
  name: "rowGroupToggle",
  tsDoc: `Toggles the expansion state of a group row. Optionally accepts a boolean state to set 
  expansion explicitly. This method triggers the row group expansion lifecycle.`,
  doc: { en: `` },
  value: "(row: RowGroup, state?: boolean) => void",
  optional: false,
};

const RowGroupApplyExpansions: PropertyType = {
  kind: "property",
  name: "rowGroupApplyExpansions",
  tsDoc: `Applies multiple group row expansion states using a mapping of row ids to expansion booleans.
  Useful when restoring or syncing expansion state.`,
  doc: { en: `` },
  value: "(expansions: Record<string, boolean>) => void",
  optional: false,
};

const RowGroupIsExpanded: PropertyType = {
  kind: "property",
  name: "rowGroupIsExpanded",
  tsDoc: `Returns a boolean indicating if the specified group row is currently expanded.`,
  doc: { en: `` },
  value: "(row: RowGroup) => boolean",
  optional: false,
};

const EventAddListener: PropertyType = {
  kind: "property",
  name: "eventAddListener",
  doc: { en: `` },
  tsDoc: `Adds an event listener to the grid for a specified event. 
  Returns a function that can be called to remove the listener.`,
  optional: false,
  value:
    "<K extends keyof GridEvents<T>>(event: K, fn: (event: Parameters<Required<GridEvents<T>>[K]>[0]) => void) => () => void",
};

const EventRemoveListener: PropertyType = {
  kind: "property",
  name: "eventRemoveListener",
  doc: { en: `` },
  tsDoc: `Removes a registered event listener. The exact event and handler function must be provided.`,
  optional: false,
  value:
    "<K extends keyof GridEvents<T>>(event: K, fn: (event: Parameters<Required<GridEvents<T>>[K]>[0]) => void) => void",
};

const EventFire: PropertyType = {
  kind: "property",
  name: "eventFire",
  doc: { en: `` },
  tsDoc: `Manually dispatches a grid event with a given payload. This is intended for advanced usage 
  where custom behavior or testing scenarios require simulating native event lifecycles.`,
  optional: false,
  value:
    "<K extends keyof GridEvents<T>>(name: K, event: Parameters<Required<GridEvents<T>>[K]>[0]) => void",
};

export const ScrollIntoViewOptions: InterfaceType = {
  kind: "interface",
  name: "ScrollIntoViewOptions<T>",
  doc: { en: `` },
  tsDoc: `Options for the \`scrollIntoView\` API. Allows you to scroll a specific row and/or column into view, 
    ensuring they are visible in the viewport.`,
  export: true,
  properties: [
    {
      kind: "property",
      name: "column",
      value: "number | string | Column<T>",
      doc: { en: `` },
      optional: true,
      tsDoc: `The column index, column id, or column object to bring into view. Triggers a horizontal scroll if the column is not currently visible.`,
    },
    {
      kind: "property",
      name: "row",
      value: "number",
      doc: { en: `` },
      optional: true,
      tsDoc: `The index of the row to bring into view. Triggers a vertical scroll if the row is not currently visible.`,
    },
    {
      kind: "property",
      name: "behavior",
      value: '"smooth" | "auto" | "instant"',
      doc: { en: `` },
      tsDoc: `Defines the scrolling behavior. "smooth" animates the scroll, "auto" uses browser default behavior, and "instant" jumps immediately.`,
      optional: true,
    },
  ],
};

const ScrollIntoView: PropertyType = {
  kind: "property",
  name: "scrollIntoView",
  doc: { en: `` },
  tsDoc: `Ensures the specified row and/or column is scrolled into view. 
Accepts a configuration object that controls the scroll behavior.`,
  optional: false,
  value: "(options: ScrollIntoViewOptions<T>) => void",
};

export const FocusCellParams: UnionType = {
  kind: "union",
  doc: { en: `` },
  export: true,
  name: "FocusCellParams<T>",
  tsDoc: `The accepted input types for the \`focusCell\` method, which updates the active focus in LyteNyte Grid. 
Supports various formats:

- A row/column pair to focus a specific cell.
- A header or group header cell position.
- A directional alias ("next", "prev", "up", "down") relative to the current focus (only when the grid is focused).`,
  types: [
    "{ row: number, column: string | number | Column<T> }",
    "PositionHeaderCell",
    'Omit<PositionHeaderGroupCell, "columnStartIndex" | "columnEndIndex">',
    '"next"',
    '"prev"',
    '"up"',
    '"down"',
  ],
};

const FocusCell: PropertyType = {
  kind: "property",
  name: "focusCell",
  tsDoc: `Sets focus to a specific cell or navigates the focus based on a direction keyword. 
Useful for keyboard-driven navigation and programmatic focus management.`,
  doc: { en: `` },
  optional: false,
  value: `(position: FocusCellParams<T>) => void`,
};

const EditBegin: PropertyType = {
  kind: "property",
  name: "editBegin",
  tsDoc: `Starts cell editing at a specified location. If the grid is set to read-only mode, this method has no effect.`,
  doc: { en: `` },
  optional: false,
  value: `(params: EditBeginParams<T>) => void`,
};

const EditEnd: PropertyType = {
  kind: "property",
  name: "editEnd",
  tsDoc: `Ends the currently active cell edit. If there is no active edit session, the method does nothing. 
Can optionally cancel the edit if \`true\` is passed.`,
  doc: { en: `` },
  optional: false,
  value: `(cancel?: boolean) => void`,
};

const EditIsCellActive: PropertyType = {
  kind: "property",
  name: "editIsCellActive",
  tsDoc: `Returns \`true\` if the provided cell is currently being edited. Useful for conditionally rendering custom cell UI.`,
  doc: { en: `` },
  optional: false,
  value: `(params: EditBeginParams<T>) => boolean`,
};

const EditUpdate: PropertyType = {
  kind: "property",
  name: "editUpdate",
  tsDoc: `Applies an edit to the specified cell programmatically. This directly updates the data without going through the UI.`,
  doc: { en: `` },
  optional: false,
  value: `(params: EditUpdateParams<T>) => void`,
};

const RowDetailIsExpanded: PropertyType = {
  kind: "property",
  name: "rowDetailIsExpanded",
  tsDoc: `Checks whether the detail panel for the given row is currently expanded. Returns \`true\` if expanded.`,
  doc: { en: `` },
  optional: false,
  value: "(rowOrId: string | RowNode<T>) => boolean",
};

const RowDetailToggle: PropertyType = {
  kind: "property",
  name: "rowDetailToggle",
  tsDoc: `Toggles the detail expansion for the specified row. Optionally provide a boolean to explicitly set the expansion state.`,
  doc: { en: `` },
  optional: false,
  value: "(rowOrId: string | RowNode<T>, state?: boolean) => void",
};

const RowDetailRenderedHeight: PropertyType = {
  kind: "property",
  name: "rowDetailRenderedHeight",
  doc: { en: `` },
  tsDoc: `Returns the rendered height of the row's detail section only. Does not include the standard row height.`,
  optional: false,
  value: "(rowOrId: string | RowNode<T>) => number",
};

const RowById: PropertyType = {
  kind: "property",
  name: "rowById",
  doc: { en: `` },
  tsDoc: `Retrieves a row by its unique id. Returns \`null\` or \`undefined\` if the row doesn't exist or 
is not currently available in the data source.`,
  optional: false,
  value: "(id: string) => RowNode<T> | null | undefined",
};

const RowByIndex: PropertyType = {
  kind: "property",
  name: "rowByIndex",
  doc: { en: `` },
  tsDoc: `Retrieves a row based on its index and optional section (body, pinned top, or pinned bottom).
Returns \`null\` or \`undefined\` if the index is out of range.`,
  optional: false,
  value: "(index: number, section?: RowSection) => RowNode<T> | null | undefined",
};

const RowSelect: PropertyType = {
  kind: "property",
  name: "rowSelect",
  doc: { en: `` },
  tsDoc: `Selects a specific set of rows based on the provided {@link RowSelectOptions}. 
Triggers corresponding selection-related grid events.`,
  optional: false,
  value: "(params: RowSelectOptions) => void",
};

const RowSelectAll: PropertyType = {
  kind: "property",
  name: "rowSelectAll",
  doc: { en: `` },
  tsDoc: `Selects all rows in the current grid view. Accepts {@link RowSelectAllOptions} for fine-grained control.
Triggers selection-related events.`,
  optional: false,
  value: "(params?: RowSelectAllOptions) => void",
};

const RowSelected: PropertyType = {
  kind: "property",
  name: "rowSelected",
  doc: { en: `` },
  tsDoc: `Returns the list of currently selected row nodes. 
Note that some returned rows may not be part of the visible grid, depending on the data state.`,
  optional: false,
  value: "() => RowNode<T>[]",
};

export const HandleSelectionParams: InterfaceType = {
  kind: "interface",
  name: "RowHandleSelectParams",
  tsDoc: `The parameters used for the \`rowHandleSelect\` API method of LyteNyte Grid.`,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      name: "target",
      tsDoc: `The event target to handle.`,
      doc: { en: `` },
      optional: false,
      value: "EventTarget",
    },
    {
      kind: "property",
      name: "shiftKey",
      tsDoc: `Indicates whether the shift key is pressed. Required for enabling range-based (bulk) row selections.`,
      doc: { en: `` },
      optional: false,
      value: "boolean",
    },
  ],
};

const RowHandleSelect: PropertyType = {
  kind: "property",
  name: "rowHandleSelect",
  value: "(params: RowHandleSelectParams) => void",
  doc: { en: `` },
  optional: false,
  tsDoc: `A method that may be used in DOM event handlers to trigger row selection logic. 
  Ideal for integrating checkbox-based or custom selection workflows. Also supports bulk row selection.`,
};

const UseRowDragProps: PropertyType = {
  kind: "property",
  name: "useRowDrag",
  doc: { en: `` },
  tsDoc: `A React hook that returns props and state for row dragging support. 
  These props can be attached to a drag handle in your component to initiate drag behavior. 
  This must follow React’s hook rules.`,
  value: "(params: UseRowDragParams<T>) => { dragProps: any, isDragging: boolean }",
  optional: false,
};

const ResizeColumn: PropertyType = {
  kind: "property",
  name: "columnResize",
  doc: { en: `` },
  tsDoc: `Resizes one or more columns by providing an object where each key is a column id and the value is the new width in pixels.`,
  value: "(columns: Record<string, number>) => void",
  optional: false,
};

const ColumnById: PropertyType = {
  kind: "property",
  name: "columnById",
  doc: { en: `` },
  tsDoc: `Returns the column with the specified id. If no matching column is found, returns \`undefined\`.`,
  value: "(id: string) => Column<T> | undefined",
  optional: false,
};

const ColumnUpdates: PropertyType = {
  kind: "property",
  name: "columnUpdate",
  doc: { en: `` },
  tsDoc: `Applies updates to one or more columns. Each key in the object is a column id, and each value is the set of updates to apply.`,
  value: "(updates: Record<string, Omit<Column<T>, 'id'>>) => void",
  optional: false,
};

export const ColumnMoveParams: InterfaceType = {
  kind: "interface",
  doc: { en: `` },
  tsDoc: `The parameters that may be provided to the \`columnMove\` API method.`,
  export: true,
  name: "ColumnMoveParams<T>",
  properties: [
    {
      kind: "property",
      tsDoc: `The columns being moved. May be the column id or the column itself. All the columns should 
      be present in the grid's column definitions.`,
      doc: { en: `` },
      name: "moveColumns",
      value: "(string | Column<T>)[]",
      optional: false,
    },
    {
      kind: "property",
      tsDoc: `The move target for the columns. The target may not be present in the move columns, i.e. can not move 
      a column to itself.`,
      doc: { en: `` },
      name: "moveTarget",
      optional: false,
      value: "string | number | Column<T>",
    },
    {
      kind: "property",
      tsDoc: `If the move columns should be placed before the target column.`,
      doc: { en: `` },
      name: "before",
      optional: true,
      value: "boolean",
    },
    {
      kind: "property",
      tsDoc: `If the pin state of the columns being moved should be updated to match the target column.`,
      doc: { en: `` },
      name: "updatePinState",
      optional: true,
      value: "boolean",
    },
  ],
};

const ColumnMove: PropertyType = {
  kind: "property",
  name: "columnMove",
  doc: { en: `` },
  optional: false,
  tsDoc: `Moves one or more columns before or after a specified target column. 
  This operation respects column group visibility and layout rules.`,
  value: "(params: ColumnMoveParams<T>) => void",
};

const HeaderGroupToggle: PropertyType = {
  kind: "property",
  name: "columnToggleGroup",
  doc: { en: `` },
  optional: false,
  tsDoc: `Toggles the expansion state of one or more column groups. 
  You can also pass a boolean to directly set the expansion state.`,
  value: "(group: string | string[], state?: boolean) => void",
};

export const ColumnAutosizeParams: InterfaceType = {
  kind: "interface",
  name: "ColumnAutosizeParams<T>",
  tsDoc: `The parameters the \`columnAutosize\` method accepts.`,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      name: "dryRun",
      value: "boolean",
      optional: true,
      doc: { en: `` },
      tsDoc: `If \`true\`, performs the autosize calculation without applying the changes. Returns the calculated widths.`,
    },
    {
      kind: "property",
      name: "includeHeader",
      value: "boolean",
      optional: true,
      doc: { en: `` },
      tsDoc: `If \`true\`, includes the column header when calculating the autosize width.`,
    },
    {
      kind: "property",
      doc: { en: `` },
      name: "columns",
      optional: true,
      tsDoc: `A list of columns to autosize. If omitted, all columns are included in the operation.`,
      value: "(string | number | Column<T>)[]",
    },
  ],
};

const ColumnAutosize: PropertyType = {
  kind: "property",
  name: "columnAutosize",
  tsDoc: `Automatically adjusts the widths of columns based on their content. Accepts optional parameters to control the behavior.`,
  doc: { en: `` },
  optional: false,
  value: "(params: ColumnAutosizeParams<T>) => Record<string, number>",
};

export const ExportDataRect: PropertyType = {
  kind: "property",
  doc: { en: `` },
  name: "exportDataRect",
  optional: false,
  tsDoc: `Returns the raw cell data within a rectangular selection of the grid. 
  This can be useful for custom data processing or exporting workflows.`,
  value: "(params?: ExportDataRectParams) => ExportDataRectResult<T>",
};

export const ExportCsv: PropertyType = {
  kind: "property",
  doc: { en: `` },
  name: "exportCsv",
  optional: false,
  tsDoc: `Exports the cell data for a given rectangle of the grid as a CSV-formatted string. 
  The rectangle can be customized through parameters such as selected rows, columns, or cell ranges.`,
  value: "(params?: ExportCsvParams) => Promise<string>",
};

export const ExportCsvFile: PropertyType = {
  kind: "property",
  doc: { en: `` },
  name: "exportCsvFile",
  optional: false,
  tsDoc: `Generates a downloadable CSV \`Blob\` from the selected rectangular area of grid cell data. 
  Can be used to trigger a file download in the browser.`,
  value: "(params?: ExportCsvParams) => Promise<Blob>",
};

const GridApiPartial: InterfaceTypePartial = {
  kind: "interface-partial",
  properties: [
    ColumnField,
    ColumnFromIndex,
    ColumnIndex,

    SortForColumn,
    RowIsLeaf,
    RowIsGroup,
    RowGroupColumnIndex,
    RowGroupToggleExpansion,
    RowGroupApplyExpansions,
    RowGroupIsExpanded,

    EventAddListener,
    EventRemoveListener,
    EventFire,

    ScrollIntoView,

    FocusCell,
    EditBegin,
    EditEnd,
    EditIsCellActive,
    EditUpdate,

    RowDetailIsExpanded,
    RowDetailToggle,
    RowDetailRenderedHeight,

    RowById,
    RowByIndex,

    RowSelect,
    RowSelectAll,
    RowSelected,
    RowHandleSelect,

    UseRowDragProps,
    ResizeColumn,
    ColumnById,
    ColumnUpdates,
    ColumnMove,

    HeaderGroupToggle,
    ColumnAutosize,

    ExportDataRect,
    ExportCsv,
    ExportCsvFile,
  ],
};

export const GridApi: InterfaceType = {
  kind: "interface",
  name: "GridApi<T>",
  tsDoc: `The LyteNyte Grid API provides a comprehensive set of methods that allow developers 
  to programmatically query, update, and manipulate grid state and data.`,
  doc: { en: `` },
  export: true,
  properties: [],
  tag: "core",
  extends: GridApiPartial,
};

export const VirtualTarget: InterfaceType = {
  kind: "interface",
  tsDoc: `Represents a virtual DOM target with bounding information, used in situations 
  where a physical DOM element does not exist. Commonly used for positioning popovers 
  or overlays within LyteNyte Grid.`,
  doc: { en: `` },
  export: true,
  name: "VirtualTarget",
  tag: "pro",
  properties: [
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `Returns the bounding rectangle representing the virtual target. 
      Equivalent to a DOMRect but without the \`toJSON\` method.`,
      name: "getBoundingClientRect",
      optional: false,
      value: '() => Omit<DOMRect, "toJSON">',
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `Returns an array of client rectangles for the virtual target, useful 
      for rendering inline tooltips or positioning logic.`,
      name: "getClientRects",
      optional: true,
      value: '() => Omit<DOMRect, "toJSON">[]',
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `Specifies a context element that acts as a reference for the virtual element. 
      Helps in aligning or calculating relative positions.`,
      name: "contextElement",
      optional: true,
      value: "HTMLElement",
    },
  ],
};

export const GridApiPro: InterfaceType = {
  kind: "interface",
  name: "GridApi<T>",
  tsDoc: `The LyteNyte Grid API provides a comprehensive set of methods that allow developers 
  to programmatically query, update, and manipulate grid state and data.`,
  doc: { en: `` },
  export: true,
  extends: GridApiPartial,
  tag: "pro",
  properties: [
    {
      kind: "property",
      doc: { en: `` },
      name: "dialogFrameOpen",
      optional: false,
      tsDoc: `Opens a dialog frame by its id. You may optionally provide a context object 
      that will be passed into the dialog's renderer for dynamic configuration.`,
      value: "(id: string, context?: any) => void",
    },
    {
      kind: "property",
      doc: { en: `` },
      name: "dialogFrameClose",
      optional: false,
      tsDoc: `Closes dialog frames. If an id is provided, only the dialog with that id is closed; 
      otherwise, all open dialogs will be closed.`,
      value: "(id?: string) => void",
    },
    {
      kind: "property",
      doc: { en: `` },
      name: "popoverFrameOpen",
      optional: false,
      tsDoc: `Opens a popover frame at the specified target element or virtual target. 
      An optional context can be passed into the popover renderer for configuration.`,
      value: "(id: string, target: HTMLElement | VirtualTarget, context?: any) => void",
    },
    {
      kind: "property",
      doc: { en: `` },
      name: "popoverFrameClose",
      optional: false,
      tsDoc: `Closes popover frames. If an id is provided, only the corresponding frame is closed; 
      otherwise, all popover frames will be dismissed.`,
      value: "(id?: string) => void",
    },
    {
      kind: "property",
      doc: { en: `` },
      name: "positionFromElement",
      optional: false,
      tsDoc: `Returns the grid-relative position of the specified HTML element. 
      This can help determine if an element belongs to a specific grid cell, 
      header, or other region—useful for anchoring popovers or tooltips.`,
      value: "(el: HTMLElement) => PositionUnion | null",
    },
  ],
};
