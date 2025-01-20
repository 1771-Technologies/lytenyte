import type { RowNode } from "../types";

export interface RowDataSource<A, D> {
  init: (api: A) => void;
  clean: (api: A) => void;

  rowByIndex: (rowIndex: number) => RowNode<D> | null | undefined;
  rowById: (id: string) => RowNode<D> | null | undefined;

  rowChildCount: (rowIndex: number) => number;
  rowParentIndex: (rowIndex: number) => number | null;
  rowDepth: (rowIndex: number) => number;

  rowCount: () => number;
  rowTopCount: () => number;
  rowBottomCount: () => number;

  rowSetData: (rowId: string, data: D) => void;
  rowSetDataMany: (updates: Record<string, D>) => void;
  rowReplaceData: (d: D[]) => void;
  rowReplaceTopData: (d: D[]) => void;
  rowReplaceBottomData: (d: D[]) => void;

  paginateGetCount: () => number;
  paginateRowStartAndEndForPage: (i: number) => [number, number];

  rowSelectionIsSelected: (id: string) => boolean;
  rowSelectionGetSelected: () => string[];
  rowSelectionSelect: (id: string[], selectChildren?: boolean) => void;
  rowSelectionDeselect: (id: string[], selectChildren?: boolean) => void;
  rowSelectionIsIndeterminate: (id: string) => boolean;
  rowSelectionAllRowsSelected: () => boolean;
  rowSelectionSelectAll: () => void;
  rowSelectionClear: () => void;

  rowGetMany: (
    start: number,
    end: number,
  ) => Record<number, RowNode<D>> | Promise<Record<number, RowNode<D>>>;
}
