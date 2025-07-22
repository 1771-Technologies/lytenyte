import type {
  AggModelFn,
  Column,
  ColumnPivotModel,
  FilterModelItem,
  Grid,
  GridAtomReadonly,
  RowDataSource,
  RowGroupModelItem,
  SortModelItem,
} from "../+types";

export interface DataRequestModel<T> {
  sorts: SortModelItem<T>[];
  filters: FilterModelItem<T>[];
  quickSearch: string | null;

  group: RowGroupModelItem<T>[];
  groupExpansions: { [rowId: string]: boolean | undefined };
  aggregations: Record<string, { fn: AggModelFn<T> }>;

  pivotGroupExpansions: { [rowId: string]: boolean | undefined };
  pivotMode: boolean;
  pivotModel: ColumnPivotModel<T>;
}

export interface DataRequest {
  readonly id: string;
  readonly path: (string | null)[];
  readonly start: number;
  readonly end: number;
  readonly rowStartIndex: number;
  readonly rowEndIndex: number;
}

export interface DataResponseLeafItem {
  readonly kind: "leaf";
  readonly id: string;
  readonly data: any;
}

export interface DataResponseBranchItem {
  readonly kind: "branch";
  readonly id: string;
  readonly data: any;
  readonly key: string | null;
  readonly childCount: number;
}

export interface DataResponsePinned {
  readonly kind: "top" | "bottom";
  readonly data: DataResponseLeafItem[];
  readonly asOfTime: number;
}

export interface DataResponse {
  readonly kind: "center";
  readonly size: number;
  readonly asOfTime: number;
  readonly path: (string | null)[];
  readonly data: (DataResponseLeafItem | DataResponseBranchItem)[];
  readonly start: number;
  readonly end: number;
}

export interface DataFetcherParams<T> {
  readonly grid: Grid<T>;
  readonly requests: DataRequest[];
  readonly reqTime: number;
  readonly model: DataRequestModel<T>;
}

export type DataFetcher<T> = (
  p: DataFetcherParams<T>,
) => Promise<(DataResponse | DataResponsePinned)[]>;

export interface DataColumnPivotFetchParams<T> {
  readonly grid: Grid<T>;
  readonly reqTime: number;
  readonly model: DataRequestModel<T>;
}

export type DataColumnPivotFetcher<T> = (p: DataColumnPivotFetchParams<T>) => Promise<Column<T>[]>;

export interface DataInFilterItemFetcherParams<T> {
  readonly grid: Grid<T>;
  readonly reqTime: number;
  readonly column: Column<T>;
}

export interface FilterInFilterItem {
  readonly label: string;
  readonly value: unknown;
  readonly group?: string[];
}

export type DataInFilterItemFetcher<T> = (
  p: DataInFilterItemFetcherParams<T>,
) => Promise<FilterInFilterItem> | FilterInFilterItem;

export interface ServerRowDataSource<T> extends RowDataSource<T> {
  readonly isLoading: GridAtomReadonly<boolean>;
  readonly pushResponses: (res: (DataResponse | DataResponsePinned)[]) => void;
  readonly pushRequests: (req: DataRequest[], onSuccess?: () => void) => void;
}

export interface ServerDataSourceParams<T> {
  readonly dataFetcher: DataFetcher<T>;
  readonly dataColumnPivotFetcher?: DataColumnPivotFetcher<T>;
  readonly dataInFilterItemFetcher?: DataInFilterItemFetcher<T>;

  readonly pageSize?: number;
}
