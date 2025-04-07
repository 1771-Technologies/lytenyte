import { measureText } from "./measure-text";
import type { AutosizeCellParametersCore } from "@1771technologies/grid-types/core";

export function autosizeCellDefault<D, E>({ api, row, column }: AutosizeCellParametersCore<D, E>) {
  const field = api.columnField(row, column);
  const state = api.getState();

  return measureText(String(field), state.internal.viewport.get() ?? document.body);
}
