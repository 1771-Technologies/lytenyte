import { useCallback, useEffect, useState } from "react";
import { isFilterComplete } from "./is-filter-complete";
import { combinedToFlat } from "./combined-to-flat";
import type { FlatSimpleFilters } from "./types";
import type { ApiProReact, ColumnProReact } from "../types";

export function useSimpleFilters<D>(
  api: ApiProReact<D>,
  column: ColumnProReact<D>,
  showConditionalWhenFilterValid: boolean,
) {
  const isPivot = api.columnIsPivot(column);

  const state = api.getState();
  const filterModel = state.filterModel.use();
  const pivotFilterModel = state.internal.columnPivotFilterModel.use();
  const filters = isPivot ? pivotFilterModel : filterModel;

  const [flatFilters, setFlatFilters] = useState(() => {
    const columnId = column.id;
    const filter = filters[columnId];
    return combinedToFlat(filter?.simple, column);
  });

  useEffect(() => {
    const columnId = column.id;
    const filter = filters[columnId];
    setFlatFilters(combinedToFlat(filter?.simple, column));
  }, [column, filters]);

  const onFilterChange = useCallback(
    (flat: FlatSimpleFilters) => {
      if (flat.length === 1 && isFilterComplete(flat[0][0]) && showConditionalWhenFilterValid) {
        const next = [
          [flat[0][0], "and"],
          [{ columnId: column.id, kind: flat[0][0].kind }, null],
        ] as FlatSimpleFilters;
        setFlatFilters(next);
        return;
      }
      setFlatFilters(flat);
    },
    [column.id, showConditionalWhenFilterValid],
  );

  return { flatFilters, onFilterChange, filters, isPivot };
}
