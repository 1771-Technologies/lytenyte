import type { ColumnPin, GridAtomReadonlyUnwatchable, RowNode, RowPin } from "../../+types";

export type RowLayout<T, C extends { id: string }> =
  | RowNormalRowLayout<T, C>
  | RowFullWidthRowLayout<T>;

interface RowFullWidthRowLayout<T> {
  readonly kind: "full-width";
  readonly id: string;
  readonly rowIndex: number;
  readonly row: GridAtomReadonlyUnwatchable<RowNode<T> | null>;
  readonly rowPin: RowPin;
  readonly rowLastPinTop?: boolean;
  readonly rowFirstPinBottom?: boolean;
  readonly rowIsFocusRow?: boolean;
}

export interface RowNormalRowLayout<T, C extends { id: string }> {
  readonly kind: "row";
  readonly rowIndex: number;
  readonly row: GridAtomReadonlyUnwatchable<RowNode<T> | null>;
  readonly rowPin: RowPin;
  readonly rowLastPinTop?: boolean;
  readonly rowFirstPinBottom?: boolean;
  readonly rowIsFocusRow?: boolean;
  readonly id: string;
  readonly cells: RowCellLayout<T, C>[];
}

export interface RowCellLayout<T, C extends { id: string }> {
  readonly kind: "cell";
  readonly colSpan: number;
  readonly rowSpan: number;
  readonly id: string;
  readonly rowIndex: number;
  readonly colIndex: number;
  readonly row: GridAtomReadonlyUnwatchable<RowNode<T> | null>;
  readonly column: C;
  readonly colPin: ColumnPin;
  readonly rowPin: RowPin;
  readonly colFirstEndPin?: boolean;
  readonly colLastStartPin?: boolean;
  readonly rowLastPinTop?: boolean;
  readonly rowFirstPinBottom?: boolean;
  readonly rowIsFocusRow?: boolean;
}
