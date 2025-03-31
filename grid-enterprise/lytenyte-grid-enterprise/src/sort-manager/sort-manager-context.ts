import { createContext, useContext, type Dispatch, type SetStateAction } from "react";
import type { SortItem } from "./use-sort-state.js";

export const SortManagerContext = createContext<
  readonly [SortItem[], Dispatch<SetStateAction<SortItem[]>>]
>([] as any);

export const useSortManagerContext = () => useContext(SortManagerContext);
