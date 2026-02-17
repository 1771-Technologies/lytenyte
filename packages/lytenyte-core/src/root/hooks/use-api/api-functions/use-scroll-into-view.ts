import {
  columnScrollIntoViewValue,
  rowScrollIntoViewValue,
  type ColumnView,
} from "@1771technologies/lytenyte-shared";
import { useEvent } from "../../../../hooks/use-event.js";
import type { Root } from "../../../root.js";

export function useScrollIntoView(
  props: Root.Props,
  vp: HTMLElement | null,
  view: ColumnView,
  xPositions: Uint32Array,
  yPositions: Uint32Array,

  rowCount: number,
  rowBottomCount: number,
  rowTopCount: number,
  headerHeightTotal: number,
): Root.API["scrollIntoView"] {
  return useEvent((opts) => {
    if (!vp) return;

    let x: number | undefined = undefined;
    let y: number | undefined = undefined;
    const col = opts.column;
    if (col != null) {
      let colIndex: number;
      if (typeof col === "number") colIndex = col;
      else if (typeof col === "string") colIndex = view.visibleColumns.findIndex((c) => c.id === col);
      else colIndex = view.visibleColumns.findIndex((c) => c.id === col.id);

      if (colIndex !== -1) {
        x = columnScrollIntoViewValue({
          centerCount: view.centerCount,
          startCount: view.startCount,
          endCount: view.endCount,
          columnIndex: colIndex,
          columnPositions: xPositions,
          viewport: vp,
        });
      }
    }

    const row = opts.row;
    if (row != null) {
      y = rowScrollIntoViewValue({
        bottomCount: rowBottomCount,
        topCount: rowTopCount,
        rowCount: rowCount,
        headerHeight: headerHeightTotal,
        rowIndex: row,
        rowPositions: yPositions,
        viewport: vp,
      });
    }

    vp.scrollTo({
      left: x != null ? x * (props.rtl ? -1 : 1) : undefined,
      top: y,
      behavior: opts.behavior ?? "auto",
    });
  });
}
