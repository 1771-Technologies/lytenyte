import { useMemo, type ReactNode } from "react";
import { HeaderCell } from "./header-cell";
import type { ApiCoreReact } from "@1771technologies/grid-types/core-react";

export function useHeaderCells(api: ApiCoreReact<any>) {
  const sx = api.getState();
  const visibleColumns = sx.columnsVisible.use();
  const xPositions = sx.columnPositions.use();

  const bounds = sx.internal.virtBounds.use();
  const hierarchy = sx.columnGroupLevels.use();

  const startCount = sx.columnVisibleStartCount.use();
  const centerCount = sx.columnVisibleCenterCount.use();
  const endCount = sx.columnVisibleEndCount.use();
  const viewportWidth = sx.internal.viewportInnerWidth.use();

  return useMemo(() => {
    const cells: ReactNode[] = [];
    const columnRowCount = hierarchy.length + 1;

    function handleCell(i: number) {
      const column = visibleColumns[i];
      let rowStart = columnRowCount;
      let level = columnRowCount - 2;
      while (hierarchy[level]?.[i] === null) {
        rowStart--;
        level--;
      }

      cells.push(
        <HeaderCell
          key={column.id}
          api={api}
          column={column}
          columnIndex={i}
          viewportWidth={viewportWidth}
          xPositions={xPositions}
          rowStart={rowStart}
          rowEnd={columnRowCount + 1}
          startCount={startCount}
          centerCount={centerCount}
          endCount={endCount}
        />,
      );
    }

    for (let i = 0; i < startCount; i++) {
      handleCell(i);
    }

    for (let i = bounds.columnStart; i < bounds.columnEnd; i++) {
      handleCell(i);
    }

    const first = startCount + centerCount;
    for (let i = first; i < visibleColumns.length; i++) {
      handleCell(i);
    }

    return cells;
  }, [
    api,
    bounds.columnEnd,
    bounds.columnStart,
    centerCount,
    endCount,
    hierarchy,
    startCount,
    viewportWidth,
    visibleColumns,
    xPositions,
  ]);
}
