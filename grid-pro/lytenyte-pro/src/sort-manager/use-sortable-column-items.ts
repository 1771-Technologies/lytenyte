import { useMemo } from "react";
import type { GridProReact } from "../types";

/**
 * Returns a list of the columns that are sortable for use in a dropdown. This is used by the sort
 * manager. This represents all the possible sort items a user can select from.
 */
export function useSortableColumnItems<D>({ state, api }: GridProReact<D>) {
  const columns = state.columns.use();

  const candidateColumns = useMemo(() => {
    return columns.filter((c) => api.columnIsSortable(c));
  }, [api, columns]);

  const columnItems = useMemo(() => {
    return candidateColumns.map((c) => ({ label: c.headerName ?? c.id, value: c.id }) as const);
  }, [candidateColumns]);

  return columnItems;
}
