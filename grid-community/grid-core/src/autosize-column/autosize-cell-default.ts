import type { ApiCommunity, ColumnCommunity } from "@1771technologies/grid-types";
import type { AutosizeCellParameters } from "@1771technologies/grid-types/community";
import { measureText } from "./measure-text";

export function autosizeCellDefault<D, E>({
  api,
  row,
  column,
}: AutosizeCellParameters<ApiCommunity<D, E>, D, ColumnCommunity<D, E>>) {
  const field = api.columnField(row, column);
  const state = api.getState();

  return measureText(String(field), state.internal.viewport.get() ?? document.body);
}
