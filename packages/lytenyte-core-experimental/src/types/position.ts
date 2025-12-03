export interface PositionDetailCell {
  readonly kind: "detail";
  readonly rowIndex: number;
  readonly colIndex: number;
}

export interface PositionFloatingCell {
  readonly kind: "floating-cell";
  readonly colIndex: number;
}

export interface PositionFullWidthRow {
  readonly kind: "full-width";
  readonly rowIndex: number;
  readonly colIndex: number;
}

export interface PositionGridCell {
  readonly kind: "cell";
  readonly rowIndex: number;
  readonly colIndex: number;
  readonly root: PositionGridCellRoot | null;
}

export interface PositionGridCellRoot {
  readonly colIndex: number;
  readonly rowIndex: number;
  readonly rowSpan: number;
  readonly colSpan: number;
}

export interface PositionHeaderCell {
  readonly kind: "header-cell";
  readonly colIndex: number;
}

export interface PositionHeaderGroupCell {
  readonly kind: "header-group-cell";
  readonly columnStartIndex: number;
  readonly columnEndIndex: number;
  readonly hierarchyRowIndex: number;
  readonly colIndex: number;
}

/**
 * Union of all valid focusable positions in the grid: cells, headers, full width rows, etc.
 *
 *   @group Navigation
 */
export type PositionUnion =
  | PositionGridCell
  | PositionFloatingCell
  | PositionHeaderCell
  | PositionDetailCell
  | PositionFullWidthRow
  | PositionHeaderGroupCell;
