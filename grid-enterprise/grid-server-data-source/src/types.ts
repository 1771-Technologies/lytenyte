import type { ApiEnterprise, ColumnEnterprise } from "@1771technologies/grid-types";
import type { RowGroupKind, RowLeafKind } from "@1771technologies/grid-types/community";
import type { ColumnInFilterItem } from "@1771technologies/grid-types/enterprise";

export type AsyncDataBlock = {
  readonly blockKey: number;
  readonly frame: {
    readonly data: unknown[];
    readonly ids: string[];
    readonly pathKeys: (string | null)[];
    readonly kinds: (RowGroupKind | RowLeafKind)[];
    readonly childCounts: number[];
  };
  readonly reqTime?: number;
  readonly path?: string[];
  readonly expansions?: Record<string, boolean>;
};

export type AsyncDataBlockPinned = {
  readonly reqTime: number;
  readonly frame: {
    readonly data: unknown[];
    readonly ids: string[];
  };
};

export type AsyncDataBlockTotal = {
  readonly reqTime: number;
  readonly frame: {
    readonly data: unknown;
  };
};

export type AsyncDataResponse = {
  readonly rootCount?: number;
  readonly reqTime: number;
  readonly blocks: AsyncDataBlock;
  readonly topBlock?: AsyncDataBlockPinned;
  readonly bottomBlock?: AsyncDataBlockPinned;
};

export interface RequestBlock {
  readonly blockKey: number;
  readonly path: string[];
  readonly rowStart: number;
  readonly rowEnd: number;
  readonly blockStart: number;
  readonly blockEnd: number;
}

export interface DataFetcherParams<D, E> {
  readonly api: ApiEnterprise<D, E>;
  readonly requestBlocks: RequestBlock[];
  readonly reqTime: number;
}

export type DataFetcher<D, E> = (p: DataFetcherParams<D, E>) => Promise<AsyncDataResponse>;

export interface ColumnInFilterItemFetcherParams<D, E> {
  readonly api: ApiEnterprise<D, E>;
  readonly column: ColumnEnterprise<D, E>;
}
export type ColumnInFilterItemFetcher<D, E> = (
  p: ColumnInFilterItemFetcherParams<D, E>,
) => Promise<ColumnInFilterItem[]>;

export interface ColumnPivotsFetcherParams<D, E> {
  readonly api: ApiEnterprise<D, E>;
}
export type ColumnPivotsFetcher<D, E> = (
  p: ColumnPivotsFetcherParams<D, E>,
) => Promise<ColumnEnterprise<D, E>[]>;
