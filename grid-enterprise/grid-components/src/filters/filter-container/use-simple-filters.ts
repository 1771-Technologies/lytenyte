import { useCallback, useEffect, useState } from "react";
import { combinedFilterIsForColumn } from "./combined-filter-is-for-column";
import { combinedToFlat } from "./combined-to-flat";
import { isFilterComplete } from "./is-filter-complete";
import type { ApiEnterpriseReact, ColumnEnterpriseReact } from "@1771technologies/grid-types";
import type { FlatSimpleFilters } from "../simple-filter/simple-filter";
import type { ColumnFilter } from "@1771technologies/grid-types/enterprise";

export function useSimpleFilters<D>(
  api: ApiEnterpriseReact<D>,
  column: ColumnEnterpriseReact<D>,
  showConditionalWhenFilterValid: boolean,
) {
  const isPivot = api.columnIsPivot(column);

  const state = api.getState();
  const filterModel = state.filterModel.use();
  const pivotFilterModel = state.internal.columnPivotFilterModel.use();
  const filters = isPivot ? pivotFilterModel : filterModel;

  const [flatFilters, setFlatFilters] = useState(() => {
    const columnId = column.id;
    const filterIndex = findInternalFilterIndex(filters, columnId);
    const filter = filters[filterIndex];
    return combinedToFlat(filter, column);
  });

  useEffect(() => {
    const columnId = column.id;
    const filterIndex = findInternalFilterIndex(filters, columnId);
    const filter = filters[filterIndex];
    setFlatFilters(combinedToFlat(filter, column));
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

function findInternalFilterIndex<D>(
  filters: ColumnFilter<ApiEnterpriseReact<D>, D>[],
  columnId: string,
) {
  const filterIndex = filters.findIndex((c) => {
    if (c.kind === "registered" || c.kind === "function" || c.kind === "in") return;

    if (!c.isInternal) return false;
    if (c.kind === "combined") {
      return combinedFilterIsForColumn(c, columnId);
    }

    return c.columnId === columnId;
  });

  return filterIndex;
}
