import type { RowNode } from "./row-node.js";

export interface RowAtom<T> {
  readonly get: () => T;
  readonly useValue: () => T;
}

export interface RowSource<T = any> {
  readonly useRowCount: () => number;
  readonly useTopCount: () => number;
  readonly useBottomCount: () => number;
  readonly useSnapshotVersion: () => number;
  readonly useMaxRowGroupDepth: () => number;

  readonly rowIndexToRowId: (index: number) => string | null | undefined;
  readonly rowByIndex: (row: number) => RowAtom<RowNode<T> | null>;
}
