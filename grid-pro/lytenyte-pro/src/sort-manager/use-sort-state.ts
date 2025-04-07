import { useEffect, useState } from "react";
import { sortModelToSortItems } from "./sort-model-to-sort-items.js";
import type { GridProReact } from "../types.js";

export interface SortItem {
  readonly columnId?: string;
  readonly label?: string;
  readonly sortOn?:
    | "values"
    | "values_absolute"
    | "values_accented"
    | "values_nulls_first"
    | "values_absolute_nulls_first"
    | "values_accented_nulls_first"
    | "values_absolute_accented_nulls_first";
  readonly sortDirection: "ascending" | "descending";
}

export function useSortState<D>(grid: GridProReact<D>) {
  const [state, setState] = useState<SortItem[]>(() => {
    const initial = sortModelToSortItems(grid.state.sortModel.peek(), grid);
    if (initial.length) return initial;

    return [{ sortDirection: "ascending" }];
  });

  useEffect(() => {
    const dispose = grid.state.sortModel.watch(() => {
      const nextModel = sortModelToSortItems(grid.state.sortModel.peek(), grid);

      if (!nextModel.length) setState([{ sortDirection: "ascending" }]);
      else setState(nextModel);
    }, false);

    return () => dispose();
  }, [grid]);

  return [state, setState] as const;
}
