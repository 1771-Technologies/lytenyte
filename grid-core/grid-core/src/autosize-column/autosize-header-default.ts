import type { AutosizeHeaderParametersCore } from "@1771technologies/grid-types/core";
import { measureText } from "./measure-text";

export function autosizeHeaderDefault<D, E>({ api, column }: AutosizeHeaderParametersCore<D, E>) {
  const text = column.headerName ?? column.id;

  const state = api.getState();

  return measureText(text, state.internal.viewport.get() ?? document.body) + 4;
}
