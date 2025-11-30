import type { ReactNode } from "react";
import type { RowNode } from "./row";

export type ColumnPin = "start" | "end" | null;
export type ColumnGroupVisibility = "always" | "close" | "open";

export type HeaderParams<T> = { column: Column<T> };
export type CellParams<T> = { row: RowNode<T>; column: Column<T> };
export type CellParamsWithIndex<T> = CellParams<T> & { rowIndex: number; colIndex: number };

export type PathField = { kind: "path"; path: string };

export interface Column<T> {
  readonly id: string;
  readonly name?: string;
  readonly type?: "string" | "number" | "date" | "datetime" | ({} & string);
  readonly hide?: boolean;

  readonly width?: number;
  readonly widthMax?: number;
  readonly widthMin?: number;
  readonly widthFlex?: number;

  readonly pin?: ColumnPin;

  readonly groupVisibility?: ColumnGroupVisibility;
  readonly groupPath?: string[];

  readonly colSpan?: number | ((params: CellParamsWithIndex<T>) => number);
  readonly rowSpan?: number | ((params: CellParamsWithIndex<T>) => number);

  readonly field?: string | number | PathField | ((params: CellParams<T>) => unknown);

  readonly floatingCellRenderer?: (props: HeaderParams<T>) => ReactNode;
  readonly headerRenderer?: (props: HeaderParams<T>) => ReactNode;
  readonly cellRenderer?: (props: CellParams<T>) => ReactNode;
  readonly editRenderer?: (props: CellParams<T>) => ReactNode;

  readonly resizable?: boolean | ((props: HeaderParams<T>) => boolean);
  readonly movable?: boolean | ((props: HeaderParams<T>) => boolean);
  readonly editable?: boolean | ((props: CellParams<T>) => boolean);

  readonly autosizeCellFn?: (params: CellParams<T>) => number | null | undefined;
  readonly autosizeHeaderFn?: (params: HeaderParams<T>) => number | null | undefined;
}

export interface ColumnMarker<T> {
  readonly floatingCellRenderer?: (props: HeaderParams<T>) => ReactNode;
  readonly headerRenderer?: (props: HeaderParams<T>) => ReactNode;
  readonly cellRenderer?: (props: CellParams<T>) => ReactNode;

  readonly width?: number;
  readonly pin?: Required<ColumnPin>;

  readonly autosizeCellFn?: (params: CellParams<T>) => number | null | undefined;
  readonly autosizeHeaderFn?: (params: HeaderParams<T>) => number | null | undefined;
}

export type ColumnBase<T> = Omit<Column<T>, "pin" | "field">;

export interface ColumnMeta<T> {
  readonly columnsVisible: Column<T>[];
  readonly columnLookup: Map<string, Column<T>>;
  readonly columnVisibleStartCount: number;
  readonly columnVisibleCenterCount: number;
  readonly columnVisibleEndCount: number;
}

export interface ColumnGroupMeta {
  readonly colIdToGroupIds: Map<string, string[]>;
  readonly validGroupIds: Set<string>;
  readonly groupIsCollapsible: Map<string, boolean>;
}
