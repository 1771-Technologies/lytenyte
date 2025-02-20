import type { ApiEnterpriseReact, ColumnEnterpriseReact } from "@1771technologies/grid-types";
import type { FilterIn } from "@1771technologies/grid-types/enterprise";
import { useEffect, useMemo, useState } from "react";

export function useInFilter<D>(api: ApiEnterpriseReact<D>, column: ColumnEnterpriseReact<D>) {
  const isPivot = api.columnIsPivot(column);
  const state = api.getState();

  const filterModel = state.filterModel.use();
  const pivotFilterModel = state.internal.columnPivotFilterModel.use();
  const filters = isPivot ? pivotFilterModel : filterModel;

  const thisFilter = useMemo(() => {
    const filter = filters[column.id]?.set;

    if (!filter) return null;

    return filter as FilterIn;
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
