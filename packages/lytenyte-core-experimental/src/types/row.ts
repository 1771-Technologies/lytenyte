import type { ReactNode } from "react";
import type { Ln } from "../types";

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

export interface RowRendererParams<T, K extends Record<string, any> = any> {
  readonly rowIndex: number;
  readonly row: RowNode<T>;
  readonly api: Ln.API<T, K>;
}

export type RowFullWidthPredicate<T, K extends Record<string, any> = any> = (params: {
  readonly rowIndex: number;
  readonly row: RowNode<T | null>;
  readonly api: Ln.API<T, K>;
}) => boolean;

export type RowFullWidthRenderer<T, K extends Record<string, any> = any> = (
  props: RowRendererParams<T, K>,
) => ReactNode;
export type RowDetailRenderer<T, K extends Record<string, any> = any> = (
  props: RowRendererParams<T, K>,
) => ReactNode;
