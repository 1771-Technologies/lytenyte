import type { ApiCommunityReact } from "@1771technologies/grid-types";
import { useMemo, type ReactNode } from "react";
import { HeaderGroupCell } from "./header-group-cell";
import type { ColumnGroupRow, ColumnPin } from "@1771technologies/grid-types/community";

export function useHeaderGroupCells(api: ApiCommunityReact<any>) {
  const sx = api.getState();

  const bounds = sx.internal.virtBounds.use();
  const hierarchy = sx.columnGroupLevels.use();
  const xPositions = sx.columnPositions.use();

  const startCount = sx.columnVisibleStartCount.use();
  const centerCount = sx.columnVisibleCenterCount.use();
  const endCount = sx.columnVisibleEndCount.use();
  const viewportWidth = sx.internal.viewportInnerWidth.use();

  return useMemo(() => {
    const cells: ReactNode[] = [];

    function handleCell(i: number, level: ColumnGroupRow, levelIndex: number, pin: ColumnPin) {
      const groupItem = level[i];
      if (!groupItem) return;

      cells.push(
        <HeaderGroupCell
          groupItem={groupItem}
          pin={pin}
          rowStart={levelIndex + 1}
          viewportWidth={viewportWidth}
          centerCount={centerCount}
          startCount={startCount}
          endCount={endCount}
          xPositions={xPositions}
        />,
      );
    }

    for (let level = 0; level < hierarchy.length; level++) {
      const processedIndices = new Set<number>();
      const row = hierarchy[level];

      for (let i = 0; i < startCount; i++) {
        if (!processedIndices.has(i)) handleCell(i, row, level, "start");
        processedIndices.add(i);
      }

      for (let i = bounds.columnStart; i < bounds.columnEnd; i++) {
        if (!processedIndices.has(i)) handleCell(i, row, level, null);
        processedIndices.add(i);
      }

      const first = startCount + centerCount;
      for (let i = first; i < row.length; i++) {
        if (!processedIndices.has(i)) handleCell(i, row, level, "end");
        processedIndices.add(i);
      }
    }

    return cells;
  }, [
    bounds.columnEnd,
    bounds.columnStart,
    centerCount,
    endCount,
    hierarchy,
    startCount,
    viewportWidth,
    xPositions,
  ]);
}
