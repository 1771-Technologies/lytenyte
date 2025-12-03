import type { ColumnPin } from "../types/column";

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
