import type { ColumnFilterModel } from "@1771technologies/grid-types/enterprise";
import type { FlatSimpleFilters } from "./types";
import type { ApiEnterpriseReact } from "@1771technologies/grid-types";
import {
  createContext,
  useContext,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from "react";

export interface FilterManagerState {
  flatFilters: FlatSimpleFilters;
  onFilterChange: (flat: FlatSimpleFilters) => void;
  filters: ColumnFilterModel<ApiEnterpriseReact<any>, any>;
  isPivot: boolean;

  inFilterValue: Set<unknown> | null;
  setInFilterValue: Dispatch<SetStateAction<Set<unknown> | null>>;
}

const context = createContext(null as unknown as FilterManagerState);

export function FilterManagerStateProvider(
  props: PropsWithChildren<{ value: FilterManagerState }>,
) {
  return <context.Provider value={props.value}>{props.children}</context.Provider>;
}

export const useFilterManagerState = () => useContext(context);
