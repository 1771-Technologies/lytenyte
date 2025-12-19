import type { API } from "./api";
import type { CellParams, HeaderParams, Renderers } from "./rendering";
import type { RowAbstract } from "./row-node";

export type ColumnPin = "start" | "end" | null;
export type ColumnGroupVisibility = "always" | "close" | "open";
export type PathField = { kind: "path"; path: string };

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

export interface ColumnExtension<
  Row extends RowAbstract,
  Column extends ColumnAbstract,
  APIType extends API<Row, object>,
  Return,
> {
  readonly field?: string | number | PathField | ((params: CellParams<Row, Column, APIType>) => unknown);
  readonly autosizeCellFn?: (params: CellParams<Row, Column, APIType>) => number | null | undefined;
  readonly autosizeHeaderFn?: (params: HeaderParams<Column, APIType>) => number | null | undefined;

  readonly floatingCellRenderer?: Renderers<Row, Column, APIType, Return>["header"];
  readonly headerRenderer?: Renderers<Row, Column, APIType, Return>["header"];
  readonly cellRenderer?: Renderers<Row, Column, APIType, Return>["cell"];
  readonly editRenderer?: Renderers<Row, Column, APIType, Return>["cell"];
}
