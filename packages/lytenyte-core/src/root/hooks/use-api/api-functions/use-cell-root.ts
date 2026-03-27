import { useEvent } from "../../../../hooks/use-event.js";
import type { Root } from "../../../root.js";
import { type PositionGridCell, type RowLayout } from "@1771technologies/lytenyte-shared";

export function useCellRoot(rowLayout: RowLayout): Root.API["cellRoot"] {
  return useEvent((row, column) => {
    const root = rowLayout.rootCell(row, column);
    if (!root) return null;

    if (root.kind === "full-width") return { kind: "full-width", rowIndex: root.rowIndex, colIndex: 0 };

    return {
      kind: "cell",
      colIndex: root.colIndex,
      rowIndex: root.rowIndex,
      root: {
        colIndex: root.colIndex,
        rowIndex: root.rowIndex,
        colSpan: root.colSpan,
        rowSpan: root.rowSpan,
      },
    } satisfies PositionGridCell;
  });
}
