import type { ApiCommunityReact } from "@1771technologies/grid-types";
import { useMemo, type ReactNode } from "react";
import { HeaderCell } from "./header-cell";

export function useHeaderCells(api: ApiCommunityReact<any>) {
  const sx = api.getState();
  const visibleColumns = sx.columnsVisible.use();

  const bounds = sx.internal.virtBounds.use();
  const hierarchy = sx.columnGroupLevels.use();

  const startCount = sx.columnVisibleStartCount.use();
  const endCount = sx.columnVisibleEndCount.use();

  return useMemo(() => {
    const cells: ReactNode[] = [];
    const columnRowCount = hierarchy.length + 1;

    for (let i = 0; i < startCount; i++) {
      const column = visibleColumns[i];
      let rowStart = columnRowCount;
      let level = columnRowCount - 2;
      while (hierarchy[level]?.[i] === null) {
        rowStart--;
        level--;
      }

      cells.push(<HeaderCell column={column} rowStart={rowStart} rowEnd={columnRowCount + 1} />);
    }

    for (let i = bounds.columnStart; i < bounds.columnEnd; i++) {
      const column = visibleColumns[i];
      let rowStart = columnRowCount;
      let level = columnRowCount - 2;
      while (hierarchy[level]?.[i] === null) {
        rowStart--;
        level--;
      }

      cells.push(<HeaderCell column={column} rowStart={rowStart} rowEnd={columnRowCount + 1} />);
    }

    const first = visibleColumns.length - endCount;
    for (let i = first; i < visibleColumns.length; i++) {
      const column = visibleColumns[i];
      let rowStart = columnRowCount;
      let level = columnRowCount - 2;
      while (hierarchy[level]?.[i] === null) {
        rowStart--;
        level--;
      }
      cells.push(<HeaderCell column={column} rowStart={rowStart} rowEnd={columnRowCount + 1} />);
    }

    return cells;
  }, [bounds.columnEnd, bounds.columnStart, endCount, hierarchy, startCount, visibleColumns]);
}
