import type { ApiPro } from "../export-pro";
import type {
  FilterCombined,
  FilterDate,
  FilterFunction,
  FilterNumber,
  FilterText,
} from "./filters";

export type ColumnInFilterItemLeaf = {
  readonly kind: "leaf";
  readonly label: string;
  readonly value: unknown;
};

export type ColumnInFilterItemParent = {
  readonly kind: "parent";
  readonly label: string;
  readonly children: ColumnInFilterItem[];
};
export type ColumnInFilterItem = ColumnInFilterItemLeaf | ColumnInFilterItemParent;

export type FilterIn = {
  readonly kind: "in";
  readonly operator: "in" | "notin";
  readonly columnId: string;
  readonly set: Set<unknown>;
};

export type ColumnFilter<A, D> =
  | FilterText
  | FilterNumber
  | FilterDate
  | FilterCombined<A, D>
  | FilterFunction<A, D>;

export type ColumnFilterModel<A, D> = {
  [columnId: string]: { simple?: ColumnFilter<A, D> | null; set?: FilterIn | null };
};

// Additional
export type ColumnInFilterItemLeafPro = ColumnInFilterItemLeaf;
export type ColumnInFilterItemParentPro = ColumnInFilterItemParent;
export type ColumnInFilterItemPro = ColumnInFilterItem;
export type FilterInPro = FilterIn;
export type ColumnFilterPro<D, E> = ColumnFilter<ApiPro<D, E>, D>;
export type ColumnFilterModelPro<D, E> = ColumnFilterModel<ApiPro<D, E>, D>;
