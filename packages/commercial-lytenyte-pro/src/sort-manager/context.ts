import { createContext, useContext, type Dispatch, type SetStateAction } from "react";
import type { SortItem } from "./+types.js";
import type { SortRowItem } from "./hooks/use-sort-row-item.js";
import type { Grid } from "../+types.js";

export interface SortManagerContext {
  readonly grid: Grid<any>;
  readonly sortItems: SortItem[];
  readonly setSortItems: Dispatch<SetStateAction<SortItem[]>>;
  readonly mode: boolean;
}

export const context = createContext<SortManagerContext>({} as any);

export const useSortManagerCtx = () => useContext(context);

export const rowContext = createContext<SortRowItem>({} as any);
export const useSortRowCtx = () => useContext(rowContext);
