import { measureText } from "@1771technologies/dom-utils";
import type { Grid } from "../../../../index.js";

export function defaultAutosize(c: Grid.T.CellParams<any>) {
  const field = c.api.columnField(c.column, c.row);

  return (measureText(`${field}`, c.api.viewport() ?? undefined)?.width ?? 120) + 28;
}

export function defaultAutosizeHeader(c: Grid.T.HeaderParams<any>) {
  const text = c.column.name ?? c.column.id;

  return (measureText(text, c.api.viewport() ?? undefined)?.width ?? 120) + 28;
}
