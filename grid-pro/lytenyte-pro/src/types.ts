export type * from "@1771technologies/grid-types/pro-react";

import type {
  AsyncDataBlock,
  AsyncDataBlockPinned,
  AsyncDataRequestBlock,
  AsyncDataResponse,
  ColumnInFilterItemFetcher,
  ColumnInFilterItemFetcherParams,
  ColumnPivotsFetcher,
  ColumnPivotsFetcherParams,
  DataFetcher,
  DataFetcherParams,
} from "@1771technologies/grid-server-data-source";
import type { ReactNode } from "react";

export type AsyncDataBlockProReact = AsyncDataBlock;
export type AsyncDataBlockPinnedProReact = AsyncDataBlockPinned;
export type AsyncDataRequestBlockProReact = AsyncDataRequestBlock;
export type AsyncDataResponseProReact = AsyncDataResponse;
export type ColumnInFilterItemFetcherProReact<D = any> = ColumnInFilterItemFetcher<D, ReactNode>;
export type ColumnInFilterItemFetcherParamsProReact<D = any> = ColumnInFilterItemFetcherParams<
  D,
  ReactNode
>;
export type ColumnPivotsFetcherProReact<D = any> = ColumnPivotsFetcher<D, ReactNode>;
export type ColumnPivotsFetcherParamsProReact<D = any> = ColumnPivotsFetcherParams<D, ReactNode>;
export type DataFetcherProReact<D = any> = DataFetcher<D, ReactNode>;
export type DataFetcherParamsPropReact<D = any> = DataFetcherParams<D, ReactNode>;
