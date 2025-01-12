import type { StoreEnterpriseReact } from "@1771technologies/grid-types";
import { useMemo } from "react";
import type { SelectItem } from "../select/select";

export function useColumnsSelectItems<D>({ state, api }: StoreEnterpriseReact<D>) {
  const columns = state.columns.use();
  const sortModel = state.sortModel.use();

  const columnsWithSort = useMemo(() => {
    return new Set(sortModel.map((c) => c.columnId));
  }, [sortModel]);
  const candidateColumns = useMemo(() => {
    return columns.filter((c) => api.columnIsSortable(c) && !columnsWithSort.has(c.id));
  }, [api, columns, columnsWithSort]);
  const columnItems = useMemo(() => {
    return candidateColumns.map<SelectItem>((c) => ({ label: c.headerName ?? c.id, value: c.id }));
  }, [candidateColumns]);

  return columnItems;
}
