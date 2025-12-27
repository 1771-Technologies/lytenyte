import type { PositionGridCell } from "@1771technologies/lytenyte-shared";
import type { API } from "../types/api.js";

export const getRootCell = (
  cellRoot: API["cellRoot"],
  rowIndex: number,
  columnIndex: number,
): PositionGridCell["root"] => {
  const c = cellRoot(rowIndex, columnIndex);

  if (!c || c.kind === "full-width") return null;

  return c.root;
};
