import type { ApiCommunity, ColumnCommunity } from "@1771technologies/grid-types";
import type { AutosizeHeaderParameters } from "@1771technologies/grid-types/community";
import { measureText } from "./measure-text";

export function autosizeHeaderDefault<D, E>({
  api,
  column,
}: AutosizeHeaderParameters<ApiCommunity<D, E>, ColumnCommunity<D, E>>) {
  const text = column.headerName ?? column.id;

  const state = api.getState();

  return measureText(text, state.internal.viewport.get() ?? document.body) + 4;
}
