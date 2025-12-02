export type RowHeight = number | `fill:${number}` | ((i: number) => number);

export type RowNode<T> = RowLeaf<T> | RowGroup;

export interface RowLeaf<T = any> {
  readonly id: string;
  readonly loading?: boolean;
  readonly error?: unknown;
  readonly kind: "leaf";
  readonly data: T | null;
}

export interface RowGroup {
  readonly id: string;
  readonly loading?: boolean;
  readonly error?: unknown;
  readonly kind: "branch";
  readonly key: string | null;
  readonly data: Record<string, unknown>;
  readonly depth: number;
  readonly errorGroup?: unknown;
  readonly loadingGroup?: boolean;
}

export interface RowSource {
  readonly useRowCount: () => number;
  readonly useTopCount: () => number;
  readonly useBottomCount: () => number;
  readonly useSnapshotVersion: () => number;

  readonly rowIndexToRowId: (index: number) => string | null | undefined;
}
