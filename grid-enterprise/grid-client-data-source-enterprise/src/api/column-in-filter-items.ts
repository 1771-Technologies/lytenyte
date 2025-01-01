import type { ColumnEnterprise } from "@1771technologies/grid-types";
import type { ClientState } from "../create-client-data-source";
import type { ColumnInFilterItem } from "@1771technologies/grid-types/enterprise";

export function columnInFilterItems<D, E>(
  state: ClientState<D, E>,
  column: ColumnEnterprise<D, E>,
) {
  const data = state.rowCenterNodes.peek();
  const api = state.api.peek();
  const values = new Set(data.map((row) => api.columnField(row, column)));

  const base = api.getState().columnBase.peek();
  const formatter =
    column.inFilterLabelFormatter ?? base.inFilterLabelFormatter ?? ((v) => String(v));

  return [...values].map(
    (c) =>
      ({
        kind: "leaf",
        label: formatter(c),
        value: c,
      }) satisfies ColumnInFilterItem,
  );
}
