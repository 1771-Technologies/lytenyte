import type { LayoutHeader } from "@1771technologies/lytenyte-shared";
import { useMemo } from "react";
import { usePosition } from "../../root/contexts/position-context.js";

export function useVirtualizedHeader(
  layout: LayoutHeader[][],
  dragged: LayoutHeader | null,
  colStartBound: number,
  colEndBound: number,
): LayoutHeader[][] {
  const position = usePosition().get();

  const headerFocusIndex =
    position?.kind === "header-cell" || position?.kind === "header-group-cell" ? position.colIndex : null;

  const virtualizedHeaderCells = useMemo(() => {
    const filtered = layout.map((row) => {
      return row.filter((col) => {
        if (headerFocusIndex != null && col.colStart <= headerFocusIndex && headerFocusIndex < col.colEnd)
          return true;

        return col.colPin || rangesOverlap(col.colStart, col.colEnd, colStartBound, colEndBound);
      });
    });

    // When dragging a group column, we may end up removing that group column when joining
    // the group with other columns in the same group (if they are separated). We want to ensure
    // the group remains mounted until after the drag. Hence we check if there would've been a merge
    // and add the dragged element to the layout. Once the drag ends the element will be removed. The
    // isHiddenMove is important for this.
    if (dragged && dragged.kind === "group") {
      const row = dragged.rowStart;
      const has = filtered[row].findIndex(
        (c) => c.kind === "group" && c.idOccurrence === dragged.idOccurrence,
      );
      if (has === -1) {
        filtered[row].push({ ...dragged, isHiddenMove: true });
      }
    }

    return filtered;
  }, [colEndBound, colStartBound, dragged, headerFocusIndex, layout]);

  return virtualizedHeaderCells;
}

function rangesOverlap(aStart: number, aEnd: number, bStart: number, bEnd: number) {
  return aStart <= bEnd && bStart <= aEnd;
}
