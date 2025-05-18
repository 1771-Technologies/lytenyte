import { useMemo, type ReactNode } from "react";
import { FloatingCell } from "./header-floating";
import type { ApiCoreReact } from "@1771technologies/grid-types/core-react";

export function useFloatingCells(api: ApiCoreReact<any>, enabled: boolean) {
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
    if (!enabled) return [];

    const cells: ReactNode[] = [];
    const columnRowCount = hierarchy.length + 1;

    function handleCell(i: number) {
      const column = visibleColumns[i];
      const rowStart = columnRowCount + 1;

      cells.push(
        <FloatingCell
          key={column.id}
          api={api}
          column={column}
          columnIndex={i}
          viewportWidth={viewportWidth}
          xPositions={xPositions}
          rowStart={rowStart}
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
    enabled,
    endCount,
    hierarchy.length,
    startCount,
    viewportWidth,
    visibleColumns,
    xPositions,
  ]);
}
