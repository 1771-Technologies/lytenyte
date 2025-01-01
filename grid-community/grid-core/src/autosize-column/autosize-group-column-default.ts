import { t } from "@1771technologies/grid-design";
import type { ApiCommunity, ColumnCommunity } from "@1771technologies/grid-types";
import type { AutosizeCellParameters } from "@1771technologies/grid-types/community";
import { measureText } from "./measure-text";

export function autosizeGroupColumnDefault<D, E>({
  api,
  row,
}: AutosizeCellParameters<ApiCommunity<D, E>, D, ColumnCommunity<D, E>>) {
  if (!api.rowIsGroup(row)) return 0;

  const text = row.pathKey;

  const el = api.getState().internal.viewport.get() ?? document.body;
  const width = measureText(text, el);

  const style = getComputedStyle(el);
  let paddingValue = Number.parseInt(style.getPropertyValue(t.spacing.cell_horizontal_padding));
  paddingValue = Number.isNaN(paddingValue) ? 10 : paddingValue;

  const depth = row.rowIndex != null ? api.rowDepth(row.rowIndex) : 0;

  return width + depth * paddingValue * 4 + 28;
}
