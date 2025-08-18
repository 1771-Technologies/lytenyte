import type { ColumnPin } from "../+types.js";

export interface Cell {
  readonly rowIndex: number;
  readonly colIndex: number;
  readonly colSpan: number;
  readonly rowSpan: number;
  readonly rowLastPinTop?: boolean;
  readonly rowFirstPinBottom?: boolean;
  readonly colLastStartPin?: boolean;
  readonly colFirstEndPin?: boolean;
  readonly colPin?: ColumnPin;
  readonly rowPin?: "top" | "bottom" | null;
}

export interface CellHeader {
  readonly colStart: number;
  readonly colEnd: number;
  readonly colSpan: number;
  readonly rowStart: number;
  readonly rowEnd: number;
  readonly colLastStartPin?: boolean;
  readonly colFirstEndPin?: boolean;
  readonly colPin: ColumnPin;
}
