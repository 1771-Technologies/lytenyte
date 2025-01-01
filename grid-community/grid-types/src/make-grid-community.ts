import type { ApiCommunity } from "./api/api-community";
import type {
  ColumnBase as RawBaseColumn,
  Column as RawColumn,
  ColumnRowGroup as RawRowGroupColumn,
} from "./column/column-community";
import type { PropsCommunity } from "./props/props-community";
import type { RowDataSource } from "./row-data-source/rds-community";

export type Api<D, E> = ApiCommunity<D, RawColumn<Api<D, E>, D, E>, E>;
export type Column<D, E> = RawColumn<Api<D, E>, D, E>;

export type ColumnBase<D, E> = RawBaseColumn<Api<D, E>, D, E>;
export type ColumnRowGroup<D, E> = RawRowGroupColumn<Api<D, E>, D, E>;

export type Init<D, E> = PropsCommunity<
  Api<D, E>,
  D,
  Column<D, E>,
  E,
  ColumnBase<D, E>,
  ColumnRowGroup<D, E>
>;

export type RowDataSourceBackingCommunity<D, E> = RowDataSource<Api<D, E>, D>;

export type MakeGridCommunity<D, E> = (init: Init<D, E>) => Api<D, E>;
