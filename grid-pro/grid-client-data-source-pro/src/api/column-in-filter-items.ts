import type { ColumnInFilterItemPro, ColumnPro } from "@1771technologies/grid-types/pro";
import type { ClientState } from "../create-client-data-source";

export function columnInFilterItems<D, E>(state: ClientState<D, E>, column: ColumnPro<D, E>) {
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
      }) satisfies ColumnInFilterItemPro,
  );
}
