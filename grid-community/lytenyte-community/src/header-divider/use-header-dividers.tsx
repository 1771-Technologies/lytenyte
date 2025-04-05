import type { ReactNode } from "react";
import { useMemo } from "react";
import { HeaderDivider } from "./header-divider";
import type { ColumnGroupRows } from "@1771technologies/grid-types/core";
import type { ApiCommunityReact } from "@1771technologies/grid-types";

export function useHeaderDividers(api: ApiCommunityReact<any>) {
  const sx = api.getState();
  const xPositions = sx.columnPositions.use();
  const hierarchy = sx.columnGroupLevels.use();

  const viewportWidth = sx.internal.viewportInnerWidth.use();
  const bounds = sx.internal.virtBounds.use();
  const startCount = sx.columnVisibleStartCount.use();
  const centerCount = sx.columnVisibleCenterCount.use();
  const endCount = sx.columnVisibleEndCount.use();
  const columns = sx.columnsVisible.use();

  return useMemo(() => {
    const firstEndIndex = xPositions.length - 1 - endCount;
    const columnRowCount = hierarchy.length + 1;
    const dividers: ReactNode[] = [];

    const indices = Array.from(
      { length: bounds.columnEnd - bounds.columnStart },
      (_, i) => i + bounds.columnStart,
    );

    for (let i = startCount - 1; i >= 0; i--) indices.unshift(i);
    const first = startCount + centerCount;
    for (let j = first; j < centerCount + startCount + endCount; j++) indices.push(j);

    for (let i = 0; i < indices.length - endCount; i++) {
      const columnIndex = indices[i];
      const rowStart = getRowStart(hierarchy, startCount, firstEndIndex, columnIndex);
      const column = columns[columnIndex];

      dividers.push(
        <HeaderDivider
          api={api}
          key={column.id}
          column={column}
          xPositions={xPositions}
          viewportWidth={viewportWidth}
          rowStart={rowStart}
          rowEnd={columnRowCount + 1}
          columnIndex={columnIndex}
          startCount={startCount}
          centerCount={centerCount}
          endCount={endCount}
        />,
      );
    }

    for (let i = indices.length - endCount; i < indices.length; i++) {
      const columnIndex = indices[i];

      const rowStart = getRowStart(hierarchy, startCount, firstEndIndex, columnIndex);
      const column = columns[columnIndex];

      dividers.push(
        <HeaderDivider
          api={api}
          key={column.id}
          column={column}
          xPositions={xPositions}
          viewportWidth={viewportWidth}
          rowStart={rowStart}
          rowEnd={columnRowCount + 1}
          columnIndex={columnIndex}
          startCount={startCount}
          centerCount={centerCount}
          endCount={endCount}
        />,
      );
    }
    return dividers;
  }, [
    api,
    bounds.columnEnd,
    bounds.columnStart,
    centerCount,
    columns,
    endCount,
    hierarchy,
    startCount,
    viewportWidth,
    xPositions,
  ]);
}

function isPartOfGroup(columnIndex: number, hierarchy: ColumnGroupRows) {
  if (!hierarchy.length) return false;

  return hierarchy.length > 0 && hierarchy[0][columnIndex] != null;
}

function getRowStart(
  hierarchy: ColumnGroupRows,
  startCount: number,
  firstEndIndex: number,
  columnIndex: number,
) {
  const isFirstEndIndex = columnIndex === firstEndIndex;
  const isLastStartIndex = columnIndex === startCount - 1 && startCount > 0;

  const hasGroup = isPartOfGroup(columnIndex, hierarchy);

  if (isFirstEndIndex || isLastStartIndex || !hasGroup) return 1;
  let level = 0;
  while (level < hierarchy.length && hierarchy[level][columnIndex] != null) {
    level++;
  }

  while (
    hierarchy[level - 1]?.[columnIndex] &&
    hierarchy[level - 1]![columnIndex]!.end - 1 === columnIndex
  ) {
    level--;
  }

  return level + 1;
}
