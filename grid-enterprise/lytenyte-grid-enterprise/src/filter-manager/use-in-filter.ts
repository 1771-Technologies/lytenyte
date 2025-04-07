import { useEffect, useMemo, useState } from "react";
import type { ApiProReact, ColumnProReact, FilterInProReact } from "../types";

export function useInFilter<D>(api: ApiProReact<D>, column: ColumnProReact<D>) {
  const isPivot = api.columnIsPivot(column);
  const state = api.getState();

  const filterModel = state.filterModel.use();
  const pivotFilterModel = state.internal.columnPivotFilterModel.use();
  const filters = isPivot ? pivotFilterModel : filterModel;

  const thisFilter = useMemo(() => {
    const filter = filters[column.id]?.set;

    if (!filter) return null;

    return filter as FilterInProReact;
  }, [column.id, filters]);

  const [values, setValues] = useState(() => (thisFilter ? new Set(thisFilter.set) : null));

  useEffect(() => {
    setValues(() => {
      const filter = filters[column.id]?.set;
      if (!filter) return null;

      return new Set(filter ? new Set(filter.set) : null);
    });
  }, [column.id, filters]);

  return { values, setValues };
}
