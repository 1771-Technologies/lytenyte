import type { StoreEnterpriseReact } from "@1771technologies/grid-types";
import { useMemo } from "react";
import type { SelectItem } from "../select/select";

export function useColumnsSelectItems<D>({ state, api }: StoreEnterpriseReact<D>) {
  const columns = state.columns.use();

  const candidateColumns = useMemo(() => {
    return columns.filter((c) => api.columnIsSortable(c));
  }, [api, columns]);

  const columnItems = useMemo(() => {
    return candidateColumns.map<SelectItem>((c) => ({ label: c.headerName ?? c.id, value: c.id }));
  }, [candidateColumns]);

  return columnItems;
}
