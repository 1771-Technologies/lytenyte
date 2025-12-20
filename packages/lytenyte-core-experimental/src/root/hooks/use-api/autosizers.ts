import { measureText } from "@1771technologies/lytenyte-shared";
import type { Root } from "../../root";

export function defaultAutosize(c: Root.CellParams<any>) {
  const field = c.api.columnField(c.column, c.row);

  return measureText(`${field}`, c.api.viewport() ?? undefined).width + 8;
}

export function defaultAutosizeHeader(c: Root.HeaderParams<any>) {
  const text = c.column.name ?? c.column.id;

  return measureText(text, c.api.viewport() ?? undefined).width + 8;
}
