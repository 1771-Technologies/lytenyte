import { createContext, useCallback, useContext, type PropsWithChildren } from "react";
import { useGrid } from "../../use-grid";
import { useFilterManagerState } from "../filter-state-context";
import type { ColumnInFilterItem } from "@1771technologies/grid-types/enterprise";
import { useInFilterItemLoader } from "./use-in-filter-item-loader";

interface InFilterState {
  isLoading: boolean;
  hasError: boolean;
  treeFilterItems: ColumnInFilterItem[];
  retry: () => never[] | undefined;
}

const context = createContext(null as unknown as InFilterState);

export function InFilterRoot(props: PropsWithChildren) {
  const grid = useGrid();
  const { column } = useFilterManagerState();

  const getItems = useCallback(() => {
    return grid.api.columnInFilterItems(column);
  }, [column, grid.api]);

  const state = useInFilterItemLoader(getItems);

  return <context.Provider value={state}>{props.children}</context.Provider>;
}

export const useInFilterState = () => useContext(context);
