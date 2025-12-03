import type { ReactNode } from "react";

export type RowHeight = number | `fill:${number}` | ((i: number) => number);
export type RowPin = "top" | "bottom" | null;

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

export interface RowSource<T = any> {
  readonly useRowCount: () => number;
  readonly useTopCount: () => number;
  readonly useBottomCount: () => number;
  readonly useSnapshotVersion: () => number;

  readonly rowIndexToRowId: (index: number) => string | null | undefined;
  readonly rowByIndex: (row: number) => RowAtom<RowNode<T> | null>;
}

export interface RowAtom<T> {
  readonly get: () => T;
  readonly useValue: () => T;
}

export type RowFullWidthPredicate<T> = (params: {
  readonly rowIndex: number;
  readonly row: RowNode<T | null>;
}) => boolean;

export type RowFullWidthRenderer<T> = (props: {
  readonly rowIndex: number;
  readonly row: RowNode<T>;
}) => ReactNode;
