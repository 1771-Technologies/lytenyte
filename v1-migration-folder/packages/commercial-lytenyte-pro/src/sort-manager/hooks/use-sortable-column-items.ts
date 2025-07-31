import { useMemo } from "react";
import type { Grid } from "../../+types";

export function useSortableColumnItems(grid: Grid<any>, pivotMode: boolean) {
  const columns = grid.state.columns.useValue();
  const pivotColumns = grid.state.columnPivotColumns.useValue();
  const base = grid.state.columnBase.useValue();

  const candidateColumns = useMemo(() => {
    const candidates = pivotMode ? pivotColumns : columns;

    return candidates.filter((c) => c.uiHints?.sortable ?? base.uiHints?.sortable);
  }, [base.uiHints?.sortable, columns, pivotColumns, pivotMode]);

  return useMemo(() => {
    return candidateColumns.map((c) => ({ label: c.name ?? c.id, value: c.id }));
  }, [candidateColumns]);
}
