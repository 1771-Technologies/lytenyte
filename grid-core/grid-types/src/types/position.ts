export type PositionGridCellKind = 1;
export type PositionFullWidthKind = 2;
export type PositionHeaderCellKind = 3;
export type PositionHeaderGroupCellKind = 4;
export type PositionFloatingCellKind = 5;

export type PositionGridCell = {
  readonly kind: PositionGridCellKind;
  readonly columnIndex: number;
  readonly rowIndex: number;

  readonly root: {
    columnIndex: number;
    rowIndex: number;
    rowSpan: number;
    columnSpan: number;
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

export type Position =
  | PositionGridCell
  | PositionFloatingCell
  | PositionHeaderCell
  | PositionFullWidthRow
  | PositionHeaderGroupCell;

export type PositionFocus = { kind: "cell"; rowIndex: number; columnIndex: number };

// Additional
export type PositionGridCellKindCore = PositionGridCellKind;
export type PositionFullWidthKindCore = PositionFullWidthKind;
export type PositionHeaderCellKindCore = PositionHeaderCellKind;
export type PositionHeaderGroupCellKindCore = PositionHeaderGroupCellKind;
export type PositionFloatingCellKindCore = PositionFloatingCellKind;
export type PositionGridCellCore = PositionGridCell;
export type PositionFullWidthRowCore = PositionFullWidthRow;
export type PositionHeaderCellCore = PositionHeaderCell;
export type PositionHeaderGroupCellCore = PositionHeaderGroupCell;
export type PositionFloatingCellCore = PositionFloatingCell;
export type PositionCore = Position;
export type PositionFocusCore = PositionFocus;

export type PositionGridCellKindPro = PositionGridCellKind;
export type PositionFullWidthKindPro = PositionFullWidthKind;
export type PositionHeaderCellKindPro = PositionHeaderCellKind;
export type PositionHeaderGroupCellKindPro = PositionHeaderGroupCellKind;
export type PositionFloatingCellKindPro = PositionFloatingCellKind;
export type PositionGridCellPro = PositionGridCell;
export type PositionFullWidthRowPro = PositionFullWidthRow;
export type PositionHeaderCellPro = PositionHeaderCell;
export type PositionHeaderGroupCellPro = PositionHeaderGroupCell;
export type PositionFloatingCellPro = PositionFloatingCell;
export type PositionPro = Position;
export type PositionFocusPro = PositionFocus;
