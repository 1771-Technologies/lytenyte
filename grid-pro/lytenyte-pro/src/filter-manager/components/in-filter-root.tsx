import { createContext, useCallback, useContext, type PropsWithChildren } from "react";
import { useGrid } from "../../use-grid";
import { useFilterManagerState } from "../filter-state-context";
import { useInFilterItemLoader } from "./use-in-filter-item-loader";
import type { ColumnInFilterItemPro } from "@1771technologies/grid-types/pro";

interface InFilterState {
  isLoading: boolean;
  hasError: boolean;
  treeFilterItems: ColumnInFilterItemPro[];
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
