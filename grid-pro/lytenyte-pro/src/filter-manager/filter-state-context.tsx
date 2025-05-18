import type { ColumnFilterModelProReact, ColumnProReact } from "../types";
import type { FlatSimpleFilters } from "./types";
import {
  createContext,
  useContext,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from "react";

export interface FilterManagerState {
  column: ColumnProReact<any>;

  flatFilters: FlatSimpleFilters;
  onFilterChange: (flat: FlatSimpleFilters) => void;
  filters: ColumnFilterModelProReact<any>;
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
