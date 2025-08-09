import type { FunctionType, InterfaceType, PropertyType } from "../+types";
import { ColumnProp, GridProp } from "./shared-properties";

export const DataRequestModel: InterfaceType = {
  kind: "interface",
  doc: { en: `` },
  export: true,
  name: "DataRequestModel<T>",
  tsDoc: `
  Describes the current grid state used to construct a request for external data.
  
  @group Row Data Source
  `,
  properties: [
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: `Array of column sort configurations.`,
      name: "sorts",
      value: "SortModelItem<T>[]",
    },
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: `The simple filters currently applied to columns. The key of the record is the column 
      id. It is not guaranteed that the column id in the filters is present in the columns in the grid.`,
      name: "filters",
      value: "Record<string, FilterModelItem<T>>",
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `The in (set) filters currently applied to the columns. The key of the record is the column
      id. It is not guaranteed that the column id in the in filters is present in the columns in the grid.`,
      optional: false,
      name: "filtersIn",
      value: "Record<string, FilterIn>",
    },
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: `Quick search text value, or null if not in use.`,
      name: "quickSearch",
      value: "string | null",
    },
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: `Group model defining how rows are grouped.`,
      name: "group",
      value: "RowGroupModelItem<T>[]",
    },
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: `Expansion state of row groups by group key.`,
      name: "groupExpansions",
      value: "Record<string, boolean | undefined>",
    },
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: `Map of aggregation functions per column.`,
      name: "aggregations",
      value: "Record<string, { fn: AggModelFn<T> }>",
    },
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: `Expansion state of pivot row groups.`,
      name: "pivotGroupExpansions",
      value: "Record<string, boolean | undefined>",
    },
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: `Indicates whether pivot mode is enabled.`,
      name: "pivotMode",
      value: "boolean",
    },
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: `Model describing current pivot column state.`,
      name: "pivotModel",
      value: "ColumnPivotModel<T>",
    },
  ],
};

export const DataRequest: InterfaceType = {
  kind: "interface",
  name: "DataRequest",
  doc: { en: `` },
  export: true,
  tsDoc: `
  Represents a specific request for data to an external data source.
  
  @group Row Data Source
  `,
  properties: [
    {
      kind: "property",
      name: "id",
      doc: { en: `` },
      optional: false,
      tsDoc: `Unique id for the request, useful for caching and deduplication.`,
      value: "string",
    },
    {
      kind: "property",
      name: "path",
      doc: { en: `` },
      optional: false,
      tsDoc: `Hierarchy path for the request. An empty array represents the root level.`,
      value: "(string | null)[]",
    },
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: `Start offset of the requested rows, relative to the current path.`,
      name: "start",
      value: "number",
    },
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: `End offset of the requested rows, relative to the current path.`,
      name: "end",
      value: "number",
    },
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: `Grid row index where the request starts.`,
      name: "rowStartIndex",
      value: "number",
    },
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: `Grid row index where the request ends.`,
      name: "rowEndIndex",
      value: "number",
    },
  ],
};

export const DataResponseLeafItem: InterfaceType = {
  kind: "interface",
  name: "DataResponseLeafItem",
  tsDoc: `
  Represents a row of data (a leaf node) returned in a server response.
  
  @group Row Data Source
  `,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `Type identifier for a leaf response item.`,
      name: "kind",
      optional: false,
      value: '"leaf"',
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `Unique row identifier for the grid.`,
      name: "id",
      optional: false,
      value: "string",
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `Arbitrary data associated with this row.`,
      name: "data",
      optional: false,
      value: "any",
    },
  ],
};

export const DataResponseBranchItem: InterfaceType = {
  kind: "interface",
  name: "DataResponseBranchItem",
  tsDoc: `
  Represents a group (branch) row returned from a data request.
  
  @group Row Data Source
  `,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `Discriminates the item as a branch response.`,
      name: "kind",
      optional: false,
      value: '"branch"',
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `Unique identifier used to create the branch row.`,
      name: "id",
      optional: false,
      value: "string",
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `The row data associated with this branch.`,
      name: "data",
      optional: false,
      value: "any",
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `The key of the group the row represents.`,
      name: "key",
      optional: false,
      value: "string | null",
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `Number of immediate children under this group.`,
      name: "childCount",
      optional: false,
      value: "number",
    },
  ],
};

const asOfTimeProp: PropertyType = {
  kind: "property",
  doc: { en: `` },
  name: "asOfTime",
  optional: false,
  tsDoc: `
  Unix timestamp indicating when the data is valid from. Used to resolve response conflicts.
  `,
  value: "number",
};

export const DataResponsePinned: InterfaceType = {
  kind: "interface",
  doc: { en: `` },
  tsDoc: `
  Response object for setting pinned row data (top or bottom).
  
  @group Row Data Source
  `,
  export: true,
  name: "DataResponsePinned",
  properties: [
    {
      kind: "property",
      doc: { en: `` },
      name: "kind",
      optional: false,
      tsDoc: `Specifies the pinned section this data applies to: "top" or "bottom".`,
      value: '"top" | "bottom"',
    },
    {
      kind: "property",
      doc: { en: `` },
      name: "data",
      optional: false,
      tsDoc: `Array of leaf rows for the pinned section.`,
      value: "DataResponseLeafItem[]",
    },
    asOfTimeProp,
  ],
};

export const DataResponse: InterfaceType = {
  kind: "interface",
  doc: { en: `` },
  tsDoc: `
  Response object for row data from a center section request.
  
  @group Row Data Source
  `,
  export: true,
  name: "DataResponse",
  properties: [
    {
      kind: "property",
      doc: { en: `` },
      name: "kind",
      optional: false,
      tsDoc: `Must be "center" — the section this response applies to.`,
      value: '"center"',
    },
    {
      kind: "property",
      doc: { en: `` },
      name: "data",
      optional: false,
      tsDoc: `Array of leaf or branch rows returned for the given path.`,
      value: "(DataResponseLeafItem | DataResponseBranchItem)[]",
    },
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: `Updated row count for the associated path.`,
      value: "number",
      name: "size",
    },
    asOfTimeProp,
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: `Hierarchy path the data belongs to. Empty array means root.`,
      name: "path",
      value: "(string | null)[]",
    },
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: `Start offset within the hierarchy segment.`,
      name: "start",
      value: "number",
    },
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: `End offset within the hierarchy segment.`,
      name: "end",
      value: "number",
    },
  ],
};

export const DataFetcherParams: InterfaceType = {
  kind: "interface",
  name: "DataFetcherParams<T>",
  doc: { en: `` },
  export: true,
  tsDoc: `
  Input parameters provided to a grid data fetcher function.
  
  @group Row Data Source
  `,
  properties: [
    GridProp,
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: `Array of individual data fetch requests.`,
      name: "requests",
      value: "DataRequest[]",
    },
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: `Unix timestamp representing when the request was initiated.`,
      name: "reqTime",
      value: "number",
    },
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: `The full data request model describing grid state.`,
      name: "model",
      value: "DataRequestModel<T>",
    },
  ],
};

export const DataFetcherFn: FunctionType = {
  kind: "function",
  name: "DataFetcherFn<T>",
  doc: { en: `` },
  tsDoc: `
  Fetches grid row data asynchronously for the LyteNyte Server Data Source.
  
  @group Row Data Source
  `,
  export: true,
  properties: [
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `The parameters provided to the data fetch function.`,
      name: "params",
      optional: false,
      value: "DataFetcherParams<T>",
    },
  ],
  return: "Promise<(DataResponse | DataResponsePinned)[]>",
};

export const DataColumnPivotFetcherParams: InterfaceType = {
  kind: "interface",
  name: "DataColumnPivotFetcherParams<T>",
  doc: { en: `` },
  tsDoc: `
  Parameters passed to the column pivot fetcher function.
  
  @group Row Data Source
  `,
  export: true,
  properties: [
    GridProp,
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: `Timestamp representing the time of the request.`,
      value: "number",
      name: "reqTime",
    },
    {
      kind: "property",
      tsDoc: `The full model describing the pivot request state.`,
      doc: { en: `` },
      name: "model",
      optional: false,
      value: "DataRequestModel<T>",
    },
  ],
};

export const DataColumnPivotFetcherFn: FunctionType = {
  kind: "function",
  doc: { en: `` },
  tsDoc: `
  Fetches pivoted columns for the grid's current pivot configuration.
  
  @group Row Data Source
  `,
  export: true,
  name: "DataColumnPivotFetcherFn<T>",
  properties: [
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `The parameters provided to the column pivot fetcher.`,
      optional: false,
      name: "params",
      value: "DataColumnPivotFetcherParams<T>",
    },
  ],
  return: "Promise<Column<T>[]>",
};

export const DataInFilterItemFetcherParams: InterfaceType = {
  kind: "interface",
  name: "DataInFilterItemFetcherParams<T>",
  doc: { en: `` },
  tsDoc: `
  Parameters passed to the in-filter fetcher function.
  
  @group Row Data Source
  `,
  export: true,
  properties: [
    GridProp,
    ColumnProp,
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: `Timestamp for the in-filter fetch request.`,
      value: "number",
      name: "reqTime",
    },
  ],
};

export const DataInFilterItemFetcherFn: FunctionType = {
  kind: "function",
  doc: { en: `` },
  tsDoc: `
  Fetches items used in "in" filters from a server-side source.
  
  @group Row Data Source
  `,
  export: true,
  name: "DataInFilterItemFetcherFn<T>",
  properties: [
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `The parameters for the in-filter fetcher function.`,
      optional: false,
      name: "params",
      value: "DataInFilterItemFetcherParams<T>",
    },
  ],
  return: "Promise<FilterInFilterItem[]> | FilterInFilterItem[]",
};

export const RowDataSourceServerParams: InterfaceType = {
  kind: "interface",
  doc: { en: `` },
  tsDoc: `
  Parameters for configuring the server row data source.
  
  @group Row Data Source
  `,
  export: true,
  name: "RowDataSourceServerParams<T>",
  properties: [
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `Function that fetches grid data when rows are requested.`,
      optional: false,
      name: "dataFetcher",
      value: "DataFetcherFn<T>",
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `Optional function to fetch columns when pivot mode is enabled.`,
      optional: true,
      name: "dataColumnPivotFetcher",
      value: "DataColumnPivotFetcherFn<T>",
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `Optional function for fetching items for in-type filters.`,
      optional: true,
      name: "dataInFilterItemFetcher",
      value: "DataInFilterItemFetcherFn<T>",
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `Function called to handle cell updates in the grid.`,
      optional: true,
      name: "cellUpdateHandler",
      value: "(updates: Map<string, any>) => void",
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `Whether cell updates should be applied optimistically.`,
      optional: true,
      name: "cellUpdateOptimistically",
      value: "boolean",
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `Number of rows to fetch in a single data block request.`,
      optional: true,
      name: "blockSize",
      value: "number",
    },
  ],
};
