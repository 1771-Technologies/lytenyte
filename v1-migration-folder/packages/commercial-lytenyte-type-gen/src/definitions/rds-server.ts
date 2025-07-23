import type { FunctionType, InterfaceType, PropertyType } from "../+types";
import { GridProp } from "./shared-properties";

export const DataRequestModel: InterfaceType = {
  kind: "interface",
  doc: { en: `` },
  export: true,
  name: "DataRequestModel<T>",
  tsDoc: ``,
  properties: [
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: ``,
      name: "sorts",
      value: "SortModelItem<T>[]",
    },
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: ``,
      name: "filters",
      value: "FilterModelItem<T>[]",
    },
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: ``,
      name: "quickSearch",
      value: "string | null",
    },
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: ``,
      name: "group",
      value: "RowGroupModelItem<T>[]",
    },
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: ``,
      name: "groupExpansions",
      value: "Record<string, boolean | undefined>",
    },
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: ``,
      name: "aggregations",
      value: "Record<string, { fn: AggModelFn<T> }>",
    },
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: ``,
      name: "pivotGroupExpansions",
      value: "Record<string, boolean | undefined>",
    },
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: ``,
      name: "pivotMode",
      value: "boolean",
    },
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: ``,
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
  tsDoc: ``,
  properties: [
    {
      kind: "property",
      name: "id",
      doc: { en: `` },
      optional: false,
      tsDoc: ``,
      value: "string",
    },
    {
      kind: "property",
      name: "path",
      doc: { en: `` },
      optional: false,
      tsDoc: ``,
      value: "(string | null)[]",
    },
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: ``,
      name: "start",
      value: "number",
    },
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: ``,
      name: "end",
      value: "number",
    },
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: ``,
      name: "rowStartIndex",
      value: "number",
    },
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: ``,
      name: "rowEndIndex",
      value: "number",
    },
  ],
};

export const DataResponseLeafItem: InterfaceType = {
  kind: "interface",
  name: "DataResponseLeafItem",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: ``,
      name: "kind",
      optional: false,
      value: '"leaf"',
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: ``,
      name: "id",
      optional: false,
      value: "string",
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: ``,
      name: "data",
      optional: false,
      value: "any",
    },
  ],
};

export const DataResponseBranchItem: InterfaceType = {
  kind: "interface",
  name: "DataResponseBranchItem",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: ``,
      name: "kind",
      optional: false,
      value: '"branch"',
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: ``,
      name: "id",
      optional: false,
      value: "string",
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: ``,
      name: "data",
      optional: false,
      value: "any",
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: ``,
      name: "key",
      optional: false,
      value: "string | null",
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: ``,
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
  tsDoc: ``,
  value: "number",
};

export const DataResponsePinned: InterfaceType = {
  kind: "interface",
  doc: { en: `` },
  tsDoc: ``,
  export: true,
  name: "DataResponsePinned",
  properties: [
    {
      kind: "property",
      doc: { en: `` },
      name: "kind",
      optional: false,
      tsDoc: ``,
      value: '"top" | "bottom"',
    },
    {
      kind: "property",
      doc: { en: `` },
      name: "data",
      optional: false,
      tsDoc: ``,
      value: "DataResponseLeafItem[]",
    },
    asOfTimeProp,
  ],
};

export const DataResponse: InterfaceType = {
  kind: "interface",
  doc: { en: `` },
  tsDoc: ``,
  export: true,
  name: "DataResponse",
  properties: [
    {
      kind: "property",
      doc: { en: `` },
      name: "kind",
      optional: false,
      tsDoc: ``,
      value: '"center"',
    },
    {
      kind: "property",
      doc: { en: `` },
      name: "data",
      optional: false,
      tsDoc: ``,
      value: "(DataResponseLeafItem | DataResponseBranchItem)[]",
    },
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: ``,
      value: "number",
      name: "size",
    },
    asOfTimeProp,
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: ``,
      name: "path",
      value: "(string | null)[]",
    },
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: ``,
      name: "start",
      value: "number",
    },
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: ``,
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
  tsDoc: ``,
  properties: [
    GridProp,
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: ``,
      name: "requests",
      value: "DataRequest[]",
    },
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: ``,
      name: "reqTime",
      value: "number",
    },
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: ``,
      name: "model",
      value: "DataRequestModel<T>",
    },
  ],
};

export const DataFetcherFn: FunctionType = {
  kind: "function",
  name: "DataFetcherFn<T>",
  doc: { en: `` },
  tsDoc: ``,
  export: true,
  properties: [
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: ``,
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
  tsDoc: ``,
  export: true,
  properties: [
    GridProp,
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: ``,
      value: "number",
      name: "reqTime",
    },
    {
      kind: "property",
      tsDoc: ``,
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
  tsDoc: ``,
  export: true,
  name: "DataColumnPivotFetcherFn<T>",
  properties: [
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: ``,
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
  tsDoc: ``,
  export: true,
  properties: [
    GridProp,
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: ``,
      value: "number",
      name: "reqTime",
    },
    {
      kind: "property",
      tsDoc: ``,
      doc: { en: `` },
      name: "column",
      optional: false,
      value: "Column<T>",
    },
  ],
};

export const DataInFilterItemFetcherFn: FunctionType = {
  kind: "function",
  doc: { en: `` },
  tsDoc: ``,
  export: true,
  name: "DataInFilterItemFetcherFn<T>",
  properties: [
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: ``,
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
  tsDoc: ``,
  export: true,
  name: "RowDataSourceServerParams<T>",
  properties: [
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: ``,
      optional: false,
      name: "dataFetcher",
      value: "DataFetcherFn<T>",
    },

    {
      kind: "property",
      doc: { en: `` },
      tsDoc: ``,
      optional: true,
      name: "dataColumnPivotFetcher",
      value: "DataColumnPivotFetcherFn<T>",
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: ``,
      optional: true,
      name: "dataInFilterItemFetcher",
      value: "DataInFilterItemFetcherFn<T>",
    },

    {
      kind: "property",
      doc: { en: `` },
      tsDoc: ``,
      optional: true,
      name: "cellUpdateHandler",
      value: "(updates: Map<string, any>) => void",
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: ``,
      optional: true,
      name: "cellUpdateOptimistically",
      value: "boolean",
    },

    {
      kind: "property",
      doc: { en: `` },
      tsDoc: ``,
      optional: true,
      name: "pageSize",
      value: "number",
    },
  ],
};
