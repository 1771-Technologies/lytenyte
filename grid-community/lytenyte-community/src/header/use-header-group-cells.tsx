import type { ApiCommunityReact } from "@1771technologies/grid-types";
import { useMemo, type ReactNode } from "react";
import { HeaderGroupCell } from "./header-group/header-group-cell";
import type { ColumnGroupRowItem, ColumnPin } from "@1771technologies/grid-types/community";

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

    function handleCell(groupItem: ColumnGroupRowItem, levelIndex: number, pin: ColumnPin) {
      cells.push(
        <HeaderGroupCell
          key={groupItem.occurrenceKey}
          api={api}
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
        const groupItem = row[i];
        if (!groupItem) continue;

        if (!processedIndices.has(i)) handleCell(groupItem, level, "start");
        for (let j = groupItem.start; j < groupItem.end; j++) processedIndices.add(j);
      }

      for (let i = bounds.columnStart; i < bounds.columnEnd; i++) {
        const groupItem = row[i];
        if (!groupItem) continue;

        if (!processedIndices.has(i)) handleCell(groupItem, level, null);
        for (let j = groupItem.start; j < groupItem.end; j++) processedIndices.add(j);
      }

      const first = startCount + centerCount;
      for (let i = first; i < row.length; i++) {
        const groupItem = row[i];
        if (!groupItem) continue;

        if (!processedIndices.has(i)) handleCell(groupItem, level, "end");
        for (let j = groupItem.start; j < groupItem.end; j++) processedIndices.add(j);
      }
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
    xPositions,
  ]);
}
