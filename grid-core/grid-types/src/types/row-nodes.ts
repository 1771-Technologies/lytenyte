import type { RowPin } from "./row";

export type RowLeafKind = 1;
export type RowGroupKind = 2;

export interface RowNodeBase {
  readonly id: string;
  readonly rowIndex: number | null;
  readonly loading?: boolean;
  readonly error?: boolean;
}

export interface RowNodeLeaf<D = unknown> extends RowNodeBase {
  readonly kind: RowLeafKind;
  readonly data: D;
  readonly rowPin: RowPin;
}

export interface RowNodeGroup extends RowNodeBase {
  readonly kind: RowGroupKind;
  readonly pathKey: string;
  readonly data: Record<string, unknown>;
}

export type RowNode<D = unknown> = RowNodeLeaf<D> | RowNodeGroup;

// Simplified
export type RowLeafKindCore = RowLeafKind;
export type RowGroupKindCore = RowGroupKind;
export type RowNodeBaseCore = RowNodeBase;
export type RowNodeLeafCore<D> = RowNodeLeaf<D>;
export type RowNodeGroupCore = RowNodeGroup;
export type RowNodeCore<D> = RowNode<D>;

export type RowLeafKindPro = RowLeafKind;
export type RowGroupKindPro = RowGroupKind;
export type RowNodeBasePro = RowNodeBase;
export type RowNodeLeafPro<D> = RowNodeLeaf<D>;
export type RowNodeGroupPro = RowNodeGroup;
export type RowNodePro<D> = RowNode<D>;
