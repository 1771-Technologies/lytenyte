import { GRID_CELL_POSITION } from "@1771technologies/grid-constants";
import type { ApiCommunityReact } from "@1771technologies/grid-types";
import { useEffect, type RefObject } from "react";

export function useCellPositionChange(
  api: ApiCommunityReact<any>,
  ref: RefObject<HTMLDivElement | null>,
  columnIndex: number,
  rowIndex: number,
) {
  useEffect(() => {
    const sx = api.getState();
    const unsub = sx.internal.navigatePosition.watch(() => {
      const position = sx.internal.navigatePosition.peek();
      if (!ref.current || !position || position.kind !== GRID_CELL_POSITION) return;

      const posRow = position.root?.rowIndex ?? position.rowIndex;
      const posCol = position.root?.columnIndex ?? position.columnIndex;

      if (
        rowIndex === posRow &&
        posCol === columnIndex &&
        !ref.current.contains(document.activeElement)
      ) {
        api.navigateScrollIntoView(posRow, posCol);
        ref.current.focus();
      }
    }, false);
    return () => unsub();
  }, [api, columnIndex, ref, rowIndex]);
}
