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

  /**
   * @deprecated
   */
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

  /**
   * @deprecated
   */
  readonly rowIsFocusRow?: boolean;
  readonly cells: LayoutCell[];
}

export type LayoutRow = LayoutRowWithCells | LayoutFullWidthRow;

export interface RowView {
  readonly top: LayoutRow[];
  readonly center: LayoutRow[];
  readonly bottom: LayoutRow[];
  readonly rowFocusedIndex: number | null;
  readonly rowFirstCenter: number;
}

export interface LayoutHeaderCell {
  readonly kind: "cell";
  readonly type: string;
  readonly id: string;
  readonly rowStart: number;
  readonly rowEnd: number;
  readonly rowSpan: number;
  readonly colStart: number;
  readonly colEnd: number;
  readonly colSpan: number;
  readonly colPin: ColumnPin;
  readonly colFirstEndPin?: boolean;
  readonly colLastStartPin?: boolean;
}

export interface LayoutHeaderFloating {
  readonly kind: "floating";
  readonly id: string;
  readonly type: string;
  readonly rowStart: number;
  readonly rowEnd: number;
  readonly rowSpan: number;
  readonly colStart: number;
  readonly colEnd: number;
  readonly colSpan: number;
  readonly colPin: ColumnPin;
  readonly colFirstEndPin?: boolean;
  readonly colLastStartPin?: boolean;
}

export interface LayoutHeaderGroup {
  readonly kind: "group";
  readonly id: string;
  readonly idOccurrence: string;
  readonly rowStart: number;
  readonly rowEnd: number;
  readonly rowSpan: number;
  readonly colStart: number;
  readonly colEnd: number;
  readonly colSpan: number;
  readonly colPin: ColumnPin;
  readonly colFirstEndPin?: boolean;
  readonly colLastStartPin?: boolean;
  readonly isCollapsible: boolean;
  readonly groupPath: string[];
  readonly columnIds: string[];
  readonly start: number;
  readonly end: number;
  readonly isHiddenMove?: boolean;
}

export type LayoutHeader = LayoutHeaderCell | LayoutHeaderFloating | LayoutHeaderGroup;
