import type { ApiCommunity } from "./api/api-core.js";
import type { Column, ColumnBase, ColumnRowGroup } from "./column/column-core.js";

export type ApiCore<D, E> = ApiCommunity<D, ColumnCore<D, E>, E>;
export type ColumnCore<D, E> = Column<ApiCore<D, E>, D, E>;
export type ColumnBaseCore<D, E> = ColumnBase<ApiCore<D, E>, D, E>;
export type ColumnRowGroupCore<D, E> = ColumnRowGroup<ApiCore<D, E>, D, E>;

// Additional types

export type { AggBuiltInsCore, AggFnCore, AggFnsCore, AggModelCore } from "./types/aggregations.js";
