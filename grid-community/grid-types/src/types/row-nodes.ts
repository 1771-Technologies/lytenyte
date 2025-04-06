import type { RowPin } from "./row";

export type RowLeafKind = 1;
export type RowGroupKind = 2;
export type RowTotalKind = 3;

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

export interface RowNodeTotal extends RowNodeBase {
  readonly kind: RowTotalKind;
  readonly data: Record<string, unknown>;
  readonly rowPin: RowPin;
}

export type RowNode<D = unknown> = RowNodeLeaf<D> | RowNodeGroup | RowNodeTotal;
export type RowLeafOrRowTotal<D> = RowNodeLeaf<D> | RowNodeTotal;

// Simplified
export type RowLeafKindCore = RowLeafKind;
export type RowGroupKindCore = RowGroupKind;
export type RowTotalKindCore = RowTotalKind;
export type RowNodeBaseCore = RowNodeBase;
export type RowNodeLeafCore<D> = RowNodeLeaf<D>;
export type RowNodeGroupCore = RowNodeGroup;
export type RowNodeTotalCore = RowNodeTotal;
export type RowNodeCore<D> = RowNode<D>;
export type RowLeafOrRowTotalCore<D> = RowLeafOrRowTotal<D>;

export type RowLeafKindPro = RowLeafKind;
export type RowGroupKindPro = RowGroupKind;
export type RowTotalKindPro = RowTotalKind;
export type RowNodeBasePro = RowNodeBase;
export type RowNodeLeafPro<D> = RowNodeLeaf<D>;
export type RowNodeGroupPro = RowNodeGroup;
export type RowNodeTotalPro = RowNodeTotal;
export type RowNodePro<D> = RowNode<D>;
export type RowLeafOrRowTotalPro<D> = RowLeafOrRowTotal<D>;
