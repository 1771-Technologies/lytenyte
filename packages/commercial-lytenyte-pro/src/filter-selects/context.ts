import { createContext, useContext, type Dispatch, type SetStateAction } from "react";
import type { FilterSelectFlat } from "./use-filter-select";

export interface FilterSelectRoot {
  readonly defaultFilter: FilterSelectFlat;
  readonly filters: FilterSelectFlat[];
  readonly setFilters: Dispatch<SetStateAction<FilterSelectFlat[]>>;
  readonly maxCount: number;
  readonly apply: () => void;
  readonly reset: () => void;
  readonly clear: () => void;
}

export const context = createContext<FilterSelectRoot>({} as any);
export const useFilterSelectRoot = () => useContext(context);
