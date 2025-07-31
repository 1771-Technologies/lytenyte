import { useCallback, useEffect, useRef, useState } from "react";
import type { Grid } from "../../+types";
import type { SortItem } from "../+types";
import { sortModelToSortItems } from "../utils/sort-model-to-sort-items";
import { itemsWithIdToMap } from "@1771technologies/lytenyte-js-utils";
import { useSortRowItems } from "./use-sort-row-item";
import { useEvent } from "@1771technologies/lytenyte-react-hooks";

export interface UseSortManagerArgs<T> {
  readonly grid: Grid<T>;
  readonly pivotMode?: boolean;
}

export function useSortManager<T>({ grid, pivotMode }: UseSortManagerArgs<T>) {
  const statePivotMode = grid.state.columnPivotMode.useValue();

  const mode = pivotMode ?? statePivotMode;

  const cb = useCallback<() => SortItem[]>(() => {
    if (mode) {
      const pivotSortModel = grid.state.columnPivotModel.get().sorts;
      const lookup = itemsWithIdToMap(grid.state.columnPivotColumns.get());

      const model = sortModelToSortItems(pivotSortModel, lookup);

      if (!model.length) return [{ sortDirection: "ascending", isCustom: false }];
      return model;
    } else {
      const sortModel = grid.state.sortModel.get();
      const lookup = itemsWithIdToMap(grid.state.columns.get());

      const model = sortModelToSortItems(sortModel, lookup);

      if (!model.length) return [{ sortDirection: "ascending", isCustom: false }];
      return model;
    }
  }, [
    grid.state.columnPivotColumns,
    grid.state.columnPivotModel,
    grid.state.columns,
    grid.state.sortModel,
    mode,
  ]);

  const fn = useEvent<() => SortItem[]>(() => cb());

  const [sortItems, setSortItems] = useState<SortItem[]>(() => {
    return cb();
  });

  const prevMode = useRef(mode);
  useEffect(() => {
    if (prevMode.current !== mode) {
      setSortItems(fn());
      prevMode.current = mode;
    }

    if (mode) {
      return grid.state.columnPivotModel.watch(() => {
        setSortItems(fn());
      });
    } else {
      return grid.state.sortModel.watch(() => {
        setSortItems(fn());
      });
    }
  }, [fn, grid.state.columnPivotModel, grid.state.sortModel, mode]);

  const sortRows = useSortRowItems(sortItems, setSortItems, grid, mode);

  return { rootProps: { sortItems, setSortItems, mode, grid }, rows: sortRows };
}
