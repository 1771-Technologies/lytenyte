import type { ColumnInFilterItem } from "../types/filter-pro";
import type { RowNode, RowNodeGroup } from "../types/row-nodes";

type MaybePromise<T> = T | Promise<T>;

export interface RowDataSourcePro<A, D, C> {
  init?: (api: A) => void;
  clean?: (api: A) => void;

  rowByIndex: (rowIndex: number) => RowNode<D> | null | undefined;
  rowById: (id: string) => RowNode<D> | null | undefined;
  rowIdToRowIndex: (id: string) => number | null | undefined;

  // Row counts are necessary for rendering the correct
  // number of rows in the virtualized view.
  rowCount: () => number;
  rowTopCount: () => number;
  rowBottomCount: () => number;

  rowDepth: (rowIndex: number) => number;

  // Necessary for data editing and row updates
  rowSetData?: (rowId: string, data: D) => void;
  rowSetDataMany?: (updates: Record<string, D>) => void;
  rowReplaceData?: (d: D[]) => void;
  rowReplaceTopData?: (d: D[]) => void;
  rowReplaceBottomData?: (d: D[]) => void;

  rowReload?: (rowIndex?: number) => void;
  rowReloadExpansion?: (row: RowNodeGroup) => void;
  rowReset?: () => void;

  columnInFilterItems?: (column: C) => Promise<ColumnInFilterItem[]> | ColumnInFilterItem[];

  paginateGetCount?: () => number;
  paginateRowStartAndEndForPage?: (i: number) => [number, number];

  rowGetAllIds: () => string[];
  rowGetAllChildrenIds: (rowIndex: number) => string[];
  rowSelectionIndeterminateSupported: () => boolean;
  rowSelectionSelectAllSupported: () => boolean;

  // column pivot support
  columnPivots?: (api: A) => MaybePromise<C[]>;

  rowGetMany: (
    start: number,
    end: number,
  ) => Record<number, RowNode<D>> | Promise<Record<number, RowNode<D>>>;
}
