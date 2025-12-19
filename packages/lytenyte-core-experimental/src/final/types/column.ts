import type { ColumnAbstract } from "@1771technologies/lytenyte-shared";
import type { API } from "./api";
import type { CellParams, HeaderParams, Renderers } from "./rendering";
import type { RowAbstract } from "./row-node";

export type PathField = { kind: "path"; path: string };

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
