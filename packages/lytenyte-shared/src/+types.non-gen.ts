import type { PositionFullWidthRow, PositionGridCell } from "./+types";

export interface ColumnWidthItem {
  readonly width?: number;
  readonly widthMin?: number;
  readonly widthMax?: number;
  readonly widthFlex?: number;
}

export type RowHeight = number | ((i: number) => number) | "auto" | `fill:${number}`;

export type Row = number;
export type Column = number;
export type RowSpan = number;
export type ColSpan = number;
export type Empty = 0;
export type RowColTuple = [RowSpan, ColSpan] | [Empty, Row, Column];

export interface SpanLayout {
  readonly rowTopStart: Row;
  readonly rowTopEnd: Row;
  readonly rowCenterStart: Row;
  readonly rowCenterEnd: Row;
  readonly rowCenterLast: Row;
  readonly rowBotStart: Row;
  readonly rowBotEnd: Row;

  readonly colStartStart: Column;
  readonly colStartEnd: Column;
  readonly colCenterStart: Column;
  readonly colCenterEnd: Column;
  readonly colCenterLast: Column;
  readonly colEndStart: Column;
  readonly colEndEnd: Column;
}

export type SpanFn = (r: Row, c: Column) => number;
export type RowPredicate = (r: Row) => boolean;

export type ScrollIntoViewFn = (p: { row?: number; column?: number; behavior: "instant" }) => void;
export type RootCellFn = (r: number, c: number) => PositionGridCell | PositionFullWidthRow | null;

export type ColumnPin = "start" | "end" | null;

export type ColumnGroupVisibility = "always" | "close" | "open";
export type RowGroupDisplayMode = "single-column" | "custom";

export interface ColumnAbstract {
  readonly id: string;

  readonly name?: string;
  readonly type?: "string" | "number" | "date" | "datetime" | ({} & string);

  readonly width?: number;
  readonly widthMax?: number;
  readonly widthMin?: number;
  readonly widthFlex?: number;

  readonly groupVisibility?: ColumnGroupVisibility;
  readonly groupPath?: string[];

  readonly pin?: ColumnPin;
  readonly hide?: boolean;
  readonly resizable?: boolean;
  readonly editable?: boolean;
  readonly movable?: boolean;
}
