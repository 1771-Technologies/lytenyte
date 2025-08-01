import { useEffect, useState } from "react";
import type {
  FilterCombination,
  FilterDate,
  FilterModelItem,
  FilterNumber,
  FilterString,
  Grid,
} from "../../+types";
import { useEvent } from "@1771technologies/lytenyte-react-hooks";

export function useSimpleFilter<T>(grid: Grid<T>, pivotMode?: boolean) {
  const pivotFilterModel = grid.state.columnPivotModel.useValue().filters;
  const filterModel = grid.state.filterModel.useValue();

  const currentMode = grid.state.columnPivotMode.useValue();

  const isPivot = pivotMode ?? currentMode;

  const model = isPivot ? pivotFilterModel : filterModel;

  const [filters, setFilters] = useState(() => {
    const simpleFilters = model.filter((f) => {
      return isColumnFilter(f);
    }) as (FilterCombination | FilterString | FilterNumber | FilterDate)[];

    return simpleFilters;
  });

  const getSimpleFilters = useEvent(() => {
    const filtersForThisColumn = model.filter((f) => {
      return isColumnFilter(f);
    }) as (FilterCombination | FilterString | FilterNumber | FilterDate)[];

    return filtersForThisColumn;
  });

  useEffect(() => {
    if (isPivot) {
      return grid.state.columnPivotModel.watch(() => {
        setFilters(getSimpleFilters());
      });
    } else {
      return grid.state.filterModel.watch(() => {
        setFilters(getSimpleFilters());
      });
    }
  }, [getSimpleFilters, grid.state.columnPivotModel, grid.state.filterModel, isPivot]);

  return { rootProps: { filters, setFilters } };
}

function isColumnFilter(filter: FilterModelItem<any>): boolean {
  if (filter.kind === "in") return false;
  return true;
}
