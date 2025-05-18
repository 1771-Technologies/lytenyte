import type { ColumnCore } from "../export-core";
import type { RowNode } from "../types/row-nodes";

export interface RowDataSourceCore<A, D> {
  init: (api: A) => void;
  clean: (api: A) => void;

  rowByIndex: (rowIndex: number) => RowNode<D> | null | undefined;
  rowById: (id: string) => RowNode<D> | null | undefined;
  rowIdToRowIndex: (id: string) => number | null | undefined;

  rowDepth: (rowIndex: number) => number;

  rowCount: () => number;
  rowTopCount: () => number;
  rowBottomCount: () => number;

  rowSetData: (rowId: string, data: D) => void;
  rowSetDataMany: (updates: Record<string, D>) => void;
  rowReplaceData: (d: D[]) => void;
  rowReplaceTopData: (d: D[]) => void;
  rowReplaceBottomData: (d: D[]) => void;

  rowGetAllIds: () => string[];
  rowGetAllChildrenIds: (rowIndex: number) => string[];

  rowSelectionIndeterminateSupported: () => boolean;
  rowSelectionSelectAllSupported: () => boolean;

  paginateGetCount: () => number;
  paginateRowStartAndEndForPage: (i: number) => [number, number];

  rowGetMany: (
    start: number,
    end: number,
  ) => Record<number, RowNode<D>> | Promise<Record<number, RowNode<D>>>;
}

export interface RowDataSourceClient<D = unknown, E = unknown> {
  readonly kind: "client";
  data: D[];
  topData?: D[];
  bottomData?: D[];

  readonly filterToDate?: (value: unknown, column: ColumnCore<D, E>) => Date;
  readonly sortToDate?: (value: unknown, column: ColumnCore<D, E>) => Date;
}
