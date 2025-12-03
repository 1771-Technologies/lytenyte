import type { Column, ColumnPin } from "./column";
import type { RowAtom, RowNode, RowPin } from "./row";

export interface LayoutHeaderCell<T> {
  readonly kind: "cell";
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
  readonly column: Column<T>;
}

export interface LayoutHeaderFloating<T> {
  readonly kind: "floating";
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
  readonly column: Column<T>;
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

export type HeaderLayoutCell<T> = LayoutHeaderCell<T> | LayoutHeaderFloating<T> | LayoutHeaderGroup;

export interface LayoutCell<T> {
  readonly kind: "cell";
  readonly colSpan: number;
  readonly rowSpan: number;
  readonly isDeadRow: boolean;
  readonly isDeadCol: boolean;
  readonly id: string;
  readonly rowIndex: number;
  readonly colIndex: number;
  readonly row: RowAtom<RowNode<T> | null>;
  readonly column: Column<T>;
  readonly colPin: ColumnPin;
  readonly rowPin: RowPin;
  readonly colFirstEndPin?: boolean;
  readonly colLastStartPin?: boolean;
  readonly rowLastPinTop?: boolean;
  readonly rowFirstPinBottom?: boolean;
  readonly rowIsFocusRow?: boolean;
}

export interface LayoutFullWidthRow<T> {
  readonly kind: "full-width";
  readonly id: string;
  readonly rowIndex: number;
  readonly row: RowAtom<RowNode<T> | null>;
  readonly rowPin: RowPin;
  readonly rowLastPinTop?: boolean;
  readonly rowFirstPinBottom?: boolean;
  readonly rowIsFocusRow?: boolean;
}

export interface LayoutRowWithCells<T> {
  readonly kind: "row";
  readonly rowIndex: number;
  readonly row: RowAtom<RowNode<T> | null>;
  readonly rowPin: RowPin;
  readonly rowLastPinTop?: boolean;
  readonly rowFirstPinBottom?: boolean;
  readonly rowIsFocusRow?: boolean;
  readonly id: string;
  readonly cells: LayoutCell<T>[];
}

export type LayoutRow<T> = LayoutRowWithCells<T> | LayoutFullWidthRow<T>;

export interface RowView<T> {
  readonly top: LayoutRow<T>[];
  readonly center: LayoutRow<T>[];
  readonly bottom: LayoutRow<T>[];
  readonly rowFocusedIndex: number | null;
  readonly rowFirstCenter: number;
}
