import type { RowNode, RowNodeGroup } from "../types";
import type { ColumnInFilterItem } from "../types-enterprise";

type MaybePromise<T> = T | Promise<T>;

export interface RowDataSourceEnterprise<A, D, C> {
  init?: (api: A) => void;
  clean?: (api: A) => void;

  rowByIndex: (rowIndex: number) => RowNode<D> | null | undefined;
  rowById: (id: string) => RowNode<D> | null | undefined;

  // Row counts are necessary for rendering the correct
  // number of rows in the virtualized view.
  rowCount: () => number;
  rowTopCount: () => number;
  rowBottomCount: () => number;

  // For row grouping functionality this is necessary for things like sticky
  // rows and groups totals
  rowChildCount: (rowIndex: number) => number;
  rowParentIndex: (rowIndex: number) => number | null;
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

  rowGroupToggle?: (id: string, state?: boolean) => void;

  paginateGetCount?: () => number;
  paginateRowStartAndEndForPage?: (i: number) => [number, number];

  rowSelectionIsSelected: (id: string) => boolean;
  rowSelectionGetSelected: () => string[];
  rowSelectionSelect: (id: string[], selectChildren?: boolean) => void;
  rowSelectionDeselect: (id: string[], selectChildren?: boolean) => void;
  rowSelectionIsIndeterminate: (id: string) => boolean;
  rowSelectionAllRowsSelected: () => boolean;
  rowSelectionSelectAll: () => void;
  rowSelectionClear: () => void;
  rowSelectionSelectAllSupported: () => boolean;

  // column pivot support
  columnPivots?: (api: A) => MaybePromise<C[]>;

  rowGetMany: (
    start: number,
    end: number,
  ) => Record<number, RowNode<D>> | Promise<Record<number, RowNode<D>>>;
}
