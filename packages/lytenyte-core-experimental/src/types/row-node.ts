export interface RowAbstract {
  readonly id: string;
}

export interface RowLeaf<T = any> extends RowAbstract {
  readonly loading?: boolean;
  readonly error?: unknown;
  readonly kind: "leaf";
  readonly data: T | null;
}

export interface RowGroup extends RowAbstract {
  readonly kind: "branch";
  readonly key: string | null;
  readonly data: Record<string, unknown>;
  readonly depth: number;

  readonly loading?: boolean;
  readonly error?: unknown;

  readonly errorGroup?: unknown;
  readonly loadingGroup?: boolean;
}

export type RowNode<T> = RowLeaf<T> | RowGroup;
