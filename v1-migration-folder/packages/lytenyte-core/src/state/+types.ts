import type { LayoutMap } from "@1771technologies/lytenyte-shared";
import type { GridAtom, GridAtomReadonly } from "../+types";

export type PositionGridCellKind = "cell";
export type PositionFullWidthKind = "full-width";
export type PositionHeaderCellKind = "header-cell";
export type PositionHeaderGroupCellKind = "header-group-cell";
export type PositionFloatingCellKind = "floating-cell";

export type PositionGridCell = {
  readonly kind: PositionGridCellKind;
  readonly columnIndex: number;
  readonly rowIndex: number;

  readonly root: {
    columnIndex: number;
    rowIndex: number;
    rowSpan: number;
    colSpan: number;
  } | null;
};

export type PositionFullWidthRow = {
  readonly kind: PositionFullWidthKind;
  readonly columnIndex: number;
  readonly rowIndex: number;
};

export type PositionHeaderCell = {
  readonly kind: PositionHeaderCellKind;
  readonly columnIndex: number;
};

export type PositionHeaderGroupCell = {
  readonly kind: PositionHeaderGroupCellKind;
  readonly columnStartIndex: number;
  readonly columnEndIndex: number;
  readonly columnIndex: number;
  readonly hierarchyRowIndex: number;
};

export type PositionFloatingCell = {
  readonly kind: PositionFloatingCellKind;
  readonly columnIndex: number;
};

export type PositionUnion =
  | PositionGridCell
  | PositionFloatingCell
  | PositionHeaderCell
  | PositionFullWidthRow
  | PositionHeaderGroupCell;

export interface InternalAtoms {
  readonly headerRows: GridAtomReadonly<number>;
  readonly headerCols: GridAtomReadonly<number>;
  readonly headerHeightTotal: GridAtomReadonly<number>;
  readonly xScroll: GridAtom<number>;
  readonly yScroll: GridAtom<number>;
  readonly refreshKey: GridAtom<number>;

  readonly layout: GridAtomReadonly<LayoutMap>;

  // For focus management
  readonly focusActive: GridAtom<PositionUnion | null>;
  readonly focusPrevColIndex: GridAtom<number | null>;
  readonly focusPrevRowIndex: GridAtom<number | null>;
}
