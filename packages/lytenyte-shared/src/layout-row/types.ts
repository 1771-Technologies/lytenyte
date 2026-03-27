import type { ColumnPin, RowPin } from "../types.js";

export interface LayoutCell {
  readonly kind: "cell";
  readonly id: string;
  readonly type: string;
  readonly colSpan: number;
  readonly rowSpan: number;
  readonly isDeadRow: boolean;
  readonly isDeadCol: boolean;
  readonly rowIndex: number;
  readonly colIndex: number;
  readonly colPin: ColumnPin;
  readonly rowPin: RowPin;
  readonly colFirstEndPin?: boolean;
  readonly colLastStartPin?: boolean;
  readonly rowLastPinTop?: boolean;
  readonly rowFirstPinBottom?: boolean;
  readonly rowIsFocusRow?: boolean;
  readonly root: LayoutCell | null;
}

export interface LayoutFullWidthRow {
  readonly kind: "full-width";
  readonly id: string;
  readonly rowIndex: number;
  readonly rowPin: RowPin;
  readonly rowLastPinTop?: boolean;
  readonly rowFirstPinBottom?: boolean;

  /**
   * @deprecated
   */
  readonly rowIsFocusRow?: boolean;
}

export interface LayoutRowWithCells {
  readonly kind: "row";
  readonly id: string;
  readonly rowIndex: number;
  readonly rowPin: RowPin;
  readonly rowLastPinTop?: boolean;
  readonly rowFirstPinBottom?: boolean;
  readonly rowIsFocusRow?: boolean;
  readonly cells: LayoutCell[];
}

export type LayoutRow = LayoutRowWithCells | LayoutFullWidthRow;
