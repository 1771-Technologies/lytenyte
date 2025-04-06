import type { ApiEnterprise } from "./api/api-pro.js";
import type { Column, ColumnBase, ColumnRowGroup } from "./column/column-pro.js";

export type ApiPro<D, E> = ApiEnterprise<D, ColumnPro<D, E>, E>;
export type ColumnPro<D, E> = Column<ApiPro<D, E>, D, E>;
export type ColumnBasePro<D, E> = ColumnBase<ApiPro<D, E>, D, E>;
export type ColumnRowGroupPro<D, E> = ColumnRowGroup<ApiPro<D, E>, D, E>;

export type { AggBuiltInsPro, AggFnPro, AggFnsPro, AggModelPro } from "./types/aggregations.js";
