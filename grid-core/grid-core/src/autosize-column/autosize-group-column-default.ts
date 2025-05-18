import type { AutosizeCellParametersCore } from "@1771technologies/grid-types/core";
import { measureText } from "./measure-text";

export function autosizeGroupColumnDefault<D, E>({ api, row }: AutosizeCellParametersCore<D, E>) {
  if (!api.rowIsGroup(row)) return 0;

  const text = row.pathKey;

  const el = api.getState().internal.viewport.get() ?? document.body;
  const width = measureText(text, el);

  const paddingValue = 8;

  const depth = row.rowIndex != null ? api.rowDepth(row.rowIndex) : 0;

  return width + depth * paddingValue * 4 + 28;
}
