import type { Column, ColumnPin } from "./column";

export interface HeaderCellLayout<T> {
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

export interface HeaderCellFloating<T> {
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

export interface HeaderGroupCellLayout {
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

export interface HeaderLayout<T> {
  readonly maxRow: number;
  readonly maxCol: number;
  readonly layout: HeaderLayoutCell<T>[][];
}

export type HeaderLayoutCell<T> =
  | HeaderCellLayout<T>
  | HeaderCellFloating<T>
  | HeaderGroupCellLayout;
