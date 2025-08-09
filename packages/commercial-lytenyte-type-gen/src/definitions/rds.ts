import type { InterfaceType, InterfaceTypePartial, PropertyType } from "../+types";

export const RowSelectParams: InterfaceType = {
  kind: "interface",
  name: "RdsRowSelectParams",
  doc: { en: `` },
  export: true,
  tsDoc: `Parameters passed to the row selection handler within the row data source.`,
  properties: [
    {
      kind: "property",
      name: "startId",
      doc: { en: `` },
      optional: false,
      tsDoc: `The starting row id of the selection range.`,
      value: "string",
    },
    {
      kind: "property",
      name: "endId",
      doc: { en: `` },
      optional: false,
      tsDoc: `The ending row id of the selection range.`,
      value: "string",
    },
    {
      kind: "property",
      name: "selectChildren",
      doc: { en: `` },
      optional: false,
      tsDoc: `Indicates whether to include child rows in the selection.`,
      value: "boolean",
    },
    {
      kind: "property",
      name: "deselect",
      doc: { en: `` },
      optional: false,
      tsDoc: `Indicates whether the action should deselect the specified rows.`,
      value: "boolean",
    },
    {
      kind: "property",
      name: "mode",
      doc: { en: `` },
      optional: false,
      tsDoc: `The current selection mode applied to the row operation.`,
      value: "RowSelectionMode",
    },
  ],
};

export const RowDataStore: InterfaceType = {
  kind: "interface",
  name: "RowDataStore<T>",
  export: true,
  tsDoc: `The internal row data store used by LyteNyte Grid to manage row metadata, counts, and access functions.`,
  doc: { en: `` },
  properties: [
    {
      kind: "property",
      name: "rowCount",
      tsDoc: `Total number of rows present in the grid.`,
      doc: { en: `` },
      value: "GridAtomReadonly<number>",
      optional: false,
    },
    {
      kind: "property",
      name: "rowTopCount",
      tsDoc: `Number of rows pinned to the top section.`,
      doc: { en: `` },
      value: "GridAtom<number>",
      optional: false,
    },
    {
      kind: "property",
      name: "rowCenterCount",
      tsDoc: `Number of scrollable rows in the center section.`,
      doc: { en: `` },
      value: "GridAtom<number>",
      optional: false,
    },
    {
      kind: "property",
      name: "rowBottomCount",
      tsDoc: `Number of rows pinned to the bottom section.`,
      doc: { en: `` },
      value: "GridAtom<number>",
      optional: false,
    },
    {
      kind: "property",
      name: "rowForIndex",
      tsDoc: `Retrieves the row node for the given row index.`,
      doc: { en: `` },
      optional: false,
      value: "(row: number) => GridAtomReadonlyUnwatchable<RowNode<T> | null>",
    },
    {
      kind: "property",
      name: "rowClearCache",
      tsDoc: `Clears the cached row node data in the store.`,
      doc: { en: `` },
      optional: false,
      value: "() => void",
    },
    {
      kind: "property",
      name: "rowInvalidateIndex",
      tsDoc: `Invalidates the row node for the given index, forcing a refresh.`,
      doc: { en: `` },
      optional: false,
      value: "(row: number) => void",
    },
  ],
};

export const RowDataSourcePartial: InterfaceTypePartial = {
  kind: "interface-partial",
  properties: [
    {
      kind: "property",
      name: "init",
      tsDoc: `Initializes the row data source. Called by LyteNyte Grid when the grid is ready.`,
      doc: { en: `` },
      optional: false,
      value: "(grid: Grid<T>) => void",
    },
    {
      kind: "property",
      name: "rowById",
      value: "(id: string) => RowNode<T> | null",
      doc: { en: `` },
      tsDoc: `Returns the row node for a given row id. May return \`null\` if the id is undefined.`,
      optional: false,
    },
    {
      kind: "property",
      name: "rowByIndex",
      value: "(index: number) => RowNode<T> | null",
      doc: { en: `` },
      tsDoc: `Returns the row node for a given index. May return \`null\` if index is out of bounds.`,
      optional: false,
    },
    {
      kind: "property",
      name: "rowToIndex",
      doc: { en: `` },
      optional: false,
      tsDoc: `Returns the row index corresponding to a row id, or \`null\` if not found.`,
      value: "(rowId: string) => number | null",
    },
    {
      kind: "property",
      name: "rowExpand",
      value: "(expansion: Record<string, boolean>) => void",
      doc: { en: `` },
      tsDoc: `Handles expansion state changes for grouped rows.`,
      optional: false,
    },
    {
      kind: "property",
      name: "rowSelect",
      value: "(params: RdsRowSelectParams) => void",
      doc: { en: `` },
      optional: false,
      tsDoc: `Handles row selection updates and modifies selection state.`,
    },
    {
      kind: "property",
      name: "rowSelectAll",
      value: "(params: RowSelectAllOptions) => void",
      doc: { en: `` },
      optional: false,
      tsDoc: `Selects or deselects all rows based on the provided parameters.`,
    },
    {
      kind: "property",
      name: "rowAreAllSelected",
      value: "(rowId?: string) => boolean",
      doc: { en: `` },
      optional: false,
      tsDoc: `Returns \`true\` if all rows are selected, otherwise \`false\`.`,
    },
    {
      kind: "property",
      name: "rowAllChildIds",
      value: "(rowId: string) => string[]",
      doc: { en: `` },
      optional: false,
      tsDoc: `Returns the list of child row ids associated with a given parent row id.`,
    },
    {
      kind: "property",
      name: "rowUpdate",
      value: "(updates: Map<string | number, any>) => void",
      tsDoc: `Updates row data using a map of row ids or indexes mapped to updated values.`,
      doc: { en: `` },
      optional: false,
    },
    {
      kind: "property",
      name: "rowDelete",
      value: "(deletions: (string | number)[]) => void",
      tsDoc: `Deletes rows by their id or index using a provided array of keys.`,
      doc: { en: `` },
      optional: false,
    },
    {
      kind: "property",
      name: "rowAdd",
      value: '(newRows: any[], atIndex?: number | "beginning" | "end") => void',
      doc: { en: `` },
      tsDoc: `Adds new rows to the grid optionally at a specific index, beginning, or end.`,
      optional: false,
    },
    {
      kind: "property",
      name: "rowSetCenterData",
      value: "(newRows: any[]) => void",
      doc: { en: `` },
      tsDoc: `Sets the data for the center rows (scrollable rows) of the grid. Effectively replacing the current row data.`,
      optional: false,
    },
    {
      kind: "property",
      name: "rowSetTopData",
      doc: { en: `` },
      tsDoc: `Sets the data for rows pinned to the top section.`,
      optional: false,
      value: "(data: any[]) => void",
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `Sets the data for rows pinned to the bottom section.`,
      name: "rowSetBotData",
      optional: false,
      value: "(data: any[]) => void",
    },
  ],
};

export const RowDataSource: InterfaceType = {
  kind: "interface",
  name: "RowDataSource<T>",
  export: true,
  tsDoc: `The row data source interface used by LyteNyte Grid to retrieve and manage row data. 
  This includes functionality for row expansion, selection, and CRUD operations.`,
  doc: { en: `` },
  properties: [],
  tag: "core",
  extends: RowDataSourcePartial,
};

const InFilterItemsProp: PropertyType = {
  kind: "property",
  name: "inFilterItems",
  tsDoc: `Returns the available in-filter items for the specified column. 
  May return items synchronously or as a Promise.`,
  doc: { en: `` },
  optional: false,
  value: "(column: Column<T>) => Promise<FilterInFilterItem[]> | FilterInFilterItem[]",
};

export const RowDataSourcePro: InterfaceType = {
  kind: "interface",
  name: "RowDataSource<T>",
  export: true,
  tsDoc: `The row data source interface used by LyteNyte Grid to retrieve and manage row data. 
  This includes functionality for row expansion, selection, and CRUD operations.`,
  doc: { en: `` },
  properties: [InFilterItemsProp],
  tag: "pro",
  extends: RowDataSourcePartial,
};

const ClientGetDataProp: PropertyType = {
  kind: "property",
  tsDoc: `A client data source method to retrieve the raw data passed to the data source.`,
  doc: { en: `` },
  name: "rowData",
  optional: false,
  value: "(section: RowSection) => T[]",
};

export const RowDataSourceClient: InterfaceType = {
  kind: "interface",
  name: "RowDataSourceClient<T>",
  export: true,
  tsDoc: `A client-side row data source used by LyteNyte Grid. All operations 
  are handled on the client, assuming the complete dataset is available in memory.

  This implementation is suitable for small to moderately sized datasets. For large-scale datasets, such as those 
  exceeding hundreds of thousands of rows, a server-based data source 
  is recommended for performance and memory efficiency.`,
  doc: { en: `` },
  properties: [ClientGetDataProp],
  tag: "core",
  extends: RowDataSourcePartial,
};

export const RowDataSourceClientPro: InterfaceType = {
  kind: "interface",
  name: "RowDataSourceClient<T>",
  export: true,
  tsDoc: `A client-side row data source used by LyteNyte Grid. All operations 
  are handled on the client, assuming the complete dataset is available in memory.

  This implementation is suitable for small to moderately sized datasets. For large-scale datasets, such as those 
  exceeding hundreds of thousands of rows, a server-based data source 
  is recommended for performance and memory efficiency.`,
  doc: { en: `` },
  tag: "pro",
  properties: [InFilterItemsProp, ClientGetDataProp],
  extends: RowDataSourcePartial,
};

export const RowDataSourceClientPageState: InterfaceType = {
  kind: "interface",
  name: "RowDataSourceClientPageState",
  export: true,
  tsDoc: `Represents pagination-related state for the client row data source in 
  LyteNyte Grid. These values enable pagination logic within the grid's UI and interactions.`,
  doc: { en: `` },
  properties: [
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `The currently active page number.`,
      name: "current",
      optional: false,
      value: "GridAtom<number>",
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `The number of rows displayed per page.`,
      name: "perPage",
      optional: false,
      value: "GridAtom<number>",
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `The total number of available pages.`,
      name: "pageCount",
      optional: false,
      value: "GridAtomReadonly<number>",
    },
  ],
};

const PageProp: PropertyType = {
  kind: "property",
  doc: { en: `` },
  tsDoc: `The properties of the current pagination state.`,
  name: "page",
  optional: false,
  value: "RowDataSourceClientPageState",
};

export const RowDataSourceClientClientPaginated: InterfaceType = {
  kind: "interface",
  name: "RowDataSourceClientPaginated<T>",
  export: true,
  tsDoc: `A paginated client-side row data source for LyteNyte Grid. 
  It divides the full dataset into pages based on the configured page 
  size, reducing the number of rows rendered at any one time to 
  improve UI responsiveness and performance.`,
  doc: { en: `` },
  extends: RowDataSourcePartial,
  tag: "core",
  properties: [PageProp, ClientGetDataProp],
};

export const RowDataSourceClientClientPaginatedPro: InterfaceType = {
  kind: "interface",
  name: "RowDataSourceClientPaginated<T>",
  export: true,
  tsDoc: `A paginated client-side row data source for LyteNyte Grid. 
  It divides the full dataset into pages based on the configured page 
  size, reducing the number of rows rendered at any one time to 
  improve UI responsiveness and performance.`,
  doc: { en: `` },
  extends: RowDataSourcePartial,
  tag: "pro",
  properties: [PageProp, InFilterItemsProp, ClientGetDataProp],
};

export const RowDataSourceServerPro: InterfaceType = {
  kind: "interface",
  name: "RowDataSourceServer<T>",
  doc: { en: `` },
  tsDoc: `A high-performance row data source for LyteNyte Grid that enables 
  server-side data loading in slices. This data source supports virtually 
  unlimited data volumes by querying only the required data ranges from a backend source.

  Unlike client-side data sources, all row operations—including filtering, sorting, 
  grouping, and pagination—must be handled on the server. This design provides 
  maximum flexibility and scalability, including support for server-driven trees 
  and pagination, but requires a more complex implementation on the backend.`,
  export: true,
  extends: RowDataSourcePartial,
  tag: "pro",
  properties: [
    InFilterItemsProp,
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `Indicates whether the server data source is currently fetching data. 
      This can be used to show a loading indicator in the UI.`,
      name: "isLoading",
      optional: false,
      value: "GridAtomReadonly<boolean>",
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `If the initial data load for the server data fails, the loadError will be set with the 
      error value. This is only set if the initial load failed.`,
      name: "loadError",
      optional: false,
      value: "GridAtomReadonly<unknown>",
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `Retries the failed data load requests.`,
      name: "retry",
      optional: false,
      value: "() => void",
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `Pushes data responses directly into the data source. Useful for 
      preloading, live updates, or streaming responses.`,
      name: "pushResponses",
      optional: false,
      value: "(req: (DataResponse | DataResponsePinned)[]) => void",
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `Triggers the data fetching pipeline with a set of requests. Can
      optionally invoke a callback upon successful completion.`,
      name: "pushRequests",
      optional: false,
      value: "(req: DataRequest[], onSuccess?: () => void, onError?: (e: unknown) => void) => void",
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `Resets the internal state and clears all server data previously fetched by the grid.`,
      name: "reset",
      optional: false,
      value: "() => void",
    },
  ],
};
