import { useMemo, type CSSProperties } from "react";
import { useGrid } from "../use-grid";
import { getRootCell } from "@1771technologies/grid-core";
import { sizeFromCoord } from "@1771technologies/js-utils";
import { getTransform } from "../utils/get-transform";
import type { ColumnCoreReact } from "@1771technologies/grid-types/core-react";
import type { CellEditLocationCore } from "@1771technologies/grid-types/core";

export function useCellEditStyle(
  column: ColumnCoreReact<any>,
  xPositions: Uint32Array,
  yPositions: Uint32Array,
  location: CellEditLocationCore,
) {
  const { state, api } = useGrid();

  const vpWidth = state.internal.viewportInnerWidth.use();
  const rtl = state.rtl.use();

  const style = useMemo(() => {
    const isStart = column.pin === "start";
    const isEnd = column.pin === "end";

    const root = getRootCell(api, location.rowIndex, location.columnIndex);
    const rowIndex = root?.rowIndex ?? location.rowIndex;
    const colIndex = root?.columnIndex ?? location.columnIndex;
    const rowSpan = root?.rowSpan ?? 1;
    const colSpan = root?.columnSpan ?? 1;

    const x = isEnd ? xPositions[colIndex] - xPositions.at(-1)! + vpWidth : xPositions[colIndex];

    const height = sizeFromCoord(rowIndex, yPositions, rowSpan);
    const width = sizeFromCoord(colIndex, xPositions, colSpan);

    const rowCount = state.internal.rowCount.peek();
    const rowTopCount = state.internal.rowTopCount.peek();
    const rowBotCount = state.internal.rowBottomCount.peek();

    const firstBotIndex = rowCount - rowBotCount;
    const isTop = rowIndex < rowTopCount;
    const isBot = rowIndex >= rowCount - rowBotCount;

    let paginateOffset = 0;
    if (state.paginate.peek()) {
      const [rowStart] = api.paginateRowStartAndEndForPage(state.paginateCurrentPage.peek());
      paginateOffset = yPositions[rowStart];
    }

    const y = isBot
      ? yPositions[rowIndex] - yPositions[firstBotIndex]
      : isTop
        ? yPositions[rowIndex]
        : yPositions[rowIndex] - yPositions[rowTopCount] - paginateOffset;

    const transform = getTransform(x * (rtl ? -1 : 1), y);
    const style = { width, height, transform, zIndex: 3 } as CSSProperties;

    if (isStart || isEnd) {
      style.insetInlineStart = "0px";
      style.position = "sticky";
      style.zIndex = 5;
    }

    return style;
  }, [
    api,
    column.pin,
    location.columnIndex,
    location.rowIndex,
    rtl,
    state.internal.rowBottomCount,
    state.internal.rowCount,
    state.internal.rowTopCount,
    state.paginate,
    state.paginateCurrentPage,
    vpWidth,
    xPositions,
    yPositions,
  ]);

  return style;
}
