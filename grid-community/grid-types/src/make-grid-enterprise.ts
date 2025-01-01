import type { ApiEnterprise } from "./api/api-enterprise";
import type {
  ColumnBase as RawBaseColumn,
  Column as RawColumn,
  ColumnRowGroup as RawRowGroupColumn,
} from "./column/column-enterprise";
import type { PropsEnterprise } from "./props/props-enterprise";
import type { RowDataSourceEnterprise as RawRowDataSourceEnterprise } from "./row-data-source/rds-enterprise";

export type Api<D, E> = ApiEnterprise<D, RawColumn<Api<D, E>, D, E>, E>;
export type Column<D, E> = RawColumn<Api<D, E>, D, E>;
export type ColumnBase<D, E> = RawBaseColumn<Api<D, E>, D, E>;
export type ColumnRowGroup<D, E> = RawRowGroupColumn<Api<D, E>, D, E>;

export type RowDataSourceEnterprise<D, E> = RawRowDataSourceEnterprise<Api<D, E>, D, Column<D, E>>;

export type Init<D, E> = PropsEnterprise<
  Api<D, E>,
  D,
  Column<D, E>,
  E,
  ColumnBase<D, E>,
  ColumnRowGroup<D, E>
>;

export type MakeGridEnterprise<D, E> = (init: Init<D, E>) => Api<D, E>;
