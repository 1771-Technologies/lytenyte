import type {
  ApiPro,
  ColumnInFilterItemPro,
  ColumnPro,
  RowGroupKindPro,
  RowLeafKindPro,
} from "@1771technologies/grid-types/pro";

export type AsyncDataBlock = {
  readonly blockKey: number;
  readonly frame: {
    readonly data: unknown[];
    readonly ids: string[];
    readonly pathKeys: (string | null)[];
    readonly kinds: (RowGroupKindPro | RowLeafKindPro)[];
    readonly childCounts: number[];
    readonly expansions?: Record<string, boolean>;
  };
  readonly size: number;
  readonly path?: string[];
};

export type AsyncDataBlockPinned = {
  readonly frame: {
    readonly data: unknown[];
    readonly ids: string[];
  };
};

export type AsyncDataResponse = {
  readonly rootCount?: number;
  readonly reqTime: number;
  readonly blocks: AsyncDataBlock[];
  readonly topBlock?: AsyncDataBlockPinned;
  readonly bottomBlock?: AsyncDataBlockPinned;
};

export interface AsyncDataRequestBlock {
  readonly id: string;
  readonly blockKey: number;
  readonly path: string[];
  readonly rowStart: number;
  readonly rowEnd: number;
  readonly blockStart: number;
  readonly blockEnd: number;
}

export interface DataFetcherParams<D, E> {
  readonly api: ApiPro<D, E>;
  readonly requestBlocks: AsyncDataRequestBlock[];
  readonly reqTime: number;
}

export type DataFetcher<D, E> = (p: DataFetcherParams<D, E>) => Promise<AsyncDataResponse>;

export interface ColumnInFilterItemFetcherParams<D, E> {
  readonly api: ApiPro<D, E>;
  readonly column: ColumnPro<D, E>;
}
export type ColumnInFilterItemFetcher<D, E> = (
  p: ColumnInFilterItemFetcherParams<D, E>,
) => Promise<ColumnInFilterItemPro[]>;

export interface ColumnPivotsFetcherParams<D, E> {
  readonly api: ApiPro<D, E>;
}
export type ColumnPivotsFetcher<D, E> = (
  p: ColumnPivotsFetcherParams<D, E>,
) => Promise<ColumnPro<D, E>[]>;
