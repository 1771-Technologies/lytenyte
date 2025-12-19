import type { API } from "./api.js";
import type { ColumnAbstract } from "./column";
import type { RowAbstract } from "./row-node.js";

type A = API<any, any>;

export interface RowParams<Row extends RowAbstract, APIType extends A> {
  readonly rowIndex: number;
  readonly row: Row;
  readonly api: APIType;
}

export interface HeaderParams<Column extends ColumnAbstract, APIType extends A> {
  readonly column: Column;
  readonly api: APIType;
}

export interface CellParams<Row extends RowAbstract, Column extends ColumnAbstract, APIType extends A> {
  readonly column: Column;
  readonly row: Row;
  readonly api: APIType;
}

export interface CellParamsWithIndex<Row extends RowAbstract, Column extends ColumnAbstract, APIType extends A>
  extends CellParams<Row, Column, APIType> {
  readonly rowIndex: number;
  readonly colIndex: number;
}

type CA = ColumnAbstract;
type RA = RowAbstract;

export interface Renderers<R extends RA, C extends CA, AT extends A, Return> {
  readonly header: (props: HeaderParams<C, AT>) => Return;
  readonly cell: (props: CellParamsWithIndex<R, C, AT>) => Return;
  readonly row: (props: RowParams<R, AT>) => Return;
}
